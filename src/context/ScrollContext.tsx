import {
  useState,
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
} from "react";

type ScrollPositionType = {
  x: number;
  y: number;
};

type ScrollContextValue = {
  mypageTab: string;
  setMypageTab: Dispatch<SetStateAction<string>>;
  mainPageScroll: ScrollPositionType;
  setMainPageScroll: Dispatch<SetStateAction<ScrollPositionType>>;
  myDiaryScroll: ScrollPositionType;
  setMyDiaryScroll: Dispatch<SetStateAction<ScrollPositionType>>;
};

export const ScrollContext = createContext<ScrollContextValue | undefined>(
  undefined,
);

export const ScrollProvider = ({ children }: { children: ReactNode }) => {
  const [mypageTab, setMypageTab] = useState("info");
  const [mainPageScroll, setMainPageScroll] = useState<ScrollPositionType>({
    x: 0,
    y: 0,
  });
  const [myDiaryScroll, setMyDiaryScroll] = useState<ScrollPositionType>({
    x: 0,
    y: 0,
  });

  const value = useMemo<ScrollContextValue>(
    () => ({
      mypageTab,
      setMypageTab,
      mainPageScroll,
      setMainPageScroll,
      myDiaryScroll,
      setMyDiaryScroll,
    }),
    [mypageTab, mainPageScroll, myDiaryScroll],
  );

  return (
    <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
  );
};

export function useScroll() {
  const ctx = useContext(ScrollContext);

  if (!ctx)
    throw new Error("useScroll must be used within <ScrollProvider>");
  return ctx;
}
