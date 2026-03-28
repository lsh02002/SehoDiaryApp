import React, { useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  deleteCommentByIdApi,
  getCommentsByUserApi,
  putCommentByIdApi,  
} from '../../api/sehodiary-api';
import { CommentRequestType, CommentResponseType } from '../../types/type';
import CommentCard1 from '../../components/react-native-card/CommentCard1';
import { useLogin } from '../../context/LoginContext';
import { showToast } from '../../layouts/Toast';

const MyComments = () => {
  const { diary, setDiary, setCommentList, myCommentList, setMyCommentList } =
    useLogin();

  useEffect(() => {
    getCommentsByUserApi()
      .then(res => {
        setMyCommentList(res.data ?? []);
      })
      .catch(() => {
        setMyCommentList([]);
      });
  }, [setMyCommentList]);

  const handleEditSave = async (commentId: number, content: string) => {
    const data: CommentRequestType = {
      diaryId: diary?.id ?? -1,
      content,
    };

    putCommentByIdApi(commentId, data)
      .then(() => {
        setCommentList((prev: CommentResponseType[] = []) =>
          prev.map(comment =>
            comment.commentId === commentId ? { ...comment, content } : comment,
          ),
        );

        setMyCommentList((prev: CommentResponseType[] = []) =>
          prev.map(comment =>
            comment.commentId === commentId ? { ...comment, content } : comment,
          ),
        );

        showToast('댓글 수정이 되었습니다.', 'success');
      })
      .catch(() => {});
  };

  const removeComment = (commentId: number) => {
    deleteCommentByIdApi(commentId)
      .then(() => {
        setCommentList((prev: CommentResponseType[] = []) =>
          prev.filter(comment => comment?.commentId !== commentId),
        );

        setMyCommentList((prev: CommentResponseType[] = []) =>
          prev.filter(comment => comment?.commentId !== commentId),
        );

        setDiary(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            commentsCount: Math.max(0, prev.commentsCount - 1),
          };
        });

        showToast('댓글 삭제가 되었습니다.', 'success');
      })
      .catch(() => {});
  };

  const handleRemoveSave = async (commentId: number) => {
    Alert.alert('댓글 삭제', '해당 댓글을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => removeComment(commentId),
      },
    ]);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>
        내가쓴댓글 ({myCommentList?.length ?? 0})
      </Text>

      {myCommentList && myCommentList.length > 0 ? (
        myCommentList.map((comment: CommentResponseType) => (
          <CommentCard1
            key={String(comment?.commentId)}
            comment={comment}
            handleEditSave={handleEditSave}
            handleRemoveSave={handleRemoveSave}
          />
        ))
      ) : (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>해당 댓글이 없습니다!</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    marginTop: 8,
  },
  emptyBox: {
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#f9fafb',
  },
  emptyText: {
    fontSize: 15,
    color: '#6b7280',
  },
});

export default MyComments;
