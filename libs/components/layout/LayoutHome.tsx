import React, { useEffect } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import FiberContainer from '../common/FiberContainer';
import HeaderFilter from '../homepage/HeaderFilter';
import { userVar } from '../../../apollo/store';
import { useReactiveVar } from '@apollo/client';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutMain = (Component: any) => {
	return (props: any) => {
		const device = useDeviceDetect();
		const user = useReactiveVar(userVar);

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
						<title>Nestar</title>
						<meta name={'title'} content={`Nestar`} />
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
						<title>Nestar</title>
						<meta name={'title'} content={`Nestar`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack className={'header-main'}>
							<FiberContainer />
							<Stack className={'container'}>
								<Stack className={'hero-content'}>
									<span className={'hero-kicker'}>Premium travel marketplace</span>
									<h1>Discover curated tours for every kind of traveler</h1>
									<p>
										Compare trusted agents, handpicked destinations, and package inclusions in one polished travel
										experience.
									</p>
									<div className={'hero-trust-row'}>
										<span>Verified local agents</span>
										<span>Instant package discovery</span>
										<span>Ocean-blue destination guides</span>
									</div>
									<div className={'hero-destination-row'}>
										<strong>Popular now</strong>
										<span>Jeju escapes</span>
										<span>Seoul culture</span>
										<span>Tokyo food tours</span>
										<span>Bali wellness</span>
									</div>
								</Stack>
								<HeaderFilter />
								<Stack className={'hero-category-row'}>
									<span className={'active'}>Adventure</span>
									<span>Cultural</span>
									<span>Family</span>
									<span>Honeymoon</span>
									<span>Cruise</span>
									<span>Business</span>
								</Stack>
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

export default withLayoutMain;
