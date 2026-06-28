import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, CircularProgress, IconButton, Pagination as MuiPagination, Stack, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import ApartmentIcon from '@mui/icons-material/Apartment';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import moment from 'moment';
import Link from 'next/link';
import withLayoutFull from '../../libs/components/layout/LayoutFull';
import Review from '../../libs/components/tourPackage/Review';
import PackageLocationMap from '../../libs/components/tourPackage/PackageLocationMap';
import TourPackageBigCard from '../../libs/components/common/TourPackageBigCard';
import {
	COMMENT_VIDEO_UPLOAD_UNAVAILABLE,
	CommentMediaPicker,
	uploadCommentImages,
	useCommentMedia,
} from '../../libs/components/common/CommentMedia';
import { TourPackage } from '../../libs/types/tour-package/tour-package';
import { formatterStr } from '../../libs/utils';
import { REACT_APP_API_URL } from '../../libs/config';
import { userVar } from '../../apollo/store';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { GET_COMMENTS, GET_TOUR_PACKAGE, GET_TOUR_PACKAGES } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { Direction, Message } from '../../libs/enums/common.enum';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { CREATE_COMMENT, LIKE_TARGET_TOUR_PACKAGE } from '../../apollo/user/mutation';
import { getI18nProps, PACKAGE_NAMESPACES } from '../../libs/i18n';
import AnimatedSection from '../../libs/components/animation/AnimatedSection';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await getI18nProps(locale, PACKAGE_NAMESPACES)),
	},
});

