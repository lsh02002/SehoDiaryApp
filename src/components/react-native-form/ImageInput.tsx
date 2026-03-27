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
import { RNFileType } from '../../types/type';

type Props = {
  disabled?: boolean;
  name: string;
  title: string;
  data: RNFileType[];
  setData: React.Dispatch<React.SetStateAction<RNFileType[] | null>>;
  previewUrls: string[];
  setPreviewUrls: React.Dispatch<React.SetStateAction<string[]>>;
};

const ImageInput = ({
  disabled,
  title,
  setData,
  previewUrls,
  setPreviewUrls,
}: Props) => {
  const [uploading, setUploading] = useState(false);

  const getExtension = (mimeType?: string) => {
    switch (mimeType) {
      case 'image/png':
        return 'png';
      case 'image/webp':
        return 'webp';
      case 'image/heic':
        return 'heic';
      case 'image/heif':
        return 'heif';
      default:
        return 'jpg';
    }
  };

  const assetToRNFile = (asset: Asset): RNFileType => {
    if (!asset.uri) {
      throw new Error('uri가 없는 이미지입니다.');
    }

    const type = asset.type || 'image/jpeg';
    const name = asset.fileName || `image-${Date.now()}.${getExtension(type)}`;

    return {
      uri: asset.uri,
      name,
      type,
    };
  };

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

      const files = selected.map(assetToRNFile);
      const uris = selected
        .map(asset => asset.uri)
        .filter((uri): uri is string => Boolean(uri));

      setData(files);
      setPreviewUrls(uris);
    } catch (error) {
      console.error(error);
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
            key={`preview-${i}`}
            source={{ uri: url }}
            style={styles.preview}
          />
        ))}
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