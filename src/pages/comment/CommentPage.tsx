import React, { useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';

import { useLogin } from '../../context/LoginContext';
import DiaryCard1 from '../../components/react-native-card/DiaryCard1';
import CommentCreateCard from '../../components/react-native-card/CommentCreateCard';
import CommentCard0 from '../../components/react-native-card/CommentCard0';

import {
  getCommentsByDiaryApi,
  putCommentByIdApi,
  showToast,
} from '../../api/sehodiary-api';

import { CommentRequestType, CommentResponseType } from '../../types/type';

const CommentPage = () => {
  const { diary, commentList, setCommentList, setMyCommentList } = useLogin();

  useEffect(() => {
    if (diary?.id) {
      getCommentsByDiaryApi(diary.id)
        .then(res => {
          setCommentList(res.data);
        })
        .catch(() => {});
    }
  }, [diary?.id, setCommentList]);

  const handleEditSave = async (commentId: number, content: string) => {
    const data: CommentRequestType = {
      diaryId: diary?.id ?? -1,
      content,
    };

    putCommentByIdApi(commentId, data)
      .then(() => {
        setCommentList((prev: CommentResponseType[] | undefined) =>
          prev?.map((comment: CommentResponseType) =>
            comment.commentId === commentId ? { ...comment, content } : comment,
          ),
        );

        setMyCommentList((prev: CommentResponseType[] | undefined) =>
          prev?.map((comment: CommentResponseType) =>
            comment.commentId === commentId ? { ...comment, content } : comment,
          ),
        );

        showToast('댓글 수정이 되었습니다.', 'success');
      })
      .catch(() => {});
  };

  const renderHeader = () => (
    <View>
      <DiaryCard1 diary={diary} />
      <CommentCreateCard diaryId={diary?.id ?? -1} />
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>해당 댓글이 없습니다!</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={commentList ?? []}
        keyExtractor={item => String(item.commentId)}
        renderItem={({ item }) => (
          <CommentCard0 comment={item} handleEditSave={handleEditSave} />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default CommentPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
