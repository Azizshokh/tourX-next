import React, { useState } from 'react';
import Link from 'next/link';
import { Stack, Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
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

interface TrendTourPackagesProps {
	initialInput: TourPackagesInquiry;
}

const TrendTourPackages = (props: TrendTourPackagesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
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
							<span>Trending Packages</span>
							<p>Hand-picked experiences that everyone is talking about.</p>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						{trendTourPackages.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Trends Empty
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
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Trending Packages</span>
							<p>Hand-picked experiences that everyone is talking about.</p>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						{featuredPackages.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Trends Empty
							</Box>
						) : (
							<div className={'topbento-grid'}>
								{featured && (
									<Link href={`/tour-package/detail?id=${featured._id}`} className={'topbento-card featured'}>
										<span className={'topbento-media'} style={{ backgroundImage: `url(${imageOf(featured)})` }} />
										<span className={'topbento-overlay'} />
										<div className={'topbento-content'}>
											<div className={'verified'}>
												<LocalFireDepartmentIcon /> {featured.packageType || 'Trending Now'}
											</div>
											<h3>{featured.packageTitle}</h3>
											<p>
												{featured.packageDesc ||
													featured.packageAddress ||
													'Hand-picked travel experience loved by the TourX community.'}
											</p>
											<span className={'book-btn'}>Explore Now</span>
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
													<StarIcon /> {ratingOf(p)} Rating
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
