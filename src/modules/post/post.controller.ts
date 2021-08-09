import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrearPostDTO, SearchPostDto, UpdatePostDTO } from './dtos';
import { PostService } from './post.service';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/create')
  createPost(@Body() createPost: CrearPostDTO, @Req() req) {
    return this.postService.createPost(createPost, req);
  }

  @Get('/all-posts')
  getAllPost() {
    return this.postService.getAllPost();
  }

  @Get('/explore-posts')
  getExplorePosts() {
    return this.postService.getExplorePosts();
  }

  @Post('/search')
  searchPost(@Body() searchDto: SearchPostDto) {
    return this.postService.searchPost(searchDto);
  }

  @Get('/:id')
  getPost(@Param('id') id: number) {
    return this.postService.getPost(id);
  }

  @Patch('/update/:id')
  updatePost(
    @Param('id') id: number,
    @Body() postDto: UpdatePostDTO,
    @Req() req,
  ) {
    return this.postService.updatePost(id, postDto, req);
  }

  @Delete('/delete/:id')
  deletePost(@Param('id') id: number) {
    return this.postService.deletePost(id);
  }
}
