import Image from "next/image";

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex h-screen">
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/court.jpg"
          alt="Court"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md px-6">
          <SignIn />
        </div>
      </div>
    </div>
  );
}
