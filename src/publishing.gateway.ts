import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class PublishingGateway {

  @WebSocketServer()
  server: Server;

  async publishEvent(data: Record<string, any>) {
    this.server.emit("Created", location);
  }

  async publishEventInRoom(room: string, data: Record<string, any>) {
    this.server.to(room).emit("Created", location);
  }
}