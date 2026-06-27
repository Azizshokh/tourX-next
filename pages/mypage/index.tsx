import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Box, Stack } from '@mui/material';
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
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
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
import { useTranslation } from 'next-i18next';
import { SUBSCRIBE, UNSUBSCRIBE, LIKE_TARGET_MEMBER } from '../../apollo/user/mutation';
import { Messages } from '../../libs/config';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await getI18nProps(locale, MYPAGE_NAMESPACES)),
	},
});

const MyPage: NextPage = () => {
	const device = useDeviceDetect();
	const { t } = useTranslation(['common', 'mypage']);
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const category: any = router.query?.category ?? 'myProfile';
	const activeCategory =
		category === 'addProperty' ? 'addTourPackage' : category === 'myProperties' ? 'myTourPackages' : category;

	/** APOLLO REQUESTS **/
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

	/** LIFECYCLES **/
	useEffect(() => {
		if (!user._id) router.push('/').then();
	}, [user]);

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
			console.log('ERROR, likeMemberHandler: ', err.message);
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

	if (device === 'mobile') {
		return <div>{t('common:mobile.mypage')}</div>;
	} else {
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
					<Stack className={'my-page'}>
						<Stack className={'back-frame'}>
							<Stack className={'left-config'}>
								<MyMenu />
							</Stack>
							<Stack className="main-config" mb={'76px'}>
								<Stack className={'list-config'}>
									{activeCategory === 'addTourPackage' && <AddTourPackage />}
									{activeCategory === 'myTourPackages' && <MyTourPackages />}
									{activeCategory === 'myFavorites' && <MyFavorites />}
									{activeCategory === 'recentlyVisited' && <RecentlyVisited />}
									{activeCategory === 'myArticles' && <MyArticles />}
									{activeCategory === 'writeArticle' && <WriteArticle />}
									{activeCategory === 'myProfile' && <MyProfile />}
									{activeCategory === 'followers' && (
										<MemberFollowers
											initialInput={{ page: 1, limit: 5, search: {} }}
											subscribeHandler={subscribeHandler}
											unsubscribeHandler={unsubscribeHandler}
											likeMemberHandler={likeMemberHandler}
											redirectToMemberPageHandler={redirectToMemberPageHandler}
										/>
									)}
									{activeCategory === 'followings' && (
										<MemberFollowings
											initialInput={{ page: 1, limit: 5, search: {} }}
											subscribeHandler={subscribeHandler}
											unsubscribeHandler={unsubscribeHandler}
											likeMemberHandler={likeMemberHandler}
											redirectToMemberPageHandler={redirectToMemberPageHandler}
										/>
									)}
								</Stack>
							</Stack>
						</Stack>
					</Stack>
				</div>
			</div>
		);
	}
};

export default withLayoutBasic(MyPage);
