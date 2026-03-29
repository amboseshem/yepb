import { getFullUser } from "@/lib/core";

export default async function MemberDashboard() {
  const user = await getFullUser();

  return (
    <div>
      <h1 className="text-2xl font-bold">My Dashboard</h1>

      <p>Name: {user?.fullName}</p>
      <p>Branch: {user?.memberProfile?.branch?.name}</p>

      <div className="mt-5">
        <h2 className="font-bold">My Contributions</h2>
        <p>Coming soon...</p>
      </div>

      <div className="mt-5">
        <h2 className="font-bold">Training Updates</h2>
        <p>Upcoming sessions will appear here</p>
      </div>
    </div>
  );
}