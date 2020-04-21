import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  /**
   * After the Gateway has been initialised
   * @param server
   */
  afterInit(server: Server) {

    server.use(async (socket: Socket, next) => {
      const query = socket.handshake.query;

      if (this.isValid(query)) {
        next();
        return;
      }

      return next(new Error("401"));
    });
  }

  /**
   * Validate a connecting socket
   * @param query
   */
  isValid(query: any): boolean {
    // Perform validation logic here
    return true;
  }

  /**
   * Perform actions on connecting socket
   * @param client
   */
  handleConnection(client: Socket) {
    client.on('subscribe', (room: string, callback) => this.handleSubscribeEvent(client, room, callback));
    client.on('unsubscribe', (room: string, callback) => this.handleUnsubscribeEvent(client, room, callback));
  }

  /**
   * Perform actions on connecting socket
   * @param client
   */
  handleDisconnect(client: any) {
    // Disconnect logic here
  }

  /**
   * Handle Subscribe request from Socket
   * @param client
   * @param room
   */
  async handleSubscribeEvent(client: Socket, room: string, callback) {

    // Validate if client can join room here

    client.join(room);
    callback(`subscribed: ${room}`);
  }

  /**
   * Handle Unsubscribe request from Socket
   * @param client
   * @param room
   */
  async handleUnsubscribeEvent(client: Socket, room: string, callback) {
    client.leave(room);
    callback(`unsubscribed: ${room}`);
  }

  /**
   * Publish Public Event
   * @param event
   * @param data
   */
  async publishEvent(event: string, data: any) {
    this.server.emit(event, data);
  }

  /**
   * Publish Event to Room
   * @param room
   * @param event
   * @param data
   */
  async publishEventInRoom(room: string, event: string, data: any) {
    this.server.to(room).emit(event, data);
  }
}