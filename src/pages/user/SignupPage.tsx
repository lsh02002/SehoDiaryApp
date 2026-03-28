import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';

import { UserSignupApi } from '../../api/sehodiary-api';
import TextInput from '../../components/react-native-form/TextInput';
import PasswordInput from '../../components/react-native-form/PasswordInput';
import ConfirmButton from '../../components/react-native-form/ConfirmButton';
import CheckboxInput from '../../components/react-native-form/CheckboxInput';
import { UserSignupType } from '../../types/type';
import Layout from '../../layouts/Layout';

const SignupPage = () => {
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const onSignupSubmit = async () => {
    await AsyncStorage.multiRemove([
      'userId',
      'nickname',
      'accessToken',
      'refreshToken',
    ]);

    const userInfo: UserSignupType = {
      email,
      nickname,
      profileImage: '',
      password,
      passwordConfirm,
    };

    await UserSignupApi(userInfo)
      .then(() => {
        navigation.navigate('Login');
      })
      .catch(() => {});
  };

  const moveToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Layout>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerRow}>
            <View style={styles.titleRow}>
              <FontAwesome6 name="registered" size={20} />
              <Text style={styles.title}> 회원가입</Text>
            </View>

            <TouchableOpacity onPress={moveToLogin}>
              <Text style={styles.linkText}>이미 계정이 있으세요?</Text>
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
            <TextInput
              name="nickname"
              title="닉네임"
              data={nickname}
              setData={setNickname}
            />
          </View>

          <View style={styles.inputBox}>
            <PasswordInput
              name="password"
              title="비밀번호"
              isPasswordVisible={isPasswordVisible}
              data={password}
              setData={setPassword}
            />
          </View>

          <View style={styles.inputBox}>
            <PasswordInput
              name="passwordConfirm"
              title="비밀번호 확인"
              isPasswordVisible={isPasswordVisible}
              data={passwordConfirm}
              setData={setPasswordConfirm}
            />
          </View>

          <View style={styles.inputBox}>
            <CheckboxInput
              name="istext"
              title="암호보기"
              checked={isPasswordVisible}
              setChecked={setIsPasswordVisible}
            />
          </View>

          <View style={styles.buttonBox}>
            <ConfirmButton title="회원 가입" onPress={onSignupSubmit} />
          </View>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
};

export default SignupPage;

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
