import React, { useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Pagination, Stack, Typography } from '@mui/material';
import TourPackageCard from '../tourPackage/TourPackageCard';
import { TourPackage } from '../../types/tour-package/tour-package';
import { T } from '../../types/common';
import { GET_VISITED_TOURS } from '../../../apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import { LIKE_TARGET_TOUR_PACKAGE } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';
import { useTranslation } from 'next-i18next';

const RecentlyVisited: NextPage = () => {
	const device = useDeviceDetect();
	const { t } = useTranslation(['common', 'mypage']);
	const [recentlyVisited, setRecentlyVisited] = useState<TourPackage[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchVisited, setSearchVisited] = useState<T>({ page: 1, limit: 6 });

	/** APOLLO REQUESTS **/
	const [likeTargetTourPackage] = useMutation(LIKE_TARGET_TOUR_PACKAGE);

	const {
		loading: getVisitedToursLoading,
		data: getVisitedToursData,
		error: getVisitedToursError,
		refetch: getVisitedToursRefetch,
	} = useQuery(GET_VISITED_TOURS, {
		fetchPolicy: 'network-only',
		variables: {
			input: searchVisited,
		},
		onCompleted: (data: T) => {
			setRecentlyVisited(data?.getVisitedTours?.list ?? []);
			setTotal(data?.getVisitedTours?.metaCounter?.[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchVisited({ ...searchVisited, page: value });
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
			await getVisitedToursRefetch({ input: searchVisited });
		} catch (err: any) {
			console.error('ERROR, likeTourPackageHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	return (
			<div id="recently-visited-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">{t('mypage:recent.title')}</Typography>
						<Typography className="sub-title">{t('mypage:recent.subtitle')}</Typography>
					</Stack>
				</Stack>
				<Stack className="favorites-list-box">
					{recentlyVisited?.length ? (
						recentlyVisited?.map((tourPackage: TourPackage) => {
							return <TourPackageCard key={tourPackage?._id} tourPackage={tourPackage} likeTourPackageHandler={likeTourPackageHandler} />;
						})
					) : (
						<div className={'no-data'}>
							<img src="/img/icons/icoAlert.svg" alt="" />
							<p>{t('mypage:recent.empty')}</p>
						</div>
					)}
				</Stack>
				{recentlyVisited?.length ? (
					<Stack className="pagination-config">
						<Stack className="pagination-box">
							<Pagination
								count={Math.ceil(total / searchVisited.limit) || 1}
								page={searchVisited.page}
								shape="circular"
								color="primary"
								onChange={paginationHandler}
							/>
						</Stack>
						<Stack className="total-result">
							<Typography>
								{t('mypage:recent.total', { count: total })}
							</Typography>
						</Stack>
					</Stack>
				) : null}
			</div>
	);
};

export default RecentlyVisited;
