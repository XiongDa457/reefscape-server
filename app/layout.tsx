import './globals.css';
import { Inter } from "next/font/google"
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Scouting App - Absolute Robotics",
  description: "Scouting app made by and for the Absolute Robotics FRC team."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" >
      <body className={`${inter.className} bg-black text-white`}>
        <nav className="fixed top-0 z-50 w-screen border-b border-white/10 px-6 backdrop-blur-sm">
          <div className="mx-auto flex h-[58px] max-w-7xl flex-row justify-between">
            <Link href="/">
              <div className="flex h-full flex-row items-center space-x-4">
                <Image src="/logo.svg" alt="team logo" width={30} height={30} />
                <p className="self-center text-lg font-semibold">Server</p>
              </div>
            </Link>

            <ul className="hidden flex-row items-center space-x-10 text-sm text-[#f1f7feb5] lg:flex">
              <li>
                <Link href="/settings">Settings</Link>
              </li>
              <li>
                <Link href="/schedule">Schedule</Link>
              </li>
              <li>
                <Link href="/teams">Teams</Link>
              </li>
            </ul>
          </div>
        </nav>

        {children}
      </body>
    </html>
  )
}
