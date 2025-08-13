export default function FlappyAdoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-blue-400">
      {children}
    </div>
  )
}
