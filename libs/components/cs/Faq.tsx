import React, { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { AccordionDetails, Box, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import LuggageRoundedIcon from '@mui/icons-material/LuggageRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import TourRoundedIcon from '@mui/icons-material/TourRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PolicyRoundedIcon from '@mui/icons-material/PolicyRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { GET_FAQ_CATEGORIES, GET_FAQS } from '../../../apollo/user/query';
import { Faq as FaqItem, FaqCategory } from '../../types/faq/faq';
import { FaqInquiry } from '../../types/faq/faq.input';
import { FaqStatus } from '../../enums/faq.enum';
import { Direction } from '../../enums/common.enum';
import { T } from '../../types/common';
import { useTranslation } from 'next-i18next';

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
	() => ({
		border: 'none',
		borderRadius: 8,
		background: 'transparent',
		'&:before': {
			display: 'none',
		},
	}),
);

const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: '1.1rem' }} />} {...props} />
))(() => ({
	minHeight: 54,
	'&.Mui-expanded': {
		minHeight: 54,
	},
	'& .MuiAccordionSummary-content': {
		margin: 0,
	},
	'& .MuiAccordionSummary-content.Mui-expanded': {
		margin: 0,
	},
}));

const iconMap: Record<string, any> = {
	booking: LuggageRoundedIcon,
	payments: CreditCardRoundedIcon,
	packages: TourRoundedIcon,
	agencies: GroupsRoundedIcon,
	account: PersonRoundedIcon,
	policies: PolicyRoundedIcon,
	community: ForumRoundedIcon,
	general: HelpOutlineRoundedIcon,
};

const fallbackFaqCategories = [
	{
		key: 'booking',
		labelKey: 'community:help.fallbackCategories.booking',
		Icon: LuggageRoundedIcon,
		items: [
			{
				id: 'booking-package',
				questionKey: 'community:help.fallback.bookingPackageQ',
				answerKey: 'community:help.fallback.bookingPackageA',
			},
			{
				id: 'booking-confirmation',
				questionKey: 'community:help.fallback.bookingConfirmationQ',
				answerKey: 'community:help.fallback.bookingConfirmationA',
			},
			{
				id: 'booking-modify',
				questionKey: 'community:help.fallback.bookingModifyQ',
				answerKey: 'community:help.fallback.bookingModifyA',
			},
			{
				id: 'booking-authenticity',
				questionKey: 'community:help.fallback.bookingAuthenticityQ',
				answerKey: 'community:help.fallback.bookingAuthenticityA',
			},
		],
	},
	{
		key: 'payments',
		labelKey: 'community:help.fallbackCategories.payments',
		Icon: CreditCardRoundedIcon,
		items: [
			{ id: 'payment-methods', questionKey: 'community:help.fallback.paymentMethodsQ', answerKey: 'community:help.fallback.paymentMethodsA' },
			{ id: 'refund-status', questionKey: 'community:help.fallback.refundStatusQ', answerKey: 'community:help.fallback.refundStatusA' },
			{ id: 'invoice', questionKey: 'community:help.fallback.invoiceQ', answerKey: 'community:help.fallback.invoiceA' },
		],
	},
	{
		key: 'packages',
		labelKey: 'community:help.fallbackCategories.packages',
		Icon: TourRoundedIcon,
		items: [
			{ id: 'included', questionKey: 'community:help.fallback.includedQ', answerKey: 'community:help.fallback.includedA' },
			{ id: 'availability', questionKey: 'community:help.fallback.availabilityQ', answerKey: 'community:help.fallback.availabilityA' },
			{ id: 'custom', questionKey: 'community:help.fallback.customQ', answerKey: 'community:help.fallback.customA' },
		],
	},
	{
		key: 'agencies',
		labelKey: 'community:help.fallbackCategories.agencies',
		Icon: GroupsRoundedIcon,
		items: [
			{ id: 'agency-contact', questionKey: 'community:help.fallback.agencyContactQ', answerKey: 'community:help.fallback.agencyContactA' },
			{ id: 'agency-follow', questionKey: 'community:help.fallback.agencyFollowQ', answerKey: 'community:help.fallback.agencyFollowA' },
		],
	},
	{
		key: 'account',
		labelKey: 'community:help.fallbackCategories.account',
		Icon: PersonRoundedIcon,
		items: [
			{ id: 'account-update', questionKey: 'community:help.fallback.accountUpdateQ', answerKey: 'community:help.fallback.accountUpdateA' },
			{ id: 'saved-trips', questionKey: 'community:help.fallback.savedTripsQ', answerKey: 'community:help.fallback.savedTripsA' },
		],
	},
	{
		key: 'policies',
		labelKey: 'community:help.fallbackCategories.policies',
		Icon: PolicyRoundedIcon,
		items: [
			{ id: 'cancellation', questionKey: 'community:help.fallback.cancellationQ', answerKey: 'community:help.fallback.cancellationA' },
			{ id: 'documents', questionKey: 'community:help.fallback.documentsQ', answerKey: 'community:help.fallback.documentsA' },
		],
	},
	{
		key: 'community',
		labelKey: 'community:help.fallbackCategories.community',
		Icon: ForumRoundedIcon,
		items: [
			{ id: 'write-article', questionKey: 'community:help.fallback.writeArticleQ', answerKey: 'community:help.fallback.writeArticleA' },
			{ id: 'community-rules', questionKey: 'community:help.fallback.communityRulesQ', answerKey: 'community:help.fallback.communityRulesA' },
		],
	},
	{
		key: 'general',
		labelKey: 'community:help.fallbackCategories.general',
		Icon: HelpOutlineRoundedIcon,
		items: [
			{ id: 'support', questionKey: 'community:help.fallback.supportQ', answerKey: 'community:help.fallback.supportA' },
			{ id: 'tourx', questionKey: 'community:help.fallback.tourxQ', answerKey: 'community:help.fallback.tourxA' },
		],
	},
];

