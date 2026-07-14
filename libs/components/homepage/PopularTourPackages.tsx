import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import LuggageRoundedIcon from '@mui/icons-material/LuggageRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import PopularTourPackageCard from './PopularTourPackageCard';
import { TourPackage } from '../../types/tour-package/tour-package';
import { TourPackagesInquiry } from '../../types/tour-package/tour-package.input';
import { GET_TOUR_PACKAGES } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { useTranslation } from 'next-i18next';

interface PopularTourPackagesProps {
	initialInput: TourPackagesInquiry;
}

const PopularTourPackages = (props: PopularTourPackagesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const { t } = useTranslation(['home']);
	const [popularTourPackages, setPopularTourPackages] = useState<TourPackage[]>([]);

	/** APOLLO REQUESTS **/
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
			setPopularTourPackages(data?.getTourPackages?.list);
		},
	});

	/** HANDLERS **/

	if (!popularTourPackages) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'popular-tour-packages'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>{t('home:sections.popular')}</span>
							<p>{t('home:sections.popularDesc')}</p>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-tour-package-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={16}
							modules={[Autoplay]}
						>
							{popularTourPackages.map((tourPackage: TourPackage) => {
								return (
									<SwiperSlide key={tourPackage._id} className={'popular-tour-package-slide'}>
										<PopularTourPackageCard tourPackage={tourPackage} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'popular-tour-packages'}>
				<Box component={'div'} className={'popular-bg-icons'} aria-hidden={'true'}>
					<span className={'popular-bg-icon plane'}>
						<FlightTakeoffRoundedIcon />
					</span>
					<span className={'popular-bg-icon earth'}>
						<PublicRoundedIcon />
					</span>
					<span className={'popular-bg-icon bag'}>
						<LuggageRoundedIcon />
					</span>
					<span className={'popular-bg-icon location'}>
						<LocationOnRoundedIcon />
					</span>
				</Box>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>{t('home:sections.popular')}</span>
							<p>{t('home:sections.popularDesc')}</p>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-tour-package-swiper'}
							slidesPerView={'auto'}
							spaceBetween={25}
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-popular-next',
								prevEl: '.swiper-popular-prev',
							}}
							pagination={{
								el: '.swiper-popular-pagination',
							}}
						>
							{popularTourPackages.map((tourPackage: TourPackage) => {
								return (
									<SwiperSlide key={tourPackage._id} className={'popular-tour-package-slide'}>
										<PopularTourPackageCard tourPackage={tourPackage} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
					<Stack className={'pagination-box'}>
						<WestIcon className={'swiper-popular-prev'} />
						<div className={'swiper-popular-pagination'}></div>
						<EastIcon className={'swiper-popular-next'} />
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

PopularTourPackages.defaultProps = {
	initialInput: {
		page: 1,
		limit: 7,
		sort: 'packageViews',
		direction: 'DESC',
		search: {},
	},
};

export default PopularTourPackages;
