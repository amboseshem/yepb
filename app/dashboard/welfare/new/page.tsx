import { prisma } from "@/lib/prisma";

export default async function NewWelfarePage() {
  const members = await prisma.memberProfile.findMany({
    include: {
      user: true,
      branch: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Add Welfare Request</h2>
        <p className="mt-1 text-slate-500">
          Record a member welfare or support request.
        </p>
      </div>

      <form
        action="/api/welfare/create"
        method="POST"
        className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Member</label>
            <select
              name="memberId"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="">Select member</option>
              {members.map((member) => (
                <option key={member.id.toString()} value={member.id.toString()}>
                  {member.user.fullName} - {member.user.phone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Request Type</label>
            <select
              name="requestType"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="">Select request type</option>
              <option value="medical">Medical</option>
              <option value="bereavement">Bereavement</option>
              <option value="emergency">Emergency</option>
              <option value="school_support">School Support</option>
              <option value="family_crisis">Family Crisis</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Title</label>
            <input
              name="title"
              type="text"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Amount Requested</label>
            <input
              name="amountRequested"
              type="number"
              min="0"
              step="0.01"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>
            <select
              name="status"
              defaultValue="pending"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="declined">Declined</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea
            name="description"
            rows={5}
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </div>

        <div>
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Save Welfare Request
          </button>
        </div>
      </form>
    </div>
  );
}