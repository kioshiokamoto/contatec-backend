import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateReview } from './dtos';
import { ReviewService } from './review.service';

@ApiTags('Review')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('/create')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Crea review de un servicio' })
  createReview(@Body() createReviewDto: CreateReview, @Req() req) {
    return this.reviewService.createReview(createReviewDto, req);
  }
}
