import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const users = await prisma.user.count();

  const contributions = await prisma.contribution.aggregate({
    _sum: { amount: true },
  });

  const projects = await prisma.project.count();

  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-blue-600 text-white p-5 rounded">
          Users: {users}
        </div>

        <div className="bg-green-600 text-white p-5 rounded">
          Contributions: KES{" "}
          {Number(contributions._sum.amount || 0).toLocaleString()}
        </div>

        <div className="bg-purple-600 text-white p-5 rounded">
          Projects: {projects}
        </div>
      </div>
    </div>
  );
}
<button
  onClick={async () => {
    const res = await fetch("/api/pesapal");
    const data = await res.json();
    window.location.href = data.url;
  }}
  className="bg-green-600 text-white px-4 py-2 rounded"
>
  Pay via PesaPal
</button>