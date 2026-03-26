import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../../themes/theme';
import { FieldLabel, FieldWrapper } from './field';

type Option = { label: string; value: string; disabled?: boolean };

type SelectArrayProps = {
  name: string;
  title: string;
  values: string[];
  setValues: (v: string[]) => void;
  options: Option[];
  placeholder?: string;
  maxMenuHeight?: number;
};

const SelectArrayInput = ({
  title,
  values,
  setValues,
  options,
  placeholder,
}: SelectArrayProps) => {
  const [open, setOpen] = useState(false);
  const mapByValue = useMemo(
    () => new Map(options.map(o => [o.value, o])),
    [options],
  );

  const toggleValue = (value: string) => {
    if (mapByValue.get(value)?.disabled) return;
    setValues(
      values.includes(value)
        ? values.filter(x => x !== value)
        : [...values, value],
    );
  };

  const selectedChips = values
    .map(v => mapByValue.get(v)?.label || v)
    .filter(Boolean);

  return (
    <FieldWrapper>
      <FieldLabel title={title} />
      <Pressable style={styles.trigger} onPress={() => setOpen(true)}>
        {selectedChips.length === 0 ? (
          <Text style={styles.placeholder}>
            {placeholder || `${title}을(를) 선택하세요`}
          </Text>
        ) : (
          <View style={styles.chips}>
            {selectedChips.map((label, index) => (
              <View key={`${label}-${index}`} style={styles.chip}>
                <Text style={styles.chipText}>{label}</Text>
              </View>
            ))}
          </View>
        )}
        <Text style={styles.chevron}>▾</Text>
      </Pressable>

      <Modal
        transparent
        visible={open}
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => undefined}>
            <Text style={styles.sheetTitle}>{title}</Text>
            <ScrollView>
              {options.length === 0 ? (
                <Text style={styles.empty}>해당 {title}이 없습니다.</Text>
              ) : null}
              {options.map(opt => {
                const checked = values.includes(opt.value);
                return (
                  <Pressable
                    key={opt.value}
                    disabled={opt.disabled}
                    onPress={() => toggleValue(opt.value)}
                    style={[
                      styles.option,
                      checked && styles.optionSelected,
                      opt.disabled && styles.disabled,
                    ]}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        checked && styles.checkboxChecked,
                      ]}
                    >
                      {checked ? (
                        <Text style={styles.checkboxMark}>✓</Text>
                      ) : null}
                    </View>
                    <Text style={styles.optionText}>{opt.label}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </FieldWrapper>
  );
};

const styles = StyleSheet.create({
  trigger: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, flex: 1 },
  chip: {
    backgroundColor: colors.chip,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  chipText: { color: colors.chipText },
  placeholder: { color: colors.muted, flex: 1 },
  chevron: { color: colors.muted },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    padding: 16,
  },
  sheet: {
    maxHeight: '75%',
    borderRadius: 20,
    backgroundColor: colors.background,
    padding: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  empty: { color: colors.muted, paddingVertical: 8 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  optionSelected: { backgroundColor: colors.primarySoft },
  optionText: { color: colors.text },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxMark: { color: 'white', fontWeight: '700' },
  disabled: { opacity: 0.5 },
});

export default SelectArrayInput;
