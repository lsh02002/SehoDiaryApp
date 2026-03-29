import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import { DiaryResponseType } from '../../types/type';

const formatDate = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(date.getDate()).padStart(2, '0')}`;
};

const DiaryCard1 = ({ diary }: { diary: DiaryResponseType | undefined }) => {
  const { width } = useWindowDimensions();
  const date = useMemo(() => formatDate(diary?.date), [diary?.date]);

  return (
    <View style={styles.card}>
      <View style={styles.body}>
        <View style={styles.column}>
          <View style={styles.headerRow}>
            <Text style={styles.diaryId}>#{diary?.id}</Text>
            <Text style={styles.title}>{diary?.title}</Text>
          </View>

          <RenderHTML
            contentWidth={width - 48}
            source={{ html: diary?.content ?? '' }}
          />

          <View style={styles.bottomRow}>
            <Text style={styles.metaText}>작성자: {diary?.nickname}</Text>
            <Text style={styles.metaText}>{date}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  body: { padding: 12 },
  column: { gap: 12 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  diaryId: {
    color: '#2563eb',
    fontWeight: '700',
  },
  title: {
    flex: 1,
    textAlign: 'right',
    fontWeight: '700',
    color: '#111827',
    fontSize: 16,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    color: '#6b7280',
    fontStyle: 'italic',
    fontSize: 12,
  },
});

export default DiaryCard1;
