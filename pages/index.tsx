import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import CommunityComments from '../libs/components/homepage/CommunityComments';
import PopularTourPackages from '../libs/components/homepage/PopularTourPackages';
import TopAgents from '../libs/components/homepage/TopAgents';
import TrendTourPackages from '../libs/components/homepage/TrendTourPackages';
import TopTourPackages from '../libs/components/homepage/TopTourPackages';
import { Box, Stack } from '@mui/material';
import Advertisement from '../libs/components/homepage/Advertisement';
import TravelInspiration from '../libs/components/homepage/TravelInspiration';
import { getI18nProps, HOME_NAMESPACES } from '../libs/i18n';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import FlightLandRoundedIcon from '@mui/icons-material/FlightLandRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import LuggageRoundedIcon from '@mui/icons-material/LuggageRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import BeachAccessRoundedIcon from '@mui/icons-material/BeachAccessRounded';
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import AnchorRoundedIcon from '@mui/icons-material/AnchorRounded';
import SailingRoundedIcon from '@mui/icons-material/SailingRounded';
import HikingRoundedIcon from '@mui/icons-material/HikingRounded';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await getI18nProps(locale, HOME_NAMESPACES)),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'home-page'}>
				<TrendTourPackages />
				<PopularTourPackages />
				<Advertisement />
				<TopTourPackages />
				<TravelInspiration />
				<TopAgents />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<Box component={'div'} className={'home-bg-icons'} aria-hidden={'true'}>
					<span className={'home-bg-icon plane'}><FlightTakeoffRoundedIcon /></span>
					<span className={'home-bg-icon landing'}><FlightLandRoundedIcon /></span>
					<span className={'home-bg-icon earth'}><PublicRoundedIcon /></span>
					<span className={'home-bg-icon bag'}><LuggageRoundedIcon /></span>
					<span className={'home-bg-icon location'}><LocationOnRoundedIcon /></span>
					<span className={'home-bg-icon compass'}><ExploreRoundedIcon /></span>
					<span className={'home-bg-icon map'}><MapRoundedIcon /></span>
					<span className={'home-bg-icon discover'}><TravelExploreRoundedIcon /></span>
					<span className={'home-bg-icon agent'}><SupportAgentRoundedIcon /></span>
					<span className={'home-bg-icon beach'}><BeachAccessRoundedIcon /></span>
					<span className={'home-bg-icon camera'}><CameraAltRoundedIcon /></span>
					<span className={'home-bg-icon anchor'}><AnchorRoundedIcon /></span>
					<span className={'home-bg-icon sail'}><SailingRoundedIcon /></span>
					<span className={'home-bg-icon hike'}><HikingRoundedIcon /></span>
					<span className={'home-bg-icon sun'}><WbSunnyRoundedIcon /></span>
				</Box>
				<TrendTourPackages />
				<PopularTourPackages />
				<Advertisement />
				<TopTourPackages />
				<TravelInspiration />
				<TopAgents />
				<CommunityComments />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
