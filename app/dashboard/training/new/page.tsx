import { prisma } from "@/lib/prisma";

export default async function NewTrainingPage() {
  const categories = await prisma.trainingCategory.findMany({
    orderBy: { name: "asc" },
  });

  const trainers = await prisma.user.findMany({
    orderBy: { fullName: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Add Training</h2>
        <p className="mt-1 text-slate-500">
          Create a new training resource or session.
        </p>
      </div>

      <form
        action="/api/training/create"
        method="POST"
        className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Title</label>
            <input
              name="title"
              type="text"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Category</label>
            <select
              name="categoryId"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id.toString()} value={category.id.toString()}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Trainer</label>
            <select
              name="trainerUserId"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="">Select trainer</option>
              {trainers.map((trainer) => (
                <option key={trainer.id} value={trainer.id}>
                  {trainer.fullName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Content Type</label>
            <select
              name="contentType"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="">Select type</option>
              <option value="video">Video</option>
              <option value="pdf">PDF</option>
              <option value="audio">Audio</option>
              <option value="article">Article</option>
              <option value="live_session">Live Session</option>
              <option value="image">Image</option>
              <option value="link">Link</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Content URL</label>
            <input
              name="contentUrl"
              type="text"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Duration (mins)</label>
            <input
              name="durationMinutes"
              type="number"
              min="0"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>
            <select
              name="status"
              defaultValue="published"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea
            name="description"
            rows={5}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </div>

        <div>
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Save Training
          </button>
        </div>
      </form>
    </div>
  );
}