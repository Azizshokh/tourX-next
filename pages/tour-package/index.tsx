import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Box, Button, Menu, MenuItem, Pagination, Stack, Typography } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import LuggageRoundedIcon from '@mui/icons-material/LuggageRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import BeachAccessRoundedIcon from '@mui/icons-material/BeachAccessRounded';
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import AnchorRoundedIcon from '@mui/icons-material/AnchorRounded';
import SailingRoundedIcon from '@mui/icons-material/SailingRounded';
import HotelRoundedIcon from '@mui/icons-material/HotelRounded';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import HikingRoundedIcon from '@mui/icons-material/HikingRounded';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useMutation, useQuery } from '@apollo/client';
import TourPackageCard from '../../libs/components/tourPackage/TourPackageCard';
import Filter from '../../libs/components/tourPackage/Filter';
import AnimatedSection from '../../libs/components/animation/AnimatedSection';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { TourPackagesInquiry } from '../../libs/types/tour-package/tour-package.input';
import { TourPackage } from '../../libs/types/tour-package/tour-package';
import { Direction, Message } from '../../libs/enums/common.enum';
import { GET_TOUR_PACKAGES } from '../../apollo/user/query';
import { LIKE_TARGET_TOUR_PACKAGE } from '../../apollo/user/mutation';
import { T } from '../../libs/types/common';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { getI18nProps, PACKAGE_NAMESPACES } from '../../libs/i18n';
import {
	cleanTourPackageInquiry,
	parseTourPackageInquiryFromQuery,
	tourPackageSearchUrl,
	tourPackageInquiryUrl,
} from '../../libs/utils/tourPackageFilter';

const PACKAGE_LIST_LIMIT = 3;

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await getI18nProps(locale, PACKAGE_NAMESPACES)),
	},
});

