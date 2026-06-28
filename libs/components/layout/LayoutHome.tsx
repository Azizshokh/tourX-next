import React, { useEffect } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import HeaderFilter from '../homepage/HeaderFilter';
import { userVar } from '../../../apollo/store';
import { useReactiveVar } from '@apollo/client';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { fadeUpMotionProps } from '../../config/animations';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const MotionStack = motion(Stack);

const withLayoutMain = (Component: any) => {
	return (props: any) => {
		const device = useDeviceDetect();
		const user = useReactiveVar(userVar);
		const { t } = useTranslation(['home']);

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

						<Stack className={'header-main'}>
							<span className={'hero-video-overlay'} />
							<MotionStack className={'container'} {...fadeUpMotionProps}>
								<Stack className={'hero-content'}>
									<span className={'hero-kicker'}>{t('home:hero.kicker')}</span>
									<h1>
										{t('home:hero.titlePrefix')} <span>{t('home:hero.titleAccent')}</span>
									</h1>
									<p>{t('home:hero.description')}</p>
									<Stack className={'hero-trust-row'}>
										<strong>{t('home:hero.travelers')}</strong>
										<strong>{t('home:hero.rating')}</strong>
										<strong>{t('home:hero.destinations')}</strong>
									</Stack>
								</Stack>
								<HeaderFilter />
							</MotionStack>
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

export default withLayoutMain;
