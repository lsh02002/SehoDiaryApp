import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
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
import Layout from '../../layouts/Layout';

const LoginPage = () => {
  const navigation = useNavigation<any>();
  const { setIsLogin } = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const emailRef = useRef<RNTextInput | null>(null);
  const passwordRef = useRef<RNTextInput | null>(null);
  const confirmButtonRef = useRef<View | null>(null);

  const onLoginSubmit = async () => {
    try {
      const res = await UserLoginApi(email, password);

      await AsyncStorage.multiSet([
        ['userId', String(res.data.data.userId ?? '')],
        ['nickname', String(res.data.data.nickname ?? '')],
        ['accessToken', String(res.headers.accesstoken ?? '')],
        ['refreshToken', String(res.headers.refreshtoken ?? '')],
      ]);

      setIsLogin(true);
      if (navigation.canGoBack()) navigation.goBack();
    } catch {}
  };

  const moveToSignup = () => {
    navigation.navigate('Signup');
  };

  return (
    <Layout>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <View style={styles.titleRow}>
              <SimpleLineIcons name="login" size={20} />
              <Text style={styles.title}> 로그인</Text>
            </View>

            <TouchableOpacity onPress={moveToSignup}>
              <Text style={styles.linkText}>계정이 없으세요?</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            ref={emailRef}
            name="email"
            title="이메일 주소"
            data={email}
            setData={setEmail}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />

          <PasswordInput
            ref={passwordRef}
            name="password"
            title="비밀 번호"
            data={password}
            setData={setPassword}
            returnKeyType="next"
            onSubmitEditing={() => confirmButtonRef.current?.focus()}
          />

          <ConfirmButton
            ref={confirmButtonRef}
            title="로그인"
            onPress={onLoginSubmit}
          />
        </View>
      </KeyboardAvoidingView>
    </Layout>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    width: '100%',
  },
  container: {
    width: '100%',
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
});
