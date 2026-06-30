import React, { useMemo, useState } from 'react';
import { NextPage } from 'next';
import { useQuery } from '@apollo/client';
import { Box, Stack, Typography } from '@mui/material';
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
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
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Faq from '../../libs/components/cs/Faq';
import AnimatedSection from '../../libs/components/animation/AnimatedSection';
import { motion } from 'framer-motion';
import { fadeUpMotionProps } from '../../libs/config/animations';
const MotionBox = motion.create(Box);
import { getI18nProps, CS_NAMESPACES } from '../../libs/i18n';
import { useTranslation } from 'next-i18next';
import { GET_NOTICE_CATEGORIES, GET_NOTICES } from '../../apollo/user/query';
import { Direction } from '../../libs/enums/common.enum';
import { NoticeStatus } from '../../libs/enums/notice.enum';
import { Notice, NoticeCategory } from '../../libs/types/notice/notice';
import { NoticeInquiry } from '../../libs/types/notice/notice.input';
import { T } from '../../libs/types/common';

const popularTopics = [
	{
		key: 'booking-help',
		titleKey: 'community:help.topics.bookingHelp',
		descriptionKey: 'community:help.topics.bookingHelpDesc',
		Icon: ConfirmationNumberRoundedIcon,
	},
	{
		key: 'payments-refunds',
		titleKey: 'community:help.topics.paymentsRefunds',
		descriptionKey: 'community:help.topics.paymentsRefundsDesc',
		Icon: PaymentsRoundedIcon,
	},
	{
		key: 'tour-packages',
		titleKey: 'community:help.topics.tourPackages',
		descriptionKey: 'community:help.topics.tourPackagesDesc',
		Icon: TravelExploreRoundedIcon,
	},
	{
		key: 'travel-agencies',
		titleKey: 'community:help.topics.travelAgencies',
		descriptionKey: 'community:help.topics.travelAgenciesDesc',
		Icon: SupportAgentRoundedIcon,
	},
	{
		key: 'account-profile',
		titleKey: 'community:help.topics.accountProfile',
		descriptionKey: 'community:help.topics.accountProfileDesc',
		Icon: AccountCircleRoundedIcon,
	},
	{
		key: 'travel-documents',
		titleKey: 'community:help.topics.travelDocuments',
		descriptionKey: 'community:help.topics.travelDocumentsDesc',
		Icon: ArticleRoundedIcon,
	},
	{
		key: 'visa-information',
		titleKey: 'community:help.topics.visaInformation',
		descriptionKey: 'community:help.topics.visaInformationDesc',
		Icon: BadgeRoundedIcon,
	},
	{
		key: 'travel-safety',
		titleKey: 'community:help.topics.travelSafety',
		descriptionKey: 'community:help.topics.travelSafetyDesc',
		Icon: SecurityRoundedIcon,
	},
];

const noticeCategoryInquiry: NoticeInquiry = {
	page: 1,
	limit: 100,
	sort: 'noticeCategoryOrder',
	direction: Direction.ASC,
	search: {},
};

const noticeInquiry: NoticeInquiry = {
	page: 1,
	limit: 200,
	sort: 'noticeOrder',
	direction: Direction.ASC,
	search: {},
};

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await getI18nProps(locale, CS_NAMESPACES)),
	},
});

const CS: NextPage = () => {
	const { t } = useTranslation(['common', 'community']);
	const [noticeCategories, setNoticeCategories] = useState<NoticeCategory[]>([]);
	const [notices, setNotices] = useState<Notice[]>([]);

	useQuery(GET_NOTICE_CATEGORIES, {
		fetchPolicy: 'network-only',
		variables: { input: noticeCategoryInquiry },
		onCompleted: (data: T) => {
			setNoticeCategories(data?.getNoticeCategories?.list ?? []);
		},
		onError: (err) => {
			console.warn('getNoticeCategories error:', err.message);
		},
	});

	useQuery(GET_NOTICES, {
		fetchPolicy: 'network-only',
		variables: { input: noticeInquiry },
		onCompleted: (data: T) => {
			setNotices(data?.getNotices?.list ?? []);
		},
		onError: (err) => {
			console.warn('getNotices error:', err.message);
		},
	});

	const noticeDescriptionsByCategoryKey = useMemo(() => {
		const categoryKeyById = new Map(
			noticeCategories
				.filter((category) => category.noticeCategoryStatus === NoticeStatus.ACTIVE)
				.map((category) => [category._id, category.noticeCategoryKey]),
		);
		const descriptionMap: Record<string, string> = {};

		notices
			.filter((notice) => notice.noticeStatus === NoticeStatus.ACTIVE)
			.forEach((notice) => {
				const categoryKey = categoryKeyById.get(notice.noticeCategoryId);
				if (categoryKey && !descriptionMap[categoryKey]) descriptionMap[categoryKey] = notice.noticeContent;
			});

		return descriptionMap;
	}, [noticeCategories, notices]);

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
				<AnimatedSection>
					<Stack className={'help-topics-section'}>
						<Typography className={'section-eyebrow'}>{t('community:help.popularTopics')}</Typography>
						<Box component={'div'} className={'topic-grid'}>
							{popularTopics.map(({ key, titleKey, descriptionKey, Icon }) => (
								<MotionBox component={'article'} className={'topic-card'} key={key} {...fadeUpMotionProps}>
									<Box component={'div'} className={'topic-icon'}>
										<Icon />
									</Box>
									<Typography className={'topic-title'}>{t(titleKey)}</Typography>
									<Typography className={'topic-desc'}>{noticeDescriptionsByCategoryKey[key] ?? t(descriptionKey)}</Typography>
								</MotionBox>
							))}
						</Box>
					</Stack>
				</AnimatedSection>

				<AnimatedSection>
					<Stack className={'faq-heading'}>
						<Typography className={'faq-title'}>{t('community:help.faqTitle')}</Typography>
						<Typography className={'faq-subtitle'}>{t('community:help.faqSubtitle')}</Typography>
					</Stack>
				</AnimatedSection>

				<AnimatedSection>
					<Box component={'div'} className={'cs-content'}>
						<Faq />
					</Box>
				</AnimatedSection>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(CS);
