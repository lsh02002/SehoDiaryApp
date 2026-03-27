import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActivityLogResponseType } from '../../types/type';

type Props = {
  log: ActivityLogResponseType;
};

const ActivityLogCard = ({ log }: Props) => {
  return (
    <View style={styles.card}>
      <View style={styles.body}>
        <View style={styles.content}>
          <Text style={styles.message}>{log?.message ?? ''}</Text>
          <Text style={styles.createdAt}>{log?.createdAt ?? ''}</Text>
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
  body: {
    padding: 12,
  },
  content: {
    gap: 8,
  },
  message: {
    fontSize: 13,
    color: '#1f2937',
  },
  createdAt: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
});

export default ActivityLogCard;
