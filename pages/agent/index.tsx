import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box, Button, Pagination } from '@mui/material';
import { Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import LuggageRoundedIcon from '@mui/icons-material/LuggageRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import BeachAccessRoundedIcon from '@mui/icons-material/BeachAccessRounded';
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import AnchorRoundedIcon from '@mui/icons-material/AnchorRounded';
import SailingRoundedIcon from '@mui/icons-material/SailingRounded';
import HotelRoundedIcon from '@mui/icons-material/HotelRounded';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import HikingRoundedIcon from '@mui/icons-material/HikingRounded';
import AgentCard from '../../libs/components/common/AgentCard';
import AnimatedSection from '../../libs/components/animation/AnimatedSection';
import { useRouter } from 'next/router';
import { getI18nProps, AGENT_NAMESPACES } from '../../libs/i18n';
import { useTranslation } from 'next-i18next';
import { Member } from '../../libs/types/member/member';
import { useMutation, useQuery } from '@apollo/client';
import { GET_AGENTS } from '../../apollo/user/query';
import { LIKE_TARGET_MEMBER } from '../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { Messages } from '../../libs/config';
import { T } from '../../libs/types/common';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await getI18nProps(locale, AGENT_NAMESPACES)),
	},
});

const AgentList: NextPage = ({ initialInput, ...props }: any) => {
	const router = useRouter();
	const { t } = useTranslation(['common', 'agent']);
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [filterSortName, setFilterSortName] = useState('sort.recent');
	const [sortingOpen, setSortingOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [searchFilter, setSearchFilter] = useState<any>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [agents, setAgents] = useState<Member[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [searchText, setSearchText] = useState<string>('');

	/** APOLLO REQUESTS **/
	/** APOLLO REQUESTS **/
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

	const {
		loading: getAgentsLoading,
		data: getAgentsData,
		error: getAgentsError,
		refetch: getAgentsRefetch,
	} = useQuery(GET_AGENTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,

		onCompleted: (data: T) => {
			setAgents(data?.getAgents?.list);
			setTotal(data?.getAgents?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const input_obj = JSON.parse(router?.query?.input as string);
			setSearchFilter(input_obj);
		} else
			router.replace(`/agent?input=${JSON.stringify(searchFilter)}`, `/agent?input=${JSON.stringify(searchFilter)}`);

		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	/** HANDLERS **/
	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		switch (e.currentTarget.id) {
			case 'recent':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: 'DESC' });
				setFilterSortName('sort.recent');
				break;
			case 'old':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: 'ASC' });
				setFilterSortName('sort.oldest');
				break;
			case 'likes':
				setSearchFilter({ ...searchFilter, sort: 'memberLikes', direction: 'DESC' });
				setFilterSortName('sort.likes');
				break;
			case 'views':
				setSearchFilter({ ...searchFilter, sort: 'memberViews', direction: 'DESC' });
				setFilterSortName('sort.views');
				break;
		}
		setSortingOpen(false);
		setAnchorEl2(null);
	};

	const paginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		await router.push(`/agent?input=${JSON.stringify(searchFilter)}`, `/agent?input=${JSON.stringify(searchFilter)}`, {
			scroll: false,
		});
		setCurrentPage(value);
	};

	const likeMemberHandler = async (user: any, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			await likeTargetMember({
				variables: {
					input: id,
				},
			});

			await getAgentsRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.error('ERROR, likeMemberHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	return (
		<Stack className={'agent-list-page'}>
			<Box component={'div'} className={'agent-page-bg-icons'} aria-hidden={'true'}>
				<span className={'agent-page-bg-icon plane'}>
					<FlightTakeoffRoundedIcon />
				</span>
				<span className={'agent-page-bg-icon earth'}>
					<PublicRoundedIcon />
				</span>
				<span className={'agent-page-bg-icon bag'}>
					<LuggageRoundedIcon />
				</span>
				<span className={'agent-page-bg-icon location'}>
					<LocationOnRoundedIcon />
				</span>
				<span className={'agent-page-bg-icon agent'}>
					<SupportAgentRoundedIcon />
				</span>
				<span className={'agent-page-bg-icon discover'}>
					<TravelExploreRoundedIcon />
				</span>
				<span className={'agent-page-bg-icon compass'}>
					<ExploreRoundedIcon />
				</span>
				<span className={'agent-page-bg-icon map'}>
					<MapRoundedIcon />
				</span>
				<span className={'agent-page-bg-icon beach'}>
					<BeachAccessRoundedIcon />
				</span>
				<span className={'agent-page-bg-icon camera'}>
					<CameraAltRoundedIcon />
				</span>
				<span className={'agent-page-bg-icon anchor'}>
					<AnchorRoundedIcon />
				</span>
				<span className={'agent-page-bg-icon sail'}>
					<SailingRoundedIcon />
				</span>
				<span className={'agent-page-bg-icon hotel'}>
					<HotelRoundedIcon />
				</span>
				<span className={'agent-page-bg-icon sun'}>
					<WbSunnyRoundedIcon />
				</span>
				<span className={'agent-page-bg-icon hike'}>
					<HikingRoundedIcon />
				</span>
			</Box>
			<Stack className={'container'}>
				<AnimatedSection><Stack className={'filter'}>
					<Box component={'div'} className={'left'}>
						<input
							type="text"
							placeholder={t('agent:searchPlaceholder')}
							value={searchText}
							onChange={(e: any) => setSearchText(e.target.value)}
							onKeyDown={(event: any) => {
								if (event.key == 'Enter') {
									setSearchFilter({
										...searchFilter,
										search: { ...searchFilter.search, text: searchText },
									});
								}
							}}
						/>
					</Box>
					<Box component={'div'} className={'right'}>
						<span>{t('agent:sortBy')}</span>
						<div>
							<Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
								{t(filterSortName)}
							</Button>
							<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
								<MenuItem onClick={sortingHandler} id={'recent'} disableRipple>
									{t('sort.recent')}
								</MenuItem>
								<MenuItem onClick={sortingHandler} id={'old'} disableRipple>
									{t('sort.oldest')}
								</MenuItem>
								<MenuItem onClick={sortingHandler} id={'likes'} disableRipple>
									{t('sort.likes')}
								</MenuItem>
								<MenuItem onClick={sortingHandler} id={'views'} disableRipple>
									{t('sort.views')}
								</MenuItem>
							</Menu>
						</div>
					</Box>
				</Stack></AnimatedSection>
				<Stack className={'card-wrap'}>
					{agents?.length === 0 ? (
						<div className={'no-data'}>
							<img src="/img/icons/icoAlert.svg" alt="" />
							<p>{t('common:empty.noAgents')}</p>
						</div>
					) : (
						agents.map((agent: Member) => {
							return <AgentCard agent={agent} key={agent._id} likeAgentHandler={likeMemberHandler} />;
						})
					)}
				</Stack>
				<AnimatedSection><Stack className={'pagination'}>
					<Stack className="pagination-box">
						{agents.length !== 0 && Math.ceil(total / searchFilter.limit) > 1 && (
							<Stack className="pagination-box">
								<Pagination
									page={currentPage}
									count={Math.ceil(total / searchFilter.limit)}
									onChange={paginationChangeHandler}
									shape="circular"
									color="primary"
								/>
							</Stack>
						)}
					</Stack>

					{agents.length !== 0 && (
						<span>
							{t('agent:total', { count: total })}
						</span>
					)}
				</Stack></AnimatedSection>
			</Stack>
		</Stack>
	);
};

AgentList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 1,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withLayoutBasic(AgentList);
