import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  getUserInfoApi,
  UserSetProfileImagesApi,
} from '../../api/sehodiary-api';
import { showToast } from '../../layouts/Toast';
import { RNFileType } from '../../types/type';
import ImageInput from '../../components/react-native-form/ImageInput';
import RNTextInput from '../../components/react-native-form/TextInput';

const MyInfo = () => {
  const [id, setId] = useState(-1);
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [images, setImages] = useState<RNFileType[] | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    getUserInfoApi()
      .then(res => {
        setId(res?.data?.id ?? -1);
        setEmail(res?.data?.email ?? '');
        setNickname(res?.data?.nickname ?? '');
        setImageUrls(res?.data?.profileImages ?? []);
        setIntroduction(res?.data?.introduction);
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSetProfiles = () => {
    const formDataToSend = new FormData();

    formDataToSend.append('introduction', introduction);

    (images ?? []).forEach(file => {
      formDataToSend.append('files', file);
    });

    UserSetProfileImagesApi(formDataToSend)
      .then(() => {
        showToast('프로필 사진 수정이 되었습니다.', 'success');
      })
      .catch(() => {});
  };

  const renderReadonlyField = (label: string, value: string) => (
    <View style={styles.fieldBox}>
      <Text style={styles.label}>{label}</Text>
      <TextInput editable={false} value={value} style={styles.input} />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderReadonlyField('회원 아이디', String(id))}
      {renderReadonlyField('이메일 주소', email)}
      {renderReadonlyField('닉네임', nickname)}

      <View style={styles.fieldBox}>
        <RNTextInput
          name="introduction"
          title="소개글"
          data={introduction}
          setData={setIntroduction}
        />
      </View>

      <View style={styles.fieldBox}>
        <ImageInput
          name="images"
          title="이미지들"
          data={images ?? []}
          setData={setImages}
          previewUrls={imageUrls}
          setPreviewUrls={setImageUrls}
        />
      </View>

      <Text style={styles.notice}>
        프로필 사진 이외는 가입할 때 정해집니다.
      </Text>

      <View style={styles.buttonRow}>
        <Pressable style={styles.primaryButton} onPress={handleSetProfiles}>
          <Text style={styles.primaryButtonText}>프로필 설정</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 32,
  },
  fieldBox: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  imageRow: {
    paddingVertical: 4,
  },
  previewImage: {
    width: 96,
    height: 96,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    marginRight: 12,
  },
  emptyPreview: {
    width: 180,
    height: 96,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyPreviewText: {
    fontSize: 14,
    color: '#6b7280',
  },
  secondaryButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#e5e7eb',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  notice: {
    fontSize: 14,
    color: '#dc2626',
    marginTop: 8,
    marginBottom: 20,
  },
  buttonRow: {
    alignItems: 'flex-end',
  },
  primaryButton: {
    minWidth: 140,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#2563eb',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 15,
    color: '#6b7280',
  },
});

export default MyInfo;
