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

	const companyLinks = [
		{ label: t('footer:links.about'), href: '/about' },
		{ label: t('footer:links.reviews'), href: '/community?articleCategory=RECOMMEND' },
		{ label: t('footer:links.contact'), href: '/cs' },
		{ label: t('footer:links.guides'), href: '/community?articleCategory=NEWS' },
		{ label: t('footer:links.dataPolicy'), href: '/cs' },
		{ label: t('footer:links.cookiePolicy'), href: '/cs' },
		{ label: t('footer:links.legal'), href: '/cs' },
		{ label: t('footer:links.sitemap'), href: '/' },
	];

	const supportLinks = [
		{ label: t('footer:links.getInTouch'), href: '/cs' },
		{ label: t('footer:links.helpCenter'), href: '/cs' },
		{ label: t('footer:links.liveChat'), href: '/cs' },
		{ label: t('footer:links.howItWorks'), href: '/about' },
	];

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
						<FacebookOutlinedIcon />
						<InstagramIcon />
						<TelegramIcon />
						<TwitterIcon />
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
					</ul>
				</Box>
				<Box component={'div'} className={'col newsletter'}>
					<h4>{t('footer:newsletter')}</h4>
					<p>{t('footer:newsletterDesc')}</p>
					<form className={'subscribe'} onSubmit={(e) => e.preventDefault()}>
						<input type={'email'} placeholder={t('footer:emailPlaceholder')} />
						<button type={'submit'}>{t('footer:send')}</button>
					</form>
					<h4 className={'apps-title'}>{t('footer:mobileApps')}</h4>
					<ul className={'apps'}>
						<li>
							<Link href={'/'}>iOS App</Link>
						</li>
						<li>
							<Link href={'/'}>Android App</Link>
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
