import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const pending = await prisma.user.findMany({
    where: { status: "pending" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <h2 className="mt-6 font-bold">Pending Members</h2>

      {pending.map((user) => (
        <div key={user.id} className="border p-3 mt-2">
          {user.fullName} - {user.phone}
        </div>
      ))}
    </div>
  );
}