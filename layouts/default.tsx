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
    </div>
  );
 
}
