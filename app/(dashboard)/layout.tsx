export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const mainNavItems = [
    { href: "/dashboard", label: "Home" },
    { href: "/dashboard/subscribers", label: "Subscribers" },
    { href: "/dashboard/free-consultations", label: "Free Consultations" },
    { href: "/dashboard/logs", label: "Emails Logs" },
    { href: "/dashboard/campaigns", label: "Campaigns" },
    { href: "/dashboard/refund-policy", label: "Refund Policy" },
    { href: "/dashboard/terms-and-conditions", label: "Terms & Conditions" },
    { href: "/dashboard/contact-details", label: "Contact Details" },
  ];

  const mediaNavItems = [
    { href: "/dashboard/media/assessment", label: "Assessment Gallery" },
    { href: "/dashboard/media/counselling", label: "Counselling Gallery" },
    { href: "/dashboard/media/wellness", label: "Wellness Media" },
    { href: "/dashboard/media/workshops", label: "Workshops Highlights" },
    { href: "/dashboard/media/hero", label: "Hero Media" },
    { href: "/dashboard/users", label: "Admin Users" },
  ];

  return (
    <div className="flex min-h-screen bg-[#f6f7f9] text-slate-950">
      <aside className="sticky top-0 hidden h-screen w-64 border-r border-slate-200 bg-white/90 px-3 py-4 backdrop-blur md:block overflow-y-auto">
        <div className="mb-6 px-3">
          <p className="text-sm font-semibold text-slate-950">My SaaS</p>
          <p className="mt-1 text-xs text-slate-500">Admin workspace</p>
        </div>

        <div className="space-y-6">
          <div>
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              General
            </p>
            <nav className="flex flex-col gap-1">
              {mainNavItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Media Galleries
            </p>
            <nav className="flex flex-col gap-1">
              {mediaNavItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </aside>

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