const TourPackageList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { t } = useTranslation(['common', 'package']);
	const [searchFilter, setSearchFilter] = useState<TourPackagesInquiry>(
		parseTourPackageInquiryFromQuery(router?.query?.input, router?.query?.search, router?.query?.page, initialInput, PACKAGE_LIST_LIMIT),
	);
	const [tourPackages, setTourPackages] = useState<TourPackage[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [filterSortName, setFilterSortName] = useState('sort.new');

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
		const nextFilter = parseTourPackageInquiryFromQuery(
			router.query.input,
			router.query.search,
			router.query.page,
			initialInput,
			PACKAGE_LIST_LIMIT,
		);
		setSearchFilter(nextFilter);
		setCurrentPage(nextFilter.page);
	}, [router.query.input, router.query.search, router.query.page, initialInput]);

	const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
		const nextFilter = cleanTourPackageInquiry({ ...searchFilter, page: value }, PACKAGE_LIST_LIMIT);
		setSearchFilter(nextFilter);
		const url =
			typeof router.query.search === 'string' && router.query.search.trim()
				? tourPackageSearchUrl(router.query.search, value)
				: tourPackageInquiryUrl(nextFilter);
		await router.push(url, url, { scroll: false });
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
		const nextFilter = cleanTourPackageInquiry({ ...searchFilter, page: 1 }, PACKAGE_LIST_LIMIT);
		switch (e.currentTarget.id) {
			case 'featured':
				nextFilter.sort = 'packageLikes';
				nextFilter.direction = Direction.DESC;
				setFilterSortName('sort.featured');
				break;
			case 'new':
				nextFilter.sort = 'createdAt';
				nextFilter.direction = Direction.DESC;
				setFilterSortName('sort.new');
				break;
			case 'popular':
				nextFilter.sort = 'packageLikes';
				nextFilter.direction = Direction.DESC;
				setFilterSortName('sort.popular');
				break;
			case 'duration':
				nextFilter.sort = 'durationDays';
				nextFilter.direction = Direction.ASC;
				setFilterSortName('sort.shortestDuration');
				break;
			case 'lowest':
				nextFilter.sort = 'packagePrice';
				nextFilter.direction = Direction.ASC;
				setFilterSortName('sort.lowestPrice');
				break;
			case 'highest':
				nextFilter.sort = 'packagePrice';
				nextFilter.direction = Direction.DESC;
				setFilterSortName('sort.highestPrice');
				break;
		}
		setSearchFilter(nextFilter);
		const url = tourPackageInquiryUrl(nextFilter);
		router.push(url, url, { scroll: false });
		setSortingOpen(false);
		setAnchorEl(null);
	};

	if (device === 'mobile') {
		return <h1>{t('mobile.packages')}</h1>;
	}

	return (
		<div id="tour-package-list-page">
			<Box component="div" className="tour-list-bg-icons" aria-hidden="true">
				<span className="tour-list-bg-icon plane">
					<FlightTakeoffRoundedIcon />
				</span>
				<span className="tour-list-bg-icon earth">
					<PublicRoundedIcon />
				</span>
				<span className="tour-list-bg-icon bag">
					<LuggageRoundedIcon />
				</span>
				<span className="tour-list-bg-icon location">
					<LocationOnRoundedIcon />
				</span>
				<span className="tour-list-bg-icon compass">
					<ExploreRoundedIcon />
				</span>
				<span className="tour-list-bg-icon map">
					<MapRoundedIcon />
				</span>
				<span className="tour-list-bg-icon agent">
					<SupportAgentRoundedIcon />
				</span>
				<span className="tour-list-bg-icon beach">
					<BeachAccessRoundedIcon />
				</span>
				<span className="tour-list-bg-icon camera">
					<CameraAltRoundedIcon />
				</span>
				<span className="tour-list-bg-icon anchor">
					<AnchorRoundedIcon />
				</span>
				<span className="tour-list-bg-icon sail">
					<SailingRoundedIcon />
				</span>
				<span className="tour-list-bg-icon hotel">
					<HotelRoundedIcon />
				</span>
				<span className="tour-list-bg-icon sun">
					<WbSunnyRoundedIcon />
				</span>
				<span className="tour-list-bg-icon discover">
					<TravelExploreRoundedIcon />
				</span>
				<span className="tour-list-bg-icon hike">
					<HikingRoundedIcon />
				</span>
			</Box>
			<div className="container">
				<Stack direction="row" className="tour-package-page">
					{/* Sidebar */}
					<AnimatedSection>
						<Stack className="filter-config">
							<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
						</Stack>
					</AnimatedSection>

					{/* Main content */}
					<Stack className="main-config" mb={'76px'}>
						{/* Results + sort bar */}
						<AnimatedSection><Stack direction="row" className="results-bar">
							<Typography className="results-count">
								{t('package:list.results', { count: total })}
							</Typography>
							<Box component="div" className="sort-box">
								<Button
									className="sort-btn"
									onClick={sortingClickHandler}
									endIcon={<KeyboardArrowDownRoundedIcon />}
									disableRipple
								>
									{t('package:list.sortBy', { sort: t(filterSortName) })}
								</Button>
								<Menu
									anchorEl={anchorEl}
									open={sortingOpen}
									onClose={sortingCloseHandler}
									sx={{ paddingTop: '5px' }}
								>
									<MenuItem onClick={sortingHandler} id="featured" disableRipple>
										{t('sort.featured')}
									</MenuItem>
									<MenuItem onClick={sortingHandler} id="new" disableRipple>
										{t('sort.new')}
									</MenuItem>
									<MenuItem onClick={sortingHandler} id="popular" disableRipple>
										{t('sort.popular')}
									</MenuItem>
									<MenuItem onClick={sortingHandler} id="duration" disableRipple>
										{t('sort.shortestDuration')}
									</MenuItem>
									<MenuItem onClick={sortingHandler} id="lowest" disableRipple>
										{t('sort.lowestPrice')}
									</MenuItem>
									<MenuItem onClick={sortingHandler} id="highest" disableRipple>
										{t('sort.highestPrice')}
									</MenuItem>
								</Menu>
							</Box>
						</Stack></AnimatedSection>

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
										<p>{t('empty.noPackages')}</p>
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
										{t('package:list.total', { count: total })}
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
