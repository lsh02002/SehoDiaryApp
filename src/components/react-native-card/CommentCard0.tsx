import React, { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderHTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CommentResponseType } from '../../types/type';
import PellRichEditorInput from '../react-native-form/PellRichEditorInput';

type Props = {
  comment: CommentResponseType;
  handleEditSave: (commentId: number, content: string) => void;
};

const formatDate = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(date.getDate()).padStart(2, '0')}`;
};

const CommentCard0 = ({ comment, handleEditSave }: Props) => {
  const [content, setContent] = useState('');
  const [nickname, setNickname] = useState('');
  const { width } = useWindowDimensions();

  useEffect(() => {
    setContent(comment?.content ?? '');
  }, [comment?.content]);

  useEffect(() => {
    AsyncStorage.getItem('nickname')
      .then(value => setNickname(value ?? ''))
      .catch(() => setNickname(''));
  }, []);

  const createdAt = useMemo(
    () => formatDate(comment?.createdAt),
    [comment?.createdAt],
  );
  const isEditing = comment?.nickname === nickname;

  return (
    <View style={styles.card}>
      <View style={styles.body}>
        <View style={styles.column}>
          <View style={styles.rowStart}>
            {comment?.profileImage ? (
              <Image
                source={{ uri: comment.profileImage }}
                style={styles.avatar}
              />
            ) : (
              <Ionicons
                name="person-outline"
                size={24}
                color="#6b7280"
                style={styles.icon}
              />
            )}

            <View style={styles.flex1}>
              {isEditing ? (
                <View>
                  <PellRichEditorInput
                    title="내용"
                    data={content}
                    setData={setContent}
                  />
                  <View style={styles.buttonRow}>
                    <Pressable
                      style={styles.primaryButton}
                      onPress={() =>
                        handleEditSave(comment?.commentId, content)
                      }
                    >
                      <Text style={styles.primaryButtonText}>수정</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <RenderHTML
                  contentWidth={width - 100}
                  source={{ html: comment?.content ?? '' }}
                />
              )}
            </View>
          </View>

          <View style={styles.bottomRow}>
            <Text style={styles.metaText}>작성자: {comment?.nickname}</Text>
            <Text style={styles.metaText}>{createdAt}</Text>
          </View>
        </View>
      </View>
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
  column: { gap: 10 },
  rowStart: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  flex1: { flex: 1 },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  icon: {
    marginTop: 2,
  },
  label: {
    marginBottom: 6,
    color: '#374151',
    fontSize: 13,
    fontWeight: '600',
  },
  editor: {
    minHeight: 88,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    color: '#6b7280',
    fontStyle: 'italic',
    fontSize: 12,
  },
});

export default React.memo(CommentCard0);
