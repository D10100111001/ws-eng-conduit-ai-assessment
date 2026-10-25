import config from '../mikro-orm.config';
import { Test } from '@nestjs/testing';
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { TagController } from './tag.controller';
import { Tag } from './tag.entity';
import { TagService } from './tag.service';
import { MikroORM } from '@mikro-orm/core';

describe('TagController', () => {
  let tagController: TagController;
  let tagService: TagService;
  let orm: MikroORM;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [MikroOrmModule.forRoot(config), MikroOrmModule.forFeature({ entities: [Tag] })],
      controllers: [TagController],
      providers: [TagService],
    }).compile();

    tagService = module.get<TagService>(TagService);
    tagController = module.get<TagController>(TagController);
    orm = module.get<MikroORM>(MikroORM);
  });

  afterAll(async () => await orm.close(true));

  describe('findAll', () => {
    it('should return an array of tags', async () => {
      const tags = ['angularjs', 'reactjs'];

      jest.spyOn(tagService, 'findAll').mockResolvedValue({ tags });

      const findAllResult = await tagController.findAll();
      expect(findAllResult).toMatchObject({ tags });
    });
  });
});
