import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PersonIcon from '@mui/icons-material/Person';
import { userVar } from '../../../apollo/store';

const MobileBottomNav = () => {
	const router = useRouter();
	const { t } = useTranslation(['common']);
	const user = useReactiveVar(userVar);
	const authHref = (href: string) => (user?._id ? href : '/account/join');
	const category = router.query.category as string | undefined;

	const items = [
		{
			key: 'explore',
			label: t('mobileNav.explore', { defaultValue: 'Explore' }),
			href: '/',
			active: router.pathname === '/',
			icon: <TravelExploreIcon />,
			activeIcon: <TravelExploreIcon />,
		},
		{
			key: 'bookings',
			label: t('mobileNav.bookings', { defaultValue: 'Bookings' }),
			href: authHref('/mypage?category=recentlyVisited'),
			active: router.pathname === '/mypage' && category === 'recentlyVisited',
			icon: <EventAvailableIcon />,
			activeIcon: <EventAvailableIcon />,
		},
		{
			key: 'saved',
			label: t('mobileNav.saved', { defaultValue: 'Saved' }),
			href: authHref('/mypage?category=myFavorites'),
			active: router.pathname === '/mypage' && category === 'myFavorites',
			icon: <FavoriteBorderIcon />,
			activeIcon: <FavoriteIcon />,
		},
		{
			key: 'profile',
			label: t('mobileNav.profile', { defaultValue: 'Profile' }),
			href: authHref('/mypage'),
			active:
				router.pathname === '/mypage' &&
				category !== 'myFavorites' &&
				category !== 'recentlyVisited',
			icon: <PersonOutlineIcon />,
			activeIcon: <PersonIcon />,
		},
	];

	return (
		<nav className="mobile-bottom-nav" aria-label={t('mobileNav.bottomNavigation', { defaultValue: 'Mobile tab navigation' })}>
			{items.map((item) => (
				<Link key={item.key} href={item.href} className={`mobile-bottom-item ${item.active ? 'active' : ''}`}>
					<span className="mobile-bottom-icon">{item.active ? item.activeIcon : item.icon}</span>
					<span className="mobile-bottom-label">{item.label}</span>
				</Link>
			))}
		</nav>
	);
};

export default MobileBottomNav;
