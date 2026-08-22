export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { href: "/dashboard", label: "Home" },
    { href: "/dashboard/subscribers", label: "Subscribers" },
    { href: "/dashboard/free-consultations", label: "Free Consultations" },
    { href: "/dashboard/logs", label: "Emails Logs" },
    { href: "/dashboard/campaigns", label: "Campaigns" },
    { href: "/dashboard/refund-policy", label: "Refund Policy" },
    { href: "/dashboard/terms-and-conditions", label: "Terms & Conditions" },
  ];

  return (
    <div className="flex min-h-screen bg-[#f6f7f9] text-slate-950">
      <aside className="sticky top-0 hidden h-screen w-64 border-r border-slate-200 bg-white/90 px-3 py-4 backdrop-blur md:block">
        <div className="mb-6 px-3">
          <p className="text-sm font-semibold text-slate-950">My SaaS</p>
          <p className="mt-1 text-xs text-slate-500">Admin workspace</p>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
