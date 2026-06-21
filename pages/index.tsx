import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import PopularTourPackages from '../libs/components/homepage/PopularTourPackages';
import TopAgents from '../libs/components/homepage/TopAgents';
import TrendTourPackages from '../libs/components/homepage/TrendTourPackages';
import TopTourPackages from '../libs/components/homepage/TopTourPackages';
import { Stack } from '@mui/material';
import Advertisement from '../libs/components/homepage/Advertisement';
import TravelInspiration from '../libs/components/homepage/TravelInspiration';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
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
				<TrendTourPackages />
				<PopularTourPackages />
				<Advertisement />
				<TopTourPackages />
				<TravelInspiration />
				<TopAgents />
				<CommunityBoards />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
