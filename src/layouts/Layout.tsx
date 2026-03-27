import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
  Button,
} from 'react-native';
import { Menu } from 'lucide-react-native';
import { BackwardButton } from '../components/react-native-form/BackwardButton';
import AddDiaryButton from '../components/react-native-form/AddDiaryButton';
import { useNavigation } from '@react-navigation/native';
import CommentPage from '../pages/comment/CommentPage';

interface Props {
  appName?: string;
  children: React.ReactNode;
}

export default function Layout({ appName = '앱', children }: Props) {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation<any>();

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.burgerButton}
          accessibilityLabel="메뉴 열기"
          accessibilityRole="button"
          onPress={() => setOpen(true)}
        >
          <Menu size={20} color="#111" />
        </TouchableOpacity>

        <Modal
          visible={open}
          transparent
          animationType="fade"
          onRequestClose={() => setOpen(false)}
        >
          <Pressable style={styles.overlay} onPress={() => setOpen(false)} />

          <View style={styles.sidebar}>
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
              <CommentPage />
            </View>
          </View>
        </Modal>

        <View style={styles.header}>
          <View style={styles.headerInner}>
            <Text style={styles.appName}>{appName}</Text>
            <View style={styles.auth}>
              <Button
                title="로그인"
                onPress={() => navigation.navigate('Login')}
              />
              <Button
                title="회원가입"
                onPress={() => navigation.navigate('Signup')}
              />
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.mainContent}
          scrollEventThrottle={16}
        >
          <BackwardButton onPress={() => {}} />
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
  },
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    maxWidth: 420,
  },
  burgerButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 40,
    height: 40,
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.32)',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
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
    paddingBottom: 100,
  },
});
