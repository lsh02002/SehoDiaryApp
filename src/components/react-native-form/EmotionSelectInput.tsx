import React, {
  forwardRef,
  useEffect,
  useState,
  useImperativeHandle,
} from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getEmotionsApi } from '../../api/sehodiary-api';
import { EmotionResponseType } from '../../types/type';
import { colors } from '../../themes/theme';
import { FieldLabel, FieldWrapper } from './field';

type EmotionType = {
  value: string;
  label: string;
  emoji: string;
};

type Props = {
  disabled?: boolean;
  name: string;
  title: string;
  data: string;
  setData: (v: string) => void;
};

export type EmotionSelectInputRef = {
  focus: () => void;
};

const EmotionSelectInput = forwardRef<EmotionSelectInputRef, Props>(
  ({ disabled, title, data, setData }, ref) => {
    const [emotions, setEmotions] = useState<EmotionType[]>([]);

    useEffect(() => {
      getEmotionsApi()
        .then(res => {
          setEmotions(
            res?.data?.map((emotion: EmotionResponseType) => ({
              value: emotion.name,
              label: emotion.name,
              emoji: emotion.emoji,
            })) ?? [],
          );
        })
        .catch(() => {});
    }, []);

    // ✅ 핵심: focus 시 첫 번째 선택
    useImperativeHandle(ref, () => ({
      focus: () => {
        if (disabled) return;

        const target =
          emotions.find(e => e.value === data || e.emoji === data) ??
          emotions[0];

        if (target) {
          setData(target.emoji);
        }
      },
    }));

    return (
      <FieldWrapper>
        <FieldLabel title={title} />

        <View style={styles.wrap}>
          {emotions.map(emotion => {
            const isActive = data === emotion.emoji || data === emotion.value;

            return (
              <Pressable
                key={emotion.emoji}
                disabled={disabled}
                onPress={() => setData(emotion.emoji)}
                style={[
                  styles.item,
                  isActive ? styles.active : styles.inactive,
                  disabled && styles.disabled,
                ]}
              >
                <Text
                  style={isActive ? styles.activeText : styles.inactiveText}
                >
                  {emotion.emoji} {emotion.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </FieldWrapper>
    );
  },
);

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  item: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
  },
  active: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  inactive: {
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  activeText: {
    color: 'white',
    fontWeight: '600',
  },
  inactiveText: {
    color: colors.text,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default EmotionSelectInput;
