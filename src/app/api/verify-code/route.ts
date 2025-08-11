import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    try {
        await dbConnect();

        const { username, code } = await request.json();

        if (!username || !code) {
            return Response.json(
                { success: false, message: "Username and code are required" },
                { status: 400 }
            );
        }

        let decodedUsername;
        try {
            decodedUsername = decodeURIComponent(username);
        } catch {
            return Response.json(
                { success: false, message: "Invalid username format" },
                { status: 400 }
            );
        }

        const user = await UserModel.findOne({ username: decodedUsername });

        if (!user) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();

            return Response.json(
                { success: true, message: "User verified successfully" },
                { status: 200 }
            );
        }

        if (!isCodeNotExpired) {
            return Response.json(
                { success: false, message: "Verification code expired. Please sign up again." },
                { status: 400 }
            );
        }

        return Response.json(
            { success: false, message: "Incorrect Verification code" },
            { status: 400 }
        );
    } catch (error) {
        console.error("Error verifying user:", error);
        return Response.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}


