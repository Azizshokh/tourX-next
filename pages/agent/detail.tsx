import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { NextPage } from 'next';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import TourPackageBigCard from '../../libs/components/common/TourPackageBigCard';
import ReviewCard from '../../libs/components/agent/ReviewCard';
import {
	COMMENT_VIDEO_UPLOAD_UNAVAILABLE,
	COMMENT_CONTENT_MAX_LENGTH,
	CommentMediaPicker,
	getCommentContentValidationError,
	uploadCommentImages,
	useCommentMedia,
} from '../../libs/components/common/CommentMedia';
import { Box, Button, Pagination, Stack, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import PersonRemoveRoundedIcon from '@mui/icons-material/PersonRemoveRounded';
import LuggageRoundedIcon from '@mui/icons-material/LuggageRounded';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import BeachAccessRoundedIcon from '@mui/icons-material/BeachAccessRounded';
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import AnchorRoundedIcon from '@mui/icons-material/AnchorRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { TourPackage } from '../../libs/types/tour-package/tour-package';
import { Member } from '../../libs/types/member/member';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { userVar } from '../../apollo/store';
import { TourPackagesInquiry } from '../../libs/types/tour-package/tour-package.input';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { Messages, resolveImageUrl } from '../../libs/config';
import { getI18nProps, AGENT_NAMESPACES } from '../../libs/i18n';
import { T } from '../../libs/types/common';
import AnimatedSection from '../../libs/components/animation/AnimatedSection';
import { GET_MEMBER, GET_TOUR_PACKAGES, GET_COMMENTS } from '../../apollo/user/query';
import {
	CREATE_COMMENT,
	LIKE_TARGET_MEMBER,
	LIKE_TARGET_TOUR_PACKAGE,
	SUBSCRIBE,
	UNSUBSCRIBE,
} from '../../apollo/user/mutation';

const objectIdRegex = /^[a-f\d]{24}$/i;

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await getI18nProps(locale, AGENT_NAMESPACES)),
	},
});

