import { Test } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import * as mocks from 'node-mocks-http';

describe('Message Controller', () => {
  let messageController: MessageController;

  const mockMessageSevice = {
    getAllMessages: jest.fn().mockImplementation((dto) => {
      return [dto];
    }),
    getAllMessagesWith: jest.fn().mockImplementation((dto) => {
      return [dto];
    }),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [MessageService],
    })
      .overrideProvider(MessageService)
      .useValue(mockMessageSevice)
      .compile();
    messageController = moduleRef.get<MessageController>(MessageController);
  });
  it('Se debe poder obtener todos los mensajes', () => {
    const req = {
      user: {
        id: 1,
        name: 'name',
      },
    };
    expect(messageController.getAllMessages(req)).toEqual(expect.any(Array));
    expect(mockMessageSevice.getAllMessages).toHaveBeenCalled();
  });
  it('Se debe poder obtener todos los mensajes de un usuario', () => {
    const req = mocks.createRequest();
    const number = Math.floor(Math.random() * 100);
    expect(messageController.getAllMessagesWith(req, number)).toEqual(
      expect.any(Array),
    );
    expect(mockMessageSevice.getAllMessagesWith).toHaveBeenCalled();
  });
});
