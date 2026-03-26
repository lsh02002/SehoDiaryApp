import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { UserSignupApi } from "../../api/sehodiary-api";
import { UserSignupType } from "../../types/type";
import TextInput from "../../components/react-native-form/TextInput";
import PasswordInput from "../../components/react-native-form/PasswordInput";
import CheckboxInput from "../../components/react-native-form/CheckboxInput";
import ConfirmButton from "../../components/react-native-form/ConfirmButton";

const SignupPage = () => {
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const onSignupSubmit = async () => {
    try {
      await AsyncStorage.multiRemove([
        "userId",
        "nickname",
        "accessToken",
        "refreshToken",
      ]);

      const userInfo: UserSignupType = {
        email,
        nickname,
        profileImage: "",
        password,
        passwordConfirm,
      };

      await UserSignupApi(userInfo);
      navigation.navigate("Login");
    } catch {}
  };

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.header}>
          <Text style={styles.title}>회원가입</Text>

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>이미 계정이 있으세요?</Text>
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
          <TextInput
            name="nickname"
            title="닉네임"
            data={nickname}
            setData={setNickname}
          />
        </View>

        <View style={styles.inputWrapper}>
          <PasswordInput
            name="password"
            title="비밀번호"
            isPasswordVisible={isPasswordVisible}
            data={password}
            setData={setPassword}
          />
        </View>

        <View style={styles.inputWrapper}>
          <PasswordInput
            name="passwordConfirm"
            title="비밀번호 확인"
            isPasswordVisible={isPasswordVisible}
            data={passwordConfirm}
            setData={setPasswordConfirm}
          />
        </View>

        <View style={styles.inputWrapper}>
          <CheckboxInput
            name="istext"
            title="암호보기"
            checked={isPasswordVisible}
            setChecked={setIsPasswordVisible}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <ConfirmButton title="회원 가입" onPress={onSignupSubmit} />
        </View>
      </View>
    </View>
  );
};

export default SignupPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
  },
  inner: {
    width: "100%",
    maxWidth: 400,
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    marginBottom: 8,
  },
  link: {
    color: "#4680ff",
    textDecorationLine: "none",
  },
  inputWrapper: {
    width: "100%",
    marginBottom: 12,
  },
  buttonWrapper: {
    width: "100%",
  },
});