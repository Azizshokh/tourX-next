import React, { ChangeEvent, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUpMotionProps } from '../../config/animations';
const MotionStack = motion(Stack);
import { Box, Button, Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import { FollowInquiry } from '../../types/follow/follow.input';
import { useQuery, useReactiveVar } from '@apollo/client';
import { Follower } from '../../types/follow/follow';
import { REACT_APP_API_URL } from '../../config';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import { userVar } from '../../../apollo/store';
import { T } from '../../types/common';
import { GET_MEMBER_FOLLOWERS } from '../../../apollo/user/query';
import { useTranslation } from 'next-i18next';

const isValidObjectId = (id?: string) => Boolean(id && id.length === 24 && id !== 'undefined' && id !== 'null');

interface MemberFollowsProps {
	initialInput: FollowInquiry;
	subscribeHandler: any;
	unsubscribeHandler: any;
	likeMemberHandler: any;
	redirectToMemberPageHandler: any;
}

const MemberFollowers = (props: MemberFollowsProps) => {
	const { initialInput, subscribeHandler, unsubscribeHandler, likeMemberHandler, redirectToMemberPageHandler } = props;
	const device = useDeviceDetect();
	const { t } = useTranslation(['common', 'mypage']);
	const router = useRouter();
	const [total, setTotal] = useState<number>(0);
	const [followInquiry, setFollowInquiry] = useState<FollowInquiry>(initialInput);
	const [memberFollowers, setMemberFollowers] = useState<Follower[]>([]);
	const user = useReactiveVar(userVar);
	const followingId = followInquiry?.search?.followingId;

	/** APOLLO REQUESTS **/
	const {
		loading: getMemberFollowersLoading,
		data: getMemberFollowersData,
		error: getMemberFollowersError,
		refetch: getMemberFollowersRefetch,
	} = useQuery(GET_MEMBER_FOLLOWERS, {
		fetchPolicy: 'no-cache',
		variables: { input: followInquiry },
		skip: !isValidObjectId(followingId),
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setMemberFollowers(data?.getMemberFollowers?.list ?? []);
			setTotal(data?.getMemberFollowers?.metaCounter?.[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		const nextFollowingId = (router.query.memberId as string) || user?._id;
		if (!nextFollowingId) return;

		setFollowInquiry((prev) => ({ ...prev, page: 1, search: { followingId: nextFollowingId } }));
	}, [router.query.memberId, user?._id]);

	useEffect(() => {
		if (!isValidObjectId(followingId)) return;
		getMemberFollowersRefetch({ input: followInquiry }).then();
	}, [followInquiry, followingId, getMemberFollowersRefetch]);

	/** HANDLERS **/
	const paginationHandler = async (event: ChangeEvent<unknown>, value: number) => {
		setFollowInquiry({ ...followInquiry, page: value });
	};

	if (device === 'mobile') {
		return (
			<Stack direction="row" alignItems="center" gap={1}>
				<PeopleAltRoundedIcon fontSize="small" />
				<Typography>{t('mypage:follow.followers')}</Typography>
			</Stack>
		);
	} else {
		return (
			<div id="member-follows-page">
				<Stack className="main-title-box">
					<Typography className="main-title">{t('mypage:follow.followers')}</Typography>
				</Stack>
				<Stack className="follows-list-box">
					<Stack className="listing-title-box">
						<Typography className="title-text">{t('common:labels.name')}</Typography>
						<Typography className="title-text">{t('common:labels.details')}</Typography>
						<Typography className="title-text">{t('common:labels.subscription')}</Typography>
					</Stack>
					{memberFollowers?.length === 0 && (
						<div className={'no-data'}>
							<img src="/img/icons/icoAlert.svg" alt="" />
							<p>{t('mypage:follow.emptyFollowers')}</p>
						</div>
					)}
					{memberFollowers.map((follower: Follower) => {
						const imagePath: string = follower?.followerData?.memberImage
							? `${REACT_APP_API_URL}/${follower?.followerData?.memberImage}`
							: '/img/profile/defaultUser.svg';
						return (
							<MotionStack className="follows-card-box" key={follower._id} {...fadeUpMotionProps}>
								<Stack className={'info'} onClick={() => redirectToMemberPageHandler(follower?.followerData?._id)}>
									<Stack className="image-box">
										<img src={imagePath} alt="" />
									</Stack>
									<Stack className="information-box">
										<Typography className="name">{follower?.followerData?.memberNick}</Typography>
										{follower?.followerData?.memberType && (
											<Typography className="member-type-badge">{follower?.followerData?.memberType}</Typography>
										)}
									</Stack>
								</Stack>
								<Stack className={'details-box'}>
									<Box className={'info-box'} component={'div'}>
										<PeopleAltRoundedIcon fontSize="small" />
										<span>{follower?.followerData?.memberFollowers}</span>
									</Box>
									<Box className={'info-box'} component={'div'}>
										<PersonAddAltRoundedIcon fontSize="small" />
										<span>{follower?.followerData?.memberFollowings}</span>
									</Box>
									<Box className={'info-box'} component={'div'}>
										<p>{t('common:labels.likes')}</p>
										{follower?.meLiked && follower?.meLiked[0]?.myFavorite ? (
											<FavoriteIcon
												color="primary"
												onClick={() =>
													likeMemberHandler(follower?.followerData?._id, getMemberFollowersRefetch, followInquiry)
												}
											/>
										) : (
											<FavoriteBorderIcon
												onClick={() =>
													likeMemberHandler(follower?.followerData?._id, getMemberFollowersRefetch, followInquiry)
												}
											/>
										)}
										<span>{follower?.followerData?.memberLikes}</span>
									</Box>
								</Stack>
								{user?._id !== follower?.followerData?._id && (
									<Stack className="action-box">
										{follower.meFollowed && follower.meFollowed[0]?.myFollowing ? (
											<>
												<Button
													className="follow-action-btn unfollow-action-btn"
													variant="outlined"
													onClick={() =>
														unsubscribeHandler(follower?.followerData?._id, getMemberFollowersRefetch, followInquiry)
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
													subscribeHandler(follower?.followerData?._id, getMemberFollowersRefetch, followInquiry)
												}
											>
												{t('mypage:follow.follow')}
											</Button>
										)}
									</Stack>
								)}
							</MotionStack>
						);
					})}
				</Stack>
				{memberFollowers.length !== 0 && (
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
							<Typography>{t('mypage:follow.totalFollowers', { count: total })}</Typography>
						</Stack>
					</Stack>
				)}
			</div>
		);
	}
};

MemberFollowers.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		search: {},
	},
};
export default MemberFollowers;
