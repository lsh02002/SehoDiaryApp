import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLogin } from '../../context/LoginContext';
import { UserLoginApi } from '../../api/sehodiary-api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TextInput from '../../components/react-native-form/TextInput';
import PasswordInput from '../../components/react-native-form/PasswordInput';
import ConfirmButton from '../../components/react-native-form/ConfirmButton';

const LoginPage = () => {
  const { setIsLogin } = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLoginSubmit = async () => {
    try {
      const res = await UserLoginApi(email, password);

      await AsyncStorage.multiSet([
        ['userId', String(res.data.data.userId)],
        ['nickname', res.data.data.nickname],
        ['accessToken', res.headers.accesstoken],
        ['refreshToken', res.headers.refreshtoken],
      ]);

      setIsLogin(true);
    } catch {}
  };

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.header}>
          <Text style={styles.title}>로그인</Text>

          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.linkText}>계정이 없으세요?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            name="email"
            title="이메일 주소"
            data={email}
            setData={setEmail}
          />
        </View>

        <View style={styles.inputWrapper}>
          <PasswordInput
            name="password"
            title="비밀 번호"
            data={password}
            setData={setPassword}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <ConfirmButton title="로그인" onPress={onLoginSubmit} />
        </View>
      </View>
    </View>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
  },
  inner: {
    width: '100%',
    maxWidth: 400,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
  },
  linkText: {
    color: '#4680ff',
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 12,
  },
  buttonWrapper: {
    width: '100%',
  },
});
