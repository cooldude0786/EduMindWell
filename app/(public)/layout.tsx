import { Footer } from '@/components/landing/Footer'
import { Navbar } from '@/components/landing/Navbar'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mt-12 flex-1 sm:mt-20">{children}</main>
      <Footer />
    </div>
  )
}