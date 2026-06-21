export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-4">
        <h2 className="font-bold mb-4">My SaaS</h2>

        <nav className="space-y-2 flex flex-col">
          <a href="/dashboard">Home</a>
          <a href="/dashboard/subscribers">Subscribers</a>
          <a href="/dashboard/free-consultations">Free Consultations</a>
          <a href="/dashboard/logs">Emails Logs</a>
          <a href="/dashboard/campaigns">Campaigns</a>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 bg-gray-50">
        {children}
      </main>
    </div>
  );
}
