import React, { useRef, useState } from 'react';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { Comment } from '../../types/comment/comment';
import { CommentGroup, CommentStatus } from '../../enums/comment.enum';
import { T } from '../../types/common';
import { Message } from '../../enums/common.enum';
import { GET_TOP_LIKED_COMMENTS } from '../../../apollo/user/query';
import { TOGGLE_COMMENT_LIKE } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { REACT_APP_API_URL } from '../../config';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useTranslation } from 'next-i18next';

const RANK_COLORS = ['#ff8a00', '#0077b6', '#28b485', '#8b5cf6', '#ec4899'];

const MOCK_COMMENTS: Comment[] = [
	{
		_id: 'mock_1',
		commentStatus: CommentStatus.ACTIVE,
		commentGroup: CommentGroup.MEMBER,
		commentContent:
			'TourX completely transformed how I travel! The Bali package was breathtaking — every detail was perfectly planned, from sunrise hikes to hidden waterfall retreats. I felt like a local, not just a tourist.',
		commentRefId: 'mock_ref_1',
		memberId: 'mock_member_1',
		likesCount: 248,
		isLiked: false,
		createdAt: new Date('2025-11-15'),
		updatedAt: new Date('2025-11-15'),
		memberData: { _id: 'mock_m1', memberNick: 'SophiaTravels', memberImage: '' } as any,
	},
	{
		_id: 'mock_2',
		commentStatus: CommentStatus.ACTIVE,
		commentGroup: CommentGroup.MEMBER,
		commentContent:
			'I booked the Santorini Escape and it exceeded every expectation. The cliffside villa, sunset boat cruise, and curated dining experiences made it truly magical. TourX is my go-to for luxury travel!',
		commentRefId: 'mock_ref_2',
		memberId: 'mock_member_2',
		likesCount: 193,
		isLiked: false,
		createdAt: new Date('2025-10-28'),
		updatedAt: new Date('2025-10-28'),
		memberData: { _id: 'mock_m2', memberNick: 'MarcoExplorer', memberImage: '' } as any,
	},
	{
		_id: 'mock_3',
		commentStatus: CommentStatus.ACTIVE,
		commentGroup: CommentGroup.MEMBER,
		commentContent:
			'From the moment I landed in Tokyo to the last bite of ramen, every moment of my TourX Japan tour was unforgettable. The guides were knowledgeable and the itinerary struck the perfect balance between culture and adventure.',
		commentRefId: 'mock_ref_3',
		memberId: 'mock_member_3',
		likesCount: 167,
		isLiked: false,
		createdAt: new Date('2025-09-12'),
		updatedAt: new Date('2025-09-12'),
		memberData: { _id: 'mock_m3', memberNick: 'YukiWanderer', memberImage: '' } as any,
	},
	{
		_id: 'mock_4',
		commentStatus: CommentStatus.ACTIVE,
		commentGroup: CommentGroup.MEMBER,
		commentContent:
			"Safari in Kenya was a dream I never thought I'd live. TourX arranged everything flawlessly — the tented camps, game drives at golden hour, and that unforgettable moment watching a lion pride with her cubs. Absolutely life-changing.",
		commentRefId: 'mock_ref_4',
		memberId: 'mock_member_4',
		likesCount: 142,
		isLiked: false,
		createdAt: new Date('2025-08-05'),
		updatedAt: new Date('2025-08-05'),
		memberData: { _id: 'mock_m4', memberNick: 'AmiraAdventures', memberImage: '' } as any,
	},
	{
		_id: 'mock_5',
		commentStatus: CommentStatus.ACTIVE,
		commentGroup: CommentGroup.MEMBER,
		commentContent:
			'The Patagonia trekking package was the adventure of a lifetime. TourX took care of everything while still leaving room for those spontaneous moments. The glaciers, the condors, the silence — I still dream about it.',
		commentRefId: 'mock_ref_5',
		memberId: 'mock_member_5',
		likesCount: 119,
		isLiked: false,
		createdAt: new Date('2025-07-20'),
		updatedAt: new Date('2025-07-20'),
		memberData: { _id: 'mock_m5', memberNick: 'LucasHighlander', memberImage: '' } as any,
	},
];

