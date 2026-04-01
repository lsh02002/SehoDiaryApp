import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { FollowUserResponseType } from '../../types/type';

export default function UserProfileCard({
  user,
}: {
  user: FollowUserResponseType | null;
}) {
  if (!user) return null;

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: user.profileImageUrl || 'https://via.placeholder.com/72',
        }}
        style={styles.image}
      />

      <View style={styles.content}>
        <Text style={styles.nickname}>{user.nickname}</Text>

        <Text style={styles.introduction}>
          {user.introduction || '소개글이 없습니다.'}
        </Text>

        <View style={styles.meta}>
          <Text style={styles.metaText}>
            팔로워 {user.followerCounter ?? 0}
          </Text>
          <Text style={styles.metaText}>
            팔로잉 {user.followingCounter ?? 0}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    backgroundColor: '#fff',
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: '#f3f4f6',
  },
  content: {
    flex: 1,
  },
  nickname: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  introduction: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 10,
    lineHeight: 21,
  },
  meta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaText: {
    fontSize: 13,
    color: '#374151',
  },
});
