import { prisma } from "@/lib/prisma";

export default async function GenerateReferralCodePage() {
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
        <h2 className="text-3xl font-bold text-slate-800">Generate Referral Code</h2>
        <p className="mt-1 text-slate-500">
          Generate or refresh a referral code for a member.
        </p>
      </div>

      <form
        action="/api/referrals/create-code"
        method="POST"
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
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
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Generate Code
          </button>
        </div>
      </form>
    </div>
  );
}