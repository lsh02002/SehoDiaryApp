import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

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

  return (
    <ScrollView style={styles.container}>
      <View>
        <DiaryCard1 diary={diary} />
        <CommentCreateCard diaryId={diary?.id ?? -1} />
      </View>
      <View style={styles.listContent}>
        {(commentList ?? []).map(comment => (
          <CommentCard0
            key={comment?.commentId}
            comment={comment}
            handleEditSave={handleEditSave}
          />
        ))}
        {commentList && commentList?.length < 1 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>해당 댓글이 없습니다!</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default CommentPage;

const styles = StyleSheet.create({
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
