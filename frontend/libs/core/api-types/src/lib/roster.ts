export interface RosterAuthor {
  username: string;
  profileLink: string;
  totalArticles: number;
  totalLikes: number;
  firstArticleDate: Date | null;
}

export interface Roster {
  authors: RosterAuthor[];
}
