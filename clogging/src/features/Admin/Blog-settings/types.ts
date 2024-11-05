export interface BlogSettings {
  profileImage: File | null;
  faviconImage: File | null;
  bannerImage: File | null;
  title: string;
  description: string;
  profileImageUrl?: string;
  faviconUrl?: string;
  bannerUrl?: string;
}
