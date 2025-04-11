import Navbar from "@/components/navbar";
import AuthSync from "@/components/auth-sync";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8fafc] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
      <Navbar />
      <AuthSync />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
