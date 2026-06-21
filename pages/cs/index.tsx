import React from 'react';
import { NextPage } from 'next';
import { Box, Stack, Typography } from '@mui/material';
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import LuggageRoundedIcon from '@mui/icons-material/LuggageRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import BeachAccessRoundedIcon from '@mui/icons-material/BeachAccessRounded';
import AnchorRoundedIcon from '@mui/icons-material/AnchorRounded';
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import SailingRoundedIcon from '@mui/icons-material/SailingRounded';
import HotelRoundedIcon from '@mui/icons-material/HotelRounded';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import HikingRoundedIcon from '@mui/icons-material/HikingRounded';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Faq from '../../libs/components/cs/Faq';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const popularTopics = [
	{
		title: 'Booking Help',
		description: 'Modify, cancel, or confirm your travel bookings.',
		Icon: ConfirmationNumberRoundedIcon,
	},
	{
		title: 'Payments & Refunds',
		description: 'Payment methods, invoices and refund status.',
		Icon: PaymentsRoundedIcon,
	},
	{
		title: 'Tour Packages',
		description: 'Details on itineraries and included activities.',
		Icon: TravelExploreRoundedIcon,
	},
	{
		title: 'Travel Agencies',
		description: 'Connect with certified local travel partners.',
		Icon: SupportAgentRoundedIcon,
	},
	{
		title: 'Account & Profile',
		description: 'Update security, settings, and travel history.',
		Icon: AccountCircleRoundedIcon,
	},
	{
		title: 'Travel Documents',
		description: 'Vouchers, insurance, and confirmation slips.',
		Icon: ArticleRoundedIcon,
	},
	{
		title: 'Visa Information',
		description: 'Global entry requirements and visa assistance.',
		Icon: MoreHorizRoundedIcon,
	},
	{
		title: 'Travel Safety',
		description: 'Security protocols and emergency guidelines.',
		Icon: SecurityRoundedIcon,
	},
];

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CS: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <h1>CS PAGE MOBILE</h1>;
	}

	return (
		<Stack className={'cs-page'}>
			<Box component={'div'} className={'cs-bg-icons'} aria-hidden={'true'}>
				<span className={'cs-bg-icon plane'}>
					<FlightTakeoffRoundedIcon />
				</span>
				<span className={'cs-bg-icon earth'}>
					<PublicRoundedIcon />
				</span>
				<span className={'cs-bg-icon bag'}>
					<LuggageRoundedIcon />
				</span>
				<span className={'cs-bg-icon location'}>
					<LocationOnRoundedIcon />
				</span>
				<span className={'cs-bg-icon compass'}>
					<ExploreRoundedIcon />
				</span>
				<span className={'cs-bg-icon map'}>
					<MapRoundedIcon />
				</span>
				<span className={'cs-bg-icon beach'}>
					<BeachAccessRoundedIcon />
				</span>
				<span className={'cs-bg-icon anchor'}>
					<AnchorRoundedIcon />
				</span>
				<span className={'cs-bg-icon camera'}>
					<CameraAltRoundedIcon />
				</span>
				<span className={'cs-bg-icon agent'}>
					<SupportAgentRoundedIcon />
				</span>
				<span className={'cs-bg-icon sail'}>
					<SailingRoundedIcon />
				</span>
				<span className={'cs-bg-icon hotel'}>
					<HotelRoundedIcon />
				</span>
				<span className={'cs-bg-icon sun'}>
					<WbSunnyRoundedIcon />
				</span>
				<span className={'cs-bg-icon discover'}>
					<TravelExploreRoundedIcon />
				</span>
				<span className={'cs-bg-icon hike'}>
					<HikingRoundedIcon />
				</span>
			</Box>
			<Stack className={'container'}>
				<Stack className={'help-topics-section'}>
					<Typography className={'section-eyebrow'}>Popular Topics</Typography>
					<Box component={'div'} className={'topic-grid'}>
						{popularTopics.map(({ title, description, Icon }) => (
							<Box component={'article'} className={'topic-card'} key={title}>
								<Box component={'div'} className={'topic-icon'}>
									<Icon />
								</Box>
								<Typography className={'topic-title'}>{title}</Typography>
								<Typography className={'topic-desc'}>{description}</Typography>
							</Box>
						))}
					</Box>
				</Stack>

				<Stack className={'faq-heading'}>
					<Typography className={'faq-title'}>Frequently Asked Questions</Typography>
					<Typography className={'faq-subtitle'}>Find quick answers to common traveler inquiries</Typography>
				</Stack>

				<Box component={'div'} className={'cs-content'}>
					<Faq />
				</Box>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(CS);
