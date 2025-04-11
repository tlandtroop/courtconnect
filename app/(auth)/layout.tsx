import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Court Connect - Sign In",
  description: "Sign in to Court Connect",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-screen bg-white">{children}</div>;
}
