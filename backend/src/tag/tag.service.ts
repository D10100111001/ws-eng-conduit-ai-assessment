import { Injectable } from "@nestjs/common";
import { EntityManager, EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Tag } from "./tag.entity";
import { ITagsRO } from "./tag.interface";

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: EntityRepository<
      Tag
    >,
    private readonly em: EntityManager,
  ) {}

  async findAll(): Promise<ITagsRO> {
    const tags = await this.tagRepository.findAll();
    return { tags: tags.map((tag) => tag.tag) };
  }

  async updateOrCreateTags(tagList: string[]): Promise<void> {
    const uniqueTags = [...new Set(tagList)];

    // Find existing tags in one query
    const existingTags = await this.tagRepository.find({
      tag: { $in: uniqueTags },
    });

    const existingTagNames = new Set(existingTags.map((tag) => tag.tag));

    // Determine which tags are new
    const newTags = uniqueTags.filter((tag) => !existingTagNames.has(tag));

    // Batch insert new tags
    if (newTags.length > 0) {
      const tagEntities = newTags.map((tag) => {
        const tagEntity = new Tag();
        tagEntity.tag = tag;
        return tagEntity;
      });
      await this.em.persistAndFlush(tagEntities);
    }
  }
}
