export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ backgroundColor: "black", justifyItems: "stretch" }}>
      <body>{children}</body>
    </html>
  )
}