const CommunityComments = () => {
	const device = useDeviceDetect();
	const { t } = useTranslation(['common', 'home']);
	const user = useReactiveVar(userVar);
	const swiperRef = useRef<any>(null);
	const [realComments, setRealComments] = useState<Comment[]>([]);
	const [activeIndex, setActiveIndex] = useState(0);
	const [likeLoading, setLikeLoading] = useState<string | null>(null);

	/** APOLLO **/
	useQuery(GET_TOP_LIKED_COMMENTS, {
		fetchPolicy: 'network-only',
		variables: { limit: 5 },
		onCompleted: (data: T) => {
			setRealComments(data?.getTopLikedComments ?? []);
		},
	});

	const localizedMockComments = MOCK_COMMENTS.map((comment, index) => ({
		...comment,
		commentContent: t(`home:testimonials.mock${index + 1}`),
	}));
	const isMock = realComments.length === 0;
	const comments = isMock ? localizedMockComments : realComments;

	const [toggleCommentLike] = useMutation(TOGGLE_COMMENT_LIKE);

	/** HANDLERS **/
	const likeToggleHandler = async (comment: Comment) => {
		if (likeLoading) return;
		if (!user._id) {
			sweetMixinErrorAlert(Message.NOT_AUTHENTICATED).then();
			return;
		}

		setLikeLoading(comment._id);
		const wasLiked = !!comment.isLiked;

		setRealComments((prev) =>
			prev.map((c) =>
				c._id === comment._id
					? {
							...c,
							isLiked: !wasLiked,
							likesCount: Math.max(0, (c.likesCount ?? 0) + (wasLiked ? -1 : 1)),
					  }
					: c,
			),
		);

		try {
			const { data } = await toggleCommentLike({ variables: { input: comment._id } });
			const res = data?.toggleCommentLike;
			if (res) {
				setRealComments((prev) =>
					prev.map((c) => (c._id === comment._id ? { ...c, isLiked: res.isLiked, likesCount: res.likesCount } : c)),
				);
			}
			if (!wasLiked) await sweetTopSmallSuccessAlert(t('home:labels.liked'), 600);
		} catch (err: any) {
			setRealComments((prev) =>
				prev.map((c) =>
					c._id === comment._id
						? {
								...c,
								isLiked: wasLiked,
								likesCount: Math.max(0, (c.likesCount ?? 0) + (wasLiked ? 1 : -1)),
						  }
						: c,
				),
			);
			sweetMixinErrorAlert(err.message).then();
		} finally {
			setLikeLoading(null);
		}
	};

	if (device === 'mobile') return null;

	return (
		<Stack className={'community-discussions'}>
			{/* Decorative background icons */}
			<Box component={'div'} className={'community-bg-icons'} aria-hidden={'true'}>
				<span className={'community-bg-icon forum'}>
					<FlightTakeoffRoundedIcon />
				</span>
				<span className={'community-bg-icon discover'}>
					<ExploreRoundedIcon />
				</span>
				<span className={'community-bg-icon review'}>
					<PublicRoundedIcon />
				</span>
				<span className={'community-bg-icon earth'}>
					<ForumRoundedIcon />
				</span>
			</Box>

			{/* Decorative travel images */}
			<img src={'/img/events/plane.png'} alt={''} className={'tc-deco tc-deco-plane'} aria-hidden={'true'} />
			<img
				src={'/img/events/travel_concepts.png'}
				alt={''}
				className={'tc-deco tc-deco-travel'}
				aria-hidden={'true'}
			/>

			<Stack className={'container'}>
				{/* Section Header */}
				<Box component={'div'} className={'tc-header'}>
					<span className={'tc-eyebrow'}>{t('home:sections.testimonialsEyebrow')}</span>
					<Typography className={'tc-main-title'}>{t('home:sections.testimonials')}</Typography>
					<Typography className={'tc-subtitle'}>{t('home:sections.testimonialsDesc')}</Typography>
				</Box>

				{/* Carousel */}
				<Box component={'div'} className={'tc-carousel-wrap'}>
					<button
						className={'tc-arrow'}
						aria-label={t('home:labels.previousComment')}
						onClick={() => swiperRef.current?.slidePrev()}
					>
						<ChevronLeftRoundedIcon />
					</button>

					<Swiper
						className={'tc-swiper'}
						modules={[Autoplay]}
						slidesPerView={1}
						autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
						onSwiper={(swiper) => {
							swiperRef.current = swiper;
						}}
						onActiveIndexChange={(swiper) => setActiveIndex(swiper.activeIndex)}
					>
						{comments.map((comment, index) => {
							const avatarSrc = comment.memberData?.memberImage
								? `${REACT_APP_API_URL}/${comment.memberData.memberImage}`
								: '/img/profile/defaultUser.svg';
							const isThisLoading = likeLoading === comment._id;
							const isMockEntry = comment._id.startsWith('mock_');

							return (
								<SwiperSlide key={comment._id} className={'tc-slide'}>
									<Box component={'div'} className={'tc-card-outer'}>
										{/* Rank badge */}
										<Box
											component={'div'}
											className={'tc-rank'}
											sx={{ background: RANK_COLORS[index % RANK_COLORS.length] }}
										>
											#{index + 1}
										</Box>

										{/* Floating avatar */}
										<Box component={'div'} className={'tc-avatar-ring'}>
											<Avatar src={avatarSrc} className={'tc-avatar'} />
										</Box>

										{/* Card */}
										<Box component={'div'} className={'tc-card'}>
											<FormatQuoteRoundedIcon className={'tc-quote-icon'} />

											<Typography className={'tc-text'}>{comment.commentContent}</Typography>

											<Box component={'div'} className={'tc-divider'} />

											<Typography className={'tc-author-name'}>
												{comment.memberData?.memberNick ?? t('common:labels.explorer')}
											</Typography>
											<Typography className={'tc-author-role'}>{t('home:labels.globalExplorer')}</Typography>

											<Box component={'div'} className={'tc-like-row'}>
												{!isMockEntry && (
													<button
														className={`tc-like-btn ${comment.isLiked ? 'liked' : ''}`}
														onClick={() => likeToggleHandler(comment)}
														disabled={isThisLoading || !!likeLoading}
													>
														{comment.isLiked ? <ThumbUpRoundedIcon /> : <ThumbUpOutlinedIcon />}
													</button>
												)}
												{isMockEntry && (
													<span className={'tc-like-btn tc-like-static'}>
														<ThumbUpRoundedIcon />
													</span>
												)}
											</Box>
										</Box>
									</Box>
								</SwiperSlide>
							);
						})}
					</Swiper>

					<button
						className={'tc-arrow'}
						aria-label={t('home:labels.nextComment')}
						onClick={() => swiperRef.current?.slideNext()}
					>
						<ChevronRightRoundedIcon />
					</button>
				</Box>

				{/* Dots */}
				<Box component={'div'} className={'tc-dots'}>
					{comments.map((_, i) => (
						<button
							key={i}
							className={`tc-dot ${i === activeIndex ? 'active' : ''}`}
							aria-label={t('home:labels.goToComment', { count: i + 1 })}
							onClick={() => swiperRef.current?.slideTo(i)}
						/>
					))}
				</Box>

			</Stack>
		</Stack>
	);
};

export default CommunityComments;
