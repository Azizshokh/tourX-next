import React, { useState } from 'react';
import Link from 'next/link';
import { Stack, Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import AssignmentIndRoundedIcon from '@mui/icons-material/AssignmentIndRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import LuggageRoundedIcon from '@mui/icons-material/LuggageRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded';
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded';
import AltRouteRoundedIcon from '@mui/icons-material/AltRouteRounded';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { TourPackage } from '../../types/tour-package/tour-package';
import { TourPackagesInquiry } from '../../types/tour-package/tour-package.input';
import TrendTourPackageCard from './TrendTourPackageCard';
import { useMutation, useQuery } from '@apollo/client';
import { GET_TOUR_PACKAGES } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { LIKE_TARGET_TOUR_PACKAGE } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';
import { REACT_APP_API_URL } from '../../config';
import { useTranslation } from 'next-i18next';

interface TrendTourPackagesProps {
	initialInput: TourPackagesInquiry;
}

const TrendTourPackages = (props: TrendTourPackagesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const { t } = useTranslation(['home']);
	const [trendTourPackages, setTrendTourPackages] = useState<TourPackage[]>([]);

	/** APOLLO REQUESTS **/
	const [liketargetTourPackage] = useMutation(LIKE_TARGET_TOUR_PACKAGE);

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
			setTrendTourPackages(data?.getTourPackages?.list);
		},
	});

	/** HANDLERS **/
	const likeTourPackageHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			// execute likeTargetTourPackage Mutation
			await liketargetTourPackage({ variables: { input: id } });
			// execute getTourPackagesRefetch
			await getTourPackagesRefetch({ input: initialInput });

			await sweetTopSmallSuccessAlert('succes', 800);
		} catch (err: any) {
			console.log('ERROR, likeTourPackageHandler: ', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (!trendTourPackages) return null;
	const featuredPackages = trendTourPackages.slice(0, 3);

	if (device === 'mobile') {
		return (
			<Stack className={'trend-tour-packages'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>{t('home:sections.trending')}</span>
							<p>{t('home:sections.trendingDesc')}</p>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						{trendTourPackages.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								{t('home:empty.trends')}
							</Box>
						) : (
							<Stack className={'trend-feature-grid'}>
								{featuredPackages.map((tourPackage: TourPackage, index: number) => (
									<TrendTourPackageCard
										key={tourPackage._id}
										tourPackage={tourPackage}
										likeTourPackageHandler={likeTourPackageHandler}
										variant={index === 0 ? 'featured' : 'compact'}
									/>
								))}
							</Stack>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		const featured = featuredPackages[0];
		const sidePackages = featuredPackages.slice(1, 3);
		const imageOf = (p?: TourPackage) =>
			p?.packageImages?.[0] ? `${REACT_APP_API_URL}/${p.packageImages[0]}` : '/img/banner/TourX%20background.png';
		const ratingOf = (p?: TourPackage) => Math.min(5, 4.6 + ((p?.packageRank || 0) % 4) / 10).toFixed(1);

		return (
			<Stack className={'trend-tour-packages'}>
				<Box component={'div'} className={'trend-bg-icons'} aria-hidden={'true'}>
					<span className={'trend-bg-icon plane'}>
						<FlightTakeoffRoundedIcon />
					</span>
					<span className={'trend-bg-icon passport'}>
						<AssignmentIndRoundedIcon />
					</span>
					<span className={'trend-bg-icon location'}>
						<LocationOnRoundedIcon />
					</span>
					<span className={'trend-bg-icon earth'}>
						<PublicRoundedIcon />
					</span>
					<span className={'trend-bg-icon bag'}>
						<LuggageRoundedIcon />
					</span>
					<span className={'trend-bg-icon map'}>
						<MapRoundedIcon />
					</span>
					<span className={'trend-bg-icon compass'}>
						<ExploreRoundedIcon />
					</span>
					<span className={'trend-bg-icon camera'}>
						<PhotoCameraRoundedIcon />
					</span>
					<span className={'trend-bg-icon route'}>
						<AltRouteRoundedIcon />
					</span>
				</Box>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>{t('home:sections.trending')}</span>
							<p>{t('home:sections.trendingDesc')}</p>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						{featuredPackages.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								{t('home:empty.trends')}
							</Box>
						) : (
							<div className={'topbento-grid'}>
								{featured && (
									<Link href={`/tour-package/detail?id=${featured._id}`} className={'topbento-card featured'}>
										<span className={'topbento-media'} style={{ backgroundImage: `url(${imageOf(featured)})` }} />
										<span className={'topbento-overlay'} />
										<div className={'topbento-content'}>
											<div className={'verified'}>
												<LocalFireDepartmentIcon /> {featured.packageType || t('home:labels.trendingNow')}
											</div>
											<h3>{featured.packageTitle}</h3>
											<p>
												{featured.packageDesc ||
													featured.packageAddress ||
													t('home:sections.trendingDesc')}
											</p>
											<span className={'book-btn'}>{t('home:labels.exploreNow')}</span>
										</div>
									</Link>
								)}
								<div className={'topbento-side'}>
									{sidePackages.map((p: TourPackage) => (
										<Link key={p._id} href={`/tour-package/detail?id=${p._id}`} className={'topbento-card small'}>
											<span className={'topbento-media'} style={{ backgroundImage: `url(${imageOf(p)})` }} />
											<span className={'topbento-overlay'} />
											<div className={'topbento-content'}>
												<h4>{p.packageTitle}</h4>
												<span className={'rank'}>
													<StarIcon /> {ratingOf(p)} {t('home:labels.rating')}
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

TrendTourPackages.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'packageLikes',
		direction: 'DESC',
		search: {},
	},
};

export default TrendTourPackages;
