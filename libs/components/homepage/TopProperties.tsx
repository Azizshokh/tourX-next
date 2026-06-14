import React, { useState } from 'react';
import Link from 'next/link';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import StarIcon from '@mui/icons-material/Star';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import TopPropertyCard from './TopPropertyCard';
import { REACT_APP_API_URL } from '../../config';
import { TourPackagesInquiry } from '../../types/tour-package/tour-package.input';
import { TourPackage as Property } from '../../types/tour-package/tour-package';
import { useMutation, useQuery } from '@apollo/client';
import { GET_TOUR_PACKAGES } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { LIKE_TARGET_TOUR_PACKAGE } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';

interface TopPropertiesProps {
	initialInput: TourPackagesInquiry;
}

const TopProperties = (props: TopPropertiesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
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
	const likePropertyHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			// execute likeTargetTourPackage Mutation
			await likeTargetTourPackage({ variables: { input: id } });
			// execute getTourPackagesRefetch
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
	} else {
		const rankedPackages = (topProperties || []).slice(0, 3);
		const featured = rankedPackages[0];
		const sidePackages = rankedPackages.slice(1, 3);
		const imageOf = (p?: Property) =>
			p?.packageImages?.[0] ? `${REACT_APP_API_URL}/${p.packageImages[0]}` : '/img/banner/TourX%20background.png';
		const ratingOf = (p?: Property) => Math.min(5, 4.6 + ((p?.packageRank || 0) % 4) / 10).toFixed(1);

		return (
			<Stack className={'top-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Top Ranked Packages</span>
							<p>Exceptional ratings and verified satisfaction from our community.</p>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						{rankedPackages.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Top Empty
							</Box>
						) : (
							<div className={'topbento-grid'}>
								{featured && (
									<Link href={`/tour-package/detail?id=${featured._id}`} className={'topbento-card featured'}>
										<span className={'topbento-media'} style={{ backgroundImage: `url(${imageOf(featured)})` }} />
										<span className={'topbento-overlay'} />
										<div className={'topbento-content'}>
											<div className={'verified'}>
												<VerifiedUserIcon /> Verified Excellence
											</div>
											<h3>{featured.packageTitle}</h3>
											<p>
												{featured.packageDesc ||
													featured.packageAddress ||
													'Exceptional rated experience curated by trusted TourX agents.'}
											</p>
											<span className={'book-btn'}>Book Exclusive</span>
										</div>
									</Link>
								)}
								<div className={'topbento-side'}>
									{sidePackages.map((p: Property) => (
										<Link key={p._id} href={`/tour-package/detail?id=${p._id}`} className={'topbento-card small'}>
											<span className={'topbento-media'} style={{ backgroundImage: `url(${imageOf(p)})` }} />
											<span className={'topbento-overlay'} />
											<div className={'topbento-content'}>
												<h4>{p.packageTitle}</h4>
												<span className={'rank'}>
													<StarIcon /> {ratingOf(p)} Ranked
												</span>
											</div>
										</Link>
									))}
								</div>
							</div>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
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
