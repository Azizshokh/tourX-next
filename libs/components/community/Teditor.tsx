import React, { useMemo, useRef, useState } from 'react';
import { Box, Button, FormControl, MenuItem, Stack, Typography, Select, TextField } from '@mui/material';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import TitleRoundedIcon from '@mui/icons-material/TitleRounded';
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import TipsAndUpdatesRoundedIcon from '@mui/icons-material/TipsAndUpdatesRounded';
import { BoardArticleCategory } from '../../enums/board-article.enum';
import { Editor } from '@toast-ui/react-editor';
import { getJwtToken } from '../../auth';
import { REACT_APP_API_URL , resolveImageUrl } from '../../config';
import { useRouter } from 'next/router';
import axios from 'axios';
import { T } from '../../types/common';
import '@toast-ui/editor/dist/toastui-editor.css';
import { useMutation } from '@apollo/client';
import { CREATE_BOARD_ARTICLE } from '../../../apollo/user/mutation';
import { Message } from '../../enums/common.enum';
import { sweetErrorHandling, sweetTopSuccessAlert } from '../../sweetAlert';

const TuiEditor = () => {
	const editorRef = useRef<Editor>(null),
		token = getJwtToken(),
		router = useRouter();
	const [articleCategory, setArticleCategory] = useState<BoardArticleCategory>(BoardArticleCategory.FREE);

	/** APOLLO REQUESTS **/
	const [createBoardArticle] = useMutation(CREATE_BOARD_ARTICLE);

	const memoizedValues = useMemo(() => {
		const articleTitle = '',
			articleContent = '',
			articleImage = '';

		return { articleTitle, articleContent, articleImage };
	}, []);

	/** HANDLERS **/
	const uploadImage = async (image: any) => {
		try {
			const formData = new FormData();
			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImageUploader($file: Upload!, $target: String!) {
						imageUploader(file: $file, target: $target) 
				  }`,
					variables: {
						file: null,
						target: 'article',
					},
				}),
			);
			formData.append(
				'map',
				JSON.stringify({
					'0': ['variables.file'],
				}),
			);
			formData.append('0', image);

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImage = response.data.data.imageUploader;
			console.log('=responseImage: ', responseImage);
			memoizedValues.articleImage = responseImage;

			return resolveImageUrl(responseImage);
		} catch (err) {
			console.log('Error, uploadImage:', err);
		}
	};

	const changeCategoryHandler = (e: any) => {
		setArticleCategory(e.target.value);
	};

	const articleTitleHandler = (e: T) => {
		console.log(e.target.value);
		memoizedValues.articleTitle = e.target.value;
	};

	const handleRegisterButton = async () => {
		try {
			const editor = editorRef.current;
			const articleContent = editor?.getInstance().getHTML() as string;
			// console.log('articleContent: ', articleContent);
			memoizedValues.articleContent = articleContent;
			if (memoizedValues.articleContent === '' && memoizedValues.articleTitle === '') {
				throw new Error(Message.INSERT_ALL_INPUTS);
			}
			await createBoardArticle({
				variables: {
					input: { ...memoizedValues, articleCategory },
				},
			});
			await sweetTopSuccessAlert('Article is created successfully', 700);
			await router.push({
				pathname: '/mypage',
				query: {
					category: 'myArticles',
				},
			});
		} catch (err: any) {
			console.log(err);
			await sweetErrorHandling(new Error(Message.INSERT_ALL_INPUTS));
		}
	};

	const doDisabledCheck = () => {
		if (memoizedValues.articleContent === '' || memoizedValues.articleTitle === '') {
			return true;
		}
	};

	return (
		<Stack className={'tourx-editor-config'}>
			<Stack className={'editor-top-grid'}>
				<Box component={'div'} className={'editor-field-card'}>
					<Stack className={'field-label-row'}>
						<CategoryRoundedIcon />
						<Typography>Category</Typography>
					</Stack>
					<FormControl className={'category-control'}>
						<Select
							value={articleCategory}
							onChange={changeCategoryHandler}
							displayEmpty
							inputProps={{ 'aria-label': 'Without label' }}
						>
							<MenuItem value={BoardArticleCategory.FREE}>
								<span>Travel Stories</span>
							</MenuItem>
							<MenuItem value={BoardArticleCategory.RECOMMEND}>Tips & Guides</MenuItem>
							<MenuItem value={BoardArticleCategory.NEWS}>News</MenuItem>
							<MenuItem value={BoardArticleCategory.HUMOR}>Humor</MenuItem>
						</Select>
					</FormControl>
				</Box>
				<Box component={'div'} className={'editor-field-card title-card'}>
					<Stack className={'field-label-row'}>
						<TitleRoundedIcon />
						<Typography>Title</Typography>
					</Stack>
					<TextField
						onChange={articleTitleHandler}
						id="filled-basic"
						placeholder="Example: 5 hidden places to visit in Seoul"
						className={'article-title-input'}
					/>
				</Box>
				<Box component={'div'} className={'editor-guide-card'}>
					<Stack className={'field-label-row'}>
						<TipsAndUpdatesRoundedIcon />
						<Typography>Writing tips</Typography>
					</Stack>
					<Typography className={'guide-copy'}>
						Add a practical headline, include travel details, and use the image button for destination photos.
					</Typography>
				</Box>
			</Stack>

			<Box className={'editor-canvas-card'}>
				<Stack className={'editor-toolbar-note'}>
					<ImageRoundedIcon />
					<Typography>Use the editor toolbar to add headings, links, lists, tables, and travel photos.</Typography>
				</Stack>
				<Editor
					initialValue={'Type here'}
					placeholder={'Type here'}
					previewStyle={'vertical'}
					height={'640px'}
					// @ts-ignore
					initialEditType={'WYSIWYG'}
					toolbarItems={[
						['heading', 'bold', 'italic', 'strike'],
						['image', 'table', 'link'],
						['ul', 'ol', 'task'],
					]}
					ref={editorRef}
					hooks={{
						addImageBlobHook: async (image: any, callback: any) => {
							const uploadedImageURL = await uploadImage(image);
							callback(uploadedImageURL);
							return false;
						},
					}}
					events={{
						load: function (param: any) {},
					}}
				/>
			</Box>

			<Stack className={'publish-action-row'}>
				<Button
					variant="contained"
					className={'publish-article-btn'}
					onClick={handleRegisterButton}
					startIcon={<PublishRoundedIcon />}
				>
					Publish Article
				</Button>
			</Stack>
		</Stack>
	);
};

export default TuiEditor;
