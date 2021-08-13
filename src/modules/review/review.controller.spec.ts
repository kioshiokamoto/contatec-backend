import { Test } from '@nestjs/testing';
import * as mocks from 'node-mocks-http';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { CreateReview } from './dtos/CreateReview.dto';

describe('Post Controller', () => {
  let reviewController: ReviewController;
  const mockReviewService = {
    createReview: jest.fn().mockImplementation((dto) => {
      return 'Se creó el review correctamente';
    }),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ReviewController],
      providers: [ReviewService],
    })
      .overrideProvider(ReviewService)
      .useValue(mockReviewService)
      .compile();
    reviewController = moduleRef.get<ReviewController>(ReviewController);
  });

  it('Usuario autenticado debe poder crear un review', () => {
    const req = mocks.createRequest();
    const review = new CreateReview();
    expect(reviewController.createReview(review, req)).toEqual(
      'Se creó el review correctamente',
    );
    expect(mockReviewService.createReview).toHaveBeenCalled();
  });
});
