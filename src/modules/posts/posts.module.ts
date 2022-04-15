import { Module } from '@nestjs/common';
import { postsProviders } from './posts.providers';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

@Module({
  providers: [PostsService, ...postsProviders],
  controllers: [PostsController],
})
export class PostsModule {}
