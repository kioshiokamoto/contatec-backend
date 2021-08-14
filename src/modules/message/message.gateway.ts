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
    this.logger.log('ID emit: ' + client.userId);
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
        msj_idPost_propuesta: payload.post || null,
      });
      // console.log(newMessage);
      const newMessageSaved = await newMessage.save();

      // console.log(newMessageSaved);
      // const completeMessage = await this.mensajeRepository.findOne(
      //   { id: newMessageSaved.id },
      //   { relations: ['msj_idPost_propuesta'] },
      // );
      // console.log(completeMessage);
      this.logger.log('Cliente que emite - client.userId: ' + client.userId);
      this.logger.log('Cliente que emite: ' + payload.from);
      this.logger.log('Usuario que recibe: ' + payload.to);

      // .to(client.userId)
      // this.server
      //   .to(payload.to)
      //   .to(payload.from)
      //   .emit('messageDefaultResponse', {
      //     data: {
      //       createdAt: newMessageSaved.createdAt,
      //       msjUserFromId: newMessageSaved.msj_user_from,
      //       msjUserToId: newMessageSaved.msj_user_to,
      //       msj_contenido: newMessageSaved.msj_contenido,
      //     },
      //   });
      this.server
        .to(payload.to)
        .emit('messageDefaultResponse', 'Se envia mensaje');
    } catch (error) {
      console.log(error);
    }
  }
  //Estructura para propuesta
  @SubscribeMessage('messageProposal')
  async handleMessageProposal(client: any, payload: any): Promise<void> {
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
    const newProposeSaved = await newPropose.save();
    this.server
      .to(payload.to)
      .to(client.userId)
      .emit('messagePropose', { data: payload.data });
  }

  @SubscribeMessage('acceptPropose')
  async handleAcceptPropose(client: any, payload: any): Promise<void> {
    console.log(payload);
    // Envia notificacion de `Acepto/Aceptaron la propuesta` hacia cliente y proveedor
    //Envia mensaje hacia destino payload.data y hacia si mismo
    this.server
      .to(payload.to)
      .to(client.userId)
      .emit('acceptYourPropose', { data: payload.data });
  }
}
