/* istanbul ignore file */
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { add } from 'date-fns';
import { Server } from 'socket.io';
import Mensaje, { Estado } from 'src/entity/mensaje.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@WebSocketGateway()
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    private userService: UserService,
    @InjectRepository(Mensaje)
    private mensajeRepository: Repository<Mensaje>,
  ) {}

  @WebSocketServer()
  private server: Server;

  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    this.logger.log('Se inicializa gateways');
  }

  handleConnection(client: any, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected: ${client.id}`);
    //console.log(client.handshake.query);
  }

  //Verificar identidad - guardar identidad
  @SubscribeMessage('identity')
  handleIdentity(client: any, payload: any): void {
    client.userId = payload;
    console.log(client.userId);
    //Agregar cliente a sala
    client.join(client.userId);
  }

  //Estructura para mensajes
  @SubscribeMessage('messageDefault')
  async handleMessage(client: any, payload: any): Promise<void> {
    //Envia mensaje hacia destino payload.data y hacia si mismo
    console.log(payload);
    try {
      const newMessage = this.mensajeRepository.create({
        msj_contenido: payload.data,
        msj_rol: 'Mensaje' as Estado,
        msj_user_from: payload.from,
        msj_user_to: payload.to,
        msj_idPost_propuesta: payload.post,
      });
      // console.log(newMessage);
      const newMessageSaved = await newMessage.save();

      // console.log(newMessageSaved);
      // const completeMessage = await this.mensajeRepository.findOne(
      //   { id: newMessageSaved.id },
      //   { relations: ['msj_idPost_propuesta'] },
      // );
      // console.log(completeMessage);

      this.server
        .to(payload.to)
        .to(client.userId)
        .emit('messageDefault', { data: payload.data });
    } catch (error) {
      console.log(error);
    }
  }
  //Estructura para propuesta
  @SubscribeMessage('messageProposal')
  handleMessageProposal(client: any, payload: any): void {
    //Envia mensaje hacia destino payload.data y hacia si mismo
    console.log(payload);
    const newPropose = this.mensajeRepository.create({
      msj_contenido: payload.data,
      msj_rol: 'Propuesta' as Estado,
      msj_user_from: payload.from,
      msj_user_to: payload.to,
      msj_idPost_propuesta: payload.post,
      msj_precio_prop: 100,
      msj_descripcion_prop: 'Se construye software',
      msj_caducidad_prop: add(new Date(), { minutes: 15 }),
    });
    this.server
      .to(payload.to)
      .to(client.userId)
      .emit('messageDefault', { data: payload.data });
  }
}
