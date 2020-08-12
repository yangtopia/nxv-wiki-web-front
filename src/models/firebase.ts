export interface FirestoreUserInfo {
  email: string;
  username: string;
  uid: string;
  displayName: string;
  photoURL: string;
}

export interface FirestoreGetArticleReqParams {
  username: string;
  slug: string;
  isEditing?: boolean;
}

export interface FirestoreArticle {
  uid: string;
  username: string;
  title: string;
  summary: string;
  slug: string;
  content: string;
  previewImage: string;
  tags: string[];
  avatarImageUrl?: string;
  claps?: number;
  created?: Date;
  updated?: Date;
  isActive: boolean;
  viewCount: number;
}

export interface FirestoreDeleteArticleReqParams {
  username: string;
  slug: string;
}