const TourPackageDetail: NextPage = ({ initialComment, ...props }: any) => {
	const router = useRouter();
	const { t } = useTranslation(['common', 'package', 'errors']);
	const user = useReactiveVar(userVar);
	const commentMedia = useCommentMedia();
	const queryId = router.query.id;
	const routePackageId = typeof queryId === 'string' ? queryId : null;
	const isValidPackageId = router.isReady && !!routePackageId && objectIdRegex.test(routePackageId);
	const [packageId, setPackageId] = useState<string | null>(null);
	const [tourPackage, setTourPackage] = useState<TourPackage | null>(null);
	const [slideImage, setSlideImage] = useState<string>('');
	const [selectedDays, setSelectedDays] = useState<number>(0);
	const [selectedTravelers, setSelectedTravelers] = useState<number>(0);
	const hasInitializedSelectors = useRef(false);
	const [relatedPackages, setRelatedPackages] = useState<TourPackage[]>([]);
	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
	const [packageComments, setPackageComments] = useState<Comment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);
	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.PACKAGE,
		commentContent: '',
		commentRefId: '',
	});

	const [likeTargetTourPackage] = useMutation(LIKE_TARGET_TOUR_PACKAGE);
	const [createComment] = useMutation(CREATE_COMMENT);

	const { loading: getTourPackageLoading, refetch: getTourPackageRefetch } = useQuery(GET_TOUR_PACKAGE, {
		fetchPolicy: 'network-only',
		variables: {
			input: routePackageId,
		},
		skip: !isValidPackageId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getTourPackage) setTourPackage(data?.getTourPackage);
			if (data?.getTourPackage) setSlideImage(data?.getTourPackage?.packageImages[0]);
			if (data?.getTourPackage && !hasInitializedSelectors.current) {
				setSelectedDays(data?.getTourPackage?.durationDays ?? 0);
				setSelectedTravelers(data?.getTourPackage?.minPeople ?? 0);
				hasInitializedSelectors.current = true;
			}
		},
	});

	const { refetch: getTourPackagesRefetch } = useQuery(GET_TOUR_PACKAGES, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: 1,
				limit: 4,
				sort: 'createdAt',
				direction: Direction.DESC,
				search: {
					cityList: tourPackage?.packageCity ? [tourPackage?.packageCity] : [],
				},
			},
		},
		skip: !isValidPackageId || !tourPackage,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getTourPackages?.list) setRelatedPackages(data?.getTourPackages?.list);
		},
	});

	const { refetch: getCommentsRefetch } = useQuery(GET_COMMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: commentInquiry,
		},
		skip: !isValidPackageId || !objectIdRegex.test(commentInquiry.search.commentRefId ?? ''),
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getComments?.list) setPackageComments(data?.getComments?.list);
			setCommentTotal(data?.getComments?.metaCounter[0]?.total ?? 0);
		},
	});

	useEffect(() => {
		if (!isValidPackageId || !routePackageId) return;

		setPackageId(routePackageId);
		setCommentInquiry({
			...commentInquiry,
			search: {
				commentRefId: routePackageId,
			},
		});
		setInsertCommentData({
			...insertCommentData,
			commentRefId: routePackageId,
		});
	}, [isValidPackageId, routePackageId]);

	const likePackageHandler = async (user: T, id: string) => {
		try {
			if (!objectIdRegex.test(id)) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetTourPackage({ variables: { input: id } });
			await getTourPackageRefetch({ input: id });
			await getTourPackagesRefetch({
				input: {
					page: 1,
					limit: 4,
					sort: 'createdAt',
					direction: Direction.DESC,
					search: {
						cityList: tourPackage?.packageCity ? [tourPackage.packageCity] : [],
					},
				},
			});
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const commentPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		setCommentInquiry({ ...commentInquiry, page: value });
	};

	const createCommentHandler = async () => {
		try {
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			if (!objectIdRegex.test(insertCommentData.commentRefId)) throw new Error(t('errors:invalidPackageId'));
			if (commentMedia.video) throw new Error(COMMENT_VIDEO_UPLOAD_UNAVAILABLE);

			const commentImages = await uploadCommentImages(commentMedia.images);
			const commentInput: CommentInput = {
				...insertCommentData,
				commentImages,
				commentVideo: null,
			};

			await createComment({ variables: { input: commentInput } });
			setInsertCommentData({ ...insertCommentData, commentContent: '', commentImages: [], commentVideo: null });
			commentMedia.clearMedia();
			await getCommentsRefetch({ input: commentInquiry });
		} catch (err: any) {
			commentMedia.setError(err.message);
			await sweetErrorHandling(err);
		}
	};

	const minDays = tourPackage?.durationDays ?? 1;
	const maxDays = minDays + 7;
	const minTravelers = tourPackage?.minPeople ?? 1;
	const maxTravelers = tourPackage?.maxPeople ?? 1;

	const totalPrice = useMemo(() => {
		if (!tourPackage) return 0;
		const base = tourPackage.packagePrice || 0;
		const dailyRate = tourPackage.durationDays > 0 ? base / tourPackage.durationDays : base;
		return Math.round(dailyRate * (selectedDays || 0) * (selectedTravelers || 0));
	}, [tourPackage, selectedDays, selectedTravelers]);

	const changeDays = (delta: number) =>
		setSelectedDays((d) => Math.min(maxDays, Math.max(minDays, d + delta)));
	const changeTravelers = (delta: number) =>
		setSelectedTravelers((t) => Math.min(maxTravelers, Math.max(minTravelers, t + delta)));

	if (getTourPackageLoading) {
		return (
			<Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '1080px' }}>
				<CircularProgress size={'4rem'} />
			</Stack>
		);
	}

	return (
		<div id={'tour-package-detail-page'}>
			<div className={'container'}>
				<Stack className={'tour-package-detail-config'}>
					<Stack className={'detail-breadcrumb'}>
						<Link href={'/tour-package'}>{t('package:detail.allTours')}</Link>
						<span>/</span>
						<Typography>{tourPackage?.packageCity || t('package:detail.adventure')}</Typography>
					</Stack>
					<Stack className={'detail-main-grid'}>
						<Stack className={'detail-main-left'}>
							<Stack className={'tour-package-info-config'}>
								<Stack className={'info'}>
									<Stack className={'left-box'}>
										<Stack className={'top-box'}>
											<Typography className={'city'}>
												{tourPackage?.packageCity}, {tourPackage?.packageCountry}
											</Typography>
											<Stack className={'divider'}></Stack>
											<Typography className={'date'}>
												{t('package:detail.daysAgo', { count: moment().diff(tourPackage?.createdAt, 'days') })}
											</Typography>
										</Stack>
										<Typography className={'title-main'}>{tourPackage?.packageTitle}</Typography>
										<Stack className={'bottom-box'}>
											<Stack className="option selector">
												<Typography className="opt-label">{t('labels.days')}</Typography>
												{minDays < maxDays ? (
													<Stack className="stepper">
														<IconButton
															className="step"
															size="small"
															disabled={selectedDays <= minDays}
															onClick={() => changeDays(-1)}
														>
															<RemoveIcon fontSize="small" />
														</IconButton>
														<Typography className="opt-value">{selectedDays}</Typography>
														<IconButton
															className="step"
															size="small"
															disabled={selectedDays >= maxDays}
															onClick={() => changeDays(1)}
														>
															<AddIcon fontSize="small" />
														</IconButton>
													</Stack>
												) : (
													<Typography className="opt-fixed">{selectedDays}</Typography>
												)}
											</Stack>
											<Stack className="option selector">
												<Typography className="opt-label">{t('labels.travelers')}</Typography>
												{minTravelers < maxTravelers ? (
													<Stack className="stepper">
														<IconButton
															className="step"
															size="small"
															disabled={selectedTravelers <= minTravelers}
															onClick={() => changeTravelers(-1)}
														>
															<RemoveIcon fontSize="small" />
														</IconButton>
														<Typography className="opt-value">{selectedTravelers}</Typography>
														<IconButton
															className="step"
															size="small"
															disabled={selectedTravelers >= maxTravelers}
															onClick={() => changeTravelers(1)}
														>
															<AddIcon fontSize="small" />
														</IconButton>
													</Stack>
												) : (
													<Typography className="opt-fixed">{minTravelers}</Typography>
												)}
											</Stack>
											<Stack className="option">
												<Typography>{tourPackage?.packageType}</Typography>
											</Stack>
										</Stack>
									</Stack>
									<Stack className={'right-box'}>
										<Stack className="buttons">
											<Stack className="button-box">
												<RemoveRedEyeIcon fontSize="medium" />
												<Typography>{tourPackage?.packageViews}</Typography>
											</Stack>
											<Stack
												className="button-box"
												onClick={() => tourPackage?._id && likePackageHandler(user, tourPackage._id)}
												style={{ cursor: 'pointer' }}
											>
												{tourPackage?.meLiked && tourPackage?.meLiked[0]?.myFavorite ? (
													<FavoriteIcon color="primary" fontSize={'medium'} />
												) : (
													<FavoriteBorderIcon fontSize={'medium'} />
												)}
												<Typography>{tourPackage?.packageLikes}</Typography>
											</Stack>
										</Stack>
									</Stack>
								</Stack>
								<Stack className={'images'}>
									<Stack className={'main-image'}>
										<img
											src={slideImage ? `${REACT_APP_API_URL}/${slideImage}` : '/img/banner/TourX%20background.png'}
											alt={'main-image'}
										/>
									</Stack>
									<Stack className={'sub-images'}>
										{tourPackage?.packageImages?.slice(0, 5).map((subImg: string) => (
											<Stack className={'sub-img-box'} onClick={() => setSlideImage(subImg)} key={subImg}>
												<img src={`${REACT_APP_API_URL}/${subImg}`} alt={'sub-image'} />
											</Stack>
										))}
									</Stack>
								</Stack>
							</Stack>
							<Stack className={'tour-package-desc-config'}>
								<Stack className={'left-config'}>
							<Stack className={'prop-desc-config'}>
								<Stack className={'top'}>
									<Typography className={'title'}>{t('package:detail.storyline')}</Typography>
									<Typography className={'desc'}>{tourPackage?.packageDesc ?? t('package:detail.noDescription')}</Typography>
								</Stack>
								{(tourPackage?.flightIncluded || tourPackage?.hotelIncluded || tourPackage?.guideIncluded) && (
									<Stack className={'bottom'}>
										<Typography className={'title'}>{t('package:detail.servicesIncluded')}</Typography>
										<Stack className={'info-box'}>
											{tourPackage?.flightIncluded && (
												<Stack className={'service-card'}>
													<Stack className={'service-icon-wrap'}>
														<FlightTakeoffIcon className={'service-icon'} />
													</Stack>
													<Stack className={'service-text'}>
														<Typography className={'service-name'}>{t('labels.flight')}</Typography>
														<Typography className={'service-desc'}>{t('package:detail.roundTrip')}</Typography>
													</Stack>
												</Stack>
											)}
											{tourPackage?.hotelIncluded && (
												<Stack className={'service-card'}>
													<Stack className={'service-icon-wrap'}>
														<ApartmentIcon className={'service-icon'} />
													</Stack>
													<Stack className={'service-text'}>
														<Typography className={'service-name'}>{t('labels.hotel')}</Typography>
														<Typography className={'service-desc'}>{t('package:detail.fiveStar')}</Typography>
													</Stack>
												</Stack>
											)}
											{tourPackage?.guideIncluded && (
												<Stack className={'service-card'}>
													<Stack className={'service-icon-wrap'}>
														<SupportAgentIcon className={'service-icon'} />
													</Stack>
													<Stack className={'service-text'}>
														<Typography className={'service-name'}>{t('labels.guide')}</Typography>
														<Typography className={'service-desc'}>{t('package:detail.localExpert')}</Typography>
													</Stack>
												</Stack>
											)}
										</Stack>
									</Stack>
								)}
							</Stack>
							<Stack className={'address-config'}>
								<Typography className={'title'}>{t('labels.address')}</Typography>
								<Typography>{tourPackage?.packageAddress}</Typography>
							</Stack>
							{commentTotal !== 0 && (
								<Stack className={'reviews-config'}>
									<Stack className={'filter-box'}>
										<Typography className={'reviews'}>{commentTotal} {t('labels.reviews')}</Typography>
									</Stack>
									<Stack className={'review-list'}>
										{packageComments?.map((comment: Comment) => (
											<Review comment={comment} key={comment?._id} />
										))}
										<Box component={'div'} className={'pagination-box'}>
											<MuiPagination
												page={commentInquiry.page}
												count={Math.ceil(commentTotal / commentInquiry.limit)}
												onChange={commentPaginationChangeHandler}
												shape="circular"
												color="primary"
											/>
										</Box>
									</Stack>
								</Stack>
							)}
							<Stack className={'leave-review-config'}>
								<Typography className={'main-title'}>{t('package:detail.leaveReview')}</Typography>
								<Typography className={'review-title'}>{t('labels.review')}</Typography>
								<textarea
									onChange={({ target: { value } }: any) => {
										setInsertCommentData({ ...insertCommentData, commentContent: value });
									}}
									value={insertCommentData.commentContent}
								></textarea>
								<CommentMediaPicker media={commentMedia} />
								<Box className={'submit-btn'} component={'div'}>
									<Button
										className={'submit-review'}
										disabled={insertCommentData.commentContent === '' || user?._id === ''}
										onClick={createCommentHandler}
									>
										<Typography className={'title'}>{t('package:detail.submitReview')}</Typography>
									</Button>
								</Box>
							</Stack>
						</Stack>
							</Stack>
						</Stack>
						<Stack className={'right-config'}>
							<Stack className={'booking-card'}>
								<PackageLocationMap
									packageCountry={tourPackage?.packageCountry}
									packageCity={tourPackage?.packageCity}
									packageAddress={tourPackage?.packageAddress}
									packageTitle={tourPackage?.packageTitle}
								/>
								<Typography className={'sidebar-kicker'}>{t('package:detail.tripSummary')}</Typography>
								<Typography className={'price'}>
									{tourPackage?.packageCurrency ?? 'USD'} {formatterStr(totalPrice)}
								</Typography>
								<Typography className={'price-note'}>
									{t('package:card.durationDays', { count: selectedDays })} · {selectedTravelers}{' '}
									{selectedTravelers === 1 ? t('package:detail.traveler') : t('package:detail.travelers')}
								</Typography>
								<Button className={'book-now'}>{t('package:detail.bookNow')}</Button>
								<Button className={'outline-action'}>{t('package:detail.wishlist')}</Button>
								<Stack className={'booking-stats'}>
										<span>{tourPackage?.durationDays} {t('labels.days')}</span>
									<span>
											{tourPackage?.minPeople}-{tourPackage?.maxPeople} {t('package:detail.people')}
									</span>
									<span>{tourPackage?.packageType}</span>
								</Stack>
								<Stack className={'included-list'}>
									<span className={tourPackage?.flightIncluded ? 'on' : ''}>{t('labels.flight')}</span>
									<span className={tourPackage?.hotelIncluded ? 'on' : ''}>{t('labels.hotel')}</span>
									<span className={tourPackage?.guideIncluded ? 'on' : ''}>{t('labels.localGuide')}</span>
								</Stack>
							</Stack>
							<Stack className={'info-box'}>
								<Typography className={'main-title'}>{t('package:detail.hostedBy')}</Typography>
								<Stack className={'image-info'}>
									<img
										className={'member-image'}
										src={
											tourPackage?.memberData?.memberImage
												? `${REACT_APP_API_URL}/${tourPackage?.memberData?.memberImage}`
												: '/img/profile/defaultUser.svg'
										}
									/>
									<Stack className={'name-phone-listings'}>
										<Link href={`/member?memberId=${tourPackage?.memberData?._id}`}>
											<Typography className={'name'}>{tourPackage?.memberData?.memberNick}</Typography>
										</Link>
										<Typography className={'listings'}>{t('package:detail.viewPackages')}</Typography>
									</Stack>
								</Stack>
							</Stack>
						</Stack>
					</Stack>
					{relatedPackages.length !== 0 && (
						<Stack className={'similar-tour-packages-config'}>
							<Stack className={'title-pagination-box'}>
								<Stack className={'title-box'}>
									<Typography className={'main-title'}>{t('package:detail.related')}</Typography>
									<Typography className={'sub-title'}>{t('package:detail.relatedDesc')}</Typography>
								</Stack>
							</Stack>
							<Stack className={'cards-box'}>
								{relatedPackages.map((tourPackage: TourPackage) => (
									<TourPackageBigCard
										tourPackage={tourPackage}
										likeTourPackageHandler={likePackageHandler}
										key={tourPackage?._id}
									/>
								))}
							</Stack>
						</Stack>
					)}
				</Stack>
			</div>
		</div>
	);
};

TourPackageDetail.defaultProps = {
	initialComment: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			commentRefId: '',
		},
	},
};

export default withLayoutFull(TourPackageDetail);