const AgentDetail: NextPage = ({ initialInput, initialComment, ...props }: any) => {
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const commentMedia = useCommentMedia();
	const [agentId, setAgentId] = useState<string | null>(null);
	const [agent, setAgent] = useState<Member | null>(null);
	const [searchFilter, setSearchFilter] = useState<TourPackagesInquiry>(initialInput);
	const [agentTourPackages, setAgentTourPackages] = useState<TourPackage[]>([]);
	const [tourPackagesTotal, setTourPackagesTotal] = useState<number>(0);
	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
	const [agentComments, setAgentComments] = useState<Comment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);
	const [commentError, setCommentError] = useState<string>('');
	const [followActionLoading, setFollowActionLoading] = useState<boolean>(false);
	const followActionInFlightRef = useRef<boolean>(false);
	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.MEMBER,
		commentContent: '',
		commentRefId: '',
	});

	/** APOLLO REQUESTS **/
	const [createComment] = useMutation(CREATE_COMMENT);
	const [likeTargetTourPackage] = useMutation(LIKE_TARGET_TOUR_PACKAGE);
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);

	const {
		loading: getMemberLoading,
		data: getMemberData,
		error: getMemberError,
		refetch: getMemberRefetch,
	} = useQuery(GET_MEMBER, {
		fetchPolicy: 'network-only',
		variables: { input: agentId },
		skip: !agentId,
		onCompleted: (data: T) => {
			setAgent(data?.getMember);
			setSearchFilter({
				...searchFilter,
				search: {
					memberId: data?.getMember?._id,
				},
			});
			setCommentInquiry({
				...commentInquiry,
				search: {
					commentRefId: data?.getMember?._id,
				},
			});
			setInsertCommentData({
				...insertCommentData,
				commentRefId: data?.getMember?._id,
			});
		},
	});

	const {
		loading: getTourPackagesLoading,
		data: getTourPackagesData,
		error: getTourPackagesError,
		refetch: getTourPackagesRefetch,
	} = useQuery(GET_TOUR_PACKAGES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		skip: !searchFilter.search.memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentTourPackages(data?.getTourPackages?.list);
			setTourPackagesTotal(data?.getTourPackages?.metaCounter[0]?.total ?? 0);
		},
	});

	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		error: getCommentsError,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'network-only',
		variables: { input: commentInquiry },
		skip: !commentInquiry.search.commentRefId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentComments(data?.getComments?.list);
			setCommentTotal(data?.getComments?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		const queryAgentId = router.query.agentId;
		const nextAgentId = Array.isArray(queryAgentId) ? queryAgentId[0] : queryAgentId;

		if (nextAgentId && objectIdRegex.test(nextAgentId)) {
			setAgentId(nextAgentId);
		}
	}, [router.query.agentId]);

	useEffect(() => {
		if (searchFilter.search.memberId) {
			getTourPackagesRefetch({ variables: { input: searchFilter } }).then();
		}
	}, [searchFilter]);

	useEffect(() => {
		if (commentInquiry.search.commentRefId) {
			getCommentsRefetch({ input: commentInquiry }).then();
		}
	}, [commentInquiry]);

	/** HANDLERS **/
	const redirectToMemberPageHandler = async (memberId: string) => {
		try {
			if (memberId === user?._id) await router.push(`/mypage?memberId=${memberId}`);
			else await router.push(`/member?memberId=${memberId}`);
		} catch (error) {
			await sweetErrorHandling(error);
		}
	};

	const tourPackagePaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		setSearchFilter({ ...searchFilter });
	};

	const commentPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		commentInquiry.page = value;
		setCommentInquiry({ ...commentInquiry });
	};

	const applyAgentFollowState = (nextFollowing: boolean, nextFollowerCount: number, refetchedAgent?: Member) => {
		setAgent((prevAgent) => {
			const baseAgent = refetchedAgent ?? prevAgent;
			if (!baseAgent || !agentId) return baseAgent;

			return {
				...baseAgent,
				memberFollowers: nextFollowerCount,
				memberFollowings: prevAgent?.memberFollowings ?? baseAgent.memberFollowings,
				meFollowed: [
					{
						followingId: baseAgent.meFollowed?.[0]?.followingId ?? agentId,
						followerId: baseAgent.meFollowed?.[0]?.followerId ?? user?._id ?? '',
						myFollowing: nextFollowing,
					},
				],
			};
		});
	};

	const refetchAgentHandler = async (id: string) => {
		const { data } = await getMemberRefetch({ input: id });
		if (data?.getMember) setAgent(data.getMember);
	};

	const likeAgentHandler = async () => {
		try {
			if (!agentId || !objectIdRegex.test(agentId)) throw new Error(Messages.error1);
			if (!user?._id) throw new Error(Messages.error2);

			await likeTargetMember({
				variables: {
					input: agentId,
				},
			});
			await refetchAgentHandler(agentId);
			await sweetTopSmallSuccessAlert('Success!', 800);
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const subscribeHandler = async () => {
		if (followActionInFlightRef.current) return;

		try {
			if (!agentId || !objectIdRegex.test(agentId)) throw new Error(Messages.error1);
			if (!user?._id) throw new Error(Messages.error2);
			if (user._id === agentId) throw new Error('Cannot follow yourself');

			followActionInFlightRef.current = true;
			setFollowActionLoading(true);
			const nextFollowerCount = (agent?.memberFollowers ?? 0) + 1;

			await subscribe({
				variables: {
					input: agentId,
				},
			});
			applyAgentFollowState(true, nextFollowerCount);
			await refetchAgentHandler(agentId);
			await sweetTopSmallSuccessAlert('Subscribed!', 800);
		} catch (err: any) {
			sweetErrorHandling(err).then();
		} finally {
			followActionInFlightRef.current = false;
			setFollowActionLoading(false);
		}
	};

	const unsubscribeHandler = async () => {
		if (followActionInFlightRef.current) return;

		try {
			if (!agentId || !objectIdRegex.test(agentId)) throw new Error(Messages.error1);
			if (!user?._id) throw new Error(Messages.error2);
			if (user._id === agentId) throw new Error('Cannot unfollow yourself');

			followActionInFlightRef.current = true;
			setFollowActionLoading(true);
			const nextFollowerCount = Math.max((agent?.memberFollowers ?? 0) - 1, 0);

			await unsubscribe({
				variables: {
					input: agentId,
				},
			});
			applyAgentFollowState(false, nextFollowerCount);
			await refetchAgentHandler(agentId);
			await sweetTopSmallSuccessAlert('Unsubscribed!', 800);
		} catch (err: any) {
			sweetErrorHandling(err).then();
		} finally {
			followActionInFlightRef.current = false;
			setFollowActionLoading(false);
		}
	};

	const createCommentHandler = async () => {
		try {
			if (!user._id) throw new Error(Messages.error2);
			if (user._id === agentId) throw new Error('Cannot write a review for yourself');
			if (commentMedia.video) throw new Error(COMMENT_VIDEO_UPLOAD_UNAVAILABLE);
			const validationError = getCommentContentValidationError(insertCommentData.commentContent);
			if (validationError) {
				setCommentError(validationError);
				return;
			}

			setCommentError('');
			const commentImages = await uploadCommentImages(commentMedia.images);
			const commentInput: CommentInput = {
				...insertCommentData,
				commentImages,
				commentVideo: null,
			};

			await createComment({
				variables: {
					input: commentInput,
				},
			});
			setInsertCommentData({ ...insertCommentData, commentContent: '', commentImages: [], commentVideo: null });
			commentMedia.clearMedia();
			await getCommentsRefetch({ input: commentInquiry });
			await sweetTopSmallSuccessAlert('Review submitted successfully', 1200);
		} catch (err: any) {
			setCommentError(err.message);
			commentMedia.setError(err.message);
			sweetErrorHandling(err).then();
		}
	};

	const likeTourPackageHandler = async (user: any, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);
			await likeTargetTourPackage({
				variables: {
					input: id,
				},
			});
			await getTourPackagesRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.error('ERROR, likeTourPackageHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const isAgentLiked = Boolean(agent?.meLiked?.[0]?.myFavorite);
	const isFollowingAgent = Boolean(agent?.meFollowed?.[0]?.myFollowing);
	const isOwnAgentProfile = Boolean(user?._id && agentId && user._id === agentId);

	return (
		<Stack className={'agent-detail-page'}>
			<Box component={'div'} className={'agent-detail-bg-icons'} aria-hidden={'true'}>
				<span className={'agent-detail-bg-icon plane'}>
					<FlightTakeoffRoundedIcon />
				</span>
				<span className={'agent-detail-bg-icon earth'}>
					<PublicRoundedIcon />
				</span>
				<span className={'agent-detail-bg-icon bag'}>
					<LuggageRoundedIcon />
				</span>
				<span className={'agent-detail-bg-icon location'}>
					<LocationOnRoundedIcon />
				</span>
				<span className={'agent-detail-bg-icon compass'}>
					<ExploreRoundedIcon />
				</span>
				<span className={'agent-detail-bg-icon bg-agent'}>
					<SupportAgentRoundedIcon />
				</span>
				<span className={'agent-detail-bg-icon map'}>
					<MapRoundedIcon />
				</span>
				<span className={'agent-detail-bg-icon beach'}>
					<BeachAccessRoundedIcon />
				</span>
				<span className={'agent-detail-bg-icon camera'}>
					<CameraAltRoundedIcon />
				</span>
				<span className={'agent-detail-bg-icon anchor'}>
					<AnchorRoundedIcon />
				</span>
			</Box>
			<Stack className={'container'}>
				<AnimatedSection>
					<Stack className={'agent-info'}>
						<Box className={'agent-photo-wrap'}>
							<img
								src={resolveImageUrl(agent?.memberImage, '/img/profile/defaultUser.svg')}
								alt={agent?.memberFullName ?? agent?.memberNick ?? ''}
								className={'agent-photo'}
							/>
						</Box>
						<Box className={'agent-content'}>
							<Typography className={'agent-role'}>Travel Agent</Typography>
							<Typography className={'agent-name'}>{agent?.memberFullName ?? agent?.memberNick}</Typography>
							{agent?.memberDesc && <Typography className={'agent-desc-text'}>{agent.memberDesc}</Typography>}
							<Box className={'agent-action-row'}>
								<Button
									className={`agent-like-btn ${isAgentLiked ? 'active' : ''}`}
									onClick={likeAgentHandler}
									startIcon={isAgentLiked ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
								>
									{isAgentLiked ? 'Liked' : 'Like Agent'}
								</Button>
								{!isOwnAgentProfile && (
									<Button
										className={`agent-follow-btn ${isFollowingAgent ? 'following' : ''}`}
										onClick={isFollowingAgent ? unsubscribeHandler : subscribeHandler}
										disabled={followActionLoading}
										startIcon={isFollowingAgent ? <PersonRemoveRoundedIcon /> : <PersonAddAltRoundedIcon />}
									>
										{isFollowingAgent ? 'Unfollow' : 'Follow'}
									</Button>
								)}
							</Box>
							<Box className={'agent-stats'}>
								<Box className={'stat-box'}>
									<Box className={'stat-icon'}>
										<LuggageRoundedIcon />
									</Box>
									<Box className={'stat-copy'}>
										<Typography className={'stat-value'}>{agent?.memberTours ?? 0}</Typography>
										<Typography className={'stat-label'}>Tour Packages</Typography>
									</Box>
								</Box>
								<Box className={'stat-box'}>
									<Box className={'stat-icon'}>
										<GroupsRoundedIcon />
									</Box>
									<Box className={'stat-copy'}>
										<Typography className={'stat-value'}>{agent?.memberFollowers ?? 0}</Typography>
										<Typography className={'stat-label'}>Followers</Typography>
									</Box>
								</Box>
								<Box className={'stat-box'}>
									<Box className={'stat-icon'}>
										<PersonAddAltRoundedIcon />
									</Box>
									<Box className={'stat-copy'}>
										<Typography className={'stat-value'}>{agent?.memberFollowings ?? 0}</Typography>
										<Typography className={'stat-label'}>Following</Typography>
									</Box>
								</Box>
								<Box className={'stat-box'}>
									<Box className={'stat-icon'}>
										<VisibilityRoundedIcon />
									</Box>
									<Box className={'stat-copy'}>
										<Typography className={'stat-value'}>{agent?.memberViews ?? 0}</Typography>
										<Typography className={'stat-label'}>Views</Typography>
									</Box>
								</Box>
								<Box className={'stat-box'}>
									<Box className={'stat-icon'}>
										<FavoriteRoundedIcon />
									</Box>
									<Box className={'stat-copy'}>
										<Typography className={'stat-value'}>{agent?.memberLikes ?? 0}</Typography>
										<Typography className={'stat-label'}>Likes</Typography>
									</Box>
								</Box>
								<Box className={'stat-box'}>
									<Box className={'stat-icon'}>
										<CalendarMonthRoundedIcon />
									</Box>
									<Box className={'stat-copy'}>
										<Typography className={'stat-value'}>
											{agent?.createdAt ? new Date(agent.createdAt).getFullYear() : '—'}
										</Typography>
										<Typography className={'stat-label'}>Member Since</Typography>
									</Box>
								</Box>
							</Box>
							{agent?.memberPhone && (
								<Stack direction={'row'} className={'agent-phone'}>
									<img src="/img/icons/call.svg" alt="" />
									<Typography>{agent.memberPhone}</Typography>
								</Stack>
							)}
						</Box>
					</Stack>
				</AnimatedSection>
				<AnimatedSection>
					<Stack className={'agent-home-list'}>
						<Stack className={'card-wrap'}>
							{agentTourPackages.map((tourPackage: TourPackage) => {
								return (
									<div className={'wrap-main'} key={tourPackage?._id}>
										<TourPackageBigCard
											tourPackage={tourPackage}
											likeTourPackageHandler={likeTourPackageHandler}
											key={tourPackage?._id}
										/>
									</div>
								);
							})}
						</Stack>
						<Stack className={'pagination'}>
							{tourPackagesTotal ? (
								<>
									<Stack className="pagination-box">
										<Pagination
											page={searchFilter.page}
											count={Math.ceil(tourPackagesTotal / searchFilter.limit) || 1}
											onChange={tourPackagePaginationChangeHandler}
											shape="circular"
											color="primary"
										/>
									</Stack>
									<span>
										Total {tourPackagesTotal} package{tourPackagesTotal > 1 ? 's' : ''} available
									</span>
								</>
							) : (
								<div className={'no-data'}>
									<img src="/img/icons/icoAlert.svg" alt="" />
									<p>No tour packages found!</p>
								</div>
							)}
						</Stack>
					</Stack>
					<Stack className={'review-box'}>
						<Stack className={'main-intro'}>
							<span>Reviews</span>
							<p>we are glad to see you again</p>
						</Stack>
						{commentTotal !== 0 && (
							<Stack className={'review-wrap'}>
								<Box component={'div'} className={'title-box'}>
									<StarIcon />
									<span>
										{commentTotal} review{commentTotal > 1 ? 's' : ''}
									</span>
								</Box>
								{agentComments?.map((comment: Comment) => {
									return <ReviewCard comment={comment} key={comment?._id} />;
								})}
								<Box component={'div'} className={'pagination-box'}>
									<Pagination
										page={commentInquiry.page}
										count={Math.ceil(commentTotal / commentInquiry.limit) || 1}
										onChange={commentPaginationChangeHandler}
										shape="circular"
										color="primary"
									/>
								</Box>
							</Stack>
						)}

						<Stack className={'leave-review-config'}>
							<Typography className={'main-title'}>Leave A Review</Typography>
							<Typography className={'review-title'}>Review</Typography>
							<textarea
								maxLength={COMMENT_CONTENT_MAX_LENGTH}
								onChange={({ target: { value } }: any) => {
									setCommentError('');
									setInsertCommentData({ ...insertCommentData, commentContent: value });
								}}
								value={insertCommentData.commentContent}
							></textarea>
							<Stack className={'review-validation-row'} direction={'row'} justifyContent={'space-between'}>
								<Typography className={'review-validation-error'} role={'alert'} sx={{ color: '#d32f2f', fontSize: 12, fontWeight: 700, minHeight: 18 }}>
									{commentError}
								</Typography>
								<Typography className={'review-character-count'} sx={{ color: '#7c8796', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
									{insertCommentData.commentContent.length}/{COMMENT_CONTENT_MAX_LENGTH}
								</Typography>
							</Stack>
							<CommentMediaPicker media={commentMedia} />
							<Box className={'submit-btn'} component={'div'}>
								<Button
									className={'submit-review'}
									disabled={user?._id === '' || user?._id === agentId}
									onClick={createCommentHandler}
								>
									<Typography className={'title'}>Submit Review</Typography>
									<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
										<g clipPath="url(#clip0_6975_3642)">
											<path
												d="M16.1571 0.5H6.37936C6.1337 0.5 5.93491 0.698792 5.93491 0.944458C5.93491 1.19012 6.1337 1.38892 6.37936 1.38892H15.0842L0.731781 15.7413C0.558156 15.915 0.558156 16.1962 0.731781 16.3698C0.818573 16.4566 0.932323 16.5 1.04603 16.5C1.15974 16.5 1.27345 16.4566 1.36028 16.3698L15.7127 2.01737V10.7222C15.7127 10.9679 15.9115 11.1667 16.1572 11.1667C16.4028 11.1667 16.6016 10.9679 16.6016 10.7222V0.944458C16.6016 0.698792 16.4028 0.5 16.1571 0.5Z"
												fill="#181A20"
											/>
										</g>
										<defs>
											<clipPath id="clip0_6975_3642">
												<rect width="16" height="16" fill="white" transform="translate(0.601562 0.5)" />
											</clipPath>
										</defs>
									</svg>
								</Button>
							</Box>
						</Stack>
					</Stack>
				</AnimatedSection>
			</Stack>
		</Stack>
	);
};

AgentDetail.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		search: {
			memberId: '',
		},
	},
	initialComment: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'ASC',
		search: {
			commentRefId: '',
		},
	},
};

export default withLayoutBasic(AgentDetail);
