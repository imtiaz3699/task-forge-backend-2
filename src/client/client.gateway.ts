import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ClientGateway {
  @WebSocketServer()
  server: Server;

  clientCreated(client: any) {
    this.server.emit('clientCreated', client);
  }
  clientUpdated(client: any) {
    this.server.emit('clientUpdated', client);
  }
  clientDeleted(id: any) {
    this.server.emit('clientDeleted', id);
  }
}
