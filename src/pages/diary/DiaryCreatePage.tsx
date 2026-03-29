import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import { createDiaryApi } from '../../api/sehodiary-api';
import TextInput from '../../components/react-native-form/TextInput';
import { TwoDiv } from '../../components/react-native-form/TwoDiv';
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
import { DiaryRequestType, RNFileType } from '../../types/type';
import Layout from '../../layouts/Layout';
import { showToast } from '../../layouts/Toast';

export default function DiaryCreatePage() {
  const navigation = useNavigation<any>();

  const [title, setTitle] = useState('');
  const [nickname, setNickname] = useState('');
  const [weather, setWeather] = useState('');
  const [visibility, setVisibility] = useState('PRIVATE');
  const [content, setContent] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [emoji, setEmoji] = useState('');
  const [isImagesShown, setIsImagesShown] = useState(true);
  const [images, setImages] = useState<RNFileType[] | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    async function load() {
      const result = await AsyncStorage.getItem('nickname');
      setNickname(result ?? '');
    }

    load();
  }, []);

  const handleCreateDiary = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    const data: DiaryRequestType = {
      title,
      weather,
      visibility,
      content,
      date: date?.toLocaleDateString('sv-SE') ?? '',
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

    await createDiaryApi(formDataToSend)
      .then(res => {
        showToast?.('글 생성이 되었습니다.', 'success');
        navigation.replace('DiaryEdit', { diaryId: res.data.id });
      })
      .catch(() => {})
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <KeyboardAvoidingView
      // eslint-disable-next-line react-native/no-inline-styles
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Layout>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.pageTitle}>일기 작성</Text>

          <View style={styles.section}>
            <TextInput
              ref={titleRef}
              name="title"
              title="제목"
              data={title}
              setData={setTitle}
              returnKeyType="next"
              onSubmitEditing={() => dateRef.current?.focus()}
            />
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

            <ConfirmButton
              title="일기 생성"
              onPress={handleCreateDiary}
              disabled={isSubmitting}
            />
          </View>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#fff',
    gap: 16,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  section: {
    gap: 12,
  },
});
