import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PagerView, { PagerViewOnPageSelectedEvent } from 'react-native-pager-view';

import { DiaryResponseType } from '../../types/type';
import SelectInput from '../../components/react-native-form/SelectInput';
import { TwoDiv } from '../../components/react-native-form/TwoDiv';

type SwiperEffectType = 'slide' | 'fade' | 'cube' | 'coverflow' | 'flip';
type SwiperDelayType = 500 | 1000 | 2000 | 3000 | 4000;

type ImageItem = {
  fileUrl?: string;
  fileName?: string;
};

const ImageSliderPage = ({ diary }: { diary: DiaryResponseType }) => {
  const [effect, setEffect] = useState<SwiperEffectType>('slide');
  const [delay, setDelay] = useState<SwiperDelayType>(1000);
  const [containerHeight, setContainerHeight] = useState(320);
  const [currentIndex, setCurrentIndex] = useState(0);

  const pagerRef = useRef<PagerView>(null);
  const autoplayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const images: ImageItem[] = diary?.imageResponses ?? [];

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

  const onLayoutContainer = useCallback((e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout;
    if (width > 0) {
      setContainerHeight(Math.max(260, width * 0.75));
    }
  }, []);

  const stopAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);

  const goToPage = useCallback(
    (page: number, animated = true) => {
      if (!pagerRef.current || images.length === 0) {
        return;
      }

      const safePage = ((page % images.length) + images.length) % images.length;

      if (animated) {
        pagerRef.current.setPage(safePage);
      } else {
        pagerRef.current.setPageWithoutAnimation(safePage);
      }

      setCurrentIndex(safePage);
    },
    [images.length]
  );

  const goToNext = useCallback(() => {
    if (!pagerRef.current || images.length <= 1) {
      return;
    }

    setCurrentIndex(prev => {
      const next = prev + 1;
      const target = next >= images.length ? 0 : next;

      if (next >= images.length) {
        pagerRef.current?.setPageWithoutAnimation(0);
      } else {
        pagerRef.current?.setPage(target);
      }

      return target;
    });
  }, [images.length]);

  const startAutoplay = useCallback(() => {
    stopAutoplay();

    if (images.length <= 1) {
      return;
    }

    autoplayTimerRef.current = setInterval(() => {
      goToNext();
    }, delay);
  }, [delay, goToNext, images.length, stopAutoplay]);

  useEffect(() => {
    startAutoplay();

    return () => {
      stopAutoplay();
    };
  }, [startAutoplay, stopAutoplay]);

  useEffect(() => {
    if (images.length === 0) {
      setCurrentIndex(0);
      stopAutoplay();
      return;
    }

    if (currentIndex >= images.length) {
      goToPage(0, false);
    }
  }, [currentIndex, goToPage, images.length, stopAutoplay]);

  const onPageSelected = useCallback((e: PagerViewOnPageSelectedEvent) => {
    setCurrentIndex(e.nativeEvent.position);
  }, []);

  const slideVariantStyle = useMemo(() => {
    switch (effect) {
      case 'fade':
        return styles.fadeSlide;
      case 'cube':
        return styles.cubeSlide;
      case 'coverflow':
        return styles.coverflowSlide;
      case 'flip':
        return styles.flipSlide;
      case 'slide':
      default:
        return styles.slideOnly;
    }
  }, [effect]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.sliderContainer} onLayout={onLayoutContainer}>
        {images.length > 0 ? (
          <>
            <PagerView
              key={`${effect}-${delay}-${images.length}`}
              ref={pagerRef}
              style={[styles.pager, { height: containerHeight }]}
              initialPage={0}
              onPageSelected={onPageSelected}
              overScrollMode="never"
            >
              {images.map((item, index) => (
                <View
                  key={item.fileUrl ?? String(index)}
                  style={styles.page}
                  collapsable={false}
                >
                  <View style={[styles.slide, slideVariantStyle]}>
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
              ))}
            </PagerView>

            <View style={styles.pagination}>
              {images.map((_, index) => (
                <Pressable
                  key={index}
                  onPress={() => {
                    goToPage(index);
                    startAutoplay();
                  }}
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
            setValue={(v: string) => {
              setEffect(v as SwiperEffectType);
              goToPage(0, false);
              startAutoplay();
            }}
            options={effectOptions}
          />
          <SelectInput
            name="delays"
            title="시간지연"
            value={String(delay)}
            setValue={(v: string) => {
              setDelay(Number(v) as SwiperDelayType);
            }}
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
  pager: {
    width: '100%',
    height: '100%',
  },
  page: {
    width: '100%',
    height: '100%',
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

  slideOnly: {},

  fadeSlide: {
    opacity: 0.96,
  },
  cubeSlide: {
    transform: [{ scale: 0.98 }],
  },
  coverflowSlide: {
    transform: [{ scale: 0.96 }],
  },
  flipSlide: {
    transform: [{ scale: 0.97 }],
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