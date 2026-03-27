import axios from 'axios';
import { BASE_URL } from './BASE_URL';
import Toast from 'react-native-toast-message';
import { CommentRequestType, UserSignupType } from '../types/type';
import { DEBUG } from './DEBUG';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ToastType = 'success' | 'error' | 'info' | 'warning';

let activeToast = '';

export const showToast = (message: string, type: ToastType = 'error') => {
  // 같은 메시지 중복 방지
  if (activeToast === message) return;

  activeToast = message;

  Toast.show({
    type,
    text1: message,
    position: 'bottom',
    visibilityTime: 3000,
    onHide: () => {
      activeToast = '';
    },
  });
};

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
    console.log(
      'REQ headers JSON =',
      config.headers.toJSON?.() ?? config.headers,
    );
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
  return api.post(`/user/profile`, data);
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
  return api.post(`/comment/${commentId}`, request);
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

export {
  UserLoginApi,
  UserSignupApi,
  UserLogoutApi,
  UserSetProfileImagesApi,
  getUserInfoApi,
  getDiariesByPublicApi,
  getDiariesByUserApi,
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
};
