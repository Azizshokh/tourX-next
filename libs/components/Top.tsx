import React, { useCallback, useEffect } from 'react';
import { useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { resolveImageUrl } from '../config';
import { Stack, Box } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { CaretDown } from 'phosphor-react';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Link from 'next/link';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { Logout } from '@mui/icons-material';
import { useTheme as useNextTheme } from 'next-themes';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import NotificationDropdown from './notifications/NotificationDropdown';
import { motion } from 'framer-motion';
import { baseTransition } from '../config/animations';
import MobileTopNavbar from './mobile/MobileTopNavbar';
import MobileBottomNav from './mobile/MobileBottomNav';

const MotionStack = motion.create(Stack);

const StyledMenu = styled((props: MenuProps) => (
	<Menu
		elevation={0}
		anchorOrigin={{
			vertical: 'bottom',
			horizontal: 'right',
		}}
		transformOrigin={{
			vertical: 'top',
			horizontal: 'right',
		}}
		{...props}
	/>
))(({ theme }) => ({
	'& .MuiPaper-root': {
		top: '109px',
		borderRadius: 6,
		marginTop: theme.spacing(1),
		minWidth: 160,
		color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
		boxShadow:
			'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
		'& .MuiMenu-list': {
			padding: '4px 0',
		},
		'& .MuiMenuItem-root': {
			'& .MuiSvgIcon-root': {
				fontSize: 18,
				color: theme.palette.text.secondary,
				marginRight: theme.spacing(1.5),
			},
			'&:active': {
				backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
			},
		},
	},
}));

const Top = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const { t } = useTranslation(['common', 'auth']);
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string | null>('en');
	const drop = Boolean(anchorEl2);
	const [colorChange, setColorChange] = useState(false);
	const [bgColor, setBgColor] = useState<boolean>(false);
	const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(null);
	const logoutOpen = Boolean(logoutAnchor);
	const { theme: nextTheme, setTheme } = useNextTheme();
	const [mounted, setMounted] = useState(false);
	const [isCompactViewport, setIsCompactViewport] = useState(false);

	/** LIFECYCLES **/
	useEffect(() => {
		const supportedLocales = ['en', 'kr', 'ru'];
		const storedLocale = localStorage.getItem('locale');
		const nextLocale = supportedLocales.includes(router.locale ?? '') ? router.locale : storedLocale;

		if (nextLocale && supportedLocales.includes(nextLocale)) {
			localStorage.setItem('locale', nextLocale);
			setLang(nextLocale);
			return;
		}

		localStorage.setItem('locale', 'en');
		setLang('en');
	}, [router.locale]);

	useEffect(() => {
		switch (router.pathname) {
			case '/tour-package/detail':
				setBgColor(true);
				break;
			default:
				break;
		}
	}, [router]);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		const mediaQuery = window.matchMedia('(max-width: 900px)');
		const updateViewport = () => setIsCompactViewport(mediaQuery.matches);
		updateViewport();

		if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', updateViewport);
		else mediaQuery.addListener(updateViewport);

		return () => {
			if (mediaQuery.removeEventListener) mediaQuery.removeEventListener('change', updateViewport);
			else mediaQuery.removeListener(updateViewport);
		};
	}, []);

	useEffect(() => {
		const handleScroll = () => setColorChange(window.scrollY >= 50);
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	/** HANDLERS **/
	const langClick = (e: any) => {
		setAnchorEl2(e.currentTarget);
	};

	const langClose = () => {
		setAnchorEl2(null);
	};

	const langChoice = useCallback(
		async (e: any) => {
			const nextLocale = e.currentTarget.id;
			setLang(nextLocale);
			localStorage.setItem('locale', nextLocale);
			setAnchorEl2(null);
			await router.push(router.asPath, router.asPath, { locale: nextLocale });
		},
		[router],
	);

	if (device == 'mobile' || isCompactViewport) {
		return (
			<>
				<MobileTopNavbar />
				<MobileBottomNav />
			</>
		);
	} else {
		return (
			<Stack className={'navbar'}>
				<MotionStack
					className={`navbar-main ${colorChange ? 'transparent' : ''} ${bgColor ? 'transparent' : ''}`}
					initial={{ opacity: 0, y: 32 }}
					animate={{ opacity: 1, y: 0 }}
					transition={baseTransition}
				>
					<Stack className={'container'}>
						<Box component={'div'} className={'logo-box'}>
							<Link href={'/'}>
								<img src="/img/logo/TourX.svg" alt="TourX" />
							</Link>
						</Box>
						<Box component={'div'} className={'router-box'}>
							<Link href={'/'}>
								<div className={router.pathname === '/' ? 'active' : ''}>{t('nav.home')}</div>
							</Link>
							<Link href={'/tour-package'}>
								<div className={router.pathname.startsWith('/tour-package') ? 'active' : ''}>{t('nav.packages')}</div>
							</Link>
							<Link href={'/agent'}>
								<div className={router.pathname.startsWith('/agent') ? 'active' : ''}> {t('nav.agents')} </div>
							</Link>
							<Link href={'/community?articleCategory=FREE'}>
								<div className={router.pathname.startsWith('/community') ? 'active' : ''}> {t('nav.community')} </div>
							</Link>
							{user?._id && (
								<Link href={'/mypage'}>
									<div className={router.pathname.startsWith('/mypage') ? 'active' : ''}> {t('nav.myPage')} </div>
								</Link>
							)}
							<Link href={'/cs'}>
								<div className={router.pathname.startsWith('/cs') ? 'active' : ''}> {t('nav.help')} </div>
							</Link>
							<Link href={'/about'}>
								<div className={router.pathname.startsWith('/about') ? 'active' : ''}> {t('nav.about')} </div>
							</Link>
						</Box>
						<Box component={'div'} className={'user-box'}>
							{user?._id ? (
								<>
									<div className={'login-user'} onClick={(event: any) => setLogoutAnchor(event.currentTarget)}>
										<img src={user?.memberImage ? resolveImageUrl(user.memberImage) : '/img/profile/defaultUser.svg'} alt="" />
									</div>

									<Menu
										id="basic-menu"
										anchorEl={logoutAnchor}
										open={logoutOpen}
										onClose={() => {
											setLogoutAnchor(null);
										}}
										sx={{ mt: '5px' }}
									>
										<MenuItem onClick={() => logOut()}>
											<Logout fontSize="small" style={{ color: 'blue', marginRight: '10px' }} />
											{t('actions.logout')}
										</MenuItem>
									</Menu>
								</>
							) : (
								<Link href={'/account/join'}>
									<div className={'join-box'}>
										<AccountCircleOutlinedIcon />
										<span>
											{t('Login')} / {t('Register')}
										</span>
									</div>
								</Link>
							)}

							<div className={'lan-box'}>
								<NotificationDropdown isAuthenticated={!!user?._id} />
								<button
									className={'theme-toggle-btn'}
									onClick={() => setTheme(nextTheme === 'dark' ? 'light' : 'dark')}
									aria-label={t('common:chat.toggleChat')}
								>
									{mounted ? (
										nextTheme === 'dark' ? (
											<LightModeRoundedIcon />
										) : (
											<DarkModeRoundedIcon />
										)
									) : (
										<DarkModeRoundedIcon />
									)}
								</button>
								<Button
									disableRipple
									className="btn-lang"
									onClick={langClick}
									endIcon={<CaretDown size={14} color="#616161" weight="fill" />}
								>
									<Box component={'div'} className={'flag'}>
										{lang !== null ? (
											<img src={`/img/flag/lang${lang}.png`} alt={'usaFlag'} />
										) : (
											<img src={`/img/flag/langen.png`} alt={'usaFlag'} />
										)}
									</Box>
								</Button>

								<StyledMenu anchorEl={anchorEl2} open={drop} onClose={langClose} sx={{ position: 'absolute' }}>
									<MenuItem disableRipple onClick={langChoice} id="en">
										<img
											className="img-flag"
											src={'/img/flag/langen.png'}
											onClick={langChoice}
											id="en"
											alt={'usaFlag'}
										/>
										{t('language.english')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="kr">
										<img
											className="img-flag"
											src={'/img/flag/langkr.png'}
											onClick={langChoice}
											id="kr"
											alt={'koreanFlag'}
										/>
										{t('language.korean')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="ru">
										<img
											className="img-flag"
											src={'/img/flag/langru.png'}
											onClick={langChoice}
											id="ru"
											alt={'russiaFlag'}
										/>
										{t('language.russian')}
									</MenuItem>
								</StyledMenu>
							</div>
						</Box>
					</Stack>
				</MotionStack>
			</Stack>
		);
	}
};

export default withRouter(Top);
