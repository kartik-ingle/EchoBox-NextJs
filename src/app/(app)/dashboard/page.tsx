import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import UserDashboard from "./UserDashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Pass session down as a prop
  return <UserDashboard initialSession={session} />;
}
