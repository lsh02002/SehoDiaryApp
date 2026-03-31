import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommentRequestType } from '../../types/type';
import { createCommentApi } from '../../api/sehodiary-api';
import { useLogin } from '../../context/LoginContext';

const CommentCreateCard = ({ diaryId }: { diaryId: number }) => {
  const { setDiary, setCommentList, setMyCommentList } = useLogin();
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('nickname')
      .then(value => setNickname(value ?? ''))
      .catch(() => setNickname(''));
  }, []);

  const handleCreateComment = () => {
    const data: CommentRequestType = {
      diaryId,
      content,
    };

    createCommentApi(data)
      .then(res => {
        setCommentList(prev => {
          if (prev === undefined) return prev;
          return [...prev, res.data];
        });

        setMyCommentList(prev => {
          if (prev === undefined) return prev;
          return [...prev, res.data];
        });

        setDiary(prev => {
          if (prev === undefined) return prev;
          return {
            ...prev,
            commentsCount: prev.commentsCount + 1,
          };
        });

        setContent('');
      })
      .catch(() => {});
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.editorContainer}>
            <Text style={styles.label}>댓글 내용</Text>
            <TextInput
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              placeholder="댓글 내용을 입력하세요"
              style={styles.editor}
            />
          </View>

          <View style={styles.sideBox}>
            <Text style={styles.label}>댓글 작성자</Text>
            <TextInput
              editable={false}
              value={nickname}
              style={styles.disabledInput}
            />
            <Pressable style={styles.button} onPress={handleCreateComment}>
              <Text style={styles.buttonText}>댓글 입력</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  editorContainer: {
    flex: 1,
  },
  sideBox: {
    width: 120,
    gap: 8,
  },
  label: {
    marginBottom: 6,
    color: '#374151',
    fontSize: 13,
    fontWeight: '600',
  },
  editor: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  disabledInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default React.memo(CommentCreateCard);
