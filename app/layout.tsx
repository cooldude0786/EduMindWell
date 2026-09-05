import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

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
      className="h-full antialiased"
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
