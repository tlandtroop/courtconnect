import Image from "next/image";
import { SignIn } from "@clerk/nextjs";
import Logo from "@/components/logo";

export default function Page() {
  return (
    <div className="fixed inset-0 flex w-full h-full">
      <div className="hidden lg:block w-1/2 relative">
        <Image
          src="/court.jpg"
          alt="Court"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#f8fafc] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="w-full flex flex-col items-center justify-center gap-10 max-w-md px-6">
          <Logo />
          <SignIn />
        </div>
      </div>
    </div>
  );
}
