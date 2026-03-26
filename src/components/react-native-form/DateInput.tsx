import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../../themes/theme';
import { FieldLabel, FieldWrapper, BaseInput, fieldStyles } from './field';

interface DateInputProps {
  disabled?: boolean;
  title: string;
  selected: Date | undefined;
  setSelected: Dispatch<SetStateAction<Date | undefined>>;
}

const formatDate = (date?: Date) => {
  if (!date) return '';
  return date.toISOString().slice(0, 10);
};

const parseDate = (value: string): Date | undefined => {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

const DateInput = ({
  disabled,
  title,
  selected,
  setSelected,
}: DateInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(formatDate(selected));

  useEffect(() => {
    setInputValue(formatDate(selected));
  }, [selected]);

  return (
    <FieldWrapper>
      <FieldLabel title={title} />
      <View style={styles.row}>
        <BaseInput
          editable={!disabled}
          value={inputValue}
          placeholder="yyyy-MM-dd"
          onChangeText={value => {
            setInputValue(value);
            const parsed = parseDate(value);
            if (parsed) setSelected(parsed);
          }}
          style={[
            fieldStyles.input,
            styles.input,
            disabled && fieldStyles.disabled,
          ]}
        />

        <Pressable
          disabled={disabled}
          onPress={() => setIsOpen(true)}
          style={[styles.button, disabled && fieldStyles.disabled]}
        >
          <Text style={styles.buttonText}>📅</Text>
        </Pressable>
      </View>

      {isOpen ? (
        <Modal
          transparent
          animationType="fade"
          visible={isOpen}
          onRequestClose={() => setIsOpen(false)}
        >
          <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
            <Pressable style={styles.modal} onPress={() => undefined}>
              <DateTimePicker
                value={selected ?? new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={(_, value) => {
                  if (Platform.OS !== 'ios') setIsOpen(false);

                  if (!value) return;

                  setSelected(value);
                  setInputValue(formatDate(value));
                }}
              />
              {Platform.OS === 'ios' ? (
                <Pressable
                  style={styles.confirm}
                  onPress={() => setIsOpen(false)}
                >
                  <Text style={styles.confirmText}>확인</Text>
                </Pressable>
              ) : null}
            </Pressable>
          </Pressable>
        </Modal>
      ) : null}
    </FieldWrapper>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: { flex: 1 },
  button: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  buttonText: { fontSize: 18 },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    padding: 16,
  },
  modal: {
    borderRadius: 24,
    backgroundColor: colors.background,
    padding: 18,
  },
  confirm: {
    marginTop: 12,
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  confirmText: { color: 'white', fontWeight: '700' },
});

export default DateInput;
