import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Button, Pagination } from '@mui/material';
import CommunityCard from '../../libs/components/common/CommunityCard';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { T } from '../../libs/types/common';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticlesInquiry } from '../../libs/types/board-article/board-article.input';
import { BoardArticleCategory } from '../../libs/enums/board-article.enum';
import { useMutation, useQuery } from '@apollo/client';
import { GET_BOARD_ARTICLES } from '../../apollo/user/query';
import { Messages } from '../../libs/config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { LIKE_TARGET_BOARD_ARTICLE } from '../../apollo/user/mutation';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import LightbulbRoundedIcon from '@mui/icons-material/LightbulbRounded';
import NewspaperRoundedIcon from '@mui/icons-material/NewspaperRounded';
import TagFacesRoundedIcon from '@mui/icons-material/TagFacesRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

const CATEGORIES = [
	{ value: 'FREE', label: 'Travel Stories', Icon: ArticleRoundedIcon },
	{ value: 'RECOMMEND', label: 'Tips & Guides', Icon: LightbulbRoundedIcon },
	{ value: 'NEWS', label: 'News', Icon: NewspaperRoundedIcon },
	{ value: 'HUMOR', label: 'Humor', Icon: TagFacesRoundedIcon },
] as const;

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Community: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;
	const articleCategory = query?.articleCategory as string;
	const [searchCommunity, setSearchCommunity] = useState<BoardArticlesInquiry>(initialInput);
	const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	if (articleCategory) initialInput.search.articleCategory = articleCategory;

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);

	const {
		loading: boardArticlesLoading,
		data: boardArticlesData,
		error: getBoardArticlesError,
		refetch: boardArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: { input: searchCommunity },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setBoardArticles(data?.getBoardArticles?.list);
			setTotalCount(data?.getBoardArticles?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (!query?.articleCategory)
			router.push(
				{ pathname: router.pathname, query: { articleCategory: 'FREE' } },
				router.pathname,
				{ shallow: true },
			);
	}, []);

	/** HANDLERS **/
	const selectCategoryHandler = async (value: string) => {
		setSearchCommunity({ ...searchCommunity, page: 1, search: { articleCategory: value as BoardArticleCategory } });
		await router.push(
			{ pathname: '/community', query: { articleCategory: value } },
			router.pathname,
			{ shallow: true },
		);
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchCommunity({ ...searchCommunity, page: value });
	};

	const likeArticleHandler = async (e: any, user: any, id: string) => {
		try {
			e.stopPropagation();
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			await likeTargetBoardArticle({ variables: { input: id } });
			await boardArticlesRefetch({ input: searchCommunity });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeArticleHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') {
		return <h1>COMMUNITY PAGE MOBILE</h1>;
	}

	return (
		<div className="community-list-page">
			<div className="cl-inner">
				{/* Left sidebar */}
				<aside className="cl-sidebar">
					<Button
						className="cl-write-btn"
						startIcon={<AddRoundedIcon />}
						onClick={() => router.push({ pathname: '/mypage', query: { category: 'writeArticle' } })}
					>
						Create Travel Post
					</Button>

					<div className="cl-cat-section">
						<span className="cl-cat-label">CATEGORIES</span>
						<nav className="cl-cat-nav">
							{CATEGORIES.map(({ value, label, Icon }) => (
								<button
									key={value}
									className={`cl-cat-item${searchCommunity.search.articleCategory === value ? ' active' : ''}`}
									onClick={() => selectCategoryHandler(value)}
								>
									<Icon className="cl-cat-icon" />
									{label}
								</button>
							))}
						</nav>
					</div>
				</aside>

				{/* Main feed */}
				<main className="cl-feed">
					{totalCount > 0 ? (
						<>
							<div className="cl-grid">
								{boardArticles.map((article: BoardArticle) => (
									<CommunityCard
										key={article._id}
										boardArticle={article}
										likeArticleHandler={likeArticleHandler}
									/>
								))}
							</div>
							<div className="cl-pagination">
								<Pagination
									count={Math.ceil(totalCount / searchCommunity.limit)}
									page={searchCommunity.page}
									shape="circular"
									color="primary"
									onChange={paginationHandler}
								/>
								<span>
									Total {totalCount} article{totalCount > 1 ? 's' : ''} available
								</span>
							</div>
						</>
					) : (
						<div className="cl-no-data">
							<img src="/img/icons/icoAlert.svg" alt="" />
							<p>No articles found!</p>
						</div>
					)}
				</main>
			</div>
		</div>
	);
};

Community.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: 'ASC',
		search: {
			articleCategory: 'FREE',
		},
	},
};

export default withLayoutBasic(Community);
