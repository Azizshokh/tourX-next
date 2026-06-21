import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, List, ListItem, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import TablePagination from '@mui/material/TablePagination';
import { TourPackagePanelList } from '../../../libs/components/admin/tourPackages/TourPackageList';
import { AllTourPackagesInquiry } from '../../../libs/types/tour-package/tour-package.input';
import { TourPackage } from '../../../libs/types/tour-package/tour-package';
import { PackageStatus } from '../../../libs/enums/package.enum';
import { packageCountries } from '../../../libs/config';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { TourPackageUpdate } from '../../../libs/types/tour-package/tour-package.update';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_TOUR_PACKAGES_BY_ADMIN } from '../../../apollo/admin/query';
import { REMOVE_TOUR_PACKAGE_BY_ADMIN, UPDATE_TOUR_PACKAGE_BY_ADMIN } from '../../../apollo/admin/mutation';
import { T } from '../../../libs/types/common';

const AdminTourPackages: NextPage = ({ initialInquiry }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [tourPackagesInquiry, setTourPackagesInquiry] = useState<AllTourPackagesInquiry>(initialInquiry);
	const [packages, setPackages] = useState<TourPackage[]>([]);
	const [packagesTotal, setPackagesTotal] = useState<number>(0);
	const [value, setValue] = useState(tourPackagesInquiry?.search?.packageStatus ?? 'ALL');
	const [searchCountry, setSearchCountry] = useState('ALL');

	/** APOLLO REQUESTS **/
	const [updateTourPackageByAdmin] = useMutation(UPDATE_TOUR_PACKAGE_BY_ADMIN);
	const [removeTourPackageByAdmin] = useMutation(REMOVE_TOUR_PACKAGE_BY_ADMIN);

	const { refetch: getAllTourPackagesByAdminRefetch } = useQuery(GET_ALL_TOUR_PACKAGES_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: tourPackagesInquiry },
		notifyOnNetworkStatusChange: true,

		onCompleted: (data: T) => {
			setPackages(data?.getAllTourPackagesByAdmin?.list ?? []);
			setPackagesTotal(data?.getAllTourPackagesByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getAllTourPackagesByAdminRefetch({ input: tourPackagesInquiry }).then();
	}, [tourPackagesInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		setTourPackagesInquiry({ ...tourPackagesInquiry, page: newPage + 1 });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		setTourPackagesInquiry({ ...tourPackagesInquiry, limit: parseInt(event.target.value, 10), page: 1 });
	};

	const menuIconClickHandler = (e: any, index: number) => {
		const tempAnchor = anchorEl.slice();
		tempAnchor[index] = e.currentTarget;
		setAnchorEl(tempAnchor);
	};

	const menuIconCloseHandler = () => {
		setAnchorEl([]);
	};

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);

		if (newValue === 'ALL') {
			const { packageStatus, ...search } = tourPackagesInquiry.search ?? {};
			setTourPackagesInquiry({ ...tourPackagesInquiry, page: 1, sort: 'createdAt', search });
			return;
		}

		setTourPackagesInquiry({
			...tourPackagesInquiry,
			page: 1,
			sort: 'createdAt',
			search: {
				...tourPackagesInquiry.search,
				packageStatus: newValue as PackageStatus,
			},
		});
	};

	const removePackageHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to remove this package?')) {
				await removeTourPackageByAdmin({
					variables: {
						input: id,
					},
				});

				await getAllTourPackagesByAdminRefetch({ input: tourPackagesInquiry });
			}
			menuIconCloseHandler();
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const searchCountryHandler = async (newValue: string) => {
		setSearchCountry(newValue);

		if (newValue === 'ALL') {
			const { packageCountryList, ...search } = tourPackagesInquiry.search ?? {};
			setTourPackagesInquiry({ ...tourPackagesInquiry, page: 1, sort: 'createdAt', search });
			return;
		}

		setTourPackagesInquiry({
			...tourPackagesInquiry,
			page: 1,
			sort: 'createdAt',
			search: {
				...tourPackagesInquiry.search,
				packageCountryList: [newValue],
			},
		});
	};

	const updateTourPackageHandler = async (updateData: TourPackageUpdate) => {
		try {
			await updateTourPackageByAdmin({
				variables: {
					input: updateData,
				},
			});
			menuIconCloseHandler();
			await getAllTourPackagesByAdminRefetch({ input: tourPackagesInquiry });
		} catch (err: any) {
			menuIconCloseHandler();
			sweetErrorHandling(err).then();
		}
	};

	return (
		<Box component={'div'} className={'content'}>
			<Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
				Package List
			</Typography>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={value}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								<ListItem
									onClick={(e) => tabChangeHandler(e, 'ALL')}
									value="ALL"
									className={value === 'ALL' ? 'li on' : 'li'}
								>
									All
								</ListItem>
								<ListItem
									onClick={(e) => tabChangeHandler(e, PackageStatus.ACTIVE)}
									value={PackageStatus.ACTIVE}
									className={value === PackageStatus.ACTIVE ? 'li on' : 'li'}
								>
									Active
								</ListItem>
								<ListItem
									onClick={(e) => tabChangeHandler(e, PackageStatus.CLOSED)}
									value={PackageStatus.CLOSED}
									className={value === PackageStatus.CLOSED ? 'li on' : 'li'}
								>
									Closed
								</ListItem>
								<ListItem
									onClick={(e) => tabChangeHandler(e, PackageStatus.DELETE)}
									value={PackageStatus.DELETE}
									className={value === PackageStatus.DELETE ? 'li on' : 'li'}
								>
									Delete
								</ListItem>
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<Select sx={{ width: '180px', mr: '20px' }} value={searchCountry}>
									<MenuItem value={'ALL'} onClick={() => searchCountryHandler('ALL')}>
										ALL COUNTRIES
									</MenuItem>
									{packageCountries.map((country) => (
										<MenuItem value={country} onClick={() => searchCountryHandler(country)} key={country}>
											{country}
										</MenuItem>
									))}
								</Select>
							</Stack>
							<Divider />
						</Box>
						<TourPackagePanelList
							packages={packages}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateTourPackageHandler={updateTourPackageHandler}
							removePackageHandler={removePackageHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={packagesTotal}
							rowsPerPage={tourPackagesInquiry?.limit}
							page={tourPackagesInquiry?.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

AdminTourPackages.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withAdminLayout(AdminTourPackages);
