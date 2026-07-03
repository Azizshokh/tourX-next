import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import CommunityCard from '../common/CommunityCard';
import { BoardArticle } from '../../types/board-article/board-article';
import { BoardArticlesInquiry } from '../../types/board-article/board-article.input';
import { LIKE_TARGET_BOARD_ARTICLE } from '../../../apollo/user/mutation';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import { Messages } from '../../config';
import { sweetTopSmallSuccessAlert, sweetMixinErrorAlert } from '../../sweetAlert';
import { T } from '../../types/common';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';

const MemberArticles: NextPage = ({ initialInput, ...props }: any) => {
	const router = useRouter();
	const [total, setTotal] = useState<number>(0);
	const { memberId } = router.query;
	const [searchFilter, setSearchFilter] = useState<BoardArticlesInquiry>(initialInput);
	const [memberBoArticles, setMemberBoArticles] = useState<BoardArticle[]>([]);
	const totalLikes = memberBoArticles.reduce((sum: number, a: BoardArticle) => sum + (a.articleLikes ?? 0), 0);

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);

	const {
		refetch: boardArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: any) => {
			setMemberBoArticles(data?.getBoardArticles?.list);
			setTotal(data?.getBoardArticles?.metaCounter[0]?.total || 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (memberId) setSearchFilter({ ...initialInput, search: { memberId } });
	}, [memberId]);

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const likeArticleHandler = async (e: any, user: any, id: string) => {
		try {
			e.stopPropagation();
			if (!id) return;
			if (!user) throw new Error(Messages.error2);
			await likeTargetBoardArticle({ variables: { input: id } });
			await boardArticlesRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('Success!', 800);
		} catch (err: any) {
			console.error('ERROR, likeArticleHandler: ', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	return (
		<div id="member-articles-page">
			<Stack className="main-title-box">
				<Stack className="title-icon">
					<ArticleRoundedIcon />
				</Stack>
				<Stack className="right-box">
					<Typography className="eyebrow">Community</Typography>
					<Typography className="main-title">Articles</Typography>
					<Typography className="sub-title">Articles and stories shared by this member</Typography>
				</Stack>
				<Stack className="article-summary">
					<Stack className="summary-item">
						<AutoStoriesRoundedIcon />
						<Stack>
							<Typography className="summary-value">{total}</Typography>
							<Typography className="summary-label">Published</Typography>
						</Stack>
					</Stack>
					<Stack className="summary-item accent">
						<FavoriteRoundedIcon />
						<Stack>
							<Typography className="summary-value">{totalLikes}</Typography>
							<Typography className="summary-label">Likes</Typography>
						</Stack>
					</Stack>
				</Stack>
			</Stack>

			<Stack className="article-list-box">
				{memberBoArticles?.length > 0 ? (
					memberBoArticles.map((boardArticle: BoardArticle) => (
						<CommunityCard
							boardArticle={boardArticle}
							likeArticleHandler={likeArticleHandler}
							key={boardArticle._id}
							size={'small'}
						/>
					))
				) : (
					<div className="no-data">
						<img src="/img/icons/icoAlert.svg" alt="" />
						<p>No articles found!</p>
					</div>
				)}
			</Stack>

			{memberBoArticles.length > 0 && (
				<Stack className="pagination-conf">
					<Stack className="pagination-box">
						<Pagination
							count={Math.ceil(total / searchFilter.limit) || 1}
							page={searchFilter.page}
							shape="circular"
							color="primary"
							onChange={paginationHandler}
						/>
					</Stack>
					<Stack className="total">
						<Typography>{total} article{total !== 1 ? 's' : ''} available</Typography>
					</Stack>
				</Stack>
			)}
		</div>
	);
};

MemberArticles.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default MemberArticles;
