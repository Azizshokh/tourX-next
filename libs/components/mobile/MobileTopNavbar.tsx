import React, { useState } from 'react';
import Link from 'next/link';
import { useReactiveVar } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import MenuIcon from '@mui/icons-material/Menu';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../config';
import MobileNavDrawer from './MobileNavDrawer';

const MobileTopNavbar = () => {
	const user = useReactiveVar(userVar);
	const { t } = useTranslation(['common']);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const avatarHref = user?._id ? '/mypage' : '/account/join';
	const avatarSrc = user?.memberImage ? `${REACT_APP_API_URL}/${user.memberImage}` : '/img/profile/defaultUser.svg';

	return (
		<>
			<header className="mobile-top-navbar">
				<button
					className="mobile-menu-button"
					type="button"
					aria-label={t('mobileNav.menu', { defaultValue: 'Mobile navigation' })}
					aria-expanded={drawerOpen}
					onClick={() => setDrawerOpen(true)}
				>
					<MenuIcon />
				</button>

				<Link href="/" className="mobile-brand" aria-label={t('nav.home', { defaultValue: 'Home' })}>
					<span>TourX</span>
				</Link>

				<Link href={avatarHref} className="mobile-avatar-link" aria-label={t('mobileNav.profile', { defaultValue: 'Profile' })}>
					<img src={avatarSrc} alt="" />
				</Link>
			</header>

			<MobileNavDrawer open={drawerOpen} isAuthenticated={!!user?._id} onClose={() => setDrawerOpen(false)} />
		</>
	);
};

export default MobileTopNavbar;
