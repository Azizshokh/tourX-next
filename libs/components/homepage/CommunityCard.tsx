import React from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Box } from '@mui/material';
import Moment from 'react-moment';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { BoardArticle } from '../../types/board-article/board-article';
import { BoardArticleCategory } from '../../enums/board-article.enum';
import { REACT_APP_API_URL } from '../../config';
import { useTranslation } from 'next-i18next';

interface CommunityCardProps {
	vertical?: boolean;
	variant?: 'feature' | 'row' | 'card';
	article: BoardArticle;
	index: number;
}

const CommunityCard = (props: CommunityCardProps) => {
	const { article, variant = 'card' } = props;
	const device = useDeviceDetect();
	const { t } = useTranslation(['common', 'community']);
	const isReview = article?.articleCategory === BoardArticleCategory.FREE;
	const tagLabel = isReview ? t('community:category.packageReview') : t('community:category.travelTips');
	const detailHref = `/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`;
	const authorName = article?.memberData?.memberNick || String(t('common:labels.explorer'));

	if (device === 'mobile') {
		return <div>{t('common:mobile.community')}</div>;
	}

	if (variant === 'feature') {
		const featureImage = article?.articleImage
			? `${REACT_APP_API_URL}/${article.articleImage}`
			: '/img/banner/TourX%20background.png';

		return (
			<Link href={detailHref} className={`discussion-feature ${isReview ? 'review' : 'tips'}`}>
				<span className={'feature-media'} style={{ backgroundImage: `url(${featureImage})` }}>
					<span className={'feature-tag'}>{tagLabel}</span>
				</span>
				<div className={'feature-body'}>
					<span className={'feature-time'}>
						<Moment fromNow>{article?.createdAt}</Moment>
					</span>
					<strong className={'feature-title'}>{article?.articleTitle}</strong>
					<p className={'feature-desc'}>{article?.articleContent}</p>
					<div className={'feature-foot'}>
						<div className={'author'}>
							<span className={'avatar'}>{authorName.charAt(0).toUpperCase()}</span>
							<span className={'name'}>{authorName}</span>
						</div>
						<div className={'feature-meta'}>
							<span>
								<ChatBubbleOutlineIcon /> {article?.articleComments || 0}
							</span>
							<span>
								<ThumbUpOutlinedIcon /> {article?.articleLikes || 0}
							</span>
							<span>
								<VisibilityOutlinedIcon /> {article?.articleViews || 0}
							</span>
						</div>
					</div>
				</div>
			</Link>
		);
	}

	if (variant === 'row') {
		return (
			<Link href={detailHref} className={`discussion-row ${isReview ? 'review' : 'tips'}`}>
				<div className={'row-icon'}>{isReview ? <RateReviewOutlinedIcon /> : <ForumOutlinedIcon />}</div>
				<div className={'row-body'}>
					<div className={'row-top'}>
						<span className={'tag'}>{tagLabel}</span>
						<span className={'time'}>
							<Moment fromNow>{article?.createdAt}</Moment>
						</span>
					</div>
					<strong className={'row-title'}>{article?.articleTitle}</strong>
					<div className={'row-meta'}>
						<span>
							<ChatBubbleOutlineIcon /> {article?.articleComments || 0}
						</span>
						<span>
							<ThumbUpOutlinedIcon /> {article?.articleLikes || 0}
						</span>
					</div>
				</div>
				<ArrowForwardIcon className={'row-arrow'} />
			</Link>
		);
	}

	return (
		<Link href={detailHref}>
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
							<ChatBubbleOutlineIcon /> {article?.articleComments || 0} {t('common:labels.comments')}
						</span>
						<span>
							<ThumbUpOutlinedIcon /> {article?.articleLikes || 0} {t('common:labels.likes')}
						</span>
					</div>
				</div>
			</Box>
		</Link>
	);
};

export default CommunityCard;
