import React, { useState } from 'react';
import Link from 'next/link';
import { Stack, Box, IconButton, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper';
import TopPropertyCard from './TopPropertyCard';
import { REACT_APP_API_URL } from '../../config';
import { TourPackagesInquiry } from '../../types/tour-package/tour-package.input';
import { TourPackage as Property } from '../../types/tour-package/tour-package';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { GET_TOUR_PACKAGES } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { LIKE_TARGET_TOUR_PACKAGE } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';
import { userVar } from '../../../apollo/store';

interface TopPropertiesProps {
	initialInput: TourPackagesInquiry;
}

const TopProperties = (props: TopPropertiesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const [topProperties, setTopProperties] = useState<Property[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetTourPackage] = useMutation(LIKE_TARGET_TOUR_PACKAGE);

	const {
		loading: getTourPackagesLoading,
		data: getTourPackagesData,
		error: getTourPackagesError,
		refetch: getTourPackagesRefetch,
	} = useQuery(GET_TOUR_PACKAGES, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: initialInput,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTopProperties(data?.getTourPackages?.list);
		},
	});

	/** HANDLERS **/
	const likePropertyHandler = async (currentUser: T, id: string) => {
		try {
			if (!id) return;
			if (!currentUser._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetTourPackage({ variables: { input: id } });
			await getTourPackagesRefetch({ input: initialInput });

			await sweetTopSmallSuccessAlert('succes', 800);
		} catch (err: any) {
			console.log('ERROR, likePropertyHandler: ', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') {
		return (
			<Stack className={'top-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Top packages</span>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'top-property-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={15}
							modules={[Autoplay]}
						>
							{topProperties.map((property: Property) => {
								return (
									<SwiperSlide className={'top-property-slide'} key={property?._id}>
										<TopPropertyCard property={property} likePropertyHandler={likePropertyHandler} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	}

	const imageOf = (p?: Property) =>
		p?.packageImages?.[0] ? `${REACT_APP_API_URL}/${p.packageImages[0]}` : '/img/banner/TourX%20background.png';
	const ratingOf = (p?: Property) => Math.min(5, 4.6 + ((p?.packageRank || 0) % 4) / 10).toFixed(1);
	const formatCount = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`);
	const inclusionLabel = (p: Property) =>
		p.flightIncluded ? 'Flight Inc.' : p.hotelIncluded ? 'Hotel Inc.' : 'Guide Inc.';
	const styleLabel = (p: Property) => (p.guideIncluded ? '5-Star' : 'Boutique');

	return (
		<Stack className={'top-properties'}>
			<Stack className={'container'}>
				<Stack className={'info-box'}>
					<Box component={'div'} className={'left'}>
						<span>Top Ranked Packages</span>
						<p>Exceptional ratings and verified satisfaction from our community.</p>
					</Box>
					<Box component={'div'} className={'right'}>
						<button type={'button'} className={'nav-arrow top-prev'} aria-label={'Previous'}>
							<ArrowBackIcon />
						</button>
						<button type={'button'} className={'nav-arrow top-next'} aria-label={'Next'}>
							<ArrowForwardIcon />
						</button>
					</Box>
				</Stack>
				<Stack className={'card-box'}>
					{(topProperties || []).length === 0 ? (
						<Box component={'div'} className={'empty-list'}>
							Top Empty
						</Box>
					) : (
						<Swiper
							className={'top-row-swiper'}
							slidesPerView={3}
							spaceBetween={24}
							modules={[Navigation]}
							navigation={{ prevEl: '.top-prev', nextEl: '.top-next' }}
						>
							{topProperties.map((p: Property) => {
								const liked = Boolean(p?.meLiked && p.meLiked[0]?.myFavorite);
								return (
									<SwiperSlide key={p._id} className={'top-row-slide'}>
										<Box component={'div'} className={'top-row-card'}>
											<div className={'card-media'} style={{ backgroundImage: `url(${imageOf(p)})` }}>
												<IconButton
													className={`fav-btn ${liked ? 'on' : ''}`}
													onClick={(e) => {
														e.stopPropagation();
														likePropertyHandler(user, p._id);
													}}
													aria-label={'favorite'}
												>
													{liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
												</IconButton>
												<span className={'price-pill'}>${p.packagePrice?.toLocaleString()}</span>
											</div>
											<div className={'card-body'}>
												<Link href={`/tour-package/detail?id=${p._id}`} className={'card-link'}>
													<div className={'top-line'}>
														<span className={'place'}>
															{(p.packageAddress || p.packageCountry || 'Featured destination').toUpperCase()}
														</span>
														<span className={'rating'}>
															<StarIcon /> {ratingOf(p)}
														</span>
													</div>
													<h4 className={'title'}>{p.packageTitle}</h4>
												</Link>
												<div className={'chip-row'}>
													<span>
														<VerifiedOutlinedIcon /> {inclusionLabel(p)}
													</span>
													<span>
														<GradeOutlinedIcon /> {styleLabel(p)}
													</span>
													<span>
														<AccessTimeIcon /> {p.durationDays || 7} Days
													</span>
												</div>
												<div className={'foot-row'}>
													<span className={'foot-stat'}>
														<ThumbUpAltOutlinedIcon /> {formatCount(p.packageLikes || 0)}
													</span>
													<span className={'foot-stat'}>
														<RemoveRedEyeOutlinedIcon /> {formatCount(p.packageViews || 0)}
													</span>
													<span className={'foot-stat travellers'}>
														<PeopleAltOutlinedIcon /> {p.maxPeople || 2} Travelers
													</span>
												</div>
											</div>
										</Box>
									</SwiperSlide>
								);
							})}
						</Swiper>
					)}
				</Stack>
			</Stack>
		</Stack>
	);
};

TopProperties.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'packageRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopProperties;
