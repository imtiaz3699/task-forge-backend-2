import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ProductsGateway {
  @WebSocketServer()
  server: Server;

  productCreated(product: any) {
    this.server.emit('productCreated', product);
  }

  productDeleted(productId: string) {
    this.server.emit('productDeleted', productId);
  }
  productUpdated(product:any){
    this.server.emit("productUpdated",product)
  }
}
