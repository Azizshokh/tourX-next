import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { TourPackage as Property } from '../../types/tour-package/tour-package';
import { TourPackagesInquiry } from '../../types/tour-package/tour-package.input';
import TrendPropertyCard from './TrendPropertyCard';
import { useMutation, useQuery } from '@apollo/client';
import { GET_TOUR_PACKAGES } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { LIKE_TARGET_TOUR_PACKAGE } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';

interface TrendPropertiesProps {
	initialInput: TourPackagesInquiry;
}

const TrendProperties = (props: TrendPropertiesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [trendProperties, setTrendProperties] = useState<Property[]>([]);

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
			setTrendProperties(data?.getTourPackages?.list);
		},
	});

	/** HANDLERS **/
	const likePropertyHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			// execute likeTargetTourPackage Mutation
			await liketargetTourPackage({ variables: { input: id } });
			// execute getTourPackagesRefetch
			await getTourPackagesRefetch({ input: initialInput });

			await sweetTopSmallSuccessAlert('succes', 800);
		} catch (err: any) {
			console.log('ERROR, likePropertyHandler: ', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (!trendProperties) return null;
	const featuredPackages = trendProperties.slice(0, 3);

	if (device === 'mobile') {
		return (
			<Stack className={'trend-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Trending Packages</span>
							<p>Hand-picked experiences that everyone is talking about.</p>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						{trendProperties.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Trends Empty
							</Box>
						) : (
							<Stack className={'trend-feature-grid'}>
								{featuredPackages.map((property: Property, index: number) => (
									<TrendPropertyCard
										key={property._id}
										property={property}
										likePropertyHandler={likePropertyHandler}
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
		return (
			<Stack className={'trend-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Trending Packages</span>
							<p>Hand-picked experiences that everyone is talking about.</p>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						{trendProperties.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Trends Empty
							</Box>
						) : (
							<Stack className={'trend-feature-grid'}>
								{featuredPackages.map((property: Property, index: number) => (
									<TrendPropertyCard
										key={property._id}
										property={property}
										likePropertyHandler={likePropertyHandler}
										variant={index === 0 ? 'featured' : 'compact'}
									/>
								))}
							</Stack>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TrendProperties.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'packageLikes',
		direction: 'DESC',
		search: {},
	},
};

export default TrendProperties;
