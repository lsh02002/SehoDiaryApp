import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Button,
  Alert,
  Animated,
  StatusBar,
  BackHandler,
  RefreshControl,
} from 'react-native';
import { Menu } from 'lucide-react-native';
import { BackwardButton } from '../components/react-native-form/BackwardButton';
import AddDiaryButton from '../components/react-native-form/AddDiaryButton';
import { useNavigation } from '@react-navigation/native';
import CommentPage from '../pages/comment/CommentPage';
import { useLogin } from '../context/LoginContext';
import { UserLogoutApi } from '../api/sehodiary-api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BottomTabNavigationProp,
  useBottomTabBarHeight,
} from '@react-navigation/bottom-tabs';
import { layouts } from '../themes/theme';
import { BottomTabParamList } from '../types/type';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  appName?: string;
  onRefresh?: () => void;
  children: React.ReactNode;
}

interface SidebarContentProps {
  contentReady: boolean;
}

const SidebarContent = memo(function SidebarContent({
  contentReady,
}: SidebarContentProps) {
  if (!contentReady) return null;

  return <CommentPage />;
});

interface SidebarProps {
  visible: boolean;
  tabBarHeight: number;
  translateY: Animated.Value;
  contentReady: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = memo(function Sidebar({
  visible,
  tabBarHeight,
  translateY,
  contentReady,
  setOpen,
}: SidebarProps) {
  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  useEffect(() => {
    if (!visible) return;

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        handleClose();
        return true; // 기본 뒤로가기 막고 모달/사이드바만 닫기
      },
    );

    return () => subscription.remove();
  }, [visible, handleClose]);

  if (!visible) return null;

  return (
    <View
      pointerEvents="box-none"
      style={[StyleSheet.absoluteFillObject, styles.overlayLayer]}
    >
      <Pressable
        style={[styles.overlay, { bottom: tabBarHeight }]}
        onPress={handleClose}
      />

      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [
              { translateX: 0 }, // 기존 -50% 대체
              { translateY },
            ],
          },
        ]}
      >
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarTitle}>댓글 창</Text>

          <TouchableOpacity
            onPress={handleClose}
            accessibilityLabel="메뉴 닫기"
          >
            <Text style={styles.closeButton}>×</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sidebarContent}>
          <SidebarContent contentReady={contentReady} />
        </View>
      </Animated.View>
    </View>
  );
});

interface HeaderProps {
  appName: string;
  isLogin: boolean;
  onLogoutSubmit: () => Promise<void>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navigation: any;
  nickname: string;
}

const Header = memo(function Header({
  appName,
  isLogin,
  onLogoutSubmit,
  setOpen,
  navigation,
  nickname,
}: HeaderProps) {
  const handleOpen = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const handleLogin = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  const handleSignup = useCallback(() => {
    navigation.navigate('Signup');
  }, [navigation]);

  return (
    <View style={styles.header}>
      <View style={styles.headerInner}>
        <TouchableOpacity
          style={styles.burgerButton}
          accessibilityLabel="메뉴 열기"
          accessibilityRole="button"
          onPress={handleOpen}
        >
          <Menu size={20} color="#111" />
        </TouchableOpacity>

        <Text style={styles.appName}>{appName}</Text>

        <View style={styles.auth}>
          {isLogin ? (
            <>
              <Button title="로그아웃" onPress={onLogoutSubmit} />
              <View>
                <Text style={styles.nicknameText}>{nickname}</Text>
              </View>
            </>
          ) : (
            <>
              <Button title="로그인" onPress={handleLogin} />
              <Button title="회원가입" onPress={handleSignup} />
            </>
          )}
        </View>
      </View>
    </View>
  );
});

type MyDiariesNavigationProp = BottomTabNavigationProp<BottomTabParamList>;

function Layout({ appName = '앱', onRefresh, children }: Props) {
  const { open, setOpen, isLogin, setIsLogin } = useLogin();
  const [visible, setVisible] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const [nickname, setNickname] = useState('');
  const navigation = useNavigation<any>();
  const mypagenavigation = useNavigation<MyDiariesNavigationProp>();

  const tabBarHeight = useBottomTabBarHeight();
  const translateY = useRef(new Animated.Value(400)).current;

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;

    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (open) {
      setVisible(true);
      setContentReady(false);

      Animated.timing(translateY, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }).start(() => {
        setContentReady(true);
      });
    } else if (visible) {
      setContentReady(false);

      Animated.timing(translateY, {
        toValue: 400,
        duration: 220,
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
      });
    }
  }, [open, visible, translateY]);

  useEffect(() => {
    const loadNickname = async () => {
      const name = await AsyncStorage.getItem('nickname');
      setNickname(name ?? 'Guest');
    };

    loadNickname();
  }, [isLogin]);

  const onLogoutSubmit = useCallback(async () => {
    Alert.alert(
      '로그아웃',
      '로그아웃 하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: () => {
            (async () => {
              try {
                await UserLogoutApi();
              } finally {
                await AsyncStorage.multiRemove([
                  'userId',
                  'nickname',
                  'accessToken',
                  'refreshToken',
                ]);

                setIsLogin(false);
              }
            })();
          },
        },
      ],
      { cancelable: true },
    );
  }, [setIsLogin]);

  const handleCreateDiary = useCallback(() => {
    mypagenavigation.navigate('Home', {
      screen: 'DiaryCreate',
    });
  }, [mypagenavigation]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <Sidebar
          visible={visible}
          tabBarHeight={tabBarHeight}
          translateY={translateY}
          contentReady={contentReady}
          setOpen={setOpen}
        />

        <Header
          appName={appName}
          isLogin={isLogin}
          onLogoutSubmit={onLogoutSubmit}
          setOpen={setOpen}
          navigation={navigation}
          nickname={nickname}
        />

        <ScrollView
          contentContainerStyle={styles.mainContent}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <BackwardButton />
          {children}
        </ScrollView>

        <AddDiaryButton title="+" onPress={handleCreateDiary} />
      </View>
    </SafeAreaView>
  );
}

export default memo(Layout);

const styles = StyleSheet.create({
  safeArea: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
  },
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'stretch',
    maxWidth: layouts.maxWidth,
  },
  burgerButton: {
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  overlayLayer: {
    zIndex: 999,
    elevation: 999,    
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.32)',
    width: '100%',
    height: '100%',
  },
  sidebar: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    alignSelf: 'center',
    height: '65%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  sidebarHeader: {
    height: 56,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sidebarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  closeButton: {
    fontSize: 28,
    lineHeight: 28,
    color: '#666',
  },
  sidebarContent: {
    flex: 1,
    padding: 8,
  },
  header: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerInner: {
    minHeight: 56,
    paddingLeft: 56,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  appName: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  auth: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userBox: {
    alignItems: 'flex-end',
  },
  nicknameText: {
    fontSize: 16,
    color: '#111',
  },
  logoutText: {
    fontSize: 13,
    color: '#111',
    marginTop: 2,
  },
  authBox: {
    flexDirection: 'row',
    gap: 16,
  },
  authText: {
    fontSize: 13,
    color: '#111',
  },
  mainContent: {
    width: layouts.width,
    paddingBottom: 100,
  },
});
