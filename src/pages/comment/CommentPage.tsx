import React, { useEffect, useCallback, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useLogin } from '../../context/LoginContext';
import DiaryCard1 from '../../components/react-native-card/DiaryCard1';
import CommentCreateCard from '../../components/react-native-card/CommentCreateCard';
import CommentCard0 from '../../components/react-native-card/CommentCard0';

import {
  getCommentsByDiaryApi,
  putCommentByIdApi,
} from '../../api/sehodiary-api';

import { CommentRequestType, CommentResponseType } from '../../types/type';
import { showToast } from '../../layouts/Toast';

const CommentPage = () => {
  const { diary, commentList, setCommentList, setMyCommentList } = useLogin();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!diary?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    getCommentsByDiaryApi(diary.id)
      .then(res => {
        setCommentList(res.data);
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, [diary?.id, setCommentList]);

  const handleEditSave = useCallback(
    async (commentId: number, content: string) => {
      const data: CommentRequestType = {
        diaryId: diary?.id ?? -1,
        content,
      };

      putCommentByIdApi(commentId, data)
        .then(() => {
          setCommentList((prev: CommentResponseType[] | undefined) =>
            prev?.map((comment: CommentResponseType) =>
              comment.commentId === commentId
                ? { ...comment, content }
                : comment,
            ),
          );

          setMyCommentList((prev: CommentResponseType[] | undefined) =>
            prev?.map((comment: CommentResponseType) =>
              comment.commentId === commentId
                ? { ...comment, content }
                : comment,
            ),
          );

          showToast('댓글 수정이 되었습니다.', 'success');
        })
        .catch(() => {});
    },
    [diary?.id, setCommentList, setMyCommentList],
  );

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>불러오는 중...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <FlatList
        style={styles.container}
        data={commentList ?? []}
        keyExtractor={item => String(item.commentId)}
        renderItem={({ item }) => (
          <CommentCard0 comment={item} handleEditSave={handleEditSave} />
        )}
        ListHeaderComponent={
          <View>
            <DiaryCard1 diary={diary} />
            <CommentCreateCard diaryId={diary?.id ?? -1} />
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>해당 댓글이 없습니다!</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={true}
      />
    </KeyboardAvoidingView>
  );
};

export default CommentPage;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
  },
});
