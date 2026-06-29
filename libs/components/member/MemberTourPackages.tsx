import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography, Box } from '@mui/material';
import TourPackageCard from '../tourPackage/TourPackageCard';
import { TourPackage } from '../../types/tour-package/tour-package';
import { TourPackagesInquiry } from '../../types/tour-package/tour-package.input';
import { T } from '../../types/common';
import { useRouter } from 'next/router';
import { GET_TOUR_PACKAGES } from '../../../apollo/user/query';
import { LIKE_TARGET_TOUR_PACKAGE } from '../../../apollo/user/mutation';
import { useMutation, useQuery } from '@apollo/client';
import { sweetMixinErrorAlert } from '../../sweetAlert';
import LuggageRoundedIcon from '@mui/icons-material/LuggageRounded';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';

const MemberTourPackages: NextPage = ({ initialInput, ...props }: any) => {
	const router = useRouter();
	const { memberId } = router.query;
	const [searchFilter, setSearchFilter] = useState<TourPackagesInquiry>({ ...initialInput });
	const [agentTourPackages, setAgentTourPackages] = useState<TourPackage[]>([]);
	const [total, setTotal] = useState<number>(0);

	/** APOLLO REQUESTS **/
	const [likeTargetTourPackage] = useMutation(LIKE_TARGET_TOUR_PACKAGE);

	const {
		refetch: getTourPackagesRefetch,
	} = useQuery(GET_TOUR_PACKAGES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		skip: !searchFilter?.search?.memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentTourPackages(data?.getTourPackages?.list);
			setTotal(data?.getTourPackages?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getTourPackagesRefetch().then();
	}, [searchFilter]);

	useEffect(() => {
		if (memberId)
			setSearchFilter({ ...initialInput, search: { ...initialInput.search, memberId: memberId as string } });
	}, [memberId]);

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const likeTourPackageHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			await likeTargetTourPackage({ variables: { input: id } });
			await getTourPackagesRefetch({ input: searchFilter });
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	return (
		<div id="member-tour-packages-page">
			<Stack className="main-title-box">
				<Stack className="right-box">
					<Stack className="title-kicker">
						<LuggageRoundedIcon />
						<Typography>Tour Packages</Typography>
					</Stack>
					<Typography className="main-title">Packages</Typography>
					<Typography className="sub-title">Browse all tour packages from this member</Typography>
				</Stack>
				<Stack className="saved-summary-panel">
					<Box className="summary-icon">
						<TravelExploreRoundedIcon />
					</Box>
					<Stack className="summary-copy">
						<Typography className="summary-value">{total}</Typography>
						<Typography className="summary-label">Total Packages</Typography>
					</Stack>
				</Stack>
			</Stack>

			<Stack className="favorites-list-box">
				{agentTourPackages?.length > 0 ? (
					agentTourPackages.map((tourPackage: TourPackage) => (
						<TourPackageCard
							tourPackage={tourPackage}
							likeTourPackageHandler={likeTourPackageHandler}
							key={tourPackage._id}
						/>
					))
				) : (
					<div className="no-data">
						<FavoriteRoundedIcon className="empty-icon" />
						<strong>No packages yet</strong>
						<p>This member hasn&apos;t published any tour packages.</p>
					</div>
				)}
			</Stack>

			{agentTourPackages.length > 0 && (
				<Stack className="pagination-config">
					<Stack className="pagination-box">
						<Pagination
							count={Math.ceil(total / searchFilter.limit) || 1}
							page={searchFilter.page}
							shape="circular"
							color="primary"
							onChange={paginationHandler}
						/>
					</Stack>
					<Stack className="total-result">
						<Typography>{total} package{total !== 1 ? 's' : ''} available</Typography>
					</Stack>
				</Stack>
			)}
		</div>
	);
};

MemberTourPackages.defaultProps = {
	initialInput: {
		page: 1,
		limit: 4,
		sort: 'createdAt',
		search: { memberId: '' },
	},
};

export default MemberTourPackages;
