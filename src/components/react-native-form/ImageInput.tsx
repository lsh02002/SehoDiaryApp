import React, { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import { colors } from '../../themes/theme';
import { FieldLabel, FieldWrapper } from './field';

export type ImageAsset = Asset;

type Props = {
  disabled?: boolean;
  name: string;
  title: string;
  data: ImageAsset[];
  setData: (files: ImageAsset[]) => void;
  previewUrls: string[];
  setPreviewUrls: React.Dispatch<React.SetStateAction<string[]>>;
};

const ImageInput = ({
  disabled,
  title,
  data,
  setData,
  previewUrls,
  setPreviewUrls,
}: Props) => {
  const [uploading, setUploading] = useState(false);

  const handlePick = async () => {
    if (disabled || uploading) return;

    setUploading(true);

    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 4,
        includeBase64: false,
        quality: 1,
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Alert.alert(
          '이미지 선택 실패',
          result.errorMessage || '이미지를 불러오는 중 문제가 발생했습니다.',
        );
        return;
      }

      const selected = (result.assets ?? []).slice(0, 4);
      setData(selected);
      setPreviewUrls([]);
    } catch {
      Alert.alert('오류', '이미지를 선택하는 중 문제가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <FieldWrapper>
      <FieldLabel title={title} />

      <Pressable
        disabled={disabled || uploading}
        onPress={handlePick}
        style={[styles.button, (disabled || uploading) && styles.disabled]}
      >
        <Text style={styles.buttonText}>
          {uploading ? '불러오는 중...' : '이미지 선택'}
        </Text>
      </Pressable>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.previewList}
      >
        {previewUrls.map((url, i) => (
          <Image
            key={`old-${i}`}
            source={{ uri: url }}
            style={styles.preview}
          />
        ))}

        {data.map((asset, i) =>
          asset.uri ? (
            <Image
              key={`new-${i}`}
              source={{ uri: asset.uri }}
              style={styles.preview}
            />
          ) : null,
        )}
      </ScrollView>
    </FieldWrapper>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  buttonText: {
    color: colors.text,
    fontWeight: '600',
  },
  previewList: {
    gap: 8,
    marginTop: 12,
  },
  preview: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: colors.backgroundSoft,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default ImageInput;
