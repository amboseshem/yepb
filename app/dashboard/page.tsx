import { getToken } from "@/lib/core";
import AdminDashboard from "./roles/AdminDashboard";
import MemberDashboard from "./roles/MemberDashboard";
import TrainerDashboard from "./roles/TrainerDashboard";

export default async function DashboardPage() {
  const user = await getToken();

  if (!user) {
    return <div className="p-6">Unauthorized</div>;
  }

  if (user.role === "trainer") {
    return <TrainerDashboard />;
  }

  if (user.role === "member") {
    return <MemberDashboard />;
  }

  return <AdminDashboard />;
}