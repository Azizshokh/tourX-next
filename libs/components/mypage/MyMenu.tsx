import React from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography, Box, List, ListItem } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Link from 'next/link';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../config';
import { logOut } from '../../auth';
import { sweetConfirmAlert } from '../../sweetAlert';
import AddLocationAltRoundedIcon from '@mui/icons-material/AddLocationAltRounded';
import LuggageRoundedIcon from '@mui/icons-material/LuggageRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import PhoneIphoneRoundedIcon from '@mui/icons-material/PhoneIphoneRounded';
import { useTranslation } from 'next-i18next';

interface MenuItemConfig {
	category: string;
	label: string;
	icon: React.ReactNode;
	accent: string;
}

const MyMenu = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { t } = useTranslation(['common', 'mypage']);
	const queryCategory = (router.query.category as string) ?? 'myProfile';
	const activeCategory: string =
		queryCategory === 'addProperty'
			? 'addTourPackage'
			: queryCategory === 'myProperties'
			? 'myTourPackages'
			: queryCategory;
	const user = useReactiveVar(userVar);

	const travelItems: MenuItemConfig[] = [
		...(user.memberType === 'AGENT'
			? [
					{
						category: 'addTourPackage',
						label: t('mypage:menu.addPackage'),
						icon: <AddLocationAltRoundedIcon />,
						accent: '#ff8a00',
					},
					{
						category: 'myTourPackages',
						label: t('mypage:menu.myPackages'),
						icon: <LuggageRoundedIcon />,
						accent: '#1f8f62',
					},
			  ]
			: []),
		{
			category: 'myFavorites',
			label: t('mypage:menu.savedTrips'),
			icon: <FavoriteRoundedIcon />,
			accent: '#ef4444',
		},
		{
			category: 'recentlyVisited',
			label: t('mypage:menu.recentlyViewed'),
			icon: <HistoryRoundedIcon />,
			accent: '#0284c7',
		},
		{
			category: 'followers',
			label: t('mypage:menu.followers'),
			icon: <GroupsRoundedIcon />,
			accent: '#7c3aed',
		},
		{
			category: 'followings',
			label: t('mypage:menu.following'),
			icon: <PersonAddAltRoundedIcon />,
			accent: '#0f766e',
		},
	];

	const communityItems: MenuItemConfig[] = [
		{
			category: 'myArticles',
			label: t('mypage:menu.myArticles'),
			icon: <ArticleRoundedIcon />,
			accent: '#2563eb',
		},
		{
			category: 'writeArticle',
			label: t('mypage:menu.writeArticle'),
			icon: <EditNoteRoundedIcon />,
			accent: '#ff8a00',
		},
	];

	const accountItems: MenuItemConfig[] = [
		{
			category: 'myProfile',
			label: t('mypage:menu.myProfile'),
			icon: <AccountCircleRoundedIcon />,
			accent: '#334155',
		},
	];

	/** HANDLERS **/
	const logoutHandler = async () => {
		try {
			if (await sweetConfirmAlert(t('mypage:menu.logoutConfirm'))) logOut();
		} catch (err: any) {
			console.log('ERROR, logoutHandler:', err.message);
		}
	};

	const renderMenuItem = (item: MenuItemConfig) => {
		const isActive = activeCategory === item.category;

		return (
			<ListItem className={isActive ? 'focus' : ''} key={item.category}>
				<Link
					href={{
						pathname: '/mypage',
						query: { category: item.category },
					}}
					scroll={false}
				>
					<div className={'flex-box'} style={{ ['--menu-accent' as string]: item.accent }}>
						<Box className={'menu-icon'}>{item.icon}</Box>
						<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
							{item.label}
						</Typography>
					</div>
				</Link>
			</ListItem>
		);
	};

	if (device === 'mobile') {
		return <div>{t('common:mobile.mypage')}</div>;
	} else {
		return (
			<Stack width={'100%'} className={'my-menu-panel'}>
				<Stack className={'profile'}>
					<Box component={'div'} className={'profile-img'}>
						<img
							src={user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'}
							alt={'member-photo'}
						/>
					</Box>
					<Stack className={'user-info'}>
						<Typography className={'user-name'}>{user?.memberNick}</Typography>
						<Box component={'div'} className={'user-phone'}>
							<PhoneIphoneRoundedIcon />
							<Typography className={'p-number'}>{user?.memberPhone}</Typography>
						</Box>
						{user?.memberType === 'ADMIN' ? (
							<a href="/_admin/users" target={'_blank'} rel="noreferrer">
								<Typography className={'view-list'}>
									<AdminPanelSettingsRoundedIcon />
									{user?.memberType}
								</Typography>
							</a>
						) : (
							<Typography className={'view-list'}>{user?.memberType === 'AGENT' ? t('mypage:menu.travelAgent') : t('mypage:menu.traveler')}</Typography>
						)}
					</Stack>
				</Stack>
				<Stack className={'sections'}>
					<Stack className={'section'}>
						<Typography className="title" variant={'h5'}>
							{t('mypage:menu.travelTools')}
						</Typography>
						<List className={'sub-section'}>{travelItems.map(renderMenuItem)}</List>
					</Stack>
					<Stack className={'section'}>
						<Typography className="title" variant={'h5'}>
							{t('mypage:menu.community')}
						</Typography>
						<List className={'sub-section'}>{communityItems.map(renderMenuItem)}</List>
					</Stack>
					<Stack className={'section'}>
						<Typography className="title" variant={'h5'}>
							{t('mypage:menu.account')}
						</Typography>
						<List className={'sub-section'}>
							{accountItems.map(renderMenuItem)}
							<ListItem onClick={logoutHandler} className={'logout-item'}>
								<div className={'flex-box'} style={{ ['--menu-accent' as string]: '#ef4444' }}>
									<Box className={'menu-icon'}>
										<LogoutRoundedIcon />
									</Box>
									<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
										{t('common:actions.logout')}
									</Typography>
								</div>
							</ListItem>
						</List>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default MyMenu;
