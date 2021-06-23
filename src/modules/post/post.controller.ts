import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';


import { CrearPostDTO } from './dtos/create-post.dto';
import { PostService } from './post.service';



@Controller('post')
export class PostController {

    constructor( private readonly postService: PostService ) {}

    @Post('/create')
    createPost( @Body() createPost: CrearPostDTO  ) {
        return this.postService.createPost( createPost );
    }

    @Get('/all-posts')
    getAllPost() {
        return this.postService.getAllPost();
    }

    @Get( ':id' )
    getPost( @Param('id') id: number ) {
        return this.postService.getPost( id );
    }

    @Put(':id')
    updatePost( @Param('id') id: number, @Body() postDto: CrearPostDTO ) {
        return this.postService.updatePost( id, postDto );
    }

    @Put('/disable/:id')
    disablePost( @Param('id') id: number ) {
        return this.postService.changeStatus( id, false );
    }

    @Put('/enable/:id')
    enablePost( @Param('id') id: number ) {
        return this.postService.changeStatus( id, true );
    }

    @Delete(':id')
    deletePost( @Param('id') id: number ) {
        return this.postService.deletePost( id );
    }
    

}
