import { FormEvent, useState } from 'react';
import Link from 'next/link';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box } from '@mui/material';
import moment from 'moment';
import { useTranslation } from 'next-i18next';

const Footer = () => {
	const device = useDeviceDetect();
	const { t } = useTranslation(['footer']);
	const [newsletterEmail, setNewsletterEmail] = useState('');
	const [newsletterMessage, setNewsletterMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

	const companyLinks = [
		{ label: t('footer:links.home'), href: '/' },
		{ label: t('footer:links.tourPackages'), href: '/tour-package' },
		{ label: t('footer:links.agents'), href: '/agent' },
		{ label: t('footer:links.community'), href: '/community' },
		{ label: t('footer:links.help'), href: '/cs' },
		{ label: t('footer:links.about'), href: '/about' },
	];

	const supportLinks = [
		{ label: t('footer:links.getInTouch'), href: '/cs' },
		{ label: t('footer:links.helpCenter'), href: '/cs' },
	];

	const openLiveChat = () => {
		if (typeof window === 'undefined') return;
		window.dispatchEvent(new CustomEvent('tourx:open-chat'));
	};

	const handleNewsletterSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const trimmedEmail = newsletterEmail.trim();
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!trimmedEmail) {
			setNewsletterMessage({ type: 'error', text: t('footer:newsletterEmpty') });
			return;
		}

		if (!emailRegex.test(trimmedEmail)) {
			setNewsletterMessage({ type: 'error', text: t('footer:newsletterInvalid') });
			return;
		}

		setNewsletterMessage({ type: 'success', text: t('footer:newsletterSuccess') });
		setNewsletterEmail('');
	};

	const renderFooterBody = (showBottomRight: boolean) => (
		<>
			<Stack className={'footer-top'}>
				<Box component={'div'} className={'expert'}>
					<span>{t('footer:expert')}</span>
					<a className={'phone'} href={'tel:+18004536744'}>
						1-800-453-6744
					</a>
				</Box>
				<Box component={'div'} className={'follow'}>
					<span>{t('footer:follow')}</span>
					<div className={'socials'}>
						<a href={'https://www.facebook.com/'} target={'_blank'} rel={'noopener noreferrer'} aria-label={'Facebook'}>
							<FacebookOutlinedIcon />
						</a>
						<a href={'https://www.instagram.com/'} target={'_blank'} rel={'noopener noreferrer'} aria-label={'Instagram'}>
							<InstagramIcon />
						</a>
						<a href={'https://telegram.org/'} target={'_blank'} rel={'noopener noreferrer'} aria-label={'Telegram'}>
							<TelegramIcon />
						</a>
						<a href={'https://twitter.com/'} target={'_blank'} rel={'noopener noreferrer'} aria-label={'Twitter'}>
							<TwitterIcon />
						</a>
					</div>
				</Box>
			</Stack>

			<div className={'footer-divider'} />

			<Stack className={'footer-cols'}>
				<Box component={'div'} className={'col contact'}>
					<h4>{t('footer:contact')}</h4>
					<p>{t('footer:address')}</p>
					<a href={'mailto:hi@tourx.com'} className={'mail'}>
						hi@tourx.com
					</a>
				</Box>
				<Box component={'div'} className={'col'}>
					<h4>{t('footer:company')}</h4>
					<ul>
						{companyLinks.map((l) => (
							<li key={l.label}>
								<Link href={l.href}>{l.label}</Link>
							</li>
						))}
					</ul>
				</Box>
				<Box component={'div'} className={'col'}>
					<h4>{t('footer:support')}</h4>
					<ul>
						{supportLinks.map((l) => (
							<li key={l.label}>
								<Link href={l.href}>{l.label}</Link>
							</li>
						))}
						<li>
							<button className={'footer-link-button'} type={'button'} onClick={openLiveChat}>
								{t('footer:links.liveChat')}
							</button>
						</li>
						<li>
							<Link href={'/about'}>{t('footer:links.howItWorks')}</Link>
						</li>
					</ul>
				</Box>
				<Box component={'div'} className={'col newsletter'}>
					<h4>{t('footer:newsletter')}</h4>
					<p>{t('footer:newsletterDesc')}</p>
					<form className={'subscribe'} onSubmit={handleNewsletterSubmit} noValidate>
						<input
							type={'email'}
							value={newsletterEmail}
							placeholder={t('footer:emailPlaceholder')}
							aria-label={t('footer:emailPlaceholder')}
							onChange={(event) => {
								setNewsletterEmail(event.target.value);
								if (newsletterMessage) setNewsletterMessage(null);
							}}
						/>
						<button type={'submit'}>{t('footer:send')}</button>
					</form>
					{newsletterMessage && (
						<span className={`newsletter-message ${newsletterMessage.type}`} role={'status'}>
							{newsletterMessage.text}
						</span>
					)}
					<h4 className={'apps-title'}>{t('footer:mobileApps')}</h4>
					<ul className={'apps'}>
						<li>
							<span>iOS App</span>
						</li>
						<li>
							<span>Android App</span>
						</li>
					</ul>
				</Box>
			</Stack>

			<Stack className={'footer-bottom'}>
				<span>© TourX - {t('footer:rights')} {moment().year()}</span>
				{showBottomRight && (
					<span>
						{t('footer:privacy')} · {t('footer:terms')} · {t('footer:sitemap')}
					</span>
				)}
			</Stack>
		</>
	);

	if (device == 'mobile') {
		return <Stack className={'footer-container'}>{renderFooterBody(false)}</Stack>;
	}

	return <Stack className={'footer-container'}>{renderFooterBody(true)}</Stack>;
};

export default Footer;
