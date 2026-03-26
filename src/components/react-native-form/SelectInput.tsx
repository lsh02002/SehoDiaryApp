import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { colors } from '../../themes/theme';
import { FieldLabel, FieldWrapper } from './field';

export type Option = {
  label: string;
  value: string;
  disabled?: boolean;
};

type Props = {
  disabled?: boolean;
  name: string;
  title: string;
  value: string;
  setValue: (v: string) => void;
  options: Option[];
  placeholder?: string;
};

const SelectInput = ({
  disabled,
  title,
  value,
  setValue,
  options,
  placeholder,
}: Props) => {
  const [open, setOpen] = useState(false);
  const selectedLabel = useMemo(
    () => options.find(opt => opt.value === value)?.label,
    [options, value],
  );

  return (
    <FieldWrapper>
      <FieldLabel title={title} />
      <Pressable
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={[styles.trigger, disabled && styles.disabled]}
      >
        <Text style={!value ? styles.placeholder : styles.valueText}>
          {selectedLabel ?? placeholder ?? `${title}을(를) 선택하세요`}
        </Text>
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
              {options.map(opt => {
                const selected = value === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    disabled={opt.disabled}
                    onPress={() => {
                      setValue(opt.value);
                      setOpen(false);
                    }}
                    style={[
                      styles.option,
                      selected && styles.optionSelected,
                      opt.disabled && styles.disabled,
                    ]}
                  >
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
  },
  placeholder: { color: colors.muted },
  valueText: { color: colors.text },
  chevron: { color: colors.muted, fontSize: 16 },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    padding: 16,
  },
  sheet: {
    maxHeight: '70%',
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
  option: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  optionSelected: { backgroundColor: colors.primarySoft },
  optionText: { color: colors.text },
  disabled: { opacity: 0.5 },
});

export default SelectInput;
