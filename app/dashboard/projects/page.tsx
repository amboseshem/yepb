import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalProjects = projects.length;
  const activeProjects = projects.filter(
    (project) => project.status === "active"
  ).length;
  const completedProjects = projects.filter(
    (project) => project.status === "completed"
  ).length;

  const archivedProjects = projects.filter(
    (project) => project.status === "cancelled"
  ).length;

  const totalBudget = projects.reduce(
    (sum, project) => sum + Number(project.budgetAmount || 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Projects</h2>
          <p className="mt-1 text-slate-500">
            Manage empowerment and investment projects.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/projects/new"
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
          >
            + Add Project
          </Link>

          <Link
            href="/dashboard/projects/transactions"
            className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-purple-700"
          >
            View Transactions
          </Link>

          <div className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow">
            Budget: KES {totalBudget.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-blue-600 p-5 text-white shadow">
          <p className="text-sm text-blue-100">Total Projects</p>
          <h3 className="mt-2 text-3xl font-bold">{totalProjects}</h3>
        </div>

        <div className="rounded-2xl bg-green-600 p-5 text-white shadow">
          <p className="text-sm text-green-100">Active Projects</p>
          <h3 className="mt-2 text-3xl font-bold">{activeProjects}</h3>
        </div>

        <div className="rounded-2xl bg-purple-600 p-5 text-white shadow">
          <p className="text-sm text-purple-100">Completed</p>
          <h3 className="mt-2 text-3xl font-bold">{completedProjects}</h3>
        </div>

        <div className="rounded-2xl bg-red-600 p-5 text-white shadow">
          <p className="text-sm text-red-100">Archived</p>
          <h3 className="mt-2 text-3xl font-bold">{archivedProjects}</h3>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-800">
            Project Directory
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Code</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Budget</th>
                <th className="px-4 py-3 font-semibold">Capital</th>
                <th className="px-4 py-3 font-semibold">Location</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                    No projects found yet.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr
                    key={project.id.toString()}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-medium">{project.name}</td>
                    <td className="px-4 py-3">{project.code ?? "-"}</td>
                    <td className="px-4 py-3">{project.projectType ?? "-"}</td>
                    <td className="px-4 py-3">
                      KES {Number(project.budgetAmount || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      KES {Number(project.capitalAmount || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">{project.location ?? "-"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          project.status === "active"
                            ? "bg-green-100 text-green-700"
                            : project.status === "completed"
                            ? "bg-blue-100 text-blue-700"
                            : project.status === "pending_approval"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/projects/${project.id.toString()}`}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}