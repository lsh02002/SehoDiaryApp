import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  ScrollView,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  deleteLikeApi,
  editDiaryApi,
  getLikingNicknameByDiaryApi,
  getOneDiaryApi,
  insertLikeApi,
  isLikedApi,
} from '../../api/sehodiary-api';
import {
  DiaryRequestType,
  ImageResponseType,
  RNFileType,
  RootStackParamList,
} from '../../types/type';
import { useLogin } from '../../context/LoginContext';
import { TwoDiv } from '../../components/react-native-form/TwoDiv';
import TextInput from '../../components/react-native-form/TextInput';
import DateInput from '../../components/react-native-form/DateInput';
import SelectInput, {
  Option,
  SelectInputRef,
} from '../../components/react-native-form/SelectInput';
import PellRichEditorInput, {
  PellRichEditorInputRef,
} from '../../components/react-native-form/PellRichEditorInput';
import EmotionSelectInput, {
  EmotionSelectInputRef,
} from '../../components/react-native-form/EmotionSelectInput';
import CheckboxInput from '../../components/react-native-form/CheckboxInput';
import ImageInput, {
  ImageInputRef,
} from '../../components/react-native-form/ImageInput';
import ConfirmButton from '../../components/react-native-form/ConfirmButton';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Layout from '../../layouts/Layout';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { showToast } from '../../layouts/Toast';

