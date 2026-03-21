import { prisma } from "@/lib/prisma";

export default async function ForgotPasswordPage() {
  const settings = await prisma.systemSetting.findMany();

  const getSetting = (key: string) =>
    settings.find((s) => s.settingKey === key)?.settingValue || "";

  const companyPhone = getSetting("company_phone");
  const companyEmail = getSetting("company_email");
  const platformName = getSetting("platform_name") || "Youth Empowerment Platform";

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-700 via-purple-700 to-blue-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800">Forgot Password</h1>
          <p className="mt-3 text-slate-500">
            Password reset by email link will be added during online deployment.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-semibold text-slate-800">
            Contact Admin for Password Reset
          </h2>

          <p className="mt-4 text-slate-600">
            If you forgot your password, please contact the administrator of{" "}
            <span className="font-semibold">{platformName}</span>.
          </p>

          <div className="mt-5 space-y-2 text-sm text-slate-700">
            <p>
              <span className="font-semibold">Phone:</span> {companyPhone || "Not set in settings"}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {companyEmail || "Not set in settings"}
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/login"
            className="inline-block rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Back to Login
          </a>
        </div>
      </div>
    </main>
  );
}