import React, { useState } from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack } from '@mui/material';
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
					<div className={'discussions-grid'}>
						{discussionArticles.map((article, index) => {
							return <CommunityCard vertical={false} article={article} index={index} key={article?._id} />;
						})}
					</div>
				</Stack>
			</Stack>
		);
	}
};

export default CommunityBoards;
