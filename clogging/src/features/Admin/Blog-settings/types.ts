export interface BlogSettings {
  id?: string;
  profileImage: File[] | null;
  nickname: string;
  description: string;
  faviconImage: File[] | null;
  bannerImage: string[] | null;
}
