import { Link } from "@heroui/link";

import { Head } from "./head";

import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col">
      <Head />
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3 bg-white">
        <div className="text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Capital One. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/privacy" className="text-sm text-black hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-black hover:underline">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-sm text-black hover:underline">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
