import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import UserDashboard from "./UserDashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return <UserDashboard initialSession={session} />;
}
