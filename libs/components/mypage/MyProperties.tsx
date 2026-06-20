import React, { useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { PropertyCard } from './PropertyCard';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { TourPackage as Property } from '../../types/tour-package/tour-package';
import { AgentTourPackagesInquiry } from '../../types/tour-package/tour-package.input';
import { T } from '../../types/common';
import { PackageStatus } from '../../enums/package.enum';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { GET_AGENT_TOUR_PACKAGES } from '../../../apollo/user/query';
import { UPDATE_TOUR_PACKAGE } from '../../../apollo/user/mutation';
import { sweetConfirmAlert, sweetErrorHandling } from '../../sweetAlert';

const MyProperties: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const [searchFilter, setSearchFilter] = useState<AgentTourPackagesInquiry>(initialInput);
	const [agentProperties, setAgentProperties] = useState<Property[]>([]);
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
			setAgentProperties(data?.getAgentTourPackages?.list);
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

	const deletePropertyHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to delete this package?')) {
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
			if (await sweetConfirmAlert(`Are you sure change to ${status} status?`)) {
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
		return <div>MY PACKAGES MOBILE</div>;
	} else {
		return (
			<div id="my-property-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Stack className="title-kicker">
							<Inventory2RoundedIcon />
							<Typography>Travel agent inventory</Typography>
						</Stack>
						<Typography className="main-title">My Packages</Typography>
						<Typography className="sub-title">Manage live experiences, close unavailable trips, and keep your TourX catalog polished.</Typography>
					</Stack>
					<Stack className="summary-box">
						<PublicRoundedIcon />
						<Stack>
							<Typography className="summary-value">{total}</Typography>
							<Typography className="summary-label">
								{searchFilter.search.packageStatus === PackageStatus.ACTIVE ? 'active packages' : 'closed packages'}
							</Typography>
						</Stack>
					</Stack>
				</Stack>
				<Stack className="property-list-box">
					<Stack className="tab-name-box">
						<Stack
							onClick={() => changeStatusHandler(PackageStatus.ACTIVE)}
							className={searchFilter.search.packageStatus === PackageStatus.ACTIVE ? 'active-tab-name' : 'tab-name'}
						>
							<CheckCircleRoundedIcon />
							<Stack>
								<Typography className="tab-label">Active</Typography>
								<Typography className="tab-helper">Visible to travelers</Typography>
							</Stack>
						</Stack>
						<Stack
							onClick={() => changeStatusHandler(PackageStatus.CLOSED)}
							className={searchFilter.search.packageStatus === PackageStatus.CLOSED ? 'active-tab-name' : 'tab-name'}
						>
							<ArchiveRoundedIcon />
							<Stack>
								<Typography className="tab-label">Closed</Typography>
								<Typography className="tab-helper">Paused or unavailable</Typography>
							</Stack>
						</Stack>
					</Stack>
					<Stack className="list-box">
						<Stack className="listing-title-box">
							<Typography className="title-text">Listing title</Typography>
							<Typography className="title-text">Date Published</Typography>
							<Typography className="title-text">Status</Typography>
							<Typography className="title-text">View</Typography>
							{searchFilter.search.packageStatus === PackageStatus.ACTIVE && (
								<Typography className="title-text">Action</Typography>
							)}
						</Stack>

						{agentProperties?.length === 0 ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No package found!</p>
							</div>
						) : (
							agentProperties.map((property: Property) => {
								return (
									<PropertyCard
										property={property}
										deletePropertyHandler={deletePropertyHandler}
										updateTourPackageHandler={updateTourPackageHandler}
									/>
								);
							})
						)}

						{agentProperties.length !== 0 && (
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
									<Typography>{total} package available</Typography>
								</Stack>
							</Stack>
						)}
					</Stack>
				</Stack>
			</div>
		);
	}
};

MyProperties.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		search: {
			packageStatus: PackageStatus.ACTIVE,
		},
	},
};

export default MyProperties;
