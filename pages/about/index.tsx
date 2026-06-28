import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { motion } from 'framer-motion';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Box, Stack } from '@mui/material';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import { useTranslation } from 'next-i18next';
import { ABOUT_NAMESPACES, getI18nProps } from '../../libs/i18n';
import FadeUp from '../../libs/components/animation/FadeUp';
import AnimatedSection from '../../libs/components/animation/AnimatedSection';
import StaggerContainer from '../../libs/components/animation/StaggerContainer';
import StaggerItem from '../../libs/components/animation/StaggerItem';
import { sectionMotionProps } from '../../libs/config/animations';

const About: NextPage = () => {
	const { t } = useTranslation(['common', 'about']);

	const missionCards = [
		{
			icon: <TravelExploreRoundedIcon />,
			title: t('about:mission.card1Title'),
			body: t('about:mission.card1Body'),
		},
		{
			icon: <VerifiedRoundedIcon />,
			title: t('about:mission.card2Title'),
			body: t('about:mission.card2Body'),
		},
		{
			icon: <ForumRoundedIcon />,
			title: t('about:mission.card3Title'),
			body: t('about:mission.card3Body'),
		},
	];

	const values = [
		{ title: t('about:values.oneTitle'), body: t('about:values.oneBody') },
		{ title: t('about:values.twoTitle'), body: t('about:values.twoBody') },
		{ title: t('about:values.threeTitle'), body: t('about:values.threeBody') },
	];

	const services = [
		t('about:services.item1'),
		t('about:services.item2'),
		t('about:services.item3'),
		t('about:services.item4'),
	];

	const team = [
		{ name: t('about:team.oneName'), role: t('about:team.oneRole') },
		{ name: t('about:team.twoName'), role: t('about:team.twoRole') },
		{ name: t('about:team.threeName'), role: t('about:team.threeRole') },
	];

	return (
		<Stack className={'about-page'}>
			{/* Hero */}
			<section className={'about-hero'}>
				<Stack className={'container'}>
					<FadeUp>
						<Stack className={'hero-copy'}>
							<span className={'eyebrow'}>{t('about:hero.kicker')}</span>
							<h1>{t('about:hero.title')}</h1>
							<p>{t('about:hero.subtitle')}</p>
							<Stack className={'hero-actions'}>
								<Link href={'/tour-package'} className={'primary-action'}>
									{t('about:hero.primary')}
									<ArrowOutwardRoundedIcon />
								</Link>
								<Link href={'/agent'} className={'secondary-action'}>
									{t('about:hero.secondary')}
								</Link>
							</Stack>
						</Stack>
					</FadeUp>
					<FadeUp delay={0.2}>
						<Box className={'hero-media'}>
							<img src={'/img/events/about_us_img.png'} alt={t('about:hero.imageAlt')} />
							<div className={'floating-note'}>
								<RouteRoundedIcon />
								<span>{t('about:stats.destinations')}</span>
							</div>
						</Box>
					</FadeUp>
				</Stack>
			</section>

			{/* Stats — motion.section avoids extra div matching .about-stats div selector */}
			<motion.section className={'about-stats'} {...sectionMotionProps}>
				<Stack className={'container'}>
					<div>
						<strong>40+</strong>
						<span>{t('about:stats.destinations')}</span>
					</div>
					<div>
						<strong>120+</strong>
						<span>{t('about:stats.agents')}</span>
					</div>
					<div>
						<strong>8K+</strong>
						<span>{t('about:stats.travelers')}</span>
					</div>
					<div>
						<strong>24/7</strong>
						<span>{t('about:stats.support')}</span>
					</div>
				</Stack>
			</motion.section>

			{/* Mission */}
			<section className={'about-mission'}>
				<Stack className={'container'}>
					<AnimatedSection>
						<Stack className={'section-heading'}>
							<span>{t('about:mission.eyebrow')}</span>
							<h2>{t('about:mission.title')}</h2>
							<p>{t('about:mission.body')}</p>
						</Stack>
					</AnimatedSection>
					<StaggerContainer className={'mission-grid'}>
						{missionCards.map((card) => (
							<StaggerItem key={card.title}>
								<article className={'mission-card'}>
									<div className={'icon-box'}>{card.icon}</div>
									<h3>{card.title}</h3>
									<p>{card.body}</p>
								</article>
							</StaggerItem>
						))}
					</StaggerContainer>
				</Stack>
			</section>

			{/* Feature */}
			<section className={'about-feature'}>
				<Stack className={'container'}>
					<FadeUp>
						<Box className={'feature-image'}>
							<img src={'/img/events/travel_concepts.png'} alt={t('about:feature.imageAlt')} />
						</Box>
					</FadeUp>
					<FadeUp delay={0.2}>
						<Stack className={'feature-copy'}>
							<span className={'eyebrow'}>{t('about:feature.eyebrow')}</span>
							<h2>{t('about:feature.title')}</h2>
							<p>{t('about:feature.body')}</p>
							<ul>
								<li>
									<VerifiedRoundedIcon />
									{t('about:feature.item1')}
								</li>
								<li>
									<FavoriteRoundedIcon />
									{t('about:feature.item2')}
								</li>
								<li>
									<SupportAgentRoundedIcon />
									{t('about:feature.item3')}
								</li>
							</ul>
						</Stack>
					</FadeUp>
				</Stack>
			</section>

			{/* Services */}
			<section className={'about-services'}>
				<Stack className={'container'}>
					<AnimatedSection>
						<Stack className={'section-heading'}>
							<span>{t('about:services.eyebrow')}</span>
							<h2>{t('about:services.title')}</h2>
							<p>{t('about:services.body')}</p>
						</Stack>
					</AnimatedSection>
					<StaggerContainer className={'services-grid'}>
						{services.map((service, index) => (
							<StaggerItem key={service}>
								<article>
									<span>{String(index + 1).padStart(2, '0')}</span>
									<p>{service}</p>
								</article>
							</StaggerItem>
						))}
					</StaggerContainer>
				</Stack>
			</section>

			{/* Values */}
			<section className={'about-values'}>
				<Stack className={'container'}>
					<AnimatedSection>
						<Stack className={'values-copy'}>
							<span>{t('about:values.eyebrow')}</span>
							<h2>{t('about:values.title')}</h2>
							<p>{t('about:values.vision')}</p>
						</Stack>
					</AnimatedSection>
					<StaggerContainer className={'values-grid'}>
						{values.map((value, index) => (
							<StaggerItem key={value.title}>
								<article>
									<span>{String(index + 1).padStart(2, '0')}</span>
									<h3>{value.title}</h3>
									<p>{value.body}</p>
								</article>
							</StaggerItem>
						))}
					</StaggerContainer>
				</Stack>
			</section>

			{/* Team */}
			<section className={'about-team'}>
				<Stack className={'container'}>
					<AnimatedSection>
						<Stack className={'section-heading'}>
							<span>{t('about:team.eyebrow')}</span>
							<h2>{t('about:team.title')}</h2>
							<p>{t('about:team.body')}</p>
						</Stack>
					</AnimatedSection>
					<StaggerContainer className={'team-grid'}>
						{team.map((member) => (
							<StaggerItem key={member.name}>
								<article>
									<div>{member.name.charAt(0)}</div>
									<h3>{member.name}</h3>
									<p>{member.role}</p>
								</article>
							</StaggerItem>
						))}
					</StaggerContainer>
				</Stack>
			</section>

			{/* Help CTA */}
			<section className={'about-help'}>
				<AnimatedSection>
					<Stack className={'container'}>
						<Stack className={'left'}>
							<h2>{t('about:cta.title')}</h2>
							<p>{t('about:cta.body')}</p>
						</Stack>
						<Stack className={'right'}>
							<Link href={'/cs'} className={'outline-action'}>
								{t('about:cta.contact')}
								<ArrowOutwardRoundedIcon />
							</Link>
							<a href={`tel:${t('about:cta.phone').replace(/\\s/g, '')}`} className={'phone-action'}>
								<PhoneRoundedIcon />
								{t('about:cta.phone')}
							</a>
						</Stack>
					</Stack>
				</AnimatedSection>
			</section>
		</Stack>
	);
};

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await getI18nProps(locale, ABOUT_NAMESPACES)),
	},
});

export default withLayoutBasic(About);
