import { Test, TestingModule } from '@nestjs/testing';
import { PostCommentsController } from './post_comments.controller';
import { PostCommentsService } from './post_comments.service';

describe('PostCommentsController', () => {
  let controller: PostCommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostCommentsController],
      providers: [PostCommentsService],
    }).compile();

    controller = module.get<PostCommentsController>(PostCommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
