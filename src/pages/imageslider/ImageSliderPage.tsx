import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';

import { DiaryResponseType } from '../../types/type';
import SelectInput from '../../components/react-native-form/SelectInput';
import { TwoDiv } from '../../components/react-native-form/TwoDiv';

type SwiperEffectType = 'slide' | 'horizontal-stack' | 'vertical-stack';
type SwiperDelayType = 500 | 1000 | 2000 | 3000 | 4000;

type ImageItem = {
  fileUrl?: string;
  fileName?: string;
};

const { width: screenWidth } = Dimensions.get('window');

const ImageSliderPage = ({ diary }: { diary: DiaryResponseType }) => {
  const [effect, setEffect] = useState<SwiperEffectType>('slide');
  const [delay, setDelay] = useState<SwiperDelayType>(1000);
  const [containerHeight, setContainerHeight] = useState(320);
  const [containerWidth, setContainerWidth] = useState(screenWidth);
  const [currentIndex, setCurrentIndex] = useState(0);

  const carouselRef = useRef<ICarouselInstance>(null);

  const images: ImageItem[] = diary?.imageResponses ?? [];

  const effectOptions = useMemo(
    () => [
      { label: '슬라이드', value: 'slide' },
      { label: '가로 스택', value: 'horizontal-stack' },
      { label: '세로 스택', value: 'vertical-stack' },
    ],
    [],
  );

  const delayOptions = useMemo(
    () => [
      { label: '0.5 초', value: '500' },
      { label: '1 초', value: '1000' },
      { label: '2 초', value: '2000' },
      { label: '3 초', value: '3000' },
      { label: '4 초', value: '4000' },
    ],
    [],
  );

  const onLayoutContainer = useCallback((e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout;
    if (width > 0) {
      setContainerWidth(width);
      setContainerHeight(Math.max(260, width * 0.75));
    }
  }, []);

  const stackModeConfig = useMemo(() => {
    if (effect === 'slide') {
      return undefined;
    }

    return {
      snapDirection: 'left' as const,
      stackInterval: 18,
      scaleInterval: 0.08,
      opacityInterval: 0.1,
      rotateZDeg: 0,
    };
  }, [effect]);

  const handlePressPagination = useCallback((index: number) => {
    carouselRef.current?.scrollTo({
      index,
      animated: true,
    });
    setCurrentIndex(index);
  }, []);

  const handleChangeEffect = useCallback((value: string) => {
    setEffect(value as SwiperEffectType);
    setCurrentIndex(0);

    requestAnimationFrame(() => {
      carouselRef.current?.scrollTo({
        index: 0,
        animated: false,
      });
    });
  }, []);

  const handleChangeDelay = useCallback((value: string) => {
    setDelay(Number(value) as SwiperDelayType);
  }, []);

  return (
    <View style={styles.wrapper}>
      <View style={styles.sliderContainer} onLayout={onLayoutContainer}>
        {images.length > 0 ? (
          <>
            {effect === 'slide' ? (
              <Carousel
                key={`${effect}-${delay}-${images.length}`}
                ref={carouselRef}
                loop={images.length > 1}
                autoPlay={images.length > 1}
                autoPlayInterval={delay}
                width={containerWidth}
                height={containerHeight}
                data={images}
                scrollAnimationDuration={800}
                pagingEnabled
                snapEnabled
                enabled={images.length > 1}
                onSnapToItem={index => setCurrentIndex(index)}
                renderItem={({ item, index }) => (
                  <View
                    key={item.fileUrl ?? String(index)}
                    style={[
                      styles.page,
                      { width: containerWidth, height: containerHeight },
                    ]}
                  >
                    <View style={styles.slide}>
                      <Image
                        source={{ uri: item.fileUrl }}
                        resizeMode="contain"
                        style={[styles.image, { height: containerHeight - 40 }]}
                      />
                      <Text style={styles.fileName}>
                        파일명: {item.fileName ?? '-'}
                      </Text>
                    </View>
                  </View>
                )}
              />
            ) : (
              <Carousel
                key={`${effect}-${delay}-${images.length}`}
                ref={carouselRef}
                loop={images.length > 1}
                autoPlay={images.length > 1}
                autoPlayInterval={delay}
                width={containerWidth}
                height={containerHeight}
                data={images}
                mode={effect}
                modeConfig={stackModeConfig}
                scrollAnimationDuration={800}
                pagingEnabled
                snapEnabled
                enabled={images.length > 1}
                onSnapToItem={index => setCurrentIndex(index)}
                renderItem={({ item, index }) => (
                  <View
                    key={item.fileUrl ?? String(index)}
                    style={[
                      styles.page,
                      { width: containerWidth, height: containerHeight },
                    ]}
                  >
                    <View style={styles.slide}>
                      <Image
                        source={{ uri: item.fileUrl }}
                        resizeMode="contain"
                        style={[styles.image, { height: containerHeight - 40 }]}
                      />
                      <Text style={styles.fileName}>
                        파일명: {item.fileName ?? '-'}
                      </Text>
                    </View>
                  </View>
                )}
              />
            )}

            <View style={styles.pagination}>
              {images.map((_, index) => (
                <Pressable
                  key={index}
                  onPress={() => handlePressPagination(index)}
                  hitSlop={8}
                  style={[
                    styles.dot,
                    index === currentIndex && styles.activeDot,
                  ]}
                />
              ))}
            </View>

            {effect !== 'slide' && (
              <View style={styles.effectBadge}>
                <Text style={styles.effectBadgeText}>현재 효과: {effect}</Text>
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>표시할 이미지가 없습니다.</Text>
          </View>
        )}
      </View>

      <View style={styles.controls}>
        <TwoDiv>
          <SelectInput
            name="effects"
            title="효과"
            value={effect}
            setValue={handleChangeEffect}
            options={effectOptions}
          />
          <SelectInput
            name="delays"
            title="시간지연"
            value={String(delay)}
            setValue={handleChangeDelay}
            options={delayOptions}
          />
        </TwoDiv>
      </View>
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
    marginBottom: 16,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  slide: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 28,
    borderRadius: 16,
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
  pagination: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#111827',
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
  controls: {
    width: '100%',
  },
});
