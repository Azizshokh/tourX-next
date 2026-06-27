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
import { useTranslation } from 'next-i18next';

const MyFavorites: NextPage = () => {
	const device = useDeviceDetect();
	const { t } = useTranslation(['common', 'mypage']);
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
		return <div>{t('mypage:menu.savedTrips')}</div>;
	} else {
		return (
			<div id="my-favorites-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Stack className="title-kicker">
							<FavoriteRoundedIcon />
							<Typography>{t('mypage:saved.kicker')}</Typography>
						</Stack>
						<Typography className="main-title">{t('mypage:saved.title')}</Typography>
						<Typography className="sub-title">
							{t('mypage:saved.subtitle')}
						</Typography>
					</Stack>
					<Stack className="saved-summary-panel">
						<Box className="summary-icon">
							<TravelExploreRoundedIcon />
						</Box>
						<Stack className="summary-copy">
							<Typography className="summary-value">{total}</Typography>
							<Typography className="summary-label">{t('mypage:saved.summary', { count: total })}</Typography>
						</Stack>
						<Stack className="summary-tags">
							<Stack className="summary-tag">
								<LuggageRoundedIcon />
								<Typography>{t('mypage:saved.curatedTours')}</Typography>
							</Stack>
							<Stack className="summary-tag">
								<PublicRoundedIcon />
								<Typography>{t('mypage:saved.globalEscapes')}</Typography>
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
							<strong>{t('mypage:saved.emptyTitle')}</strong>
							<p>{t('mypage:saved.emptyBody')}</p>
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
								{t('mypage:saved.total', { count: total })}
							</Typography>
						</Stack>
					</Stack>
				) : null}
			</div>
		);
	}
};

export default MyFavorites;
