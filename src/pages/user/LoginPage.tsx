import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { useNavigation } from '@react-navigation/native';

import { UserLoginApi } from '../../api/sehodiary-api';
import TextInput from '../../components/react-native-form/TextInput';
import PasswordInput from '../../components/react-native-form/PasswordInput';
import ConfirmButton from '../../components/react-native-form/ConfirmButton';
import { useLogin } from '../../context/LoginContext';

const LoginPage = () => {
  const navigation = useNavigation<any>();
  const { setIsLogin } = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLoginSubmit = async () => {
    await UserLoginApi(email, password)
      .then(res => {
        AsyncStorage.multiSet([
          ['userId', String(res.data.data.userId ?? '')],
          ['nickname', String(res.data.data.nickname ?? '')],
          ['accessToken', String(res.headers.accesstoken ?? '')],
          ['refreshToken', String(res.headers.refreshtoken ?? '')],
        ]);

        setIsLogin(true);
        navigation.navigate('Home');
      })
      .catch(() => {});
  };

  const moveToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View style={styles.titleRow}>
            <SimpleLineIcons name="login" size={20} />
            <Text style={styles.title}> 로그인</Text>
          </View>

          <TouchableOpacity onPress={moveToRegister}>
            <Text style={styles.linkText}>계정이 없으세요?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputBox}>
          <TextInput
            name="email"
            title="이메일 주소"
            data={email}
            setData={setEmail}
          />
        </View>

        <View style={styles.inputBox}>
          <PasswordInput
            name="password"
            title="비밀 번호"
            data={password}
            setData={setPassword}
          />
        </View>

        <View style={styles.buttonBox}>
          <ConfirmButton title="로그인" onPress={onLoginSubmit} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  container: {
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerRow: {
    width: '100%',
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 1,
    color: '#111827',
  },
  linkText: {
    color: '#4680ff',
    fontSize: 14,
  },
  inputBox: {
    width: '100%',
    marginBottom: 16,
  },
  buttonBox: {
    width: '100%',
  },
});
