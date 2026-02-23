import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jorge Renato Leon | Software Engineer",
  description:
    "Personal portfolio of Jorge Renato Leon Chumpitaz — Software Engineer. Building modern web applications with TypeScript, React, and Next.js.",
  keywords: [
    "Jorge Renato Leon",
    "Frontend Developer",
    "Software Engineer",
    "TypeScript",
    "React",
    "Next.js",
    "Portfolio",
  ],
  authors: [{ name: "Jorge Renato Leon Chumpitaz" }],
  openGraph: {
    title: "Jorge Renato Leon | Software Engineer",
    description:
      "Software Engineer and Informatics Engineer. Building modern web applications with TypeScript, React, and Next.js.",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inline script to prevent FOUC on dark mode */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable} font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
