'use client'; // Mark the component as a Client Component
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import Navbar from '@/components/navbar';

export default function Home() {
  useEffect(() => {
    // Initialize Socket.io connection
    const socket = io();

    // Listen for real-time updates
    socket.on('court-status-update', (data) => {
      console.log('Court status updated:', data);
      // You can update your state or UI here based on the real-time data
    });

    // Clean up the Socket.io connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <Navbar />
      <p>TODO: Dashboard</p>
    </div>
  );
}