import React, { useEffect, useState } from "react";
import {
  Image,
  PermissionsAndroid,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  Asset,
  ImageLibraryOptions,
  launchImageLibrary,
} from "react-native-image-picker";
import {
  getUserInfoApi,
  UserSetProfileImagesApi,
} from "../../api/sehodiary-api";
import { showToast } from "../../layouts/Toast";

type SelectedImage = {
  uri: string;
  name: string;
  type: string;
};

const MyInfo = () => {
  const [id, setId] = useState(-1);
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [images, setImages] = useState<SelectedImage[]>([]);

  useEffect(() => {
    getUserInfoApi()
      .then((res) => {
        setId(res?.data?.id ?? -1);
        setEmail(res?.data?.email ?? "");
        setNickname(res?.data?.nickname ?? "");
        setImageUrls(res?.data?.profileImages ?? []);
      })
      .catch(() => {});
  }, []);

  const requestAndroidPermission = async () => {
    if (Platform.OS !== "android") return true;

    // Android 13 이상은 READ_MEDIA_IMAGES, 이하는 READ_EXTERNAL_STORAGE
    const permission =
      Platform.Version >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const granted = await PermissionsAndroid.request(permission);

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const handlePickImages = async () => {
    const hasPermission = await requestAndroidPermission();

    if (!hasPermission) {
      showToast("앨범 접근 권한이 필요합니다.", "error");
      return;
    }

    const options: ImageLibraryOptions = {
      mediaType: "photo",
      selectionLimit: 5, // 0 = unlimited, 여기선 5장 제한
      includeBase64: false,
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;

      if (response.errorCode) {
        showToast("이미지를 불러오지 못했습니다.", "error");
        return;
      }

      const assets = response.assets ?? [];

      const pickedImages: SelectedImage[] = assets
        .filter((asset: Asset) => !!asset.uri)
        .map((asset: Asset, index: number) => ({
          uri: asset.uri!,
          name: asset.fileName ?? `profile-${Date.now()}-${index}.jpg`,
          type: asset.type ?? "image/jpeg",
        }));

      setImages(pickedImages);
      setImageUrls(pickedImages.map((item) => item.uri));
    });
  };

  const handleSetProfiles = () => {
    if (images.length === 0) {
      showToast("선택된 이미지가 없습니다.", "error");
      return;
    }

    const formDataToSend = new FormData();

    images.forEach((file) => {
      formDataToSend.append("files", {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as any);
    });

    UserSetProfileImagesApi(formDataToSend)
      .then(() => {
        showToast("프로필 사진 수정이 되었습니다.", "success");
      })
      .catch(() => {
        showToast("프로필 사진 수정에 실패했습니다.", "error");
      });
  };

  const renderReadonlyField = (label: string, value: string) => (
    <View style={styles.fieldBox}>
      <Text style={styles.label}>{label}</Text>
      <TextInput editable={false} value={value} style={styles.input} />
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {renderReadonlyField("회원 아이디", String(id))}
      {renderReadonlyField("이메일 주소", email)}
      {renderReadonlyField("닉네임", nickname)}

      <View style={styles.fieldBox}>
        <Text style={styles.label}>프로필 이미지</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.imageRow}
        >
          {imageUrls.length > 0 ? (
            imageUrls.map((uri, index) => (
              <Image
                key={`${uri}-${index}`}
                source={{ uri }}
                style={styles.previewImage}
              />
            ))
          ) : (
            <View style={styles.emptyPreview}>
              <Text style={styles.emptyPreviewText}>
                등록된 이미지가 없습니다.
              </Text>
            </View>
          )}
        </ScrollView>

        <Pressable style={styles.secondaryButton} onPress={handlePickImages}>
          <Text style={styles.secondaryButtonText}>이미지 선택</Text>
        </Pressable>
      </View>

      <Text style={styles.notice}>프로필 사진 이외는 가입할 때 정해집니다.</Text>

      <View style={styles.buttonRow}>
        <Pressable style={styles.primaryButton} onPress={handleSetProfiles}>
          <Text style={styles.primaryButtonText}>프로필 설정</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 32,
  },
  fieldBox: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
  },
  imageRow: {
    paddingVertical: 4,
  },
  previewImage: {
    width: 96,
    height: 96,
    borderRadius: 16,
    backgroundColor: "#e5e7eb",
    marginRight: 12,
  },
  emptyPreview: {
    width: 180,
    height: 96,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyPreviewText: {
    fontSize: 14,
    color: "#6b7280",
  },
  secondaryButton: {
    marginTop: 12,
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#e5e7eb",
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  notice: {
    fontSize: 14,
    color: "#dc2626",
    marginTop: 8,
    marginBottom: 20,
  },
  buttonRow: {
    alignItems: "flex-end",
  },
  primaryButton: {
    minWidth: 140,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#2563eb",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
});

export default MyInfo;