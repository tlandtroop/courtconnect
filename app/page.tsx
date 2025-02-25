import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  // useEffect(() => {
  //   // Initialize Socket.io connection
  //   const socket = io();

  //   // Listen for real-time updates
  //   socket.on("court-status-update", (data) => {
  //     console.log("Court status updated:", data);
  //     // You can update your state or UI here based on the real-time data
  //   });

  //   // Clean up the Socket.io connection on component unmount
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  if (userId) {
    redirect("/dashboard");
  }

  return;
}
