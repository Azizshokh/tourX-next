import React, { useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { TourPackageCard } from './TourPackageCard';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { TourPackage } from '../../types/tour-package/tour-package';
import { AgentTourPackagesInquiry } from '../../types/tour-package/tour-package.input';
import { T } from '../../types/common';
import { PackageStatus } from '../../enums/package.enum';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { GET_AGENT_TOUR_PACKAGES } from '../../../apollo/user/query';
import { UPDATE_TOUR_PACKAGE } from '../../../apollo/user/mutation';
import { sweetConfirmAlert, sweetErrorHandling } from '../../sweetAlert';
import { useTranslation } from 'next-i18next';

const MyTourPackages: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const { t } = useTranslation(['common', 'mypage']);
	const [searchFilter, setSearchFilter] = useState<AgentTourPackagesInquiry>(initialInput);
	const [agentTourPackages, setAgentTourPackages] = useState<TourPackage[]>([]);
	const [total, setTotal] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** APOLLO REQUESTS **/
	const [updateTourPackage] = useMutation(UPDATE_TOUR_PACKAGE);

	const {
		loading: getAgentTourPackagesLoading,
		data: getAgentTourPackagesData,
		error: getAgentTourPackagesError,
		refetch: getAgentTourPackagesRefetch,
	} = useQuery(GET_AGENT_TOUR_PACKAGES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentTourPackages(data?.getAgentTourPackages?.list);
			setTotal(data?.getAgentTourPackages?.metaCounter[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const changeStatusHandler = (value: PackageStatus) => {
		setSearchFilter({ ...searchFilter, search: { packageStatus: value } });
	};

	const deleteTourPackageHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert(t('mypage:packages.deleteConfirm'))) {
				await updateTourPackage({
					variables: {
						input: {
							_id: id,
							packageStatus: PackageStatus.DELETE,
						},
					},
				});
				await getAgentTourPackagesRefetch({ input: searchFilter });
			}
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	const updateTourPackageHandler = async (status: string, id: string) => {
		try {
			if (await sweetConfirmAlert(t('mypage:packages.statusConfirm', { status }))) {
				await updateTourPackage({
					variables: {
						input: {
							_id: id,
							packageStatus: status,
						},
					},
				});
				await getAgentTourPackagesRefetch({ input: searchFilter });
			}
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};
	if (user?.memberType !== 'AGENT') {
		router.back();
	}

	if (device === 'mobile') {
		return <div>{t('mypage:packages.title')}</div>;
	} else {
		return (
			<div id="my-tour-package-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Stack className="title-kicker">
							<Inventory2RoundedIcon />
							<Typography>{t('mypage:packages.kicker')}</Typography>
						</Stack>
						<Typography className="main-title">{t('mypage:packages.title')}</Typography>
						<Typography className="sub-title">{t('mypage:packages.subtitle')}</Typography>
					</Stack>
					<Stack className="summary-box">
						<PublicRoundedIcon />
						<Stack>
							<Typography className="summary-value">{total}</Typography>
							<Typography className="summary-label">
								{searchFilter.search.packageStatus === PackageStatus.ACTIVE ? t('mypage:packages.active') : t('mypage:packages.closed')}
							</Typography>
						</Stack>
					</Stack>
				</Stack>
				<Stack className="tour-package-list-box">
					<Stack className="tab-name-box">
						<Stack
							onClick={() => changeStatusHandler(PackageStatus.ACTIVE)}
							className={searchFilter.search.packageStatus === PackageStatus.ACTIVE ? 'active-tab-name' : 'tab-name'}
						>
							<CheckCircleRoundedIcon />
							<Stack>
								<Typography className="tab-label">{t('common:status.active')}</Typography>
								<Typography className="tab-helper">{t('mypage:packages.visible')}</Typography>
							</Stack>
						</Stack>
						<Stack
							onClick={() => changeStatusHandler(PackageStatus.CLOSED)}
							className={searchFilter.search.packageStatus === PackageStatus.CLOSED ? 'active-tab-name' : 'tab-name'}
						>
							<ArchiveRoundedIcon />
							<Stack>
								<Typography className="tab-label">{t('common:status.closed')}</Typography>
								<Typography className="tab-helper">{t('mypage:packages.paused')}</Typography>
							</Stack>
						</Stack>
					</Stack>
					<Stack className="list-box">
						<Stack className="listing-title-box">
							<Typography className="title-text">{t('mypage:packages.listingTitle')}</Typography>
							<Typography className="title-text">{t('mypage:packages.datePublished')}</Typography>
							<Typography className="title-text">{t('common:labels.status')}</Typography>
							<Typography className="title-text">{t('common:labels.view')}</Typography>
							{searchFilter.search.packageStatus === PackageStatus.ACTIVE && (
								<Typography className="title-text">{t('common:labels.actions')}</Typography>
							)}
						</Stack>

						{agentTourPackages?.length === 0 ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>{t('mypage:packages.empty')}</p>
							</div>
						) : (
							agentTourPackages.map((tourPackage: TourPackage) => {
								return (
									<TourPackageCard
										tourPackage={tourPackage}
										deleteTourPackageHandler={deleteTourPackageHandler}
										updateTourPackageHandler={updateTourPackageHandler}
									/>
								);
							})
						)}

						{agentTourPackages.length !== 0 && (
							<Stack className="pagination-config">
								<Stack className="pagination-box">
									<Pagination
										count={Math.ceil(total / searchFilter.limit)}
										page={searchFilter.page}
										shape="circular"
										color="primary"
										onChange={paginationHandler}
									/>
								</Stack>
								<Stack className="total-result">
									<Typography>{t('mypage:packages.available', { count: total })}</Typography>
								</Stack>
							</Stack>
						)}
					</Stack>
				</Stack>
			</div>
		);
	}
};

MyTourPackages.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		search: {
			packageStatus: PackageStatus.ACTIVE,
		},
	},
};

export default MyTourPackages;
