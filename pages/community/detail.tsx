import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Box, Button, Stack, Typography, IconButton, Backdrop } from '@mui/material';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Moment from 'react-moment';
import { userVar } from '../../apollo/store';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import { Comment } from '../../libs/types/comment/comment';
import dynamic from 'next/dynamic';
import { T } from '../../libs/types/common';
import EditIcon from '@mui/icons-material/Edit';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import LightbulbRoundedIcon from '@mui/icons-material/LightbulbRounded';
import NewspaperRoundedIcon from '@mui/icons-material/NewspaperRounded';
import TagFacesRoundedIcon from '@mui/icons-material/TagFacesRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { getI18nProps, COMMUNITY_NAMESPACES } from '../../libs/i18n';
import { useTranslation } from 'next-i18next';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { GET_BOARD_ARTICLE, GET_COMMENTS } from '../../apollo/user/query';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { CommentGroup, CommentStatus } from '../../libs/enums/comment.enum';
import { Messages, resolveImageUrl } from '../../libs/config';
import { CommentUpdate } from '../../libs/types/comment/comment.update';
import {
	COMMENT_VIDEO_UPLOAD_UNAVAILABLE,
	COMMENT_CONTENT_MAX_LENGTH,
	CommentMediaDisplay,
	CommentMediaPicker,
	getCommentContentValidationError,
	uploadCommentImages,
	useCommentMedia,
} from '../../libs/components/common/CommentMedia';
import CommentLikeButton from '../../libs/components/common/CommentLikeButton';
import {
	sweetConfirmAlert,
	sweetMixinErrorAlert,
	sweetMixinSuccessAlert,
	sweetTopSmallSuccessAlert,
} from '../../libs/sweetAlert';
import { CREATE_COMMENT, LIKE_TARGET_BOARD_ARTICLE, UPDATE_COMMENT } from '../../apollo/user/mutation';

const ToastViewerComponent = dynamic(() => import('../../libs/components/community/TViewer'), { ssr: false });

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await getI18nProps(locale, COMMUNITY_NAMESPACES)),
	},
});

const CATEGORY_NAV = [
	{ value: 'FREE', labelKey: 'community:category.FREE', Icon: ArticleRoundedIcon },
	{ value: 'RECOMMEND', labelKey: 'community:category.RECOMMEND', Icon: LightbulbRoundedIcon },
	{ value: 'NEWS', labelKey: 'community:category.NEWS', Icon: NewspaperRoundedIcon },
	{ value: 'HUMOR', labelKey: 'community:category.HUMOR', Icon: TagFacesRoundedIcon },
];

