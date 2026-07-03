import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Box, IconButton, Stack } from '@mui/material';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import LuggageRoundedIcon from '@mui/icons-material/LuggageRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import BeachAccessRoundedIcon from '@mui/icons-material/BeachAccessRounded';
import AnchorRoundedIcon from '@mui/icons-material/AnchorRounded';
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import SailingRoundedIcon from '@mui/icons-material/SailingRounded';
import HotelRoundedIcon from '@mui/icons-material/HotelRounded';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import MyTourPackages from '../../libs/components/mypage/MyTourPackages';
import MyFavorites from '../../libs/components/mypage/MyFavorites';
import RecentlyVisited from '../../libs/components/mypage/RecentlyVisited';
import AddTourPackage from '../../libs/components/mypage/AddNewTourPackage';
import MyProfile from '../../libs/components/mypage/MyProfile';
import MyArticles from '../../libs/components/mypage/MyArticles';
import { useMutation, useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import MyMenu from '../../libs/components/mypage/MyMenu';
import WriteArticle from '../../libs/components/mypage/WriteArticle';
import MemberFollowers from '../../libs/components/member/MemberFollowers';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import MemberFollowings from '../../libs/components/member/MemberFollowings';
import { getI18nProps, MYPAGE_NAMESPACES } from '../../libs/i18n';
import AnimatedSection from '../../libs/components/animation/AnimatedSection';
import FadeUp from '../../libs/components/animation/FadeUp';
import { useTranslation } from 'next-i18next';
import { SUBSCRIBE, UNSUBSCRIBE, LIKE_TARGET_MEMBER } from '../../apollo/user/mutation';
import { Messages } from '../../libs/config';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await getI18nProps(locale, MYPAGE_NAMESPACES)),
	},
});

