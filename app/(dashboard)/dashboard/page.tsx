import { getServerSession } from "next-auth";

export default async function Dashboard() {
  const session = await getServerSession();

  if (!session) {
    return <div>Unauthorized</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Welcome 👋</h1>

      <div className="mt-4 p-4 bg-white rounded shadow">
        Logged in as: {session.user?.email}
      </div>
    </div>
  );
}