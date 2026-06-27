import React, { ChangeEvent, useEffect, useState } from 'react';
import { Box, Button, Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import { FollowInquiry } from '../../types/follow/follow.input';
import { useQuery, useReactiveVar } from '@apollo/client';
import { Following } from '../../types/follow/follow';
import { REACT_APP_API_URL } from '../../config';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { userVar } from '../../../apollo/store';
import { GET_MEMBER_FOLLOWINGS } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { useTranslation } from 'next-i18next';

const isValidObjectId = (id?: string) => Boolean(id && id.length === 24 && id !== 'undefined' && id !== 'null');

interface MemberFollowingsProps {
	initialInput: FollowInquiry;
	subscribeHandler: any;
	unsubscribeHandler: any;
	likeMemberHandler: any;
	redirectToMemberPageHandler: any;
}

const MemberFollowings = (props: MemberFollowingsProps) => {
	const { initialInput, subscribeHandler, unsubscribeHandler, likeMemberHandler, redirectToMemberPageHandler } = props;
	const device = useDeviceDetect();
	const { t } = useTranslation(['common', 'mypage']);
	const router = useRouter();
	const [total, setTotal] = useState<number>(0);
	const [followInquiry, setFollowInquiry] = useState<FollowInquiry>(initialInput);
	const [memberFollowings, setMemberFollowings] = useState<Following[]>([]);
	const user = useReactiveVar(userVar);
	const followerId = followInquiry?.search?.followerId;

	/** APOLLO REQUESTS **/
	const {
		loading: getMemberFollowingsLoading,
		data: getMemberFollowingsData,
		error: getMemberFollowingsError,
		refetch: getMemberFollowingsRefetch,
	} = useQuery(GET_MEMBER_FOLLOWINGS, {
		fetchPolicy: 'no-cache',
		variables: { input: followInquiry },
		skip: !isValidObjectId(followerId),
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setMemberFollowings(data?.getMemberFollowings?.list ?? []);
			setTotal(data?.getMemberFollowings?.metaCounter?.[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		const nextFollowerId = (router.query.memberId as string) || user?._id;
		if (!nextFollowerId) return;

		setFollowInquiry((prev) => ({ ...prev, page: 1, search: { followerId: nextFollowerId } }));
	}, [router.query.memberId, user?._id]);

	useEffect(() => {
		if (!isValidObjectId(followerId)) return;
		getMemberFollowingsRefetch({ input: followInquiry }).then();
	}, [followInquiry, followerId, getMemberFollowingsRefetch]);

	/** HANDLERS **/
	const paginationHandler = async (event: ChangeEvent<unknown>, value: number) => {
		setFollowInquiry({ ...followInquiry, page: value });
	};

	if (device === 'mobile') {
		return <div>{t('mypage:follow.following')}</div>;
	} else {
		return (
			<div id="member-follows-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">{t('mypage:follow.following')}</Typography>
					</Stack>
				</Stack>
				<Stack className="follows-list-box">
					<Stack className="listing-title-box">
						<Typography className="title-text">{t('common:labels.name')}</Typography>
						<Typography className="title-text">{t('common:labels.details')}</Typography>
						<Typography className="title-text">{t('common:labels.subscription')}</Typography>
					</Stack>
					{memberFollowings?.length === 0 && (
						<div className={'no-data'}>
							<img src="/img/icons/icoAlert.svg" alt="" />
							<p>{t('mypage:follow.emptyFollowing')}</p>
						</div>
					)}
					{memberFollowings.map((follower: Following) => {
						const imagePath: string = follower?.followingData?.memberImage
							? `${REACT_APP_API_URL}/${follower?.followingData?.memberImage}`
							: '/img/profile/defaultUser.svg';
						return (
							<Stack className="follows-card-box" key={follower._id}>
								<Stack className={'info'} onClick={() => redirectToMemberPageHandler(follower?.followingData?._id)}>
									<Stack className="image-box">
										<img src={imagePath} alt="" />
									</Stack>
									<Stack className="information-box">
										<Typography className="name">{follower?.followingData?.memberNick}</Typography>
									</Stack>
								</Stack>
								<Stack className={'details-box'}>
									<Box className={'info-box'} component={'div'}>
										<p>{t('mypage:follow.followers')}</p>
										<span>({follower?.followingData?.memberFollowers})</span>
									</Box>
									<Box className={'info-box'} component={'div'}>
										<p>{t('mypage:follow.following')}</p>
										<span>({follower?.followingData?.memberFollowings})</span>
									</Box>
									<Box className={'info-box'} component={'div'}>
										{follower?.meLiked && follower?.meLiked[0]?.myFavorite ? (
											<FavoriteIcon
												color="primary"
												onClick={() =>
													likeMemberHandler(follower?.followingData?._id, getMemberFollowingsRefetch, followInquiry)
												}
											/>
										) : (
											<FavoriteBorderIcon
												onClick={() =>
													likeMemberHandler(follower?.followingData?._id, getMemberFollowingsRefetch, followInquiry)
												}
											/>
										)}
										<span>({follower?.followingData?.memberLikes})</span>
									</Box>
								</Stack>
								{user?._id !== follower?.followingData?._id && (
									<Stack className="action-box">
										{follower.meFollowed && follower.meFollowed[0]?.myFollowing ? (
											<>
												<Typography className="following-state">{t('mypage:follow.following')}</Typography>
												<Button
													className="follow-action-btn unfollow-action-btn"
													variant="outlined"
													onClick={() =>
														unsubscribeHandler(follower?.followingData?._id, getMemberFollowingsRefetch, followInquiry)
													}
												>
													{t('mypage:follow.unfollow')}
												</Button>
											</>
										) : (
											<Button
												className="follow-action-btn"
												variant="contained"
												onClick={() =>
													subscribeHandler(follower?.followingData?._id, getMemberFollowingsRefetch, followInquiry)
												}
											>
												{t('mypage:follow.follow')}
											</Button>
										)}
									</Stack>
								)}
							</Stack>
						);
					})}
				</Stack>
				{memberFollowings.length !== 0 && (
					<Stack className="pagination-config">
						<Stack className="pagination-box">
							<Pagination
								page={followInquiry.page}
								count={Math.ceil(total / followInquiry.limit) || 1}
								onChange={paginationHandler}
								shape="circular"
								color="primary"
							/>
						</Stack>
						<Stack className="total-result">
							<Typography>{t('mypage:follow.totalFollowing', { count: total })}</Typography>
						</Stack>
					</Stack>
				)}
			</div>
		);
	}
};

MemberFollowings.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		search: {},
	},
};

export default MemberFollowings;
