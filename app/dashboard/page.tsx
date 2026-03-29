import { getToken } from "@/lib/core";
import AdminDashboard from "./roles/AdminDashboard";
import MemberDashboard from "./roles/MemberDashboard";
import TrainerDashboard from "./roles/TrainerDashboard";

export default async function DashboardPage() {
  const user = await getToken();

  if (!user) return <div>Unauthorized</div>;

  if (user.role === "super_admin" || user.role === "admin") {
    return <AdminDashboard />;
  }

  if (user.role === "trainer") {
    return <TrainerDashboard />;
  }

  return <MemberDashboard />;
}