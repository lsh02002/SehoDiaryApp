import {
  useState,
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
} from 'react';
import { CommentResponseType, DiaryResponseType } from '../types/type';

type LoginContextValue = {
  isLogin: boolean;
  setIsLogin: Dispatch<SetStateAction<boolean>>;
  hasNewDiary: boolean;
  setHasNewDiary: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  mypageTab: string;
  setMypageTab: Dispatch<SetStateAction<string>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  diary?: DiaryResponseType;
  setDiary: Dispatch<SetStateAction<DiaryResponseType | undefined>>;
  commentList?: CommentResponseType[];
  setCommentList: Dispatch<SetStateAction<CommentResponseType[] | undefined>>;
  myCommentList?: CommentResponseType[];
  setMyCommentList: Dispatch<SetStateAction<CommentResponseType[] | undefined>>;
};

export const LoginContext = createContext<LoginContextValue | undefined>(
  undefined,
);

export const LoginProvider = ({ children }: { children: ReactNode }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [hasNewDiary, setHasNewDiary] = useState(false);
  const [open, setOpen] = useState(false);
  const [mypageTab, setMypageTab] = useState('follow');
  const [diary, setDiary] = useState<DiaryResponseType>();
  const [commentList, setCommentList] = useState<
    CommentResponseType[] | undefined
  >(undefined);
  const [myCommentList, setMyCommentList] = useState<
    CommentResponseType[] | undefined
  >(undefined);

  const value = useMemo<LoginContextValue>(
    () => ({
      isLogin,
      setIsLogin,
      hasNewDiary,
      setHasNewDiary,
      open,
      setOpen,
      mypageTab,
      setMypageTab,
      diary,
      setDiary,
      commentList,
      setCommentList,
      myCommentList,
      setMyCommentList,
    }),
    [commentList, diary, hasNewDiary, isLogin, myCommentList, mypageTab, open],
  );

  return (
    <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
  );
};

export function useLogin() {
  const ctx = useContext(LoginContext);

  if (!ctx) throw new Error('useLogin must be used within <LoginProvider>');
  return ctx;
}
