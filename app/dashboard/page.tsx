import { getToken } from "@/lib/core";
import AdminDashboard from "./roles/AdminDashboard";
import MemberDashboard from "./roles/MemberDashboard";

export default async function DashboardPage() {
  const user = await getToken();

  if (!user) {
    return <div className="p-6">Unauthorized</div>;
  }

  // TEMP SAFE ROUTING (NO TRAINER FILE)
  if (user.role === "member") {
    return <MemberDashboard />;
  }

  // All others go to admin for now
  return <AdminDashboard />;
}
