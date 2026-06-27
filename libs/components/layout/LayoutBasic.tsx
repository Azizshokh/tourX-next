import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useTranslation } from 'next-i18next';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutBasic = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
		const { t } = useTranslation(['common']);
		const device = useDeviceDetect();
		const [authHeader, setAuthHeader] = useState<boolean>(false);
		const user = useReactiveVar(userVar);

		const memoizedValues = useMemo(() => {
			let title = '',
				desc = '';

			switch (router.pathname) {
				case '/tour-package':
					title = 'layout.packageSearch';
					desc = 'layout.findTrip';
					break;
				case '/agent':
					title = 'layout.agents';
					desc = 'layout.travelExperts';
					break;
				case '/agent/detail':
					title = 'layout.agentPage';
					desc = 'layout.travelExpert';
					break;
				case '/mypage':
					title = 'layout.myPage';
					desc = 'layout.myTravel';
					break;
				case '/community':
					title = 'layout.community';
					desc = 'Home / Community';
					break;
				case '/community/detail':
					title = 'layout.communityDetail';
					desc = 'Home / Community';
					break;
				case '/cs':
					title = 'layout.help';
					desc = 'We are glad to see you again!';
					break;
				case '/about':
					title = 'layout.about';
					desc = 'layout.aboutTourX';
					break;
				case '/account/join':
					title = 'layout.loginSignup';
					desc = 'layout.authProcess';
					setAuthHeader(true);
					break;
				case '/member':
					title = 'layout.memberPage';
					desc = 'Home / Member';
					break;
				default:
					break;
			}

			return { title, desc };
		}, [router.pathname]);

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		/** HANDLERS **/

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>TourX</title>
						<meta name={'title'} content={`TourX`} />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		} else {
			return (
				<>
					<Head>
						<title>TourX</title>
						<meta name={'title'} content={`TourX`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack
							className={`header-basic ${authHeader && 'auth'}`}
						>
							<Stack className={'container'}>
								<strong>{t(memoizedValues.title)}</strong>
								<span>{t(memoizedValues.desc)}</span>
							</Stack>
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Chat />

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutBasic;
