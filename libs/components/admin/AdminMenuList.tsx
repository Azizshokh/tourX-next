import React, { useEffect, useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import Link from 'next/link';
import { List, ListItemButton, ListItemIcon, Typography } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import LuggageRoundedIcon from '@mui/icons-material/LuggageRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import cookies from 'js-cookie';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useTranslation } from 'next-i18next';

const AdminMenuList = (props: any) => {
	const router = useRouter();
	const device = useDeviceDetect();
	const { t } = useTranslation(['admin']);
	const [mobileLayout, setMobileLayout] = useState(false);
	const [openSubMenu, setOpenSubMenu] = useState('Users');
	const [openMenu, setOpenMenu] = useState(typeof window === 'object' ? cookies.get('admin_menu') === 'true' : false);
	const [clickMenu, setClickMenu] = useState<any>([]);
	const [clickSubMenu, setClickSubMenu] = useState('');

	const {
		router: { pathname },
	} = props;

	const pathnames = pathname.split('/').filter((x: any) => x);

	/** LIFECYCLES **/
	useEffect(() => {
		if (device === 'mobile') setMobileLayout(true);

		switch (pathnames[1]) {
			case 'properties':
				setClickMenu(['Packages']);
				break;
			case 'community':
				setClickMenu(['Community']);
				break;
			case 'comments':
				setClickMenu(['Comments']);
				break;
			case 'cs':
				setClickMenu(['Cs']);
				break;
			default:
				setClickMenu(['Users']);
				break;
		}

		switch (pathnames[2]) {
			case 'logs':
				setClickSubMenu('Logs');
				break;
			case 'inquiry':
				setClickSubMenu('1:1 Inquiry');
				break;
			case 'notice':
				setClickSubMenu('Notice');
				break;
			case 'faq':
				setClickSubMenu('FAQ');
				break;
			case 'board_create':
				setClickSubMenu('Board Create');
				break;
			default:
				switch (pathnames[1]) {
					case 'properties':
						setClickSubMenu('Package List');
						break;
					case 'community':
						setClickSubMenu('Article List');
						break;
					default:
						setClickSubMenu('User List');
						break;
				}
				break;
		}
	}, []);

	/** HANDLERS **/
	const subMenuChangeHandler = (target: string) => {
		if (clickMenu.find((item: string) => item === target)) {
			// setOpenSubMenu('');
			setClickMenu(clickMenu.filter((menu: string) => target !== menu));
		} else {
			// setOpenSubMenu(target);
			setClickMenu([...clickMenu, target]);
		}
	};

	const menu_set = [
		{
			title: 'Users',
			icon: <GroupsRoundedIcon className={'admin-menu-icon'} />,
			on_click: () => subMenuChangeHandler('Users'),
		},
		{
			title: 'Packages',
			icon: <LuggageRoundedIcon className={'admin-menu-icon'} />,
			on_click: () => subMenuChangeHandler('Packages'),
		},
		{
			title: 'Community',
			icon: <ForumRoundedIcon className={'admin-menu-icon'} />,
			on_click: () => subMenuChangeHandler('Community'),
		},
		{
			title: 'Cs',
			icon: <SupportAgentRoundedIcon className={'admin-menu-icon'} />,
			on_click: () => subMenuChangeHandler('Cs'),
		},
		{
			title: 'Comments',
			icon: <ChatBubbleOutlineRoundedIcon className={'admin-menu-icon'} />,
			on_click: () => subMenuChangeHandler('Comments'),
		},
	];

	const sub_menu_set: any = {
		Users: [{ title: 'User List', url: '/_admin/users' }],
		Packages: [{ title: 'Package List', url: '/_admin/properties' }],
		Community: [{ title: 'Article List', url: '/_admin/community' }],
		Comments: [{ title: 'Comment List', url: '/_admin/comments' }],
		Cs: [
			{ title: 'FAQ', url: '/_admin/cs/faq' },
			{ title: 'Notice', url: '/_admin/cs/notice' },
		],
	};

	const menuLabel = (title: string) =>
		({
			Users: t('admin:menu.users'),
			Packages: t('admin:menu.packages'),
			Community: t('admin:menu.community'),
			Cs: t('admin:menu.cs'),
			Comments: t('admin:menu.comments'),
			'User List': t('admin:menu.userList'),
			'Package List': t('admin:menu.packageList'),
			'Article List': t('admin:menu.articleList'),
			'Comment List': t('admin:menu.commentList'),
			Notice: t('admin:menu.notice'),
			FAQ: t('admin:menu.faq'),
		}[title] || title);

	return (
		<>
			{menu_set.map((item, index) => (
				<List className={'menu_wrap'} key={index} disablePadding>
					<ListItemButton
						onClick={item.on_click}
						component={'li'}
						className={clickMenu[0] === item.title ? 'menu on' : 'menu'}
						aria-label={menuLabel(item.title)}
						title={menuLabel(item.title)}
						sx={{
							minHeight: 48,
							justifyContent: openMenu ? 'initial' : 'center',
							px: 2.5,
						}}
					>
						<ListItemIcon
							sx={{
								minWidth: 0,
								mr: 2,
								justifyContent: 'center',
							}}
						>
							{item.icon}
						</ListItemIcon>
						<Typography variant={'body2'} component={'span'} sx={{ flex: 1, fontWeight: 'inherit', fontSize: 'inherit', fontFamily: 'inherit' }}>
							{menuLabel(item.title)}
						</Typography>
						{clickMenu.find((menu: string) => item.title === menu) ? <ExpandLess /> : <ExpandMore />}
					</ListItemButton>
					<Collapse
						in={!!clickMenu.find((menu: string) => menu === item.title)}
						className="menu"
						timeout="auto"
						component="li"
						unmountOnExit
					>
						<List className="menu-list" disablePadding>
							{sub_menu_set[item.title] &&
								sub_menu_set[item.title].map((sub: any, i: number) => (
									<Link href={sub.url} shallow={true} replace={true} key={i}>
										<ListItemButton
											component="li"
											className={clickMenu[0] === item.title && clickSubMenu === sub.title ? 'li on' : 'li'}
											aria-label={menuLabel(sub.title)}
											title={menuLabel(sub.title)}
										>
											<Typography variant={sub.title} component={'span'}>
												{menuLabel(sub.title)}
											</Typography>
										</ListItemButton>
									</Link>
								))}
						</List>
					</Collapse>
				</List>
			))}
		</>
	);
};

export default withRouter(AdminMenuList);
