import React, { useEffect, useState, useRef, KeyboardEvent } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import {
  Translate,
  withLocalize,
  LocalizeContextProps,
} from 'react-localize-redux';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';

import _throttle from 'lodash/throttle';
import _isUndefined from 'lodash/isUndefined';
import _isEmpty from 'lodash/isEmpty';
import _delay from 'lodash/delay';
import _get from 'lodash/get';
import _sortedUniq from 'lodash/sortedUniq';
import _replace from 'lodash/replace';

import { Fab, Chip, Tooltip } from '@material-ui/core';
import { Create, Save, Cancel } from '@material-ui/icons';
import { MarkdownStyle } from '@styles/styled-mixins';

import firebase, { ARTICLE_TEMP_COLLECTION_NAME } from '@services/initFirebase';

import { selectFirestoreUserInfo } from '@store/auth';
import { showMessage } from '@store/message';

import nxvMarkdownParser from '@utils/nxv-markdown-parser';
import slugify from '@utils/slugfy';
import {
  createFirestoreArticleThunk,
  selectFirestoreArticle,
  updateFirestoreArticleThunk,
  updateArticleTagThunk,
} from '@store/article';
import useApexRender from '@hooks/useApexRender';
import { ErrorComponent } from '@components/shared';
import { FirestoreUserInfo } from '@models/firebase';

const firestore = firebase.firestore();

const MarkdownEditor = dynamic(
  () => import('@yangtopia/react-markdown-editor-lite'),
  {
    ssr: false,
  },
);

const AritcleEditorContainerWrap = styled.article`
  width: 100%;
  padding-left: 15px;
  padding-right: 15px;
  padding-bottom: 100px;
  .rc-md-editor {
    min-height: 60vh;
    .section-container.input {
      font-family: 'Noto Sans KR';
    }
    .editor-html-preview {
      ${MarkdownStyle};
    }
    .section-container.html-wrap {
      border-left: 1px solid #f5f5f5;
    }
  }
`;

const ButtonWrap = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
`;

const StyledFabPublish = styled(Fab).attrs({
  color: 'primary',
  variant: 'extended',
  type: 'submit',
})`
  margin-left: 10px;
`;

const StyledFabSave = styled(Fab).attrs({
  variant: 'extended',
  type: 'button',
})`
  color: #fff;
  background-color: #a9a9a9;
  &:hover {
    background-color: #808080;
  }
`;

const CreateIcon = styled(Create)`
  margin-right: 5px;
  font-size: 20px;
`;

const SaveIcon = styled(Save)`
  margin-right: 5px;
  font-size: 20px;
`;

const CancelIcon = styled(Cancel)`
  margin-right: 5px;
  font-size: 20px;
`;

const Form = styled.form`
  /* height: 80%; */
`;

const InputBase = styled.input`
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: #a3acb4;
  }
  background: none;
  border: none;
  font-weight: bold;
  margin-bottom: 20px;
  font-family: inherit;
  width: 100%;
`;

const TitleInput = styled(InputBase)`
  font-size: 50px;
  @media (max-width: ${(props) => props.theme.breakPoint.sm}) {
    font-size: 30px;
  }
`;

const SlugInput = styled(InputBase)`
  font-size: 20px;
  margin-bottom: 0;
`;

const TagInputWrap = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const TagInput = styled(InputBase)`
  margin-bottom: 0;
`;

const ChipStyled = styled(Chip)`
  font-weight: bold;
  margin-right: ${(props) => props.theme.spacing(1)}px;
  font-size: 14px;
`;

const SlugInputWrap = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  flex: 1;
  @media (max-width: ${(props) => props.theme.breakPoint.sm}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SlugInputTooltip = styled.div`
  font-size: 12px;
  padding: ${(props) => props.theme.spacing(1)}px 0;
`;

const SlugInputPreview = styled.div`
  display: flex;
  align-items: center;
  font-size: 20px;
  color: #a3acb4;
  white-space: nowrap;
  @media (max-width: ${(props) => props.theme.breakPoint.sm}) {
    font-size: 12px;
    margin-top: ${(props) => props.theme.spacing(1)}px;
  }
