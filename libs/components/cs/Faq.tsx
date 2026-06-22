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
		label: 'Booking',
		Icon: LuggageRoundedIcon,
		items: [
			{
				id: 'booking-package',
				question: 'How do I book a tour package?',
				answer:
					'To book a package, simply search for your destination, select your preferred itinerary, and click Book Now. You will be prompted to enter traveler details and complete the payment securely through our marketplace.',
			},
			{
				id: 'booking-confirmation',
				question: 'Where can I find my booking confirmation?',
				answer:
					'Your confirmation is available in your TourX account after checkout. You should also receive the confirmation details from the travel agent or TourX notification flow.',
			},
			{
				id: 'booking-modify',
				question: 'Can I modify my traveler information after booking?',
				answer:
					'Contact the travel agent as soon as possible with the corrected traveler details. Changes depend on package availability, partner rules, and document deadlines.',
			},
			{
				id: 'booking-authenticity',
				question: 'How do I verify the authenticity of a Travel Agency?',
				answer:
					'Open the agency profile to review its verification status, package history, traveler feedback, and contact details before confirming a trip.',
			},
		],
	},
	{
		key: 'payments',
		label: 'Payments & Refunds',
		Icon: CreditCardRoundedIcon,
		items: [
			{
				id: 'payment-methods',
				question: 'Which payment methods are supported?',
				answer: 'Supported payment options depend on the travel agent and package. Check the package details before booking.',
			},
			{
				id: 'refund-status',
				question: 'How can I check my refund status?',
				answer: 'Review your booking messages or contact the travel agent handling the reservation for the latest refund update.',
			},
			{
				id: 'invoice',
				question: 'Can I receive an invoice for my booking?',
				answer: 'Yes. Ask the travel agent or support contact for invoice details after your booking is confirmed.',
			},
		],
	},
	{
		key: 'packages',
		label: 'Tour Packages',
		Icon: TourRoundedIcon,
		items: [
			{
				id: 'included',
				question: 'What is included in a tour package?',
				answer:
					'Each package shows its own inclusions, such as flights, hotels, local guides, duration, traveler limits, and destination details.',
			},
			{
				id: 'availability',
				question: 'How do I know if a package is available?',
				answer: 'Active packages are available to browse. Confirm final dates and capacity with the travel agent before payment.',
			},
			{
				id: 'custom',
				question: 'Can I request a custom itinerary?',
				answer: 'Some travel agents can customize routes, dates, or activities. Contact the agent from the package or profile page.',
			},
		],
	},
	{
		key: 'agencies',
		label: 'Travel Agencies',
		Icon: GroupsRoundedIcon,
		items: [
			{
				id: 'agency-contact',
				question: 'How do I contact a travel agency?',
				answer: 'Open the agent profile or package detail page to view available contact and profile information.',
			},
			{
				id: 'agency-follow',
				question: 'Can I follow a travel agency?',
				answer: 'Yes. Logged-in users can follow travel agents from their profile page and return to them later.',
			},
		],
	},
	{
		key: 'account',
		label: 'Account',
		Icon: PersonRoundedIcon,
		items: [
			{
				id: 'account-update',
				question: 'How do I update my profile?',
				answer: 'Go to My Page, open My Profile, and update your personal details, image, and contact information.',
			},
			{
				id: 'saved-trips',
				question: 'Where are my saved trips?',
				answer: 'Saved Trips are available from My Page. Tap the heart icon on packages to save or remove them.',
			},
		],
	},
	{
		key: 'policies',
		label: 'Travel Policies',
		Icon: PolicyRoundedIcon,
		items: [
			{
				id: 'cancellation',
				question: 'What is the cancellation policy?',
				answer:
					'Cancellation rules vary by travel agent and package. Review the package details and confirm with the agent before booking.',
			},
			{
				id: 'documents',
				question: 'Which travel documents do I need?',
				answer:
					'Document needs depend on destination and traveler nationality. Always check passport, visa, insurance, and voucher requirements early.',
			},
		],
	},
	{
		key: 'community',
		label: 'Community',
		Icon: ForumRoundedIcon,
		items: [
			{
				id: 'write-article',
				question: 'Can I share travel stories on TourX?',
				answer: 'Yes. Use Write Article from My Page to share travel stories, tips and guides, news, or humor posts.',
			},
			{
				id: 'community-rules',
				question: 'What content is allowed in community posts?',
				answer: 'Keep posts travel-relevant, respectful, accurate, and safe for the TourX community.',
			},
		],
	},
	{
		key: 'general',
		label: 'General Questions',
		Icon: HelpOutlineRoundedIcon,
		items: [
			{
				id: 'support',
				question: 'How do I get more help?',
				answer:
					'Use the help page topics first, then contact the relevant travel agent or TourX support channel for booking-specific questions.',
			},
			{
				id: 'tourx',
				question: 'What is TourX?',
				answer:
					'TourX is a travel marketplace for discovering tour packages, travel agents, saved trips, and traveler community content.',
			},
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

		if (activeCategories.length === 0 || activeFaqs.length === 0) return fallbackFaqCategories;

		return activeCategories.map((category) => {
			const Icon = iconMap[category.faqCategoryKey] ?? HelpOutlineRoundedIcon;
			const items = activeFaqs
				.filter((faq) => faq.faqCategoryId === category._id)
				.map((faq) => ({
					id: faq._id,
					question: faq.faqQuestion,
					answer: faq.faqAnswer,
				}));

			return {
				key: category.faqCategoryKey || category._id,
				label: category.faqCategoryTitle,
				Icon,
				items,
			};
		});
	}, [backendCategories, backendFaqs]);

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
		return <div>FAQ MOBILE</div>;
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
						<Typography>No questions in this category yet.</Typography>
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
