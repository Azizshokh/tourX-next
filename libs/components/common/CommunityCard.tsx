import React from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { BoardArticle } from '../../types/board-article/board-article';
import Moment from 'react-moment';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const CATEGORY_LABEL: Record<string, string> = {
	FREE: 'Travel Stories',
	RECOMMEND: 'Tips & Guides',
	NEWS: 'News',
	HUMOR: 'Humor',
};

interface CommunityCardProps {
	boardArticle: BoardArticle;
	size?: string;
	likeArticleHandler: any;
}

const CommunityCard = (props: CommunityCardProps) => {
	const { boardArticle, size = 'normal', likeArticleHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	const imagePath: string = boardArticle?.articleImage
		? `${REACT_APP_API_URL}/${boardArticle?.articleImage}`
		: '/img/community/communityImg.png';

	const authorImg: string = boardArticle?.memberData?.memberImage
		? `${REACT_APP_API_URL}/${boardArticle.memberData.memberImage}`
		: '/img/profile/defaultUser.svg';

	const chooseArticleHandler = (e: React.SyntheticEvent, article: BoardArticle) => {
		router.push(
			{
				pathname: '/community/detail',
				query: { articleCategory: article?.articleCategory, id: article?._id },
			},
			undefined,
			{ shallow: true },
		);
	};

	const goMemberPage = (id: string) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	if (device === 'mobile') {
		return <div>COMMUNITY CARD MOBILE</div>;
	}

	/* ── Small size: used in MyArticles / MemberArticles (keep existing layout) ── */
	if (size === 'small') {
		return (
			<Stack
				sx={{ width: '285px' }}
				className="community-general-card-config"
				onClick={(e) => chooseArticleHandler(e, boardArticle)}
			>
				<Stack className="image-box">
					<img src={imagePath} alt="" className="card-img" />
				</Stack>
				<Stack className="desc-box" sx={{ marginTop: '-20px' }}>
					<Stack>
						<Typography
							className="desc"
							onClick={(e) => {
								e.stopPropagation();
								goMemberPage(boardArticle?.memberData?._id as string);
							}}
						>
							{boardArticle?.memberData?.memberNick}
						</Typography>
						<Typography className="title">{boardArticle?.articleTitle}</Typography>
					</Stack>
					<Stack className="buttons">
						<IconButton color="default">
							<RemoveRedEyeIcon />
						</IconButton>
						<Typography className="view-cnt">{boardArticle?.articleViews}</Typography>
						<IconButton
							color="default"
							onClick={(e: any) => likeArticleHandler(e, user, boardArticle?._id)}
						>
							{boardArticle?.meLiked?.[0]?.myFavorite ? (
								<FavoriteIcon color="primary" />
							) : (
								<FavoriteBorderIcon />
							)}
						</IconButton>
						<Typography className="view-cnt">{boardArticle?.articleLikes}</Typography>
					</Stack>
				</Stack>
				<Stack className="date-box">
					<Moment className="month" format="MMMM">
						{boardArticle?.createdAt}
					</Moment>
					<Typography className="day">
						<Moment format="DD">{boardArticle?.createdAt}</Moment>
					</Typography>
				</Stack>
			</Stack>
		);
	}

	/* ── Normal size: new premium card for the community feed ── */
	return (
		<Box className="community-article-card" onClick={(e) => chooseArticleHandler(e, boardArticle)}>
			{/* Image */}
			<Box className="cac-image-wrap">
				<img src={imagePath} alt={boardArticle?.articleTitle} className="cac-img" />
				<Box className="cac-badges">
					<span className="cac-badge">
						{CATEGORY_LABEL[boardArticle?.articleCategory] ?? boardArticle?.articleCategory}
					</span>
				</Box>
				<IconButton
					className="cac-like-btn"
					onClick={(e) => {
						e.stopPropagation();
						likeArticleHandler(e, user, boardArticle?._id);
					}}
				>
					{boardArticle?.meLiked?.[0]?.myFavorite ? (
						<FavoriteRoundedIcon className="cac-liked" />
					) : (
						<FavoriteBorderRoundedIcon />
					)}
				</IconButton>
			</Box>

			{/* Body */}
			<Box className="cac-body">
				<Typography className="cac-title">{boardArticle?.articleTitle}</Typography>

				{/* Author + time */}
				<Box className="cac-author">
					<img
						src={authorImg}
						alt={boardArticle?.memberData?.memberNick}
						className="cac-avatar"
						onClick={(e) => {
							e.stopPropagation();
							goMemberPage(boardArticle?.memberData?._id as string);
						}}
					/>
					<Box className="cac-author-info">
						<Typography
							className="cac-author-name"
							onClick={(e) => {
								e.stopPropagation();
								goMemberPage(boardArticle?.memberData?._id as string);
							}}
						>
							{boardArticle?.memberData?.memberNick}
						</Typography>
						<Typography className="cac-time">
							<Moment fromNow>{boardArticle?.createdAt}</Moment>
						</Typography>
					</Box>
				</Box>

				{/* Stats */}
				<Box className="cac-stats">
					<span className="cac-stat">
						<VisibilityRoundedIcon />
						{boardArticle?.articleViews?.toLocaleString()}
					</span>
					<span className="cac-stat">
						<FavoriteBorderRoundedIcon />
						{boardArticle?.articleLikes?.toLocaleString()}
					</span>
					<span className="cac-stat">
						<CommentRoundedIcon />
						{boardArticle?.articleComments}
					</span>
				</Box>
			</Box>
		</Box>
	);
};

export default CommunityCard;
