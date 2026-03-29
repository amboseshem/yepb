import { getDashboardStats } from "@/lib/core";

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 mt-5">
        <div className="bg-blue-500 text-white p-5 rounded">
          Users: {Number(stats.users)}
        </div>

        <div className="bg-green-500 text-white p-5 rounded">
          Contributions: KES {Number(stats.totalContributions).toLocaleString()}
        </div>
      </div>
    </div>
  );
}