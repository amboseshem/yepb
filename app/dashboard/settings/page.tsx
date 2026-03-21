import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const [settings, branches] = await Promise.all([
    prisma.systemSetting.findMany({
      orderBy: {
        settingKey: "asc",
      },
    }),
    prisma.branch.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Settings</h2>
        <p className="mt-1 text-slate-500">
          Company details, bank details, and branch management.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-800">Company / Group Details</h3>

        <form
          action="/api/settings/update"
          method="POST"
          className="mt-5 grid gap-4 md:grid-cols-2"
        >
          <input type="hidden" name="group" value="company" />

          <input name="platform_name" placeholder="Platform Name" className="rounded-xl border border-slate-300 px-4 py-3" />
          <input name="company_phone" placeholder="Contact Phone" className="rounded-xl border border-slate-300 px-4 py-3" />
          <input name="company_email" placeholder="Contact Email" className="rounded-xl border border-slate-300 px-4 py-3" />
          <input name="po_box" placeholder="P.O. Box" className="rounded-xl border border-slate-300 px-4 py-3" />
          <input name="kra_pin" placeholder="KRA PIN" className="rounded-xl border border-slate-300 px-4 py-3" />
          <input name="bank_name" placeholder="Bank Name" className="rounded-xl border border-slate-300 px-4 py-3" />
          <input name="bank_account_name" placeholder="Bank Account Name" className="rounded-xl border border-slate-300 px-4 py-3" />
          <input name="bank_account_number" placeholder="Bank Account Number" className="rounded-xl border border-slate-300 px-4 py-3" />
          <input name="paybill_number" placeholder="Paybill Number" className="rounded-xl border border-slate-300 px-4 py-3" />
          <input name="website_url" placeholder="Website URL" className="rounded-xl border border-slate-300 px-4 py-3" />

          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Save Company Details
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-800">Add Branch</h3>

        <form
          action="/api/branches/create"
          method="POST"
          className="mt-5 grid gap-4 md:grid-cols-2"
        >
          <input name="name" placeholder="Branch Name" required className="rounded-xl border border-slate-300 px-4 py-3" />
          <input name="code" placeholder="Branch Code" className="rounded-xl border border-slate-300 px-4 py-3" />
          <input name="location" placeholder="Location" className="rounded-xl border border-slate-300 px-4 py-3" />
          <input name="leaderName" placeholder="Leader Name" className="rounded-xl border border-slate-300 px-4 py-3" />
          <input name="contactPhone" placeholder="Contact Phone" className="rounded-xl border border-slate-300 px-4 py-3" />

          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
            >
              Add Branch
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-800">Current Branches</h3>
        </div>

        <div className="divide-y">
          {branches.map((branch) => (
            <form
              key={branch.id.toString()}
              action="/api/branches/update"
              method="POST"
              className="grid gap-3 p-4 md:grid-cols-6"
            >
              <input type="hidden" name="branchId" value={branch.id.toString()} />
              <input name="name" defaultValue={branch.name} className="rounded-xl border border-slate-300 px-3 py-2" />
              <input name="code" defaultValue={branch.code ?? ""} className="rounded-xl border border-slate-300 px-3 py-2" />
              <input name="location" defaultValue={branch.location ?? ""} className="rounded-xl border border-slate-300 px-3 py-2" />
              <input name="leaderName" defaultValue={branch.leaderName ?? ""} className="rounded-xl border border-slate-300 px-3 py-2" />
              <input name="contactPhone" defaultValue={branch.contactPhone ?? ""} className="rounded-xl border border-slate-300 px-3 py-2" />
              <button className="rounded-xl bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-700">
                Update
              </button>
            </form>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-800">
            Current Settings
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Setting Key</th>
                <th className="px-4 py-3 font-semibold">Value</th>
              </tr>
            </thead>
            <tbody>
              {settings.map((setting) => (
                <tr key={setting.id.toString()} className="border-t border-slate-100">
                  <td className="px-4 py-3">{setting.settingKey}</td>
                  <td className="px-4 py-3">{setting.settingValue ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}