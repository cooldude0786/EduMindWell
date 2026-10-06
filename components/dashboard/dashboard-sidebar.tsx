"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import * as React from "react"
import { createPortal } from "react-dom"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  DashboardSquare01Icon,
  Image01Icon,
  Logout01Icon,
  Mail01Icon,
  Megaphone01Icon,
  Search01Icon,
  Settings01Icon,
  UserAdd01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type DashboardSidebarProps = {
  user?: {
    name?: string | null
    email?: string | null
  } | null
}

const navigationGroups = [
  {
    label: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: DashboardSquare01Icon },
      { href: "/dashboard/subscribers", label: "Subscribers", icon: UserGroupIcon },
      { href: "/dashboard/free-consultations", label: "Free Consultations", icon: UserAdd01Icon },
      { href: "/dashboard/logs", label: "Email Logs", icon: Mail01Icon },
      { href: "/dashboard/campaigns", label: "Campaigns", icon: Megaphone01Icon },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/dashboard/testimonials", label: "Testimonials", icon: DashboardSquare01Icon },
      { href: "/dashboard/refund-policy", label: "Refund Policy", icon: Settings01Icon },
      { href: "/dashboard/terms-and-conditions", label: "Terms & Conditions", icon: Settings01Icon },
      { href: "/dashboard/contact-details", label: "Contact Details", icon: Mail01Icon },
      { href: "/dashboard/navigation", label: "Nav Content", icon: DashboardSquare01Icon },
    ],
  },
  {
    label: "Media",
    items: [
      { href: "/dashboard/media/assessment", label: "Assessment Gallery", icon: Image01Icon },
      { href: "/dashboard/media/counselling", label: "Counselling Gallery", icon: Image01Icon },
      { href: "/dashboard/media/wellness", label: "Wellness Media", icon: Image01Icon },
      { href: "/dashboard/media/workshops", label: "Workshops Highlights", icon: Image01Icon },
      { href: "/dashboard/media/hero", label: "Hero Media", icon: Image01Icon },
      { href: "/dashboard/media/institutions", label: "Institution Logos", icon: Image01Icon },
      { href: "/dashboard/users", label: "Admin Users", icon: UserGroupIcon },
    ],
  },
] as const

function getInitials(name?: string | null, email?: string | null) {
  const value = name || email || "Admin"
  return value
    .split(/[\s@]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

type NavigationSearchProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function NavigationSearch({ open, onOpenChange }: NavigationSearchProps) {
  const router = useRouter()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [query, setQuery] = React.useState("")

  const filteredGroups = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return navigationGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          if (!normalizedQuery) return true
          return `${item.label} ${item.href}`.toLowerCase().includes(normalizedQuery)
        }),
      }))
      .filter((group) => group.items.length > 0)
  }, [query])

  const firstResult = filteredGroups[0]?.items[0]

  React.useEffect(() => {
    if (!open) return

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 0)

    return () => window.clearTimeout(focusTimer)
  }, [open])

  React.useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        onOpenChange(false)
      }

      if (event.key === "Enter" && firstResult) {
        event.preventDefault()
        onOpenChange(false)
        router.push(firstResult.href)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [firstResult, onOpenChange, open, router])

  if (!open || typeof document === "undefined") return null

  const navigateTo = (href: string) => {
    onOpenChange(false)
    router.push(href)
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 p-4 pt-[12vh]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onOpenChange(false)
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="navigation-search-title"
        className="w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-950 shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id="navigation-search-title" className="sr-only">
          Search dashboard navigation
        </h2>
        <div className="flex h-14 items-center gap-3 border-b border-slate-200 px-4">
          <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="size-5 shrink-0 text-slate-500" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") onOpenChange(false)
            }}
            placeholder="Search dashboard navigation..."
            aria-label="Search dashboard navigation"
            aria-controls="navigation-search-results"
            className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
          <kbd className="hidden rounded border border-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 sm:inline-block">
            ESC
          </kbd>
        </div>

        <div id="navigation-search-results" className="max-h-[min(60vh,24rem)] overflow-y-auto p-2">
          {filteredGroups.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-slate-500">
              No navigation links found.
            </p>
          ) : (
            filteredGroups.map((group) => (
              <div key={group.label} className="mb-2 last:mb-0">
                <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {group.label}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <button
                      key={item.href}
                      type="button"
                      onClick={() => navigateTo(item.href)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-slate-100 focus-visible:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      <HugeiconsIcon icon={item.icon} strokeWidth={2} className="size-4 shrink-0 text-slate-500" />
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      <span className="hidden max-w-52 truncate text-xs font-normal text-slate-400 sm:block">
                        {item.href}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = React.useState(false)
  const displayName = user?.name || "Admin User"
  const displayEmail = user?.email || "admin@edumindwell.com"

  React.useEffect(() => {
    const handleSearchShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setSearchOpen(true)
      }
    }

    window.addEventListener("keydown", handleSearchShortcut)
    return () => window.removeEventListener("keydown", handleSearchShortcut)
  }, [])

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-2 py-2 outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            E
          </div>
          <div data-sidebar="header-content" className="min-w-0">
            <p className="truncate text-sm font-semibold">EduMindWell</p>
            <p className="truncate text-xs text-muted-foreground">Admin workspace</p>
          </div>
        </Link>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              type="button"
              aria-label="Search navigation"
              tooltip="Search navigation"
              onClick={() => setSearchOpen(true)}
              className="border border-border/70 bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
              <span data-sidebar="label">Search navigation</span>
              <kbd data-sidebar="label" className="ml-auto rounded border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                ⌘/Ctrl K
              </kbd>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navigationGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === item.href
                      : pathname === item.href || pathname.startsWith(`${item.href}/`)

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                        <Link href={item.href}>
                          <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                          <span data-sidebar="label" className="truncate">{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="border border-transparent hover:border-border">
              <Avatar className="size-8 shrink-0 rounded-lg">
                <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                  {getInitials(user?.name, user?.email)}
                </AvatarFallback>
              </Avatar>
              <div data-sidebar="footer-content" className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-medium">{displayName}</p>
                <p className="truncate text-xs text-muted-foreground">{displayEmail}</p>
              </div>
              <HugeiconsIcon icon={Settings01Icon} strokeWidth={2} className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/dashboard/users">
                <HugeiconsIcon icon={UserGroupIcon} strokeWidth={2} />
                Admin users
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
              <HugeiconsIcon icon={Logout01Icon} strokeWidth={2} />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>

      <NavigationSearch
        key={searchOpen ? "search-open" : "search-closed"}
        open={searchOpen}
        onOpenChange={setSearchOpen}
      />
    </Sidebar>
  )
}
