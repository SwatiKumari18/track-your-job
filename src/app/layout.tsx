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
        <div className="flex flex-col md:flex-row md:h-screen">

          {/* Sidebar */}
          <aside className="w-full md:w-64 bg-indigo-400 p-4 md:p-6">
            <h1 className="text-xl font-extrabold mb-6 tracking-wide text-purple">
              Track Your Job
            </h1>

            <nav className="flex gap-4 md:block md:space-y-3">
              <Link href="/dashboard" className="text-lg font-bold block hover:text-gray-300">
                Dashboard
              </Link>

              <Link href="/applications" className="text-lg font-bold block hover:text-gray-300">
                Applications
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-8 bg-gray-50 overflow-auto">
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}