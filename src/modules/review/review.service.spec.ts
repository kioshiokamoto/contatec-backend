import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Post from '../../entity/post.entity';
import Review from '../../entity/review.entity';
import Trabajo from '../../entity/trabajo.entity';
import { ReviewService } from './review.service';
import { CreateReview } from './dtos/CreateReview.dto';

const mockRepository = () => ({
  create: jest.fn(),
});

type MockRepository<T = any> = Partial<
  Record<keyof Repository<Review>, jest.Mock>
>;

describe('ReviewService', () => {
  let service: ReviewService;
  let reviewRepository: MockRepository<Review>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ReviewService,
        {
          provide: getRepositoryToken(Review),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Post),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Trabajo),
          useValue: mockRepository(),
        },
      ],
    }).compile();
    service = module.get<ReviewService>(ReviewService);
    reviewRepository = module.get(getRepositoryToken(Review));
  });
  it('Debería ser definido', () => {
    expect(service).toBeDefined();
  });
  describe('createReview', () => {
    const createreview = new CreateReview();
    createreview.rw_comentario = 'comment';
    createreview.rw_idPost = 1;
    createreview.rw_score = 10;
    let review: Review;
    const req = {
      user: {
        id: 1,
        name: 'name',
      },
    };
    it('El usuario califica con un comentario', async () => {
      reviewRepository.create.mockImplementationOnce((data) => {
        review = new Review({
          ...data,
        });
        return {
          ...data,
          save: jest.fn().mockReturnValue(review),
        };
      });
      const res = await service.createReview(createreview, req);
      expect(res).toEqual({
        message: 'El review se creo correctamente',
        data: {
          ...review,
        },
      });
    });
    it('El usuario califica sin ningún comentario', async () => {
      review = new Review({});
      createreview.rw_comentario = undefined;
      reviewRepository.create.mockReturnValue(
        new Review({
          save: jest.fn().mockReturnValue(review),
        }),
      );
      const res = await service.createReview(createreview, req);
      expect(res).toEqual({
        message: 'El review se creo correctamente',
        data: {
          ...review,
        },
      });
    });
    it('Ocurre un error durante la creación de la review', async () => {
      reviewRepository.create.mockReturnValue(
        new Review({
          save: jest
            .fn()
            .mockRejectedValue(new Error('Error al guardar el review')),
        }),
      );
      const res = await service.createReview(createreview, req);
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('Error al guardar el review');
    });
  });
});
