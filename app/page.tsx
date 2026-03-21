import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-700 via-purple-700 to-red-600 text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-16 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <p className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium">
            Youth Empowerment Platform
          </p>

          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Build a stronger youth network with members, contributions, welfare,
            projects, training, and future referrals in one place.
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-white/90">
            A complete digital platform for managing growth, support systems,
            projects, learning, and long-term empowerment.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/login"
              className="rounded-2xl bg-white px-6 py-3 font-semibold text-blue-700 shadow-lg hover:bg-slate-100"
            >
              Login to Dashboard
            </Link>

            <Link
              href="/dashboard"
              className="rounded-2xl bg-green-600 px-6 py-3 font-semibold text-white shadow-lg hover:bg-green-700"
            >
              Open Dashboard
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-0 lg:w-[420px]">
          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
            <h3 className="text-xl font-bold">Members</h3>
            <p className="mt-2 text-white/85">
              Register, organize, and monitor members professionally.
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
            <h3 className="text-xl font-bold">Contributions</h3>
            <p className="mt-2 text-white/85">
              Record payments, categories, and financial progress.
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
            <h3 className="text-xl font-bold">Projects</h3>
            <p className="mt-2 text-white/85">
              Manage project growth, capital, and transaction records.
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
            <h3 className="text-xl font-bold">Training</h3>
            <p className="mt-2 text-white/85">
              Organize learning resources, sessions, and development content.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}