import React, { useState } from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Box } from '@mui/material';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import RateReviewRoundedIcon from '@mui/icons-material/RateReviewRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import CommunityCard from './CommunityCard';
import { BoardArticle } from '../../types/board-article/board-article';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { BoardArticleCategory } from '../../enums/board-article.enum';

const CommunityBoards = () => {
	const device = useDeviceDetect();
	const [searchCommunity, setSearchCommunity] = useState({
		page: 1,
		sort: 'articleViews',
		direction: 'DESC',
	});
	const [newsArticles, setNewsArticles] = useState<BoardArticle[]>([]);
	const [freeArticles, setFreeArticles] = useState<BoardArticle[]>([]);

	/** APOLLO REQUESTS **/
	const {
		loading: getnewsArticlesLoading,
		data: getNewsArticlesData,
		error: getNewsArticlesError,
		refetch: getNewsArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: {
			input: { ...searchCommunity, limit: 6, search: { articleCategory: BoardArticleCategory.NEWS } },
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setNewsArticles(data?.getBoardArticles?.list);
		},
	});

	const {
		loading: getFreeArticlesLoading,
		data: getFreeArticlesData,
		error: getFreeArticlesError,
		refetch: getFreeArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: {
			input: { ...searchCommunity, limit: 3, search: { articleCategory: BoardArticleCategory.FREE } },
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setFreeArticles(data?.getBoardArticles?.list);
		},
	});

	if (device === 'mobile') {
		return <div>COMMUNITY BOARDS (MOBILE)</div>;
	} else {
		const discussionArticles: BoardArticle[] = [...(newsArticles || []), ...(freeArticles || [])].slice(0, 4);

		return (
			<Stack className={'community-discussions'}>
				<Box component={'div'} className={'community-bg-icons'} aria-hidden={'true'}>
					<span className={'community-bg-icon forum'}>
						<ForumRoundedIcon />
					</span>
					<span className={'community-bg-icon discover'}>
						<TravelExploreRoundedIcon />
					</span>
					<span className={'community-bg-icon review'}>
						<RateReviewRoundedIcon />
					</span>
					<span className={'community-bg-icon earth'}>
						<PublicRoundedIcon />
					</span>
				</Box>
				<Stack className={'container'}>
					<Stack className={'discussions-head'}>
						<div className={'left'}>
							<span className={'title'}>Community Discussions</span>
							<p>Real tips and reviews from the TourX explorer community.</p>
						</div>
						<Link href={'/community?articleCategory=NEWS'} className={'join-btn'}>
							Join the Conversation
						</Link>
					</Stack>

					{discussionArticles.length === 0 ? (
						<div className={'discussions-empty'}>No discussions yet. Be the first to start one!</div>
					) : (
						<div className={'discussions-grid'}>
							{discussionArticles.map((article, index) => (
								<CommunityCard variant={'card'} article={article} index={index} key={article?._id} />
							))}
						</div>
					)}
				</Stack>
			</Stack>
		);
	}
};

export default CommunityBoards;
