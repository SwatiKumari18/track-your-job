import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Track Your Job",
  description: "Track your job applications easily",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen">

          {/* Sidebar */}
          <aside className="w-64 bg-gray-900 text-white p-6">
            <h1 className="text-xl font-bold mb-6">
              Track Your Job
            </h1>

            <nav className="space-y-3">
              <Link href="/dashboard" className="block hover:text-gray-300">
                Dashboard
              </Link>

              <Link href="/applications" className="block hover:text-gray-300">
                Applications
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8 bg-gray-50 overflow-auto">
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}