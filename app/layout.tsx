import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  style: ['normal', 'italic'],
  weight: ['600', '700'],
});

export const metadata: Metadata = {
  title: 'EduMindWell | Career. Mind. Wellbeing. All Aligned.',
  description:
    'Empowering students from Class 8 to 12 to build confident careers without sacrificing their mental wellbeing.',
  icons: {
    icon: '/brandLogo.png',
    shortcut: '/brandLogo.png',
    apple: '/brandLogo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn('h-full', 'antialiased', inter.variable, playfairDisplay.variable)}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/brandLogo.png" type="image/png" />
        <link rel="shortcut icon" href="/brandLogo.png" />
        <link rel="apple-touch-icon" href="/brandLogo.png" />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
