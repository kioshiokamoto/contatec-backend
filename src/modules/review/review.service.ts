import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Post from '../../entity/post.entity';
import Review from '../../entity/review.entity';
import Trabajo from '../../entity/trabajo.entity';
import { Repository } from 'typeorm';
import { CreateReview } from './dtos';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Trabajo)
    private workRepository: Repository<Trabajo>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async createReview(createReviewDto: CreateReview, req: any) {
    try {
      const { rw_score, rw_idPost, rw_comentario } = createReviewDto;
      const usuario = req.user.id;
      const comentario = rw_comentario ? rw_comentario : '';

      const review = this.reviewRepository.create({
        rw_score,
        rw_comentario: comentario,
        rw_idUsuario: usuario,
        rw_idPost,
      });
      const savedReview = await review.save();

      return {
        message: 'El review se creo correctamente',
        data: {
          ...savedReview,
        },
      };
    } catch (error) {
      return error;
    }
  }
}
