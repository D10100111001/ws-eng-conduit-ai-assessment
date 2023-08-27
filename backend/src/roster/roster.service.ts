import { Injectable } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/mysql";
import { RosterAuthorDTO, RosterDTO } from "./roster.dto";
import { QueryOrder } from "@mikro-orm/core";

@Injectable()
export class RosterService {
  constructor(private readonly em: EntityManager) {}

  async getRosterData(): Promise<RosterDTO> {
    const query = this.em.createQueryBuilder("Article", "a")
      .select([
        "u.username as username",
        "COUNT(a.id) as totalArticles",
        "SUM(a.favorites_count) as totalLikes",
        "MIN(a.created_at) as firstArticleDate",
      ])
      .leftJoin("a.author", "u")
      .groupBy("u.id")
      .orderBy({ "(totalLikes)": QueryOrder.DESC });

    console.log(query.getQuery());

    const rawData: any[] = await query.execute();

    console.log(rawData);

    const rosterAuthors: RosterAuthorDTO[] = rawData.map((author) => {
      return {
        username: author.username,
        profileLink: `/profile/${author.username}`,
        totalArticles: author.totalArticles || 0,
        totalLikes: author.totalLikes || 0,
        firstArticleDate: author.firstArticleDate || null,
      };
    });

    return { authors: rosterAuthors };
  }
}
