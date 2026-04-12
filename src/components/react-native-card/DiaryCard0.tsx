import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BottomTabParamList, DiaryResponseType } from '../../types/type';
import { useLogin } from '../../context/LoginContext';
import {
  deleteLikeApi,
  getLikingNicknameByDiaryApi,
  insertLikeApi,
  isLikedApi,
} from '../../api/sehodiary-api';
import ImageCard from './ImageCard';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type MyDiariesNavigationProp = BottomTabNavigationProp<BottomTabParamList>;

const DiaryCard0 = ({
  diary0,
  now,
}: {
  diary0: DiaryResponseType;
  now: number;
}) => {
  const mypagenavigaton = useNavigation<MyDiariesNavigationProp>();
  const { width } = useWindowDimensions();
  const { isLogin, setOpen, setDiary } = useLogin();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(-1);
  const [nicknameList, setNicknameList] = useState<string[]>([]);
  const [likesModalVisible, setLikesModalVisible] = useState(false);

  const updatedAt = diary0?.updatedAt;
  const createdAt = diary0?.createdAt;
  const updatedTime = updatedAt ? new Date(updatedAt).getTime() : 0;
  const isRecentlyUpdated =
    updatedTime > now - 60 * 60 * 1000 && createdAt !== updatedAt;

  useEffect(() => {
    setLikesCount(diary0?.likesCount ?? -1);

    if (isLogin) {
      isLikedApi(diary0?.id ?? -1)
        .then(res => setIsLiked(res.data))
        .catch(() => {});
    }
  }, [diary0?.id, diary0?.likesCount, isLogin]);

  useEffect(() => {
    if (!likesModalVisible) return;

    getLikingNicknameByDiaryApi(diary0?.id ?? -1)
      .then(res => setNicknameList(res.data))
      .catch(() => setNicknameList([]));
  }, [diary0?.id, likesCount, likesModalVisible]);

  const handleLikeClick = () => {
    if (!isLogin) return;

    if (isLiked) {
      deleteLikeApi(diary0?.id ?? -1)
        .then(res => {
          setIsLiked(res.data);
          setLikesCount(prev => prev - 1);
        })
        .catch(() => {});
      return;
    }

    insertLikeApi(diary0?.id ?? -1)
      .then(res => {
        setIsLiked(res.data);
        setLikesCount(prev => prev + 1);
      })
      .catch(() => {});
  };

  const handleOpenComment = () => {
    setDiary(() => {
      if (!diary0) return diary0;
      return {
        ...diary0,
        isLiked,
        likesCount,
      };
    });

    setOpen(true);
  };

  const moveToDetail = () => {
    mypagenavigaton.navigate('Home', {
      screen: 'DiaryEdit',
      params: {
        diaryId: diary0?.id,
      },
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.body}>
        <View style={styles.column}>
          <Pressable style={styles.headerRow} onPress={moveToDetail}>
            <Text style={styles.diaryId}>
              #{diary0?.id}
              {isRecentlyUpdated && <Text>수정됨(1시간내)</Text>}
            </Text>
            <Text style={styles.title}>{diary0?.title}</Text>
          </Pressable>

          <Pressable onPress={moveToDetail}>
            <RenderHTML
              contentWidth={width - 48}
              source={{ html: diary0?.content ?? '' }}
            />
          </Pressable>

          <View style={styles.imageList}>
            {diary0?.imageResponses?.map(image => (
              <ImageCard
                key={image?.id}
                imageUrl={image?.fileUrl}
                diary={diary0}
              />
            ))}
          </View>

          <View style={styles.footerRow}>
            <View style={styles.authorRow}>
              {diary0?.profileImage ? (
                <Image
                  source={{ uri: diary0.profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <Ionicons name="person-outline" size={36} color="#6b7280" />
              )}
              <Text style={styles.authorText}>작성자: {diary0?.nickname}</Text>
            </View>

            <View style={styles.actionsRow}>
              <Text>{diary0?.emoji}</Text>

              <Pressable onPress={handleOpenComment} hitSlop={8}>
                <Feather name="message-square" size={18} color="#374151" />
              </Pressable>
              <Text style={styles.metaText}>({diary0?.commentsCount})</Text>

              <Pressable onPress={handleLikeClick} hitSlop={8}>
                {isLiked ? (
                  <AntDesign name="like1" size={18} color="#2563eb" />
                ) : (
                  <AntDesign name="like2" size={18} color="#374151" />
                )}
              </Pressable>

              <Pressable onPress={() => setLikesModalVisible(true)} hitSlop={8}>
                <Text style={styles.metaText}>{likesCount}</Text>
              </Pressable>

              <Text style={styles.metaText}>{diary0?.date}</Text>
            </View>
          </View>
        </View>
      </View>

      <Modal visible={likesModalVisible} animationType="fade" transparent>
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setLikesModalVisible(false)}
        >
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>좋아요 누른 사람</Text>
            <ScrollView>
              {nicknameList.length > 0 ? (
                nicknameList.map(nickname => (
                  <Text key={nickname} style={styles.modalItem}>
                    {nickname}
                  </Text>
                ))
              ) : (
                <Text style={styles.emptyText}>아직 좋아요가 없습니다.</Text>
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  body: { padding: 12 },
  column: { gap: 12 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  diaryId: {
    color: '#2563eb',
    fontWeight: '700',
  },
  title: {
    flex: 1,
    textAlign: 'right',
    fontWeight: '700',
    color: '#111827',
    fontSize: 16,
  },
  imageList: {
    gap: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  authorText: {
    color: '#6b7280',
    fontStyle: 'italic',
    fontSize: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginLeft: 'auto',
  },
  metaText: {
    color: '#6b7280',
    fontStyle: 'italic',
    fontSize: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxHeight: 400,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalItem: {
    paddingVertical: 6,
    color: '#111827',
  },
  emptyText: {
    color: '#6b7280',
  },
});

export default React.memo(DiaryCard0);
