import React from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Box } from '@mui/material';
import Moment from 'react-moment';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import { BoardArticle } from '../../types/board-article/board-article';
import { BoardArticleCategory } from '../../enums/board-article.enum';

interface CommunityCardProps {
	vertical: boolean;
	article: BoardArticle;
	index: number;
}

const CommunityCard = (props: CommunityCardProps) => {
	const { article } = props;
	const device = useDeviceDetect();
	const isReview = article?.articleCategory === BoardArticleCategory.FREE;
	const tagLabel = isReview ? 'Package Review' : 'Travel Tips';

	if (device === 'mobile') {
		return <div>COMMUNITY CARD (MOBILE)</div>;
	} else {
		return (
			<Link href={`/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`}>
				<Box component={'div'} className={`discussion-card ${isReview ? 'review' : 'tips'}`}>
					<div className={'icon-tile'}>{isReview ? <RateReviewOutlinedIcon /> : <ForumOutlinedIcon />}</div>
					<div className={'discussion-body'}>
						<div className={'discussion-top'}>
							<span className={'tag'}>{tagLabel}</span>
							<span className={'time'}>
								<Moment fromNow>{article?.createdAt}</Moment>
							</span>
						</div>
						<strong className={'discussion-title'}>{article?.articleTitle}</strong>
						<p className={'discussion-desc'}>{article?.articleContent}</p>
						<div className={'discussion-meta'}>
							<span>
								<ChatBubbleOutlineIcon /> {article?.articleComments || 0} Comments
							</span>
							<span>
								<ThumbUpOutlinedIcon /> {article?.articleLikes || 0} Likes
							</span>
						</div>
					</div>
				</Box>
			</Link>
		);
	}
};

export default CommunityCard;