`;

interface FormValues {
  title: string;
  slug: string;
  content: string;
  tag: string;
}

interface TempArticle {
  title: string;
  slug: string;
  content: string;
  tags: string[];
}

interface Props extends LocalizeContextProps {
  isEditable?: boolean;
  isServer?: boolean;
}

const ArticleEditorContainer: React.FC<Props> = ({
  activeLanguage,
  isEditable = false,
  isServer = false,
}) => {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [isShowTagInputTooltip, setShowTagInputTooltip] = useState(false);

  const dispatch = useDispatch();
  const userInfo = useSelector(selectFirestoreUserInfo);
  const article = useSelector(selectFirestoreArticle);

  const isKorean = activeLanguage.code === 'ko';
  const initialTitle = isEditable ? _get(article, 'title', '') : '';
  const initialSlug = (() => {
    if (isEditable) {
      const { slug } = router.query;
      return slug as string;
    }
    return '';
  })();
  const initialContent = isEditable ? _get(article, 'content', '') : '';
  const initialTags = isEditable ? _get(article, 'tags', []) : [];

  const [currentTags, setTags] = useState<string[]>(initialTags);

  const filteredPlugins = ((firebaseUserInfo?: FirestoreUserInfo) => {
    const plugins = [
      'toc',
      'header',
      'fonts',
      'table',
      'image',
      'link',
      'clear',
      'logger',
      'mode-toggle',
      'full-screen',
    ];
    return firebaseUserInfo
      ? plugins
      : plugins.filter((plugin) => plugin !== 'image');
  })(userInfo);

  const formik = useFormik<FormValues>({
    initialValues: {
      title: initialTitle,
      slug: initialSlug,
      content: initialContent,
      tag: '',
    },
    onSubmit: ({ title, slug, content }) => {
      if (!userInfo) {
        dispatch(
          showMessage({
            messageCode: 'message.login.need',
          }),
        );
        return;
      }
      if (_isEmpty(title)) {
        dispatch(
          showMessage({
            messageCode: 'message.article.error.empty.title',
          }),
        );
        return;
      }
      if (_isEmpty(slug)) {
        dispatch(
          showMessage({
            messageCode: 'message.article.error.empty.slug',
          }),
        );
        return;
      }
      if (_isEmpty(slugify(slug))) {
        dispatch(
          showMessage({
            messageCode: 'message.article.error.wrong-slug',
          }),
        );
        return;
      }
      if (_isEmpty(content)) {
        dispatch(
          showMessage({
            messageCode: 'message.article.error.empty.content',
          }),
        );
        return;
      }

      const previewImageUrlExtracted = ((str: string) => {
        const regexp = /(?:!\[(.*?)\]\((.*?)\))/;
        const matched = str.match(regexp);
        if (matched) {
          return matched[2];
        }
        return '';
      })(content);

      const summaryExtracted = nxvMarkdownParser(content)
        .replace(/<(.|\n)*?>/g, '')
        .substr(0, 400);

      if (isEditable && article) {
        dispatch(updateArticleTagThunk(currentTags));
        dispatch(
          updateFirestoreArticleThunk(article, {
            uid: userInfo?.uid,
            username: userInfo?.username,
            title,
            content,
            slug: slugify(slug),
            tags: currentTags,
            summary: summaryExtracted,
            previewImage: previewImageUrlExtracted,
            isActive: article.isActive,
            viewCount: article.viewCount,
          }),
        );
      } else {
        dispatch(updateArticleTagThunk(currentTags));
        dispatch(
          createFirestoreArticleThunk({
            uid: userInfo?.uid,
            username: userInfo?.username,
            title,
            content,
            slug: slugify(slug),
            tags: currentTags,
            summary: summaryExtracted,
            previewImage: previewImageUrlExtracted,
            avatarImageUrl: userInfo.photoURL,
            claps: 0,
            isActive: true,
            viewCount: 0,
          }),
        );
      }
    },
  });

  const { setValue: setContentFieldValue } = formik.getFieldHelpers('content');

  // for INITIAL APEXCHARTS
  const [isComponentMount, setIsComponentMount] = useState(false);
  const [markdownHtml, setMarkdownHtml] = useState('');

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  useApexRender([isComponentMount, markdownHtml]);

  useEffect(() => {
    if (userInfo) {
      (async () => {
        if (!isEditable) {
          const docSnapshot = await firestore
            .collection(ARTICLE_TEMP_COLLECTION_NAME)
            .doc(userInfo.uid)
            .get();

          if (docSnapshot.exists) {
            const {
              title,
              content,
              slug,
              tags,
            } = docSnapshot.data() as TempArticle;

            setTags(tags);

            formik.setValues({
              title,
              content,
              slug,
              tag: '',
            });
          }
        }
      })();
    }
  }, [userInfo]);

  const markdownRenderHandler = (markdownText: string) => {
    setIsComponentMount(true);
    const parsedText = nxvMarkdownParser(markdownText);
    setMarkdownHtml(parsedText);
    return parsedText;
  };

  const onImageUploadHandler = async (file: File) => {
    const storageRef = firebase.storage().ref();
    const imageRef = storageRef.child(`images/${userInfo?.uid}/${file.name}`);

    const uploadedImageUrl: string = await (
      await imageRef.put(file, { contentType: `${file.type}` })
    ).ref.getDownloadURL();

    return uploadedImageUrl;
  };

  const onClickTempSave = async () => {
    const { title, slug, content } = formik.values;
    const docRef = firestore
      .collection(ARTICLE_TEMP_COLLECTION_NAME)
      .doc(userInfo?.uid);
    try {
      await docRef.set({
        title,
        slug,
        content,
        tags: currentTags,
      });
      dispatch(
        showMessage({
          messageCode: 'message.article.save.success',
        }),
      );
    } catch (error) {
      dispatch(
        showMessage({
          messageCode: 'error.custom',
          message: error,
        }),
      );
    }
  };

  const onClickCancel = () => {
    const { owner, slug } = router.query;
    router.push('/[owner]/[slug]', `/${owner}/${slug}`);
  };

  const onDeleteTag = (tag: string) => {
    setTags(currentTags.filter((currentTag) => currentTag !== tag));
  };

  const onKeyDownTagInput = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13 || e.keyCode === 32) {
      e.preventDefault();
      const { tag } = formik.values;
      if (currentTags.length === 3) {
        dispatch(
          showMessage({
            messageCode: 'error.custom',
            message: '태그는 3개까지만 허용됩니다.',
            severity: 'warning',
          }),
        );
        return;
      }
      if (tag.trim().length < 2) {
        setShowTagInputTooltip(true);
        return;
      }
      setTags(
        _sortedUniq(currentTags.concat([_replace(tag.trim(), / /g, '_')])),
      );
      formik.setFieldValue('tag', '');
      setShowTagInputTooltip(false);
    }
  };

  return isServer ? (
    <ErrorComponent errorCode="wrong-approach" />
  ) : (
    <AritcleEditorContainerWrap>
      <Form onSubmit={formik.handleSubmit}>
        <TitleInput
          ref={titleInputRef}
          id="title"
          name="title"
          type="text"
          placeholder={isKorean ? '제목을 입력하세요' : 'Enter Title'}
          onChange={formik.handleChange}
          value={formik.values.title}
        />
        <SlugInputWrap>
          <SlugInput
            id="slug"
            name="slug"
            type="text"
            placeholder={isKorean ? 'URL을 입력하세요' : 'Enter Search URL'}
            onChange={formik.handleChange}
            value={formik.values.slug}
          />
          <Tooltip
            title={
              <SlugInputTooltip>
                외부로 노출될 글의 주소를 설정합니다.
              </SlugInputTooltip>
            }
            arrow
          >
            <SlugInputPreview>
              {`${window.location.protocol}//${window.location.host}/@${
                userInfo?.username
              }/${slugify(formik.values.slug)}`}
            </SlugInputPreview>
          </Tooltip>
        </SlugInputWrap>
        <TagInputWrap>
          {currentTags.map((tag) => (
            <ChipStyled
              key={tag}
              label={`#${tag}`}
              onDelete={() => onDeleteTag(tag)}
            />
          ))}
          <Tooltip
            open={isShowTagInputTooltip}
            title={
              <SlugInputTooltip>2글자 이상 입력해주세요.</SlugInputTooltip>
            }
            placement="bottom-start"
            arrow
          >
            <TagInput
              id="tag"
              name="tag"
              type="text"
              placeholder="태그 입력 후 엔터"
              onChange={formik.handleChange}
              value={formik.values.tag}
              onKeyDown={(e) => onKeyDownTagInput(e)}
            />
          </Tooltip>
        </TagInputWrap>
        <MarkdownEditor
          htmlClass="editor-html-preview"
          renderHTML={markdownRenderHandler}
          onImageUpload={onImageUploadHandler}
          plugins={filteredPlugins}
          config={{
            table: {
              isShowDefaultText: false,
            },
          }}
          onChange={({ text, html }, event) => {
            setContentFieldValue(text);
            setMarkdownHtml(html);
          }}
          value={formik.values.content}
        />
        <ButtonWrap>
          {!isEditable && userInfo && (
            <StyledFabSave onClick={onClickTempSave}>
              <SaveIcon />
              <Translate id="common.save" />
            </StyledFabSave>
          )}
          {isEditable && (
            <StyledFabSave onClick={onClickCancel}>
              <CancelIcon />
              <Translate id="common.cancel" />
            </StyledFabSave>
          )}
          <StyledFabPublish>
            <CreateIcon />
            <Translate id={`common.${isEditable ? 'edit' : 'publish'}`} />
          </StyledFabPublish>
        </ButtonWrap>
      </Form>
    </AritcleEditorContainerWrap>
  );
};

export default withLocalize(ArticleEditorContainer);
