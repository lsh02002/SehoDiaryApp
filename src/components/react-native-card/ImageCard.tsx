import React, { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ImageSliderPage from '../../pages/imageslider/ImageSliderPage';
import { DiaryResponseType } from '../../types/type';

type Props = {
  diary: DiaryResponseType;
  imageUrl: string;
};

const ImageCard = ({ diary, imageUrl }: Props) => {
  const [imageOpen, setImageOpen] = useState(false);
  const hasMultipleImages = (diary?.imageResponses?.length ?? 0) > 1;

  return (
    <>
      <View style={styles.imageWrapper}>
        <Pressable onPress={() => setImageOpen(true)}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        </Pressable>
      </View>

      {!hasMultipleImages && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            이미지 뷰는 이미지가 2개 이상이어야 합니다.
          </Text>
        </View>
      )}

      <Modal
        visible={imageOpen && hasMultipleImages}
        animationType="fade"
        transparent
      >
        <Pressable style={styles.backdrop} onPress={() => setImageOpen(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>
                이미지 슬라이더(사진 여러장 등록시)
              </Text>
              <Pressable onPress={() => setImageOpen(false)}>
                <Text style={styles.closeText}>×</Text>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
              <ImageSliderPage diary={diary} />
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    justifyContent: 'center',
    paddingVertical: 8,
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 12,
  },
  warningBox: {
    backgroundColor: '#fef3c7',
    borderRadius: 10,
    padding: 10,
  },
  warningText: {
    color: '#92400e',
    fontSize: 12,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 780,
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  closeText: {
    fontSize: 28,
    lineHeight: 28,
    color: '#6b7280',
  },
  content: {
    padding: 8,
  },
});

export default ImageCard;
