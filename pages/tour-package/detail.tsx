import React, { ChangeEvent, useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Pagination as MuiPagination, Stack, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import moment from 'moment';
import Link from 'next/link';
import withLayoutFull from '../../libs/components/layout/LayoutFull';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import Review from '../../libs/components/property/Review';
import PropertyBigCard from '../../libs/components/common/PropertyBigCard';
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

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const TourPackageDetail: NextPage = ({ initialComment, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [packageId, setPackageId] = useState<string | null>(null);
	const [tourPackage, setTourPackage] = useState<TourPackage | null>(null);
	const [slideImage, setSlideImage] = useState<string>('');
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
			input: packageId,
		},
		skip: !packageId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getTourPackage) setTourPackage(data?.getTourPackage);
			if (data?.getTourPackage) setSlideImage(data?.getTourPackage?.packageImages[0]);
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
		skip: !packageId || !tourPackage,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getTourPackages?.list) setRelatedPackages(data?.getTourPackages?.list);
		},
	});

	const { refetch: getCommentsRefetch } = useQuery(GET_COMMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: initialComment,
		},
		skip: !commentInquiry.search.commentRefId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getComments?.list) setPackageComments(data?.getComments?.list);
			setCommentTotal(data?.getComments?.metaCounter[0]?.total ?? 0);
		},
	});

	useEffect(() => {
		if (router.query.id) {
			setPackageId(router.query.id as string);
			setCommentInquiry({
				...commentInquiry,
				search: {
					commentRefId: router.query.id as string,
				},
			});
			setInsertCommentData({
				...insertCommentData,
				commentRefId: router.query.id as string,
			});
		}
	}, [router]);

	useEffect(() => {
		if (commentInquiry.search.commentRefId) getCommentsRefetch({ input: commentInquiry }).then();
	}, [commentInquiry]);

	const likePackageHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
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
			await createComment({ variables: { input: insertCommentData } });
			setInsertCommentData({ ...insertCommentData, commentContent: '' });
			await getCommentsRefetch({ input: commentInquiry });
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	if (getTourPackageLoading) {
		return (
			<Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '1080px' }}>
				<CircularProgress size={'4rem'} />
			</Stack>
		);
	}

	if (device === 'mobile') {
		return <div>TOUR PACKAGE DETAIL PAGE</div>;
	}

	return (
		<div id={'property-detail-page'}>
			<div className={'container'}>
				<Stack className={'property-detail-config'}>
					<Stack className={'property-info-config'}>
						<Stack className={'info'}>
							<Stack className={'left-box'}>
								<Typography className={'title-main'}>{tourPackage?.packageTitle}</Typography>
								<Stack className={'top-box'}>
									<Typography className={'city'}>
										{tourPackage?.packageCity}, {tourPackage?.packageCountry}
									</Typography>
									<Stack className={'divider'}></Stack>
									<Typography className={'date'}>{moment().diff(tourPackage?.createdAt, 'days')} days ago</Typography>
								</Stack>
								<Stack className={'bottom-box'}>
									<Stack className="option">
										<Typography>{tourPackage?.durationDays} days</Typography>
									</Stack>
									<Stack className="option">
										<Typography>
											{tourPackage?.minPeople}-{tourPackage?.maxPeople} people
										</Typography>
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
								<Typography>
									{tourPackage?.packageCurrency ?? 'USD'} {formatterStr(tourPackage?.packagePrice)}
								</Typography>
							</Stack>
						</Stack>
						<Stack className={'images'}>
							<Stack className={'main-image'}>
								<img
									src={slideImage ? `${REACT_APP_API_URL}/${slideImage}` : '/img/property/bigImage.png'}
									alt={'main-image'}
								/>
							</Stack>
							<Stack className={'sub-images'}>
								{tourPackage?.packageImages.map((subImg: string) => (
									<Stack className={'sub-img-box'} onClick={() => setSlideImage(subImg)} key={subImg}>
										<img src={`${REACT_APP_API_URL}/${subImg}`} alt={'sub-image'} />
									</Stack>
								))}
							</Stack>
						</Stack>
					</Stack>
					<Stack className={'property-desc-config'}>
						<Stack className={'left-config'}>
							<Stack className={'prop-desc-config'}>
								<Stack className={'top'}>
									<Typography className={'title'}>Package Description</Typography>
									<Typography className={'desc'}>{tourPackage?.packageDesc ?? 'No Description!'}</Typography>
								</Stack>
								<Stack className={'bottom'}>
									<Typography className={'title'}>Package Details</Typography>
									<Stack className={'info-box'}>
										<Stack className={'left'}>
											<Box component={'div'} className={'info'}>
												<Typography className={'title'}>Price</Typography>
												<Typography className={'data'}>
													{tourPackage?.packageCurrency ?? 'USD'} {formatterStr(tourPackage?.packagePrice)}
												</Typography>
											</Box>
											<Box component={'div'} className={'info'}>
												<Typography className={'title'}>Duration</Typography>
												<Typography className={'data'}>{tourPackage?.durationDays} days</Typography>
											</Box>
											<Box component={'div'} className={'info'}>
												<Typography className={'title'}>People</Typography>
												<Typography className={'data'}>
													{tourPackage?.minPeople}-{tourPackage?.maxPeople}
												</Typography>
											</Box>
										</Stack>
										<Stack className={'right'}>
											<Box component={'div'} className={'info'}>
												<Typography className={'title'}>Travel Dates</Typography>
												<Typography className={'data'}>
													{moment(tourPackage?.startDate).format('DD MMM YYYY')} -{' '}
													{moment(tourPackage?.endDate).format('DD MMM YYYY')}
												</Typography>
											</Box>
											<Box component={'div'} className={'info'}>
												<Typography className={'title'}>Type</Typography>
												<Typography className={'data'}>{tourPackage?.packageType}</Typography>
											</Box>
											<Box component={'div'} className={'info'}>
												<Typography className={'title'}>Inclusions</Typography>
												<Typography className={'data'}>
													{[
														tourPackage?.flightIncluded && 'Flight',
														tourPackage?.hotelIncluded && 'Hotel',
														tourPackage?.guideIncluded && 'Guide',
													]
														.filter(Boolean)
														.join(', ') || 'None'}
												</Typography>
											</Box>
										</Stack>
									</Stack>
								</Stack>
							</Stack>
							<Stack className={'address-config'}>
								<Typography className={'title'}>Address</Typography>
								<Typography>{tourPackage?.packageAddress}</Typography>
							</Stack>
							{commentTotal !== 0 && (
								<Stack className={'reviews-config'}>
									<Stack className={'filter-box'}>
										<Typography className={'reviews'}>{commentTotal} reviews</Typography>
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
								<Typography className={'main-title'}>Leave A Review</Typography>
								<Typography className={'review-title'}>Review</Typography>
								<textarea
									onChange={({ target: { value } }: any) => {
										setInsertCommentData({ ...insertCommentData, commentContent: value });
									}}
									value={insertCommentData.commentContent}
								></textarea>
								<Box className={'submit-btn'} component={'div'}>
									<Button
										className={'submit-review'}
										disabled={insertCommentData.commentContent === '' || user?._id === ''}
										onClick={createCommentHandler}
									>
										<Typography className={'title'}>Submit Review</Typography>
									</Button>
								</Box>
							</Stack>
						</Stack>
						<Stack className={'right-config'}>
							<Stack className={'info-box'}>
								<Typography className={'main-title'}>Get More Information</Typography>
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
										<Typography className={'listings'}>View Packages</Typography>
									</Stack>
								</Stack>
							</Stack>
						</Stack>
					</Stack>
					{relatedPackages.length !== 0 && (
						<Stack className={'similar-properties-config'}>
							<Stack className={'title-pagination-box'}>
								<Stack className={'title-box'}>
									<Typography className={'main-title'}>Related Packages</Typography>
									<Typography className={'sub-title'}>More packages in this destination</Typography>
								</Stack>
							</Stack>
							<Stack className={'cards-box'}>
								{relatedPackages.map((tourPackage: TourPackage) => (
									<PropertyBigCard
										property={tourPackage}
										likePropertyHandler={likePackageHandler}
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
