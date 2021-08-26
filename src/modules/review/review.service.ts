import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Post from '../../entity/post.entity';
import Review from '../../entity/review.entity';
import Trabajo from '../../entity/trabajo.entity';
import { getConnection, Repository } from 'typeorm';
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
      const { rw_score, rw_idPost, rw_comentario, rw_idTrabajo } =
        createReviewDto;
      const usuario = req.user.id;
      const comentario = rw_comentario ? rw_comentario : '';

      const review = this.reviewRepository.create({
        rw_score,
        rw_comentario: comentario,
        rw_idUsuario: usuario,
        rw_idPost,
        rw_idTrabajo,
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

  async updateReview(createReviewDto: CreateReview, req: any) {
    try {
      const { rw_score, rw_idPost, rw_comentario, rw_idTrabajo } =
        createReviewDto;
      const usuario = req.user.id;
      const comentario = rw_comentario ? rw_comentario : '';

      const findReview = await this.reviewRepository.delete({ rw_idTrabajo });

      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(Review)
        .where('rw_idTrabajo = :rw_idTrabajo', { rw_idTrabajo: rw_idTrabajo })
        .execute();

      const review = this.reviewRepository.create({
        rw_score,
        rw_comentario: comentario,
        rw_idUsuario: usuario,
        rw_idPost,
        rw_idTrabajo,
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