const DiaryEditPage = ({
  route,
}: NativeStackScreenProps<RootStackParamList, 'DiaryEdit'>) => {
  const { diaryId } = route.params;

  const [id, setId] = useState(-1);
  const [nickname, setNickname] = useState('');
  const [title, setTitle] = useState('');
  const [weather, setWeather] = useState('');
  const [visibility, setVisibility] = useState('PUBLIC');
  const [content, setContent] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [commentsCount, setCommentsCount] = useState(-1);
  const [likesCount, setLikesCount] = useState(-1);
  const [isLiked, setIsLiked] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [images, setImages] = useState<RNFileType[] | null>(null);
  const [imageResponses, setImageResponses] = useState<ImageResponseType[]>([]);
  const [profileImage, setProfileImage] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [emoji, setEmoji] = useState('');

  const [isImagesShown, setIsImagesShown] = useState(true);
  const { isLogin, diary, setDiary, setOpen } = useLogin();
  const [isMouseOverOnce, setIsMouseOverOnce] = useState(false);
  const [nicknameList, setNicknameList] = useState<string[]>([]);

  const titleRef = useRef<RNTextInput | null>(null);
  const dateRef = useRef<RNTextInput | null>(null);
  const weatherRef = useRef<RNTextInput | null>(null);
  const visibilityRef = useRef<SelectInputRef | null>(null);
  const contentRef = useRef<PellRichEditorInputRef | null>(null);
  const emotionSelectRef = useRef<EmotionSelectInputRef | null>(null);
  const checkboxRef = useRef<View | null>(null);
  const imageInputRef = useRef<ImageInputRef | null>(null);

  const visibilityOptions: Option[] = [
    { label: 'PUBLIC', value: 'PUBLIC' },
    { label: 'PRIVATE', value: 'PRIVATE' },
    { label: 'FRIENDS', value: 'FRIENDS' },
  ];

  useEffect(() => {
    getOneDiaryApi(Number(diaryId))
      .then(res => {
        const data = res.data;
        setId(data.id);
        setNickname(data.nickname);
        setTitle(data.title);
        setWeather(data.weather);
        setVisibility(data.visibility);
        setContent(data.content);
        setCommentsCount(data.commentsCount);
        setLikesCount(data.likesCount);
        setImageResponses(data.imageResponses);
        setProfileImage(data.profileImage);
        setImageUrls(
          data.imageResponses.map((image: ImageResponseType) => image.fileUrl),
        );
        setEmoji(data.emoji ?? '');
        setCreatedAt(data.createdAt);

        if (data.date) {
          setDate(new Date(data.date));
        }

        setDiary(data);
      })
      .catch(() => {});

    if (isLogin) {
      isLikedApi(Number(diaryId))
        .then(res => {
          setIsLiked(res.data);
        })
        .catch(() => {});
    }
  }, [diaryId, isLogin, setDiary]);

  useEffect(() => {
    if (isMouseOverOnce) {
      getLikingNicknameByDiaryApi(Number(diaryId) ?? -1)
        .then(res => {
          setNicknameList(res.data);
        })
        .catch(() => {});
    }
  }, [diaryId, isMouseOverOnce, likesCount]);

  const handleEditDiary = () => {
    const data: DiaryRequestType = {
      title,
      content,
      date: date?.toLocaleDateString('sv-SE') ?? '',
      visibility,
      weather,
      emoji: emoji ?? '',
    };

    const formDataToSend = new FormData();

    formDataToSend.append('request', {
      string: JSON.stringify(data),
      type: 'application/json',
      name: 'request.json',
    } as any);

    (images ?? []).forEach(file => {
      formDataToSend.append('files', file);
    });

    editDiaryApi(Number(diaryId), formDataToSend)
      .then(() => {
        showToast('글 수정이 되었습니다.', 'success');
      })
      .catch(() => {});
  };

  const handleLikeClick = () => {
    if (!isLogin) return;

    if (isLiked) {
      deleteLikeApi(Number(diaryId))
        .then(res => {
          setIsLiked(res.data);
          setLikesCount(prev => prev - 1);
        })
        .catch(() => {});
    } else {
      insertLikeApi(Number(diaryId))
        .then(res => {
          setIsLiked(res.data);
          setLikesCount(prev => prev + 1);
        })
        .catch(() => {});
    }
  };

  const handleOpenComment = () => {
    const cCount =
      diary && diary.commentsCount > commentsCount
        ? diary.commentsCount
        : commentsCount;

    const data = {
      id: Number(diaryId),
      nickname,
      title,
      content,
      date: date?.toLocaleDateString('sv-SE') ?? '',
      visibility,
      weather,
      commentsCount: cCount,
      likesCount,
      isLiked,
      imageResponses,
      profileImage,
      emoji: emoji ?? '',
      createdAt,
    };

    setDiary(data);
    setOpen(true);
  };

  return (
    <KeyboardAvoidingView
      // eslint-disable-next-line react-native/no-inline-styles
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Layout>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.pageTitle}>일기 작성</Text>

          <TwoDiv>
            <TextInput
              disabled
              name="id"
              title="아이디"
              data={String(id)}
              setData={v => setId(Number(v))}
            />
            <TextInput
              ref={titleRef}
              name="title"
              title="제목"
              data={title}
              setData={setTitle}
              returnKeyType="next"
              onSubmitEditing={() => dateRef.current?.focus()}
            />
          </TwoDiv>

          <TwoDiv>
            <TextInput
              disabled
              name="nickname"
              title="작성자"
              data={nickname}
              setData={() => {}}
            />
            <DateInput
              ref={dateRef}
              title="날짜"
              selected={date}
              setSelected={setDate}
              returnKeyType="next"
              onSubmitEditing={() => weatherRef.current?.focus()}
            />
          </TwoDiv>

          <TwoDiv>
            <TextInput
              ref={weatherRef}
              name="weather"
              title="날씨"
              data={weather}
              setData={setWeather}
              returnKeyType="next"
              onSubmitEditing={() => visibilityRef.current?.focus()}
            />
            <SelectInput
              ref={visibilityRef}
              name="visibility"
              title="공개여부"
              value={visibility}
              setValue={setVisibility}
              options={visibilityOptions}
              onPressNext={() => contentRef.current?.focus()}
            />
          </TwoDiv>

          <PellRichEditorInput
            ref={contentRef}
            title="내용"
            data={content}
            setData={setContent}
            onPressNext={() => emotionSelectRef.current?.focus()}
            rows={8}
          />

          <View style={styles.actionRow}>
            <Pressable
              onPress={handleOpenComment}
              style={styles.iconButton}
              hitSlop={8}
            >
              <FontAwesome6 name="comment-dots" size={18} />
            </Pressable>

            <Text style={styles.countText}>({diary?.commentsCount})</Text>

            <Pressable
              onPress={handleLikeClick}
              onPressIn={() => setIsMouseOverOnce(true)}
              onPressOut={() => setIsMouseOverOnce(false)}
              style={styles.iconButton}
              hitSlop={8}
            >
              {isLiked ? (
                <AntDesign name="like1" size={18} />
              ) : (
                <AntDesign name="like2" size={18} />
              )}
            </Pressable>

            <View style={styles.likesWrapper}>
              <Text style={styles.countText}>{likesCount}</Text>

              {isMouseOverOnce && nicknameList.length > 0 && (
                <View style={styles.tooltip}>
                  {nicknameList.map((list, index) => (
                    <Text key={index} style={styles.nicknameText}>
                      {list}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </View>

          <EmotionSelectInput
            ref={emotionSelectRef}
            name="emotion"
            title="이모션"
            data={emoji ?? ''}
            setData={setEmoji}
          />

          <CheckboxInput
            ref={checkboxRef}
            name="isimageshown"
            title="이미지입력창"
            checked={isImagesShown}
            setChecked={setIsImagesShown}
          />

          {isImagesShown && (
            <ImageInput
              ref={imageInputRef}
              name="images"
              title="이미지들"
              data={images ?? []}
              setData={setImages}
              previewUrls={imageUrls}
              setPreviewUrls={setImageUrls}
            />
          )}

          <ConfirmButton title="일기 수정" onPress={handleEditDiary} />
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
};

export default DiaryEditPage;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    width: '100%',
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
    marginBottom: 16,
  },
  iconButton: {
    marginRight: 6,
  },
  countText: {
    fontStyle: 'italic',
    color: 'gray',
    marginRight: 10,
  },
  likesWrapper: {
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
    left: -15,
    top: 25,
    padding: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    zIndex: 10,
    elevation: 3,
    minWidth: 100,
  },
  nicknameText: {
    color: '#333',
    marginBottom: 2,
  },
});
