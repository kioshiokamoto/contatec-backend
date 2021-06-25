import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CrearPostDTO } from './dtos/create-post.dto';
import { UpdatePostDTO } from './dtos/update-post.dto';
import { PostService } from './post.service';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/create')
  createPost(@Body() createPost: CrearPostDTO) {
    return this.postService.createPost(createPost);
  }

  @Get('/all-posts')
  getAllPost() {
    return this.postService.getAllPost();
  }

  @Get(':id')
  getPost(@Param('id') id: number) {
    return this.postService.getPost(id);
  }

  @Patch(':id')
  updatePost(@Param('id') id: number, @Body() postDto: UpdatePostDTO) {
    return this.postService.updatePost(id, postDto);
  }

  @Delete(':id')
  deletePost(@Param('id') id: number) {
    return this.postService.deletePost(id);
  }
}
