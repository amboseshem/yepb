import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function TrainingPage() {
  const trainings = await prisma.training.findMany({
    include: {
      category: true,
      trainer: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalTrainings = trainings.length;
  const publishedTrainings = trainings.filter(
    (item) => item.status === "published"
  ).length;
  const draftTrainings = trainings.filter(
    (item) => item.status === "draft"
  ).length;
  const totalCategories = new Set(
    trainings.map((item) => item.category?.name).filter(Boolean)
  ).size;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Training</h2>
          <p className="mt-1 text-slate-500">
            Manage learning content, sessions, and training resources.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/training/new"
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
          >
            + Add Training
          </Link>

          <div className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow">
            Total Trainings: {totalTrainings}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-blue-600 p-5 text-white shadow">
          <p className="text-sm text-blue-100">Total Trainings</p>
          <h3 className="mt-2 text-3xl font-bold">{totalTrainings}</h3>
        </div>

        <div className="rounded-2xl bg-green-600 p-5 text-white shadow">
          <p className="text-sm text-green-100">Published</p>
          <h3 className="mt-2 text-3xl font-bold">{publishedTrainings}</h3>
        </div>

        <div className="rounded-2xl bg-red-600 p-5 text-white shadow">
          <p className="text-sm text-red-100">Drafts</p>
          <h3 className="mt-2 text-3xl font-bold">{draftTrainings}</h3>
        </div>

        <div className="rounded-2xl bg-purple-600 p-5 text-white shadow">
          <p className="text-sm text-purple-100">Categories</p>
          <h3 className="mt-2 text-3xl font-bold">{totalCategories}</h3>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-800">
            Training Content
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Trainer</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Duration</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {trainings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                    No training content found yet.
                  </td>
                </tr>
              ) : (
                trainings.map((item) => (
                  <tr
                    key={item.id.toString()}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-medium">{item.title}</td>
                    <td className="px-4 py-3">{item.category?.name ?? "-"}</td>
                    <td className="px-4 py-3">{item.trainer?.fullName ?? "-"}</td>
                    <td className="px-4 py-3">{item.contentType}</td>
                    <td className="px-4 py-3">
                      {item.durationMinutes ? `${item.durationMinutes} mins` : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          item.status === "published"
                            ? "bg-green-100 text-green-700"
                            : item.status === "draft"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {item.status}
                      </span>
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