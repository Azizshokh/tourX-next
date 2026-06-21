import React, { useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Pagination, Stack, Typography, Box } from '@mui/material';
import TourPackageCard from '../tourPackage/TourPackageCard';
import { TourPackage } from '../../types/tour-package/tour-package';
import { T } from '../../types/common';
import { GET_FAVORITES } from '../../../apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import { LIKE_TARGET_TOUR_PACKAGE } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import LuggageRoundedIcon from '@mui/icons-material/LuggageRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';

const MyFavorites: NextPage = () => {
	const device = useDeviceDetect();
	const [myFavorites, setMyFavorites] = useState<TourPackage[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchFavorites, setSearchFavorites] = useState<T>({ page: 1, limit: 6 });

	/** APOLLO REQUESTS **/
	const [likeTargetTourPackage] = useMutation(LIKE_TARGET_TOUR_PACKAGE);

	const {
		loading: getFavoritesLoading,
		data: getFavoritesData,
		error: getFavoritesError,
		refetch: getFavoritesRefetch,
	} = useQuery(GET_FAVORITES, {
		fetchPolicy: 'network-only',
		variables: {
			input: searchFavorites,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setMyFavorites(data?.getFavorites?.list ?? []);
			setTotal(data?.getFavorites?.metaCounter?.[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFavorites({ ...searchFavorites, page: value });
	};

	const likeTourPackageHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetTourPackage({
				variables: {
					input: id,
				},
			});
			const nextPage =
				myFavorites.length === 1 && searchFavorites.page > 1 ? searchFavorites.page - 1 : searchFavorites.page;
			const nextSearchFavorites = { ...searchFavorites, page: nextPage };
			if (nextPage !== searchFavorites.page) setSearchFavorites(nextSearchFavorites);
			else await getFavoritesRefetch({ input: nextSearchFavorites });
		} catch (err: any) {
			console.log('ERROR, likeTourPackageHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') {
		return <div>SAVED TRIPS MOBILE</div>;
	} else {
		return (
			<div id="my-favorites-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Stack className="title-kicker">
							<FavoriteRoundedIcon />
							<Typography>TourX wishlist</Typography>
						</Stack>
						<Typography className="main-title">Saved Trips</Typography>
						<Typography className="sub-title">
							Keep your favorite travel packages close, compare the details, and return when you are ready to book.
						</Typography>
					</Stack>
					<Stack className="saved-summary-panel">
						<Box className="summary-icon">
							<TravelExploreRoundedIcon />
						</Box>
						<Stack className="summary-copy">
							<Typography className="summary-value">{total}</Typography>
							<Typography className="summary-label">saved package{total === 1 ? '' : 's'}</Typography>
						</Stack>
						<Stack className="summary-tags">
							<Stack className="summary-tag">
								<LuggageRoundedIcon />
								<Typography>Curated tours</Typography>
							</Stack>
							<Stack className="summary-tag">
								<PublicRoundedIcon />
								<Typography>Global escapes</Typography>
							</Stack>
						</Stack>
					</Stack>
				</Stack>
				<Stack className="favorites-list-box">
					{myFavorites?.length ? (
						myFavorites?.map((tourPackage: TourPackage) => {
							return (
								<TourPackageCard
									tourPackage={tourPackage}
									likeTourPackageHandler={likeTourPackageHandler}
									myFavorites={true}
									key={tourPackage?._id}
								/>
							);
						})
					) : (
						<div className={'no-data'}>
							<FavoriteRoundedIcon className="empty-icon" />
							<strong>No saved trips yet!</strong>
							<p>Explore TourX packages and tap the heart to build your shortlist.</p>
						</div>
					)}
				</Stack>
				{myFavorites?.length ? (
					<Stack className="pagination-config">
						<Stack className="pagination-box">
							<Pagination
								count={Math.ceil(total / searchFavorites.limit) || 1}
								page={searchFavorites.page}
								shape="circular"
								color="primary"
								onChange={paginationHandler}
							/>
						</Stack>
						<Stack className="total-result">
							<Typography>
								Total {total} saved trip{total > 1 ? 's' : ''}
							</Typography>
						</Stack>
					</Stack>
				) : null}
			</div>
		);
	}
};

export default MyFavorites;