const CommunityDetail: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { t } = useTranslation(['common', 'community']);
	const { query } = router;

	const articleId = query?.id as string;
	const articleCategory = query?.articleCategory as string;

	const [comment, setComment] = useState<string>('');
	const [commentError, setCommentError] = useState<string>('');
	const [wordsCnt, setWordsCnt] = useState<number>(0);
	const [updatedCommentWordsCnt, setUpdatedCommentWordsCnt] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const commentMedia = useCommentMedia();
	const [comments, setComments] = useState<Comment[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchFilter, setSearchFilter] = useState<CommentsInquiry>({ ...initialInput });
	const [memberImage, setMemberImage] = useState<string>('/img/community/articleImg.png');
	const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
	const [updatedComment, setUpdatedComment] = useState<string>('');
	const [updatedCommentId, setUpdatedCommentId] = useState<string>('');
	const [likeLoading, setLikeLoading] = useState<boolean>(false);
	const [boardArticle, setBoardArticle] = useState<BoardArticle>();

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);
	const [createComment] = useMutation(CREATE_COMMENT);
	const [updateComment] = useMutation(UPDATE_COMMENT);

	const { refetch: boardArticleRefetch } = useQuery(GET_BOARD_ARTICLE, {
		skip: !articleId,
		fetchPolicy: 'network-only',
		variables: { input: articleId },
		notifyOnNetworkStatusChange: true,
		onCompleted(data: any) {
			setBoardArticle(data?.getBoardArticle);
			if (data?.getBoardArticle?.memberData?.memberImage) {
				setMemberImage(resolveImageUrl(data?.getBoardArticle?.memberData?.memberImage));
			}
		},
	});

	const { refetch: getCommentsRefetch } = useQuery(GET_COMMENTS, {
		skip: !searchFilter.search.commentRefId,
		fetchPolicy: 'cache-and-network',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted(data: any) {
			setComments(data.getComments.list);
			setTotal(data.getComments?.metaCounter?.[0]?.total || 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (articleId) setSearchFilter({ ...searchFilter, search: { commentRefId: articleId } });
	}, [articleId]);

	/** HANDLERS **/
	const tabChangeHandler = (value: string) => {
		router.replace(
			{ pathname: '/community', query: { articleCategory: value } },
			'/community',
			{ shallow: true },
		);
	};

	const likeBoArticleHandler = async (user: any, id: any) => {
		try {
			if (likeLoading) return;
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);
			setLikeLoading(true);
			await likeTargetBoardArticle({ variables: { input: id } });
			await boardArticleRefetch({ input: articleId });
			await sweetTopSmallSuccessAlert('Success!', 800);
		} catch (err: any) {
			console.error('ERROR, likeBoArticleHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		} finally {
			setLikeLoading(false);
		}
	};

	const createCommentHandler = async () => {
		try {
			if (!user?._id) throw new Error(Messages.error2);
			if (commentMedia.video) throw new Error(COMMENT_VIDEO_UPLOAD_UNAVAILABLE);
			const validationError = getCommentContentValidationError(comment);
			if (validationError) {
				setCommentError(validationError);
				return;
			}
			setCommentError('');
			const commentImages = await uploadCommentImages(commentMedia.images);
			const commentInput: CommentInput = {
				commentGroup: CommentGroup.ARTICLE,
				commentRefId: articleId,
				commentContent: comment,
				commentImages,
				commentVideo: null,
			};
			await createComment({ variables: { input: commentInput } });
			await getCommentsRefetch({ input: searchFilter });
			await boardArticleRefetch({ input: articleId });
			setComment('');
			commentMedia.clearMedia();
			await sweetMixinSuccessAlert(t('community:comments.created'));
		} catch (error: any) {
			setCommentError(error.message);
			commentMedia.setError(error.message);
			await sweetMixinErrorAlert(error.message);
		}
	};

	const updateButtonHandler = async (commentId: string, commentStatus?: CommentStatus.DELETE) => {
		try {
			if (!user?._id) throw new Error(Messages.error2);
			if (!commentId) throw new Error('Select a comment id to update!');
			if (updatedComment === comments?.find((c) => c?._id === commentId)?.commentContent) return;
			const updateData: CommentUpdate = {
				_id: commentId,
				...(commentStatus && { commentStatus }),
				...(updatedComment && { commentContent: updatedComment }),
			};
			if (!updateData?.commentContent && !updateData?.commentStatus)
				throw new Error('Provide data to update your comment!');
			if (commentStatus) {
				if (await sweetConfirmAlert(t('community:comments.deleteConfirm'))) {
					await updateComment({ variables: { input: updateData } });
					await sweetMixinSuccessAlert(t('community:comments.deleted'));
				} else return;
			} else {
				await updateComment({ variables: { input: updateData } });
				await sweetMixinSuccessAlert(t('community:comments.updated'));
			}
			await getCommentsRefetch({ input: searchFilter });
		} catch (error: any) {
			await sweetMixinErrorAlert(error.message);
		} finally {
			setOpenBackdrop(false);
			setUpdatedComment('');
			setUpdatedCommentWordsCnt(0);
			setUpdatedCommentId('');
		}
	};

	const getCommentMemberImage = (imageUrl: string | undefined) => {
		if (imageUrl) return resolveImageUrl(imageUrl);
		return '/img/community/articleImg.png';
	};

	const goMemberPage = (id: any) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	const cancelButtonHandler = () => {
		setOpenBackdrop(false);
		setUpdatedComment('');
		setUpdatedCommentWordsCnt(0);
	};

	const updateCommentInputHandler = (value: string) => {
		if (value.length > 100) return;
		setUpdatedCommentWordsCnt(value.length);
		setUpdatedComment(value);
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const articleHeroImage = boardArticle?.articleImage
		? resolveImageUrl(boardArticle.articleImage)
		: '/img/community/communityImg.png';

	const userAvatar = user?.memberImage
		? resolveImageUrl(user.memberImage)
		: '/img/community/articleImg.png';

	if (device === 'mobile') {
		return <div>{t('common:mobile.community')}</div>;
	}

	return (
		<div className={'community-detail-page'}>
			<div className={'container'}>
				<Stack className={'cd-inner'}>

					{/* ── Sidebar ── */}
					<Stack className={'cd-sidebar'} component={'aside'}>
						<Button
							className={'cd-write-btn'}
							startIcon={<AddRoundedIcon />}
							onClick={() =>
								router.push({ pathname: '/mypage', query: { category: 'writeArticle' } })
							}
						>
							{t('community:createPost')}
						</Button>

						<Box className={'cd-cat-section'}>
							<span className={'cd-cat-label'}>{t('community:categories')}</span>
							<Stack className={'cd-cat-nav'}>
								{CATEGORY_NAV.map(({ value, labelKey, Icon }) => (
									<button
										key={value}
										className={`cd-cat-item ${articleCategory === value ? 'active' : ''}`}
										onClick={() => tabChangeHandler(value)}
									>
										<Icon className={'cd-cat-icon'} />
										{t(labelKey)}
									</button>
								))}
							</Stack>
						</Box>
					</Stack>

					{/* ── Main ── */}
					<Stack className={'cd-main'}>

						{/* Article card */}
						<Box className={'cd-article-card'}>

							{/* Hero image */}
							<Box className={'cd-hero'}>
								<img src={articleHeroImage} alt={boardArticle?.articleTitle} className={'cd-hero-img'} />
								<Box className={'cd-hero-overlay'} />
								<span className={'cd-hero-badge'}>
									{articleCategory ? t(`community:category.${articleCategory}`) : ''}
								</span>
							</Box>

							{/* Article body */}
							<Box className={'cd-article-body'}>
								<Typography className={'cd-article-title'}>{boardArticle?.articleTitle}</Typography>

								{/* Author + stats row */}
								<Stack className={'cd-meta-row'}>
									<Stack className={'cd-author-block'}>
										<img
											src={memberImage}
											alt={''}
											className={'cd-author-avatar'}
											onClick={() => goMemberPage(boardArticle?.memberData?._id)}
										/>
										<Box>
											<Typography
												className={'cd-author-name'}
												onClick={() => goMemberPage(boardArticle?.memberData?._id)}
											>
												{boardArticle?.memberData?.memberNick}
											</Typography>
											<Typography className={'cd-author-date'}>
												<Moment format={'DD MMM YYYY'}>{boardArticle?.createdAt}</Moment>
											</Typography>
										</Box>
									</Stack>

									<Stack className={'cd-stats-row'}>
										<span className={'cd-stat'}>
											<VisibilityIcon />
											{boardArticle?.articleViews?.toLocaleString()}
										</span>
										<span className={'cd-stat'}>
											{boardArticle?.meLiked?.[0]?.myFavorite ? (
												<ThumbUpAltIcon />
											) : (
												<ThumbUpOffAltIcon />
											)}
											{boardArticle?.articleLikes}
										</span>
										<span className={'cd-stat'}>
											<ChatBubbleOutlineRoundedIcon />
											{total}
										</span>
									</Stack>
								</Stack>

								<Box className={'cd-article-divider'} />

								{/* Rich text content */}
								<Box className={'cd-content'}>
									<ToastViewerComponent markdown={boardArticle?.articleContent} className={'ytb_play'} />
								</Box>

								{/* Bottom like button */}
								<Stack className={'cd-like-section'}>
									<button
										className={`cd-like-btn${boardArticle?.meLiked?.[0]?.myFavorite ? ' liked' : ''}`}
										onClick={() => likeBoArticleHandler(user, boardArticle?._id)}
										disabled={likeLoading}
									>
										{boardArticle?.meLiked?.[0]?.myFavorite ? (
											<ThumbUpAltIcon />
										) : (
											<ThumbUpOffAltIcon />
										)}
										<span>{boardArticle?.articleLikes}</span>
									</button>
								</Stack>
							</Box>
						</Box>

						{/* Comments section */}
						<Box className={'cd-comments-wrap'}>
							<Typography className={'cd-comments-title'}>{t('community:comments.title')} ({total})</Typography>

							{/* Input */}
							<Stack className={'cd-leave-comment'}>
								<Stack className={'cd-comment-input-row'}>
									<img src={userAvatar} alt={''} className={'cd-commenter-avatar'} />
									<input
										type={'text'}
										placeholder={t('community:comments.placeholder')}
										value={comment}
										className={'cd-comment-input'}
										onChange={(e) => {
											setCommentError('');
											setWordsCnt(e.target.value.length);
											setComment(e.target.value);
										}}
										maxLength={COMMENT_CONTENT_MAX_LENGTH}
									/>
									<Button className={'cd-comment-submit'} onClick={createCommentHandler}>
										{t('community:comments.post')}
									</Button>
								</Stack>
								<Stack className={'cd-input-footer'}>
									<CommentMediaPicker media={commentMedia} />
									<Typography className={'cd-comment-validation'} role={'alert'} sx={{ color: '#d32f2f', fontSize: 12, fontWeight: 700 }}>{commentError}</Typography>
									<Typography className={'cd-word-count'}>{wordsCnt}/{COMMENT_CONTENT_MAX_LENGTH}</Typography>
								</Stack>
							</Stack>

							{/* Comment list */}
							<Box className={'cd-comment-list'}>
							{comments.map((commentData) => (
								<Stack className={'cd-comment-item'} key={commentData._id}>
									<Stack className={'cd-comment-header'}>
										<Stack
											className={'cd-comment-author'}
											onClick={() => goMemberPage(commentData?.memberData?._id as string)}
										>
											<img
												src={getCommentMemberImage(commentData?.memberData?.memberImage)}
												alt={''}
												className={'cd-comment-avatar'}
											/>
											<Box>
												<Typography className={'cd-comment-name'}>
													{commentData?.memberData?.memberNick}
												</Typography>
												<Typography className={'cd-comment-date'}>
													<Moment format={'DD MMM YYYY · HH:mm'}>{commentData?.createdAt}</Moment>
												</Typography>
											</Box>
										</Stack>

										{commentData?.memberId === user?._id && (
											<Stack className={'cd-comment-actions'}>
												<IconButton
													size={'small'}
													className={'cd-action-btn delete'}
													onClick={() => {
														setUpdatedCommentId(commentData._id);
														updateButtonHandler(commentData._id, CommentStatus.DELETE);
													}}
												>
													<DeleteForeverIcon />
												</IconButton>
												<IconButton
													size={'small'}
													className={'cd-action-btn edit'}
													onClick={() => {
														setUpdatedComment(commentData.commentContent);
														setUpdatedCommentWordsCnt(commentData.commentContent?.length);
														setUpdatedCommentId(commentData._id);
														setOpenBackdrop(true);
													}}
												>
													<EditIcon />
												</IconButton>

												<Backdrop sx={{ zIndex: 1300 }} open={openBackdrop}>
													<Box className={'cd-edit-modal'}>
														<Typography className={'cd-edit-modal-title'}>{t('community:comments.editTitle')}</Typography>
														<input
															autoFocus
															value={updatedComment}
															onChange={(e) => updateCommentInputHandler(e.target.value)}
															type={'text'}
															className={'cd-edit-modal-input'}
														/>
														<Stack className={'cd-edit-modal-footer'}>
															<Typography className={'cd-edit-modal-count'}>
																{updatedCommentWordsCnt}/100
															</Typography>
															<Stack direction={'row'} gap={'10px'}>
																<Button
																	className={'cd-edit-cancel'}
																	onClick={cancelButtonHandler}
																>
																	{t('community:comments.cancel')}
																</Button>
																<Button
																	className={'cd-edit-save'}
																	onClick={() => updateButtonHandler(updatedCommentId)}
																>
																	{t('common:actions.save')}
																</Button>
															</Stack>
														</Stack>
													</Box>
												</Backdrop>
											</Stack>
										)}
									</Stack>

									<Box className={'cd-comment-content'}>
										<Typography>{commentData?.commentContent}</Typography>
										<CommentMediaDisplay
											images={commentData?.commentImages}
											video={commentData?.commentVideo}
										/>
										<CommentLikeButton
											commentId={commentData._id}
											initialLiked={commentData.isLiked}
											initialCount={commentData.likesCount}
										/>
									</Box>
								</Stack>
							))}
							</Box>

							{total > 0 && (
								<Stack className={'cd-pagination'}>
									<button
										className={'cd-page-btn'}
										onClick={(e) => paginationHandler(e, searchFilter.page - 1)}
										disabled={searchFilter.page <= 1}
									>
										<ChevronLeftRoundedIcon />
									</button>

									<Stack className={'cd-page-track'}>
										{Array.from({ length: Math.ceil(total / searchFilter.limit) }, (_, i) => i + 1).map((n) => (
											<button
												key={n}
												className={`cd-page-dot ${n === searchFilter.page ? 'active' : ''}`}
												onClick={(e) => paginationHandler(e, n)}
											/>
										))}
									</Stack>

									<button
										className={'cd-page-btn'}
										onClick={(e) => paginationHandler(e, searchFilter.page + 1)}
										disabled={searchFilter.page >= Math.ceil(total / searchFilter.limit)}
									>
										<ChevronRightRoundedIcon />
									</button>

									<Typography className={'cd-page-label'}>
										{searchFilter.page} / {Math.ceil(total / searchFilter.limit)}
									</Typography>
								</Stack>
							)}
						</Box>
					</Stack>
				</Stack>
			</div>
		</div>
	);
};

CommunityDetail.defaultProps = {
	initialInput: {
		page: 1,
		limit: 1,
		sort: 'createdAt',
		direction: 'DESC',
		search: { commentRefId: '' },
	},
};

export default withLayoutBasic(CommunityDetail);
