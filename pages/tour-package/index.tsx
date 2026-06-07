import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Box, Button, Menu, MenuItem, Pagination, Stack, Typography } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMutation, useQuery } from '@apollo/client';
import PropertyCard from '../../libs/components/property/PropertyCard';
import Filter from '../../libs/components/property/Filter';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { TourPackagesInquiry } from '../../libs/types/tour-package/tour-package.input';
import { TourPackage } from '../../libs/types/tour-package/tour-package';
import { Direction, Message } from '../../libs/enums/common.enum';
import { GET_TOUR_PACKAGES } from '../../apollo/user/query';
import { LIKE_TARGET_TOUR_PACKAGE } from '../../apollo/user/mutation';
import { T } from '../../libs/types/common';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const TourPackageList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [searchFilter, setSearchFilter] = useState<TourPackagesInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [tourPackages, setTourPackages] = useState<TourPackage[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [filterSortName, setFilterSortName] = useState('New');

	const [likeTargetTourPackage] = useMutation(LIKE_TARGET_TOUR_PACKAGE);

	const { refetch: getTourPackagesRefetch } = useQuery(GET_TOUR_PACKAGES, {
		fetchPolicy: 'network-only',
		variables: {
			input: searchFilter,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTourPackages(data?.getTourPackages?.list ?? []);
			setTotal(data?.getTourPackages?.metaCounter?.[0]?.total ?? 0);
		},
	});

	useEffect(() => {
		if (router.query.input) setSearchFilter(JSON.parse(router?.query?.input as string));
		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
		const nextFilter = { ...searchFilter, page: value };
		await router.push(
			`/tour-package?input=${JSON.stringify(nextFilter)}`,
			`/tour-package?input=${JSON.stringify(nextFilter)}`,
			{ scroll: false },
		);
		setCurrentPage(value);
	};

	const likePackageHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetTourPackage({ variables: { input: id } });
			await getTourPackagesRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		const nextFilter = { ...searchFilter };
		switch (e.currentTarget.id) {
			case 'new':
				nextFilter.sort = 'createdAt';
				nextFilter.direction = Direction.DESC;
				setFilterSortName('New');
				break;
			case 'popular':
				nextFilter.sort = 'packageLikes';
				nextFilter.direction = Direction.DESC;
				setFilterSortName('Popular');
				break;
			case 'duration':
				nextFilter.sort = 'durationDays';
				nextFilter.direction = Direction.ASC;
				setFilterSortName('Shortest Duration');
				break;
			case 'lowest':
				nextFilter.sort = 'packagePrice';
				nextFilter.direction = Direction.ASC;
				setFilterSortName('Lowest Price');
				break;
			case 'highest':
				nextFilter.sort = 'packagePrice';
				nextFilter.direction = Direction.DESC;
				setFilterSortName('Highest Price');
				break;
		}
		setSearchFilter(nextFilter);
		setSortingOpen(false);
		setAnchorEl(null);
	};

	if (device === 'mobile') {
		return <h1>TOUR PACKAGES MOBILE</h1>;
	}

	return (
		<div id="property-list-page" style={{ position: 'relative' }}>
			<div className="container">
				<Box component={'div'} className={'right'}>
					<span>Sort by</span>
					<div>
						<Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
							{filterSortName}
						</Button>
						<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
							<MenuItem onClick={sortingHandler} id={'new'} disableRipple>
								New
							</MenuItem>
							<MenuItem onClick={sortingHandler} id={'popular'} disableRipple>
								Popular
							</MenuItem>
							<MenuItem onClick={sortingHandler} id={'duration'} disableRipple>
								Shortest Duration
							</MenuItem>
							<MenuItem onClick={sortingHandler} id={'lowest'} disableRipple>
								Lowest Price
							</MenuItem>
							<MenuItem onClick={sortingHandler} id={'highest'} disableRipple>
								Highest Price
							</MenuItem>
						</Menu>
					</div>
				</Box>
				<Stack className={'property-page'}>
					<Stack className={'filter-config'}>
						<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
					</Stack>
					<Stack className="main-config" mb={'76px'}>
						<Stack className={'list-config'}>
							{tourPackages?.length === 0 ? (
								<div className={'no-data'}>
									<img src="/img/icons/icoAlert.svg" alt="" />
									<p>No packages found!</p>
								</div>
							) : (
								tourPackages.map((tourPackage: TourPackage) => (
									<PropertyCard
										property={tourPackage}
										likePropertyHandler={likePackageHandler}
										key={tourPackage?._id}
									/>
								))
							)}
						</Stack>
						<Stack className="pagination-config">
							{tourPackages.length !== 0 && (
								<Stack className="pagination-box">
									<Pagination
										page={currentPage}
										count={Math.ceil(total / searchFilter.limit)}
										onChange={handlePaginationChange}
										shape="circular"
										color="primary"
									/>
								</Stack>
							)}

							{tourPackages.length !== 0 && (
								<Stack className="total-result">
									<Typography>Total {total} package{total > 1 ? 's' : ''} available</Typography>
								</Stack>
							)}
						</Stack>
					</Stack>
				</Stack>
			</div>
		</div>
	);
};

TourPackageList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			pricesRange: {
				start: 0,
				end: 2000000,
			},
		},
	},
};

export default withLayoutBasic(TourPackageList);
