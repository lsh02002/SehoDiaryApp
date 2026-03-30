import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Button,
  Alert,
} from 'react-native';
import { Menu } from 'lucide-react-native';
import { BackwardButton } from '../components/react-native-form/BackwardButton';
import AddDiaryButton from '../components/react-native-form/AddDiaryButton';
import { useNavigation } from '@react-navigation/native';
import CommentPage from '../pages/comment/CommentPage';
import { useLogin } from '../context/LoginContext';
import { RootSiblingParent } from 'react-native-root-siblings';
import { UserLogoutApi } from '../api/sehodiary-api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Animated } from 'react-native';

interface Props {
  appName?: string;
  children: React.ReactNode;
}

export default function Layout({ appName = '앱', children }: Props) {
  const { open, setOpen, isLogin, setIsLogin } = useLogin();
  const [visible, setVisible] = React.useState(false);
  const [contentReady, setContentReady] = React.useState(false);
  const navigation = useNavigation<any>();

  const tabBarHeight = useBottomTabBarHeight();
  const translateY = React.useRef(new Animated.Value(400)).current;

  React.useEffect(() => {
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

  const onLogoutSubmit = async () => {
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
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        {visible && (
          <View
            pointerEvents="box-none"
            style={[StyleSheet.absoluteFillObject, styles.overlayLayer]}
          >
            <Pressable
              style={[styles.overlay, { bottom: tabBarHeight }]}
              onPress={() => setOpen(false)}
            />

            <Animated.View
              style={[
                styles.sidebar,
                {
                  transform: [
                    { translateX: -210 }, // 기존 -50% 대체
                    { translateY },
                  ],
                },
              ]}
            >
              <View style={styles.sidebarHeader}>
                <Text style={styles.sidebarTitle}>댓글 창</Text>

                <TouchableOpacity
                  onPress={() => setOpen(false)}
                  accessibilityLabel="메뉴 닫기"
                >
                  <Text style={styles.closeButton}>×</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.sidebarContent}>
                <RootSiblingParent>
                  {contentReady ? <CommentPage /> : null}
                </RootSiblingParent>
              </View>
            </Animated.View>
          </View>
        )}

        <View style={styles.header}>
          <View style={styles.headerInner}>
            <TouchableOpacity
              style={styles.burgerButton}
              accessibilityLabel="메뉴 열기"
              accessibilityRole="button"
              onPress={() => setOpen(true)}
            >
              <Menu size={20} color="#111" />
            </TouchableOpacity>
            <Text style={styles.appName}>{appName}</Text>
            <View style={styles.auth}>
              {isLogin ? (
                <Button title="로그아웃" onPress={onLogoutSubmit} />
              ) : (
                <>
                  <Button
                    title="로그인"
                    onPress={() => navigation.navigate('Login')}
                  />
                  <Button
                    title="회원가입"
                    onPress={() => navigation.navigate('Signup')}
                  />
                </>
              )}
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.mainContent}
          scrollEventThrottle={16}
        >
          <BackwardButton />
          {children}
        </ScrollView>

        <AddDiaryButton
          title="+"
          onPress={() => navigation.navigate('DiaryCreate')}
        />
      </View>
    </View>
  );
}

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
    alignItems: 'center',
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
    width: 420,
    left: '50%',
    bottom: 0,
    transform: [{ translateX: '-50%' }],
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
    gap: 10,
  },
  userBox: {
    alignItems: 'flex-end',
  },
  nicknameText: {
    fontSize: 13,
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
    width: 420,
    paddingBottom: 100,
  },
});
