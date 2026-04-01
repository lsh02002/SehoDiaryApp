import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { BottomTabParamList, FollowUserResponseType } from '../../types/type';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type NavigationProp = BottomTabNavigationProp<BottomTabParamList>;

type Props = {
  user: FollowUserResponseType;
  onPressFollow?: () => void;
  isFollowing?: boolean;
};

const FollowCard = ({ user, onPressFollow, isFollowing }: Props) => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <View style={styles.card}>
      <View style={styles.body}>
        <View style={styles.row}>
          {user?.profileImageUrl ? (
            <Image
              source={{ uri: user?.profileImageUrl }}
              style={styles.profileImage}
            />
          ) : (
            <Ionicons name="person-outline" size={36} color="#6b7280" />
          )}

          <View style={styles.content}>
            <Text style={styles.nickname}>{user?.nickname ?? ''}</Text>
          </View>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Home', {
                screen: 'DiaryList',
                params: { targetUserId: user?.userId },
              })
            }
          >
            <Text>다이어리 보기</Text>
          </TouchableOpacity>

          {onPressFollow && (
            <TouchableOpacity
              style={[
                styles.followButton,
                isFollowing && styles.followingButton,
              ]}
              onPress={onPressFollow}
            >
              <Text
                style={[styles.followText, isFollowing && styles.followingText]}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          )}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e5e7eb',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  nickname: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  followButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
  },
  followingButton: {
    backgroundColor: '#e5e7eb',
  },
  followText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  followingText: {
    color: '#374151',
  },
});

export default React.memo(FollowCard);
