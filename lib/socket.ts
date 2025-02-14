import { Server } from 'socket.io';

let io: Server;

export default function handler(req: any, res: any) {
  if (!io) {
    io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('A user connected');
      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });
  }
  res.end();
}