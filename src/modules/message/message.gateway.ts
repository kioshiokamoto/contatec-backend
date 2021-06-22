import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UserService } from '../user/user.service';

@WebSocketGateway()
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(private userService: UserService) {}

  @WebSocketServer()
  private server: Server;

  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    this.logger.log('Se inicializa gateways');
  }

  handleConnection(client: any, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);

    // console.log(client.id);
    // console.log(client.handshake.query);
  }
  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected: ${client.id}`);
    //console.log(client.handshake.query);
  }

  @SubscribeMessage('identity')
  handleIdentity(client: any, payload: any): void {
    //Verificar identidad - guardar identidad
    client.userId = payload;
    console.log(client.userId);
    //Agregar cliente a sala
    client.join(client.userId);
  }

  @SubscribeMessage('messageDefault')
  handleMessage(client: any, payload: any): void {
    //Envia mensaje hacia destino payload.data y hacia si mismo
    console.log(payload);
    this.server
      .to(payload.from)
      .to(client.userId)
      .emit('messageDefault', { data: payload.data });
    // this.server.to('OPhHaIRN5cBjpeONAAAA').emit('private message', { payload, from: client.id});
  }
}