const categoryInquiry: FaqInquiry = {
	page: 1,
	limit: 100,
	sort: 'faqCategoryOrder',
	direction: Direction.ASC,
	search: {},
};

const faqInquiry: FaqInquiry = {
	page: 1,
	limit: 200,
	sort: 'faqOrder',
	direction: Direction.ASC,
	search: {},
};

const Faq = () => {
	const device = useDeviceDetect();
	const { t } = useTranslation(['community']);
	const [category, setCategory] = useState<string>('booking');
	const [expanded, setExpanded] = useState<string | false>('booking-package');
	const [backendCategories, setBackendCategories] = useState<FaqCategory[]>([]);
	const [backendFaqs, setBackendFaqs] = useState<FaqItem[]>([]);

	useQuery(GET_FAQ_CATEGORIES, {
		fetchPolicy: 'network-only',
		variables: { input: categoryInquiry },
		onCompleted: (data: T) => {
			setBackendCategories(data?.getFaqCategories?.list ?? []);
		},
		onError: (err) => {
			console.warn('getFaqCategories error:', err.message);
		},
	});

	useQuery(GET_FAQS, {
		fetchPolicy: 'network-only',
		variables: { input: faqInquiry },
		onCompleted: (data: T) => {
			setBackendFaqs(data?.getFaqs?.list ?? []);
		},
		onError: (err) => {
			console.warn('getFaqs error:', err.message);
		},
	});

	const faqCategories = useMemo(() => {
		const activeCategories = backendCategories.filter((item) => item.faqCategoryStatus === FaqStatus.ACTIVE);
		const activeFaqs = backendFaqs.filter((item) => item.faqStatus === FaqStatus.ACTIVE);

		const localizedFallbackCategories = fallbackFaqCategories.map((category) => ({
			...category,
			label: t(category.labelKey),
			items: category.items.map((item) => ({
				id: item.id,
				question: t(item.questionKey),
				answer: t(item.answerKey),
			})),
		}));

		if (activeCategories.length === 0 || activeFaqs.length === 0) return localizedFallbackCategories;

		return activeCategories.map((category) => {
			const Icon = iconMap[category.faqCategoryKey] ?? HelpOutlineRoundedIcon;
			const fallbackCategory = localizedFallbackCategories.find((item) => item.key === category.faqCategoryKey);
			const backendItems = activeFaqs
				.filter((faq) => faq.faqCategoryId === category._id)
				.map((faq) => ({
					id: faq._id,
					question: faq.faqQuestion,
					answer: faq.faqAnswer,
				}));

			return {
				key: category.faqCategoryKey || category._id,
				label: fallbackCategory?.label ?? category.faqCategoryTitle,
				Icon,
				items: fallbackCategory?.items ?? backendItems,
			};
		});
	}, [backendCategories, backendFaqs, t]);

	const activeCategory = faqCategories.find((item) => item.key === category) ?? faqCategories[0];

	useEffect(() => {
		if (!activeCategory) return;

		const categoryExists = faqCategories.some((item) => item.key === category);
		if (!categoryExists) {
			const nextCategory = faqCategories.find((item) => item.items.length > 0) ?? faqCategories[0];
			setCategory(nextCategory.key);
			setExpanded(nextCategory.items[0]?.id ?? false);
			return;
		}

		if (activeCategory.items.length > 0 && expanded !== false && !activeCategory.items.some((item) => item.id === expanded)) {
			setExpanded(activeCategory.items[0].id);
		}
		if (activeCategory.items.length === 0 && expanded !== false) setExpanded(false);
	}, [faqCategories, activeCategory, category, expanded]);

	const changeCategoryHandler = (nextCategory: string) => {
		const next = faqCategories.find((item) => item.key === nextCategory) ?? faqCategories[0];
		setCategory(next.key);
		setExpanded(next.items[0]?.id ?? false);
	};

	const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
		setExpanded(newExpanded ? panel : false);
	};

	if (device === 'mobile') {
		return <div>{t('community:help.mobile')}</div>;
	}

	return (
		<Stack className={'faq-content'}>
			<Box component={'nav'} className={'faq-categories'}>
				{faqCategories.map(({ key, label, Icon }) => (
					<button
						type={'button'}
						className={category === key ? 'active' : ''}
						onClick={() => changeCategoryHandler(key)}
						key={key}
					>
						<Icon />
						<span>{label}</span>
					</button>
				))}
			</Box>
			<Box component={'div'} className={'faq-accordion-panel'}>
				{activeCategory?.items.length === 0 && (
					<Box component={'div'} className={'faq-empty-state'}>
						<Typography>{t('community:help.noQuestions')}</Typography>
					</Box>
				)}

				{activeCategory?.items.map((item) => (
					<Accordion expanded={expanded === item.id} onChange={handleChange(item.id)} key={item.id}>
						<AccordionSummary className={'faq-question'} aria-controls={`${item.id}-content`} id={`${item.id}-header`}>
							<Typography>{item.question}</Typography>
						</AccordionSummary>
						<AccordionDetails className={'faq-answer'}>
							<Typography>{item.answer}</Typography>
						</AccordionDetails>
					</Accordion>
				))}
			</Box>
		</Stack>
	);
};

export default Faq;
