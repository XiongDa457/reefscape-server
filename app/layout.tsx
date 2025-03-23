import { Inter } from "next/font/google"
import { Metadata } from "next";

import './globals.css';

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Scouting App - Absolute Robotics",
  description: "Scouting app made by and for the Absolute Robotics FRC team."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" >
      <body className={`${inter.className} bg-black text-white`}>
        {children}
      </body>
    </html>
  )
}
