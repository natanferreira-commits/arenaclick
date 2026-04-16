export interface InstagramProfile {
  username: string;
  fullName: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  profilePicUrl: string;
  engagementRate: number;
  avgLikes: number;
  avgComments: number;
  isVerified: boolean;
  topPosts: {
    url: string;
    likes: number;
    comments: number;
    thumbnail: string;
  }[];
}

export interface MediaKitData {
  // Dados do formulário
  name: string;
  email: string;
  whatsapp: string;
  niche: string;
  city: string;
  contactEmail: string;
  avgStoryViews: number;
  avgReelsViews: number;

  // Dados scraped
  instagram: InstagramProfile | null;

  // IA
  aiDescription: string;
}

export interface FormInput {
  name: string;
  email: string;
  whatsapp: string;
  instagram: string;
  niche: string;
  city: string;
  contactEmail: string;
  avgStoryViews: string;
  avgReelsViews: string;
}
