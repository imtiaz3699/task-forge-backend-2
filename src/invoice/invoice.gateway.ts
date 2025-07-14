import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class InvoiceGateway {
  @WebSocketServer()
  server: Server;

  invoiceCreated(invoice: any) {
    this.server.emit('invoiceCreated', invoice);
  }
  invoiceUpdated(invoice: any) {
    this.server.emit('invoiceUpdated', invoice);
  }
  invoiceDeleted(id: any) {
    this.server.emit('invoiceDeleted', id);
  }
}
