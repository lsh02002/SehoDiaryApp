import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  RichEditor,
  RichToolbar,
  actions,
} from 'react-native-pell-rich-editor';
import { colors } from '../../themes/theme';
import { FieldLabel, FieldWrapper } from './field';

type Props = {
  disabled?: boolean;
  title: string;
  data: string;
  setData: (v: string) => void;
  rows?: number;
};

const PellRichEditorInput = ({
  disabled = false,
  title,
  data,
  setData,
  rows = 8,
}: Props) => {
  const editorRef = useRef<RichEditor>(null);
  const htmlRef = useRef(data || '');
  const initializedRef = useRef(false);
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [initialHtml, setInitialHtml] = useState(data || '');

  const editorHeight = useMemo(() => Math.max(rows, 8) * 28, [rows]);

  useEffect(() => {    
    htmlRef.current = data || '';
    setInitialHtml(data);
  }, [data]);

  useEffect(() => {
    return () => {
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
      }
    };
  }, []);

  const flushToParent = useCallback(
    (html: string) => {
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
      }

      syncTimerRef.current = setTimeout(() => {
        setData(html);
      }, 250);
    },
    [setData],
  );

  const handleChange = useCallback(
    (html: string) => {
      const nextHtml = html ?? '';
      htmlRef.current = nextHtml;
      flushToParent(nextHtml);
    },
    [flushToParent],
  );

  const handleInitialized = useCallback(() => {
    initializedRef.current = true;
  }, []);

  return (
    <FieldWrapper>
      <FieldLabel title={title} />

      <View style={[styles.container, disabled && styles.disabled]}>
        {!disabled && (
          <RichToolbar
            getEditor={() => editorRef.current}
            actions={[
              actions.setBold,
              actions.setItalic,
              actions.setUnderline,
              actions.heading1,
              actions.heading2,
              actions.insertBulletsList,
              actions.insertOrderedList,
              actions.blockquote,
              actions.undo,
              actions.redo,
            ]}
            style={styles.toolbar}
            iconTint={colors.text}
            selectedIconTint={colors.primary}
            selectedButtonStyle={styles.selectedButton}
          />
        )}

        <RichEditor
          ref={editorRef}
          disabled={disabled}
          initialContentHTML={initialHtml}
          placeholder="내용을 입력하세요."
          editorInitializedCallback={handleInitialized}
          style={[styles.editor, { minHeight: editorHeight }]}
          editorStyle={{
            backgroundColor: colors.background,
            color: colors.text,
            placeholderColor: colors.muted,
            contentCSSText: `
              font-size: 16px;
              line-height: 1.6;
              padding: 12px;
              min-height: ${editorHeight}px;
            `,
          }}
          onChange={handleChange}
        />
      </View>

      <Text style={styles.helper}>선택 유지 우선 구조입니다.</Text>
    </FieldWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  toolbar: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.backgroundSoft,
  },
  editor: {
    minHeight: 240,
    backgroundColor: colors.background,
  },
  selectedButton: {
    backgroundColor: colors.backgroundSoft,
    borderRadius: 8,
  },
  helper: {
    marginTop: 6,
    fontSize: 12,
    color: colors.muted,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default PellRichEditorInput;