const MyPage: NextPage = () => {
	const { t } = useTranslation(['common', 'mypage']);
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const category: any = router.query?.category ?? 'myProfile';
	const activeCategory =
		category === 'addProperty' ? 'addTourPackage' : category === 'myProperties' ? 'myTourPackages' : category;
	const [isResponsiveLayout, setIsResponsiveLayout] = useState<boolean>(false);
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

	/** APOLLO REQUESTS **/
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

	/** LIFECYCLES **/
	useEffect(() => {
		if (!user._id) router.push('/').then();
	}, [user]);

	useEffect(() => {
		const mediaQuery = window.matchMedia('(max-width: 1024px)');
		const syncResponsiveLayout = () => {
			setIsResponsiveLayout(mediaQuery.matches);
			setIsMenuOpen(false);
		};

		syncResponsiveLayout();
		mediaQuery.addEventListener('change', syncResponsiveLayout);

		return () => mediaQuery.removeEventListener('change', syncResponsiveLayout);
	}, []);

	useEffect(() => {
		if (isResponsiveLayout) setIsMenuOpen(false);
	}, [activeCategory, isResponsiveLayout]);

	useEffect(() => {
		if (!isResponsiveLayout || !isMenuOpen) {
			document.body.classList.remove('mypage-sidebar-open');
			return;
		}

		document.body.classList.add('mypage-sidebar-open');
		return () => document.body.classList.remove('mypage-sidebar-open');
	}, [isResponsiveLayout, isMenuOpen]);

	useEffect(() => {
		if (!isResponsiveLayout || !isMenuOpen) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setIsMenuOpen(false);
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isMenuOpen, isResponsiveLayout]);

	/** HANDLERS **/
	const subscribeHandler = async (id: string, refetch: any, query: any) => {
		try {
			if (!id) throw new Error(Messages.error1);
			if (!user._id) throw new Error(Messages.error2);
			if (user._id === id) throw new Error(t('mypage:follow.cannotFollowSelf'));

			await subscribe({
				variables: {
					input: id,
				},
			});
			await sweetTopSmallSuccessAlert(t('mypage:follow.subscribed'), 800);
			if (refetch && query) await refetch({ input: query });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const unsubscribeHandler = async (id: string, refetch: any, query: any) => {
		try {
			if (!id) throw new Error(Messages.error1);
			if (!user._id) throw new Error(Messages.error2);
			if (user._id === id) throw new Error(t('mypage:follow.cannotUnfollowSelf'));

			await unsubscribe({
				variables: {
					input: id,
				},
			});
			await sweetTopSmallSuccessAlert(t('mypage:follow.unsubscribed'), 800);
			if (refetch && query) await refetch({ input: query });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const likeMemberHandler = async (id: string, refetch: any, query: any) => {
		try {
			if (!id) return;
			if (!user) throw new Error(Messages.error2);
			await likeTargetMember({
				variables: {
					input: id,
				},
			});
			await sweetTopSmallSuccessAlert('Success!', 800);
			await refetch({ input: query });
		} catch (err: any) {
			console.error('ERROR, likeMemberHandler: ', err.message);
			sweetMixinErrorAlert(err).then();
		}
	};

	const redirectToMemberPageHandler = async (memberId: string) => {
		try {
			if (memberId === user?._id) await router.push(`/mypage?memberId=${memberId}`);
			else await router.push(`/member?memberId=${memberId}`);
		} catch (error) {
			await sweetErrorHandling(error);
		}
	};

	return (
			<div id="my-page" style={{ position: 'relative' }}>
				<Box component={'div'} className={'mypage-bg-icons'} aria-hidden={'true'}>
					<span className={'mypage-bg-icon plane'}>
						<FlightTakeoffRoundedIcon />
					</span>
					<span className={'mypage-bg-icon earth'}>
						<PublicRoundedIcon />
					</span>
					<span className={'mypage-bg-icon bag'}>
						<LuggageRoundedIcon />
					</span>
					<span className={'mypage-bg-icon location'}>
						<LocationOnRoundedIcon />
					</span>
					<span className={'mypage-bg-icon discover'}>
						<TravelExploreRoundedIcon />
					</span>
					<span className={'mypage-bg-icon article'}>
						<ArticleRoundedIcon />
					</span>
					<span className={'mypage-bg-icon compass'}>
						<ExploreRoundedIcon />
					</span>
					<span className={'mypage-bg-icon map'}>
						<MapRoundedIcon />
					</span>
					<span className={'mypage-bg-icon beach'}>
						<BeachAccessRoundedIcon />
					</span>
					<span className={'mypage-bg-icon anchor'}>
						<AnchorRoundedIcon />
					</span>
					<span className={'mypage-bg-icon camera'}>
						<CameraAltRoundedIcon />
					</span>
					<span className={'mypage-bg-icon agent'}>
						<SupportAgentRoundedIcon />
					</span>
					<span className={'mypage-bg-icon sail'}>
						<SailingRoundedIcon />
					</span>
					<span className={'mypage-bg-icon hotel'}>
						<HotelRoundedIcon />
					</span>
					<span className={'mypage-bg-icon sun'}>
						<WbSunnyRoundedIcon />
					</span>
				</Box>
				<div className="container">
					{isResponsiveLayout && (
						<Box component={'div'} className={'mypage-menu-toggle-wrap'}>
							<IconButton
								className={`mypage-menu-toggle ${isMenuOpen ? 'open' : ''}`}
								onClick={() => setIsMenuOpen((prev) => !prev)}
								aria-label={t('mypage:menu.account')}
								aria-expanded={isMenuOpen}
							/>
						</Box>
					)}
					{isResponsiveLayout && isMenuOpen && (
						<Box
							component={'button'}
							className={'mypage-menu-backdrop'}
							aria-label={t('mypage:menu.account')}
							onClick={() => setIsMenuOpen(false)}
						/>
					)}
					<Stack className={'my-page'}>
						<Stack
							className={`back-frame ${
								isResponsiveLayout ? (isMenuOpen ? 'menu-open' : 'menu-closed') : ''
							}`}
						>
							<Stack className={`left-config ${isResponsiveLayout && isMenuOpen ? 'open' : ''}`}>
								<FadeUp><MyMenu /></FadeUp>
							</Stack>
							<Stack className="main-config" mb={'76px'}>
								<Stack className={'list-config'}>
									{activeCategory === 'addTourPackage' && <AnimatedSection><AddTourPackage /></AnimatedSection>}
									{activeCategory === 'myTourPackages' && <AnimatedSection><MyTourPackages /></AnimatedSection>}
									{activeCategory === 'myFavorites' && <AnimatedSection><MyFavorites /></AnimatedSection>}
									{activeCategory === 'recentlyVisited' && <AnimatedSection><RecentlyVisited /></AnimatedSection>}
									{activeCategory === 'myArticles' && <AnimatedSection><MyArticles /></AnimatedSection>}
									{activeCategory === 'writeArticle' && <AnimatedSection><WriteArticle /></AnimatedSection>}
									{activeCategory === 'myProfile' && <AnimatedSection><MyProfile /></AnimatedSection>}
									{activeCategory === 'followers' && (
										<AnimatedSection>
											<MemberFollowers
												initialInput={{ page: 1, limit: 5, search: {} }}
												subscribeHandler={subscribeHandler}
												unsubscribeHandler={unsubscribeHandler}
												likeMemberHandler={likeMemberHandler}
												redirectToMemberPageHandler={redirectToMemberPageHandler}
											/>
										</AnimatedSection>
									)}
									{activeCategory === 'followings' && (
										<AnimatedSection>
											<MemberFollowings
												initialInput={{ page: 1, limit: 5, search: {} }}
												subscribeHandler={subscribeHandler}
												unsubscribeHandler={unsubscribeHandler}
												likeMemberHandler={likeMemberHandler}
												redirectToMemberPageHandler={redirectToMemberPageHandler}
											/>
										</AnimatedSection>
									)}
								</Stack>
							</Stack>
						</Stack>
					</Stack>
				</div>
			</div>
	);
};

export default withLayoutBasic(MyPage);
