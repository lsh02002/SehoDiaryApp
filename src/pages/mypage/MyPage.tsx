import React, { useEffect, useMemo } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useLogin } from '../../context/LoginContext';
import { useScroll } from '../../context/ScrollContext';
import MyDiaries from './MyDiaries';
import MyComments from './MyComments';
import MyActivityLogs from './MyActivityLogs';
import MyInfo from './MyInfo';
import Layout from '../../layouts/Layout';

type MyPageTab = 'info' | 'mydiary' | 'activitylog';

type RootStackParamList = {
  MyPage: {
    tab?: MyPageTab;
  };
};

const TABS: Array<{ key: MyPageTab; label: string }> = [
  { key: 'info', label: '회원 정보' },
  { key: 'mydiary', label: '내가쓴일기' },
  { key: 'activitylog', label: '활동 로그 내역' },
];

const MyPage = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'MyPage'>>();
  const { isLogin } = useLogin();
  const { mypageTab, setMypageTab } = useScroll();

  const initialTab = useMemo<MyPageTab>(() => {
    const tab = route.params?.tab;
    return tab === 'info' || tab === 'mydiary' || tab === 'activitylog'
      ? tab
      : 'info';
  }, [route.params?.tab]);

  useEffect(() => {
    if (!mypageTab) {
      setMypageTab(initialTab);
    }
  }, [initialTab, mypageTab, setMypageTab]);

  const currentTab = mypageTab || initialTab;

  const handleTabChange = (nextTab: MyPageTab) => {
    setMypageTab(nextTab);
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'info':
        return <MyInfo />;
      case 'mydiary':
        return (
          <>
            <MyDiaries />
            <MyComments />
          </>
        );
      case 'activitylog':
        return <MyActivityLogs />;
      default:
        return <MyInfo />;
    }
  };

  if (!isLogin) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Text style={styles.emptyText}>
          마이페이지는 로그인 후 이용할 수 있습니다.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.tabList}>
          {TABS.map(tab => {
            const selected = currentTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                activeOpacity={0.8}
                onPress={() => handleTabChange(tab.key)}
                style={styles.tabButton}
              >
                <Text
                  style={[styles.tabText, selected && styles.tabTextSelected]}
                >
                  {tab.label}
                </Text>
                <View
                  style={[
                    styles.tabIndicator,
                    selected && styles.tabIndicatorSelected,
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.content}>{renderContent()}</View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',        
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 24,
  },
  tabList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9ca3af',
    textAlign: 'center',
  },
  tabTextSelected: {
    color: '#111827',
  },
  tabIndicator: {
    marginTop: 8,
    height: 3,
    width: '100%',
    borderRadius: 999,
    backgroundColor: 'transparent',
  },
  tabIndicatorSelected: {
    backgroundColor: '#3b82f6',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
  },
});

export default MyPage;
