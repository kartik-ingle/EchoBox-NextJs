import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        { success: false, message: "Username is already taken" },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: "User already exists with this email" },
          { status: 400 }
        );
      }

      // Update unverified user's details
      existingUserByEmail.password = await bcrypt.hash(password, 10);
      existingUserByEmail.verifyCode = verifyCode;
      existingUserByEmail.verifyExpiry = new Date(Date.now() + 3600000);
      existingUserByEmail.save();
    } else {
      // Create new user
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      await new UserModel({
        username,
        email,
        password: await bcrypt.hash(password, 10),
        verifyCode,
        verifyExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      }).save();
    }

    // Send verification email (only once)
    console.log("📧 Sending verification email to:", email, "Code:", verifyCode);
    const emailResponse = await sendVerificationEmail(email, username, verifyCode);

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: "User registered, but failed to send verification email",
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error while registering user", error);
    return Response.json(
      { success: false, message: "Error while registering user" },
      { status: 500 }
    );
  }
}
