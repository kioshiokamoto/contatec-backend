import { Test } from '@nestjs/testing';
import { WorkController } from './work.controller';
import { WorkService } from './work.service';
import { AcceptPropose, UpdateWork } from './dtos';

describe('Post Controller', () => {
  let workController: WorkController;
  const mockWorkService = {
    acceptPropose: jest.fn().mockImplementation((dto) => {
      return 'Se aceptó propuesta correctamente';
    }),
    cancelWork: jest.fn().mockImplementation((dto) => {
      return 'Se canceló el trabajo correctamente';
    }),
    updateStatus: jest.fn().mockImplementation((dto) => {
      return 'Se actualizó estado de trabajo correctamente';
    }),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [WorkController],
      providers: [WorkService],
    })
      .overrideProvider(WorkService)
      .useValue(mockWorkService)
      .compile();
    workController = moduleRef.get<WorkController>(WorkController);
  });

  it('Usuario autenticado debe poder aceptar propuesta', () => {
    const propose = new AcceptPropose();
    expect(workController.acceptPropose(propose)).toEqual(
      'Se aceptó propuesta correctamente',
    );
    expect(mockWorkService.acceptPropose).toHaveBeenCalled();
  });
  it('Usuario autenticado debe poder cancelar trabajo', () => {
    expect(workController.cancelWork(1)).toEqual(
      'Se canceló el trabajo correctamente',
    );
    expect(mockWorkService.cancelWork).toHaveBeenCalled();
  });
  it('Usuario autenticado debe poder actulizar el estado del trabajo', () => {
    const update = new UpdateWork();
    expect(workController.updateStatus(1, update)).toEqual(
      'Se actualizó estado de trabajo correctamente',
    );
    expect(mockWorkService.updateStatus).toHaveBeenCalled();
  });
});
