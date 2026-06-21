import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Box, Button, Menu, MenuItem, Pagination, Stack, Typography } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMutation, useQuery } from '@apollo/client';
import TourPackageCard from '../../libs/components/tourPackage/TourPackageCard';
import Filter from '../../libs/components/tourPackage/Filter';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { TourPackagesInquiry } from '../../libs/types/tour-package/tour-package.input';
import { TourPackage } from '../../libs/types/tour-package/tour-package';
import { Direction, Message } from '../../libs/enums/common.enum';
import { GET_TOUR_PACKAGES } from '../../apollo/user/query';
import { LIKE_TARGET_TOUR_PACKAGE } from '../../apollo/user/mutation';
import { T } from '../../libs/types/common';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';

const PACKAGE_LIST_LIMIT = 3;

const normalizePackageListInput = (input: TourPackagesInquiry): TourPackagesInquiry => ({
	...input,
	page: input?.page && input.page > 0 ? input.page : 1,
	limit: PACKAGE_LIST_LIMIT,
	search: input?.search ?? {},
});

const parsePackageListInput = (input: string | string[] | undefined, fallback: TourPackagesInquiry): TourPackagesInquiry => {
	if (typeof input !== 'string') return normalizePackageListInput(fallback);

	try {
		return normalizePackageListInput(JSON.parse(input));
	} catch (err) {
		return normalizePackageListInput(fallback);
	}
};

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const TourPackageList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [searchFilter, setSearchFilter] = useState<TourPackagesInquiry>(
		parsePackageListInput(router?.query?.input, initialInput),
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
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTourPackages(data?.getTourPackages?.list ?? []);
			setTotal(data?.getTourPackages?.metaCounter?.[0]?.total ?? 0);
		},
	});

	useEffect(() => {
		const nextFilter = parsePackageListInput(router.query.input, initialInput);
		setSearchFilter(nextFilter);
		setCurrentPage(nextFilter.page);
	}, [router.query.input, initialInput]);

	const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
		const nextFilter = normalizePackageListInput({ ...searchFilter, page: value });
		setSearchFilter(nextFilter);
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
		const nextFilter = normalizePackageListInput({ ...searchFilter, page: 1 });
		switch (e.currentTarget.id) {
			case 'featured':
				nextFilter.sort = 'packageLikes';
				nextFilter.direction = Direction.DESC;
				setFilterSortName('Featured');
				break;
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
		router.push(
			`/tour-package?input=${JSON.stringify(nextFilter)}`,
			`/tour-package?input=${JSON.stringify(nextFilter)}`,
			{ scroll: false },
		);
		setSortingOpen(false);
		setAnchorEl(null);
	};

	if (device === 'mobile') {
		return <h1>TOUR PACKAGES MOBILE</h1>;
	}

	return (
		<div id="tour-package-list-page">
			<div className="container">
				<Stack direction="row" className="tour-package-page">
					{/* Sidebar */}
					<Stack className="filter-config">
						<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
					</Stack>

					{/* Main content */}
					<Stack className="main-config" mb={'76px'}>
						{/* Results + sort bar */}
						<Stack direction="row" className="results-bar">
							<Typography className="results-count">
								{total.toLocaleString()} result{total !== 1 ? 's' : ''}
							</Typography>
							<Box component="div" className="sort-box">
								<Button
									className="sort-btn"
									onClick={sortingClickHandler}
									endIcon={<KeyboardArrowDownRoundedIcon />}
									disableRipple
								>
									Sort by: {filterSortName}
								</Button>
								<Menu
									anchorEl={anchorEl}
									open={sortingOpen}
									onClose={sortingCloseHandler}
									sx={{ paddingTop: '5px' }}
								>
									<MenuItem onClick={sortingHandler} id="featured" disableRipple>
										Featured
									</MenuItem>
									<MenuItem onClick={sortingHandler} id="new" disableRipple>
										New
									</MenuItem>
									<MenuItem onClick={sortingHandler} id="popular" disableRipple>
										Popular
									</MenuItem>
									<MenuItem onClick={sortingHandler} id="duration" disableRipple>
										Shortest Duration
									</MenuItem>
									<MenuItem onClick={sortingHandler} id="lowest" disableRipple>
										Lowest Price
									</MenuItem>
									<MenuItem onClick={sortingHandler} id="highest" disableRipple>
										Highest Price
									</MenuItem>
								</Menu>
							</Box>
						</Stack>

						{/* Card list */}
						<Stack className="list-config">
							{tourPackages?.length === 0 ? (
								<Box
									component="div"
									className="empty-state-wrap"
									display="flex"
									justifyContent="center"
									alignItems="center"
									minHeight="600px"
									width="100%"
								>
									<Box component="div" className="no-data">
										<img src="/img/icons/icoAlert.svg" alt="" />
										<p>No packages found!</p>
									</Box>
								</Box>
							) : (
								tourPackages.slice(0, PACKAGE_LIST_LIMIT).map((tourPackage: TourPackage) => (
									<TourPackageCard
										tourPackage={tourPackage}
										likeTourPackageHandler={likePackageHandler}
										key={tourPackage?._id}
									/>
								))
							)}
						</Stack>

						{/* Pagination — only when there is more than one page */}
						{Math.ceil(total / PACKAGE_LIST_LIMIT) > 1 && (
							<Stack className="pagination-config">
								<Stack className="pagination-box">
									<Pagination
										page={currentPage}
										count={Math.ceil(total / PACKAGE_LIST_LIMIT)}
										onChange={handlePaginationChange}
										shape="circular"
										color="primary"
									/>
								</Stack>
								<Stack className="total-result">
									<Typography>
										Total {total} package{total > 1 ? 's' : ''} available
									</Typography>
								</Stack>
							</Stack>
						)}
					</Stack>
				</Stack>
			</div>
		</div>
	);
};

TourPackageList.defaultProps = {
	initialInput: {
		page: 1,
		limit: PACKAGE_LIST_LIMIT,
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
