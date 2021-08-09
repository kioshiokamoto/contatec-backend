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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CrearPostDTO, SearchPostDto, UpdatePostDTO } from './dtos';
import { PostService } from './post.service';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Crear post' })
  createPost(@Body() createPost: CrearPostDTO, @Req() req) {
    return this.postService.createPost(createPost, req);
  }

  @Get('/all-posts')
  @ApiOperation({ summary: 'Obtener todos los posts' })
  getAllPost() {
    return this.postService.getAllPost();
  }

  @Get('/explore-posts')
  @ApiOperation({ summary: 'Explorar posts' })
  getExplorePosts() {
    return this.postService.getExplorePosts();
  }

  @Post('/search')
  @ApiOperation({ summary: 'Buscador' })
  searchPost(@Body() searchDto: SearchPostDto) {
    return this.postService.searchPost(searchDto);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Obtener post por ID' })
  getPost(@Param('id') id: number) {
    return this.postService.getPost(id);
  }

  @Patch('/update/:id')
  @ApiOperation({ summary: 'Actualizar post' })
  @ApiBearerAuth('Authorization')
  updatePost(
    @Param('id') id: number,
    @Body() postDto: UpdatePostDTO,
    @Req() req,
  ) {
    return this.postService.updatePost(id, postDto, req);
  }

  @Delete('/delete/:id')
  @ApiOperation({ summary: 'Eliminar post' })
  @ApiBearerAuth('Authorization')
  deletePost(@Param('id') id: number) {
    return this.postService.deletePost(id);
  }
}
