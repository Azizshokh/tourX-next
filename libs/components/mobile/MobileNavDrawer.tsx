import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useTheme as useNextTheme } from 'next-themes';
import CloseIcon from '@mui/icons-material/Close';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LuggageRoundedIcon from '@mui/icons-material/LuggageRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import NotificationDropdown from '../notifications/NotificationDropdown';

interface MobileNavDrawerProps {
	open: boolean;
	isAuthenticated: boolean;
	onClose: () => void;
}

const localeOptions = [
	{ id: 'en', labelKey: 'language.english' },
	{ id: 'kr', labelKey: 'language.korean' },
	{ id: 'ru', labelKey: 'language.russian' },
];

const MobileNavDrawer = ({ open, isAuthenticated, onClose }: MobileNavDrawerProps) => {
	const router = useRouter();
	const { t } = useTranslation(['common']);
	const { theme: nextTheme, setTheme } = useNextTheme();
	const [mounted, setMounted] = useState(false);
	const [lang, setLang] = useState<string>('en');

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		const supportedLocales = localeOptions.map((item) => item.id);
		const storedLocale = typeof window !== 'undefined' ? localStorage.getItem('locale') : null;
		const nextLocale = supportedLocales.includes(router.locale ?? '') ? router.locale : storedLocale;
		setLang(nextLocale && supportedLocales.includes(nextLocale) ? nextLocale : 'en');
	}, [router.locale]);

	useEffect(() => {
		if (!open) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onClose();
		};

		document.addEventListener('keydown', handleKeyDown);
		document.body.classList.add('mobile-nav-open');

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.body.classList.remove('mobile-nav-open');
		};
	}, [open, onClose]);

	const changeLocale = useCallback(
		async (nextLocale: string) => {
			setLang(nextLocale);
			localStorage.setItem('locale', nextLocale);
			await router.push(router.asPath, router.asPath, { locale: nextLocale });
			onClose();
		},
		[onClose, router],
	);

	const navLinks = [
		{ label: t('nav.home', { defaultValue: 'Home' }), href: '/', match: '/', icon: <HomeRoundedIcon /> },
		{ label: t('nav.packages', { defaultValue: 'Packages' }), href: '/tour-package', match: '/tour-package', icon: <LuggageRoundedIcon /> },
		{ label: t('nav.agents', { defaultValue: 'Agents' }), href: '/agent', match: '/agent', icon: <SupportAgentRoundedIcon /> },
		{
			label: t('nav.community', { defaultValue: 'Community' }),
			href: '/community?articleCategory=FREE',
			match: '/community',
			icon: <ForumRoundedIcon />,
		},
		{
			label: t('nav.myPage', { defaultValue: 'My Page' }),
			href: isAuthenticated ? '/mypage' : '/account/join',
			match: '/mypage',
			icon: <AccountCircleRoundedIcon />,
		},
		{ label: t('nav.help', { defaultValue: 'Help' }), href: '/cs', match: '/cs', icon: <HelpOutlineRoundedIcon /> },
		{ label: t('nav.about', { defaultValue: 'About Us' }), href: '/about', match: '/about', icon: <InfoOutlinedIcon /> },
	];

	const isActive = (match: string) => {
		if (match === '/') return router.pathname === '/';
		return router.pathname === match || router.pathname.startsWith(`${match}/`);
	};

	return (
		<div className={`mobile-nav-drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
			<button className="mobile-nav-backdrop" type="button" aria-label={t('actions.close', { defaultValue: 'Close' })} onClick={onClose} />
			<aside className="mobile-nav-panel" role="dialog" aria-modal="true" aria-label={t('mobileNav.menu', { defaultValue: 'Mobile navigation' })}>
				<div className="mobile-nav-panel-head">
					<div>
						<strong>{t('brand')}</strong>
						<span>{t('mobileNav.subtitle', { defaultValue: 'Premium travel marketplace' })}</span>
					</div>
					<button className="mobile-nav-close" type="button" aria-label={t('actions.close', { defaultValue: 'Close' })} onClick={onClose}>
						<CloseIcon />
					</button>
				</div>

				<nav className="mobile-nav-links" aria-label={t('mobileNav.menu', { defaultValue: 'Mobile navigation' })}>
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className={`mobile-nav-link ${isActive(link.match) ? 'active' : ''}`}
							onClick={onClose}
						>
							<span className="mobile-nav-link-icon">{link.icon}</span>
							<span>{link.label}</span>
						</Link>
					))}
				</nav>

				<div className="mobile-nav-tools">
					<div className="mobile-nav-tool-row">
						<span>{t('notifications.title', { defaultValue: 'Notifications' })}</span>
						<NotificationDropdown isAuthenticated={isAuthenticated} />
					</div>

					<button
						className="mobile-nav-theme"
						type="button"
						onClick={() => setTheme(nextTheme === 'dark' ? 'light' : 'dark')}
					>
						{mounted && nextTheme === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
						<span>{t('mobileNav.theme', { defaultValue: 'Theme mode' })}</span>
					</button>

					<div className="mobile-nav-languages" aria-label={t('mobileNav.language', { defaultValue: 'Language' })}>
						{localeOptions.map((item) => (
							<button
								key={item.id}
								type="button"
								className={lang === item.id ? 'active' : ''}
								onClick={() => changeLocale(item.id)}
							>
								<img src={`/img/flag/lang${item.id}.png`} alt="" />
								<span>{t(item.labelKey)}</span>
							</button>
						))}
					</div>
				</div>
			</aside>
		</div>
	);
};

export default MobileNavDrawer;
