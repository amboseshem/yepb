export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Add Project</h2>
        <p className="mt-1 text-slate-500">
          Create a new empowerment or investment project.
        </p>
      </div>

      <form
        action="/api/projects/create"
        method="POST"
        className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Project Name</label>
            <input
              name="name"
              type="text"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Project Code</label>
            <input
              name="code"
              type="text"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              placeholder="Optional code"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Project Type</label>
            <input
              name="projectType"
              type="text"
              placeholder="e.g. Poultry, Savings, Business, Farming"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Location</label>
            <input
              name="location"
              type="text"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Budget Amount</label>
            <input
              name="budgetAmount"
              type="number"
              min="0"
              step="0.01"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Capital Amount</label>
            <input
              name="capitalAmount"
              type="number"
              min="0"
              step="0.01"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Start Date</label>
            <input
              name="startDate"
              type="date"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Expected End Date</label>
            <input
              name="expectedEndDate"
              type="date"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>
            <select
              name="status"
              defaultValue="active"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="draft">Draft</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
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
            Save Project
          </button>
        </div>
      </form>
    </div>
  );
}