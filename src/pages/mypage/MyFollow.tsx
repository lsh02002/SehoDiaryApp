import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { UserInfoResponseType } from '../../types/type';
import {
  createFollowApi,
  getDiscoverListByUserApi,
  getFollowerListByUserApi,
  getFollowingListByUserApi,
} from '../../api/sehodiary-api';
import FollowCard from '../../components/react-native-card/FollowCard';
import SelectInput from '../../components/react-native-form/SelectInput';
import ConfirmButton from '../../components/react-native-form/ConfirmButton';
import { showToast } from '../../layouts/Toast';

const MyFollow = () => {
  const [targetUserId, setTargetUserId] = useState(-1);
  const [userList, setUserList] = useState<UserInfoResponseType[]>([]);
  const [followingList, setFollowingList] = useState<UserInfoResponseType[]>(
    [],
  );
  const [followerList, setFollowerList] = useState<UserInfoResponseType[]>(
    [],
  );
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    getDiscoverListByUserApi()
      .then(res => {
        setUserList(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refresh]);

  useEffect(() => {
    setLoading(true);

    getFollowingListByUserApi()
      .then(res => {
        setFollowingList(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refresh]);

  useEffect(() => {
    setLoading(true);

    getFollowerListByUserApi()
      .then(res => {
        setFollowerList(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refresh]);

  const handleFollowSubmit = async () => {
    createFollowApi(targetUserId)
      .then(() => {
        showToast('팔로우에 성공했습니다.', 'success');

        setRefresh(prev => !prev);
      })
      .catch(() => {});
  };

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SelectInput
        disabled={userList?.length < 1}
        name="userlist"
        title="유저리스트"
        value={String(targetUserId)}
        setValue={v => setTargetUserId(Number(v))}
        options={userList?.map((user: UserInfoResponseType) => ({
          label: user?.nickname,
          value: String(user?.userId),
        }))}
      />
      <ConfirmButton
        disabled={userList.length < 1}
        title="팔로우 하기"
        onPress={handleFollowSubmit}
      />
      <Text style={styles.title}>팔로잉 ({followingList.length})</Text>
      {followingList.length > 0 ? (
        followingList.map((user: UserInfoResponseType) => (
          <FollowCard key={String(user?.userId)} user={user} isFollowing={true} />
        ))
      ) : (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>팔로잉 이 없습니다!</Text>
        </View>
      )}
      <Text style={styles.title}>팔로워 ({followerList.length})</Text>

      {followerList.length > 0 ? (
        followerList.map((user: UserInfoResponseType) => (
          <FollowCard key={String(user?.userId)} user={user} isFollowing={false} />
        ))
      ) : (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>팔로워가 없습니다!</Text>
        </View>
      )}
    </View>
  );
};

export default MyFollow;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    marginTop: 8,
  },
  emptyBox: {
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#f9fafb',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 15,
    color: '#6b7280',
  },
});
