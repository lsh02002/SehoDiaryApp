import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
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
  onPressNext?: () => void;
};

export type PellRichEditorInputRef = {
  focus: () => void;
  blur: () => void;
  setHtml: (html: string) => void;
  getHtml: () => string;
};

const PellRichEditorInput = forwardRef<PellRichEditorInputRef, Props>(
  ({ disabled = false, title, data, setData, rows = 8, onPressNext }, ref) => {
    const editorRef = useRef<RichEditor>(null);
    const htmlRef = useRef(data || '');
    const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [initialHtml, setInitialHtml] = useState(data || '');

    const editorHeight = useMemo(() => Math.max(rows, 8) * 28, [rows]);

    useEffect(() => {
      htmlRef.current = data || '';
      setInitialHtml(data || '');
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

    useImperativeHandle(ref, () => ({
      focus: () => {
        if (disabled) return;

        // 1차 포커스
        editorRef.current?.focusContentEditor();

        // 🔥 핵심: 키보드 확실히 띄우기
        setTimeout(() => {
          editorRef.current?.focusContentEditor();
        }, 100);
      },
      blur: () => {
        editorRef.current?.blurContentEditor();
      },
      setHtml: (html: string) => {
        htmlRef.current = html;
        editorRef.current?.setContentHTML(html);
        setData(html);
      },
      getHtml: () => htmlRef.current,
    }));

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
            enterKeyHint="next"
            onKeyUp={(e: any) => {
              if (e?.key === 'Enter') {
                onPressNext?.();
              }
            }}
          />
        </View>

        <Text style={styles.helper}>선택 유지 우선 구조입니다.</Text>
      </FieldWrapper>
    );
  },
);

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
