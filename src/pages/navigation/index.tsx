"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Flag, Wallet, Users, Settings } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: "/home", label: "Home", icon: Home },
    { href: "/passport", label: "Passport", icon: Flag },
    { href: "/wallet", label: "Wallet", icon: Wallet },
    { href: "/referral", label: "Referral", icon: Users },
    { href: "/userSettings", label: "Settings", icon: Settings },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-white px-4 py-2 md:bottom-auto md:left-4 md:top-1/2 md:w-16 md:-translate-y-1/2 md:rounded-full md:border md:py-8">
      <ul className="flex justify-between md:flex-col md:space-y-6">
        {links.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className={`flex flex-col items-center gap-1 p-2 text-xs ${
                pathname === href ? "text-orange-500" : "text-gray-600"
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="md:hidden">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default function NavigationPage() {
  return <Navigation />
}

