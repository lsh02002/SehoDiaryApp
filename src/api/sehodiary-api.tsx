import axios from 'axios';
import { BASE_URL } from './BASE_URL';
import { CommentRequestType, UserSignupType } from '../types/type';
import { DEBUG } from './DEBUG';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '../layouts/Toast';

export const api = axios.create({
  baseURL: BASE_URL,
});

// 요청 인터셉터: 매 요청마다 토큰 자동 추가
api.interceptors.request.use(
  async config => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (accessToken && refreshToken) {
      config.headers.set('accessToken', accessToken);
      config.headers.set('refreshToken', refreshToken);
    }

    return config;
  },
  error => Promise.reject(error),
);

// ✅ 응답 인터셉터: 새 accessToken이 오면 자동 저장
api.interceptors.response.use(
  async response => {
    const newAccessToken = response.headers.accesstoken; // 헤더 키 이름은 서버와 동일하게
    if (newAccessToken) {
      await AsyncStorage.setItem('accessToken', newAccessToken);
    }

    if (DEBUG) {
      console.log(response?.config?.url, response);
    }

    return response;
  },
  error => {
    // ✅ detailMessage가 있으면 가장 먼저 콘솔에 출력
    if (error.response?.data?.detailMessage) {
      showToast(error.response.data.detailMessage);
    }
    // 그 외의 에러도 같이 로깅
    else {
      showToast(error.message);
    }

    if (DEBUG) {
      console.error(error);
    }

    return Promise.reject(error);
  },
);

const UserLoginApi = async (email: string, password: string) => {
  return api.post(`/user/login`, {
    email,
    password,
  });
};

const UserSignupApi = async (data: UserSignupType) => {
  return api.post(`/user/sign-up`, data);
};

const UserLogoutApi = async () => {
  return api.post(`/user/logout`);
};

const UserSetProfileImagesApi = async (data: FormData) => {
  return api.put(`/user/profile`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const getUserInfoApi = async () => {
  return api.get(`/user/info`);
};

const getDiariesByPublicApi = async () => {
  return api.get(`/diary/public`);
};

const getDiariesByUserApi = async () => {
  return api.get(`/diary/user`);
};

const getDiariesTargetFollowingUserIdByUser = async (targetUserId: number) => {
  return api.get(`/diary/${targetUserId}/user`);
}

const getOneDiaryApi = async (diaryId: number) => {
  return api.get(`/diary/one/${diaryId}`);
};

const createDiaryApi = async (data: FormData) => {
  return api.post(`/diary/create`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const editDiaryApi = async (diaryId: number, data: FormData) => {
  return api.put(`/diary/edit/${diaryId}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const getCommentsByDiaryApi = async (diaryId: number) => {
  return api.get(`/comment/diary/${diaryId}`);
};

const getCommentsByUserApi = async () => {
  return api.get(`/comment/user`);
};

const createCommentApi = async (data: CommentRequestType) => {
  return api.post(`/comment/create`, data);
};

const putCommentByIdApi = async (
  commentId: number,
  request: CommentRequestType,
) => {
  return api.put(`/comment/${commentId}`, request);
};

const deleteCommentByIdApi = async (commentId: number) => {
  return api.delete(`/comment/${commentId}`);
};

const getLikingNicknameByDiaryApi = async (diaryId: number) => {
  return api.get(`/like/nicknames/${diaryId}`);
};

const isLikedApi = async (diaryId: number) => {
  return api.get(`/like/isLiked/${diaryId}`);
};

const insertLikeApi = async (diaryId: number) => {
  return api.post(`/like/${diaryId}`);
};

const deleteLikeApi = async (diaryId: number) => {
  return api.delete(`/like/${diaryId}`);
};

const getLogMessagesByUserApi = async () => {
  return api.get(`/activitylog/user`);
};

const getEmotionsApi = async () => {
  return api.get(`/emotion/all`);
};

const getFollowingListByUserApi = async () => {
  return api.get(`/follow/following`);
};

const getFollowerListByUserApi = async () => {
  return api.get(`/follow/follower`);
};

const getDiscoverListByUserApi = async () => {
  return api.get(`/follow/discover`);
};

const createFollowApi = async (targetUserId: number) => {
  return api.post(`/follow/${targetUserId}/follow`);
};

export {
  UserLoginApi,
  UserSignupApi,
  UserLogoutApi,
  UserSetProfileImagesApi,
  getUserInfoApi,
  getDiariesByPublicApi,
  getDiariesByUserApi,
  getDiariesTargetFollowingUserIdByUser,
  getOneDiaryApi,
  createDiaryApi,
  editDiaryApi,
  getCommentsByDiaryApi,
  getCommentsByUserApi,
  createCommentApi,
  putCommentByIdApi,
  deleteCommentByIdApi,
  getLikingNicknameByDiaryApi,
  isLikedApi,
  insertLikeApi,
  deleteLikeApi,
  getLogMessagesByUserApi,
  getEmotionsApi,
  getFollowingListByUserApi,
  getFollowerListByUserApi,
  getDiscoverListByUserApi,
  createFollowApi,
};
