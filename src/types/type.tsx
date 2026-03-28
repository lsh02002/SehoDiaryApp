export type UserSignupType = {
  email: string;
  nickname: string;
  profileImage: string;
  password: string;
  passwordConfirm: string;
};

export type DiaryRequestType = {
  title: string;
  content: string;
  date: string;
  visibility: string;
  weather: string;
  emoji: string;
};

export type DiaryResponseType = {
  id: number;
  nickname: string;
  title: string;
  content: string;
  date: string;
  visibility: string;
  weather: string;
  commentsCount: number;
  likesCount: number;
  isLiked: boolean;
  imageResponses: ImageResponseType[];
  profileImage: string;
  emoji: string | null;
  createdAt: string;
};

export type CommentRequestType = {
  diaryId: number;
  content: string;
};

export type CommentResponseType = {
  diaryId: number;
  commentId: number;
  nickname: string;
  profileImage: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type ImageResponseType = {
  id: number;
  diaryId: number;
  uploaderId: number;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  sizeBytes: number;
  deleted: boolean;
};

export type ActivityLogResponseType = {
  id: number;
  message: string;
  createdAt: string;
};

export type EmotionResponseType = {
  id: number;
  name: string;
  emoji: string;
  createdAt: string;
  updatedAt: string;
};

export type RNFileType = {
  uri: string;
  name?: string;  
  type?: string;
  size?: number;
};

export type RootStackParamList = {
  MainTabs: undefined;
  Login: undefined;
  Signup: undefined;
  DiaryCreate: undefined;
  DiaryList: undefined;
  DiaryEdit: { diaryId: number };
  Mypage: undefined;
};
