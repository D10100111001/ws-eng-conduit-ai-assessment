export class RosterAuthorDTO {
  username: string;
  profileLink: string;
  totalArticles: number;
  totalLikes: number;
  firstArticleDate: Date | null;
}

export class RosterDTO {
  authors: RosterAuthorDTO[];
}
