import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  LayoutChangeEvent,
} from 'react-native';
import Swiper from 'react-native-swiper';

import { DiaryResponseType } from '../../types/type';
import SelectInput from '../../components/react-native-form/SelectInput';
import { TwoDiv } from '../../components/react-native-form/TwoDiv';

type SwiperEffectType = 'slide' | 'fade' | 'cube' | 'coverflow' | 'flip';
type SwiperDelayType = 500 | 1000 | 2000 | 3000 | 4000;

const ImageSliderPage = ({ diary }: { diary: DiaryResponseType }) => {
  const [effect, setEffect] = useState<SwiperEffectType>('fade');
  const [delay, setDelay] = useState<SwiperDelayType>(1000);
  const [containerHeight, setContainerHeight] = useState(320);
  const swiperRef = useRef<Swiper | null>(null);

  const effectOptions = useMemo(
    () => [
      { label: '페이드', value: 'fade' },
      { label: '슬라이드', value: 'slide' },
      { label: '큐브', value: 'cube' },
      { label: '커버플로우', value: 'coverflow' },
      { label: '플립', value: 'flip' },
    ],
    []
  );

  const delayOptions = useMemo(
    () => [
      { label: '0.5 초', value: '500' },
      { label: '1 초', value: '1000' },
      { label: '2 초', value: '2000' },
      { label: '3 초', value: '3000' },
      { label: '4 초', value: '4000' },
    ],
    []
  );

  const images = diary?.imageResponses ?? [];

  const onLayoutContainer = (e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout;
    if (width > 0) {
      setContainerHeight(Math.max(260, width * 0.75));
    }
  };

  useEffect(() => {
    if (swiperRef.current && images.length > 0) {
      swiperRef.current.scrollBy(0, false);
    }
  }, [effect, delay, images.length]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.sliderContainer} onLayout={onLayoutContainer}>
        <Swiper
          ref={swiperRef}
          key={`${effect}-${delay}`}
          loop
          autoplay
          autoplayTimeout={delay / 1000}
          showsPagination
          showsButtons={false}
          removeClippedSubviews={false}
          dotStyle={styles.dot}
          activeDotStyle={styles.activeDot}
        >
          {images.map((image, index) => (
            <View key={image.fileUrl ?? String(index)} style={styles.slide}>
              <Image
                source={{ uri: image.fileUrl }}
                resizeMode="contain"
                style={[styles.image, { height: containerHeight - 40 }]}
              />
              <Text style={styles.fileName}>
                파일명: {image.fileName ?? '-'}
              </Text>
            </View>
          ))}
        </Swiper>

        {images.length === 0 && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>표시할 이미지가 없습니다.</Text>
          </View>
        )}

        {effect !== 'slide' && (
          <View style={styles.effectBadge}>
            <Text style={styles.effectBadgeText}>현재 효과: {effect}</Text>
          </View>
        )}
      </View>

      <TwoDiv>
        <SelectInput
          name="effects"
          title="효과"
          value={effect}
          setValue={(v: string) => setEffect(v as SwiperEffectType)}
          options={effectOptions}
        />
        <SelectInput
          name="delays"
          title="시간지연"
          value={String(delay)}
          setValue={(v: string) => setDelay(Number(v) as SwiperDelayType)}
          options={delayOptions}
        />
      </TwoDiv>
    </View>
  );
};

export default ImageSliderPage;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  sliderContainer: {
    width: '100%',
    height: 360,
    position: 'relative',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 28,
  },
  image: {
    width: '100%',
  },
  fileName: {
    marginTop: 8,
    fontSize: 14,
  },
  emptyBox: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
  },
  dot: {
    backgroundColor: '#d1d5db',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginBottom: -10,
  },
  activeDot: {
    backgroundColor: '#111827',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginBottom: -10,
  },
  effectBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  effectBadgeText: {
    color: '#fff',
    fontSize: 12,
  },
});