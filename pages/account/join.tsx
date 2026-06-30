import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { logIn, signUp } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { getI18nProps, AUTH_NAMESPACES } from '../../libs/i18n';
import { useTranslation } from 'next-i18next';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import LuggageRoundedIcon from '@mui/icons-material/LuggageRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import BeachAccessRoundedIcon from '@mui/icons-material/BeachAccessRounded';
import AnchorRoundedIcon from '@mui/icons-material/AnchorRounded';
import SailingRoundedIcon from '@mui/icons-material/SailingRounded';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import HikingRoundedIcon from '@mui/icons-material/HikingRounded';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await getI18nProps(locale, AUTH_NAMESPACES)),
	},
});

const Join: NextPage = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const { t } = useTranslation(['common', 'auth']);
	const [input, setInput] = useState({ nick: '', password: '', phone: '', type: 'USER' });
	const [loginView, setLoginView] = useState<boolean>(true);

	/** HANDLERS **/
	const viewChangeHandler = (state: boolean) => {
		setLoginView(state);
	};

	const handleInput = useCallback((name: any, value: any) => {
		setInput((prev) => {
			return { ...prev, [name]: value };
		});
	}, []);

	const doLogin = useCallback(async () => {
		try {
			await logIn(input.nick, input.password);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	const doSignUp = useCallback(async () => {
		try {
			await signUp(input.nick, input.password, input.phone, input.type);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	if (device === 'mobile') {
		return (
			<Stack className={'join-page'}>
				<Stack className={'container'}>
					<Stack className={'main'}>
						<Stack className={'left'}>
							<Box className={'logo'}>
								<img src="/img/logo/TourX.svg" alt="TourX" />
								<span>TourX</span>
							</Box>

							<Box className={'info'}>
								<Typography className={'info-title'}>
									{loginView ? t('auth:welcomeBack') : t('auth:createAccount')}
								</Typography>
								<Typography className={'info-sub'}>
									{loginView ? t('auth:signInJourney') : t('auth:joinTourX')}
								</Typography>
							</Box>

							<Box className={'input-wrap'}>
								<div className={'input-box'}>
									<span>{t('auth:nickname')}</span>
									<div className={'input-inner'}>
										<AccountCircleRoundedIcon className={'input-icon'} />
										<input
											type="text"
											placeholder={t('auth:enterNickname')}
											onChange={(e) => handleInput('nick', e.target.value)}
											onKeyDown={(event) => {
												if (event.key === 'Enter' && loginView) doLogin();
												if (event.key === 'Enter' && !loginView) doSignUp();
											}}
										/>
									</div>
								</div>

								<div className={'input-box'}>
									<span>{t('auth:password')}</span>
									<div className={'input-inner'}>
										<LockRoundedIcon className={'input-icon'} />
										<input
											type="password"
											placeholder={t('auth:enterPassword')}
											onChange={(e) => handleInput('password', e.target.value)}
											onKeyDown={(event) => {
												if (event.key === 'Enter' && loginView) doLogin();
												if (event.key === 'Enter' && !loginView) doSignUp();
											}}
										/>
									</div>
								</div>

								{!loginView && (
									<div className={'input-box'}>
										<span>{t('auth:phone')}</span>
										<div className={'input-inner'}>
											<LocalPhoneRoundedIcon className={'input-icon'} />
											<input
												type="text"
												placeholder={t('auth:enterPhone')}
												onChange={(e) => handleInput('phone', e.target.value)}
												onKeyDown={(event) => {
													if (event.key === 'Enter') doSignUp();
												}}
											/>
										</div>
									</div>
								)}
							</Box>

							<Box className={'register'}>
								{!loginView && (
									<div className={'type-option'}>
										<span className={'type-label'}>{t('auth:registerAs')}</span>
										<div className={'type-btns'}>
											<button
												className={`type-btn${input.type === 'USER' ? ' active' : ''}`}
												onClick={() => handleInput('type', 'USER')}
											>
												<PersonRoundedIcon />
												{t('auth:user')}
											</button>
											<button
												className={`type-btn${input.type === 'AGENT' ? ' active' : ''}`}
												onClick={() => handleInput('type', 'AGENT')}
											>
												<SupportAgentRoundedIcon />
												{t('auth:agent')}
											</button>
										</div>
									</div>
								)}

								{loginView && (
									<div className={'remember-info'}>
										<FormGroup>
											<FormControlLabel control={<Checkbox defaultChecked size="small" />} label={t('auth:rememberMe')} />
										</FormGroup>
										<a>{t('auth:lostPassword')}</a>
									</div>
								)}

								<Button
									className={'submit-btn'}
									endIcon={<ArrowForwardRoundedIcon />}
									disabled={
										loginView
											? input.nick === '' || input.password === ''
											: input.nick === '' || input.password === '' || input.phone === '' || input.type === ''
									}
									onClick={loginView ? doLogin : doSignUp}
								>
									{loginView ? t('auth:signIn') : t('auth:createAccountButton')}
								</Button>
							</Box>

							<Box className={'ask-info'}>
								{loginView ? (
									<p>
										{t('auth:noAccount')}
										<b onClick={() => viewChangeHandler(false)}>{t('auth:signUp')}</b>
									</p>
								) : (
									<p>
										{t('auth:hasAccount')}
										<b onClick={() => viewChangeHandler(true)}>{t('auth:signIn')}</b>
									</p>
								)}
							</Box>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'join-page'}>
				<Stack className={'container'}>
					<Stack className={'main'}>

						{/* ── LEFT: form ── */}
						<Stack className={'left'}>
							<Box className={'logo'}>
								<img src="/img/logo/TourX.svg" alt="TourX" />
								<span>TourX</span>
							</Box>

							<Box className={'info'}>
								<Typography className={'info-title'}>
									{loginView ? t('auth:welcomeBack') : t('auth:createAccount')}
								</Typography>
								<Typography className={'info-sub'}>
									{loginView ? t('auth:signInJourney') : t('auth:joinTourX')}
								</Typography>
							</Box>

							<Box className={'input-wrap'}>
								<div className={'input-box'}>
									<span>{t('auth:nickname')}</span>
									<div className={'input-inner'}>
										<AccountCircleRoundedIcon className={'input-icon'} />
										<input
											type="text"
											placeholder={t('auth:enterNickname')}
											onChange={(e) => handleInput('nick', e.target.value)}
											onKeyDown={(event) => {
												if (event.key === 'Enter' && loginView) doLogin();
												if (event.key === 'Enter' && !loginView) doSignUp();
											}}
										/>
									</div>
								</div>

								<div className={'input-box'}>
									<span>{t('auth:password')}</span>
									<div className={'input-inner'}>
										<LockRoundedIcon className={'input-icon'} />
										<input
											type="password"
											placeholder={t('auth:enterPassword')}
											onChange={(e) => handleInput('password', e.target.value)}
											onKeyDown={(event) => {
												if (event.key === 'Enter' && loginView) doLogin();
												if (event.key === 'Enter' && !loginView) doSignUp();
											}}
										/>
									</div>
								</div>

								{!loginView && (
									<div className={'input-box'}>
										<span>{t('auth:phone')}</span>
										<div className={'input-inner'}>
											<LocalPhoneRoundedIcon className={'input-icon'} />
											<input
												type="text"
												placeholder={t('auth:enterPhone')}
												onChange={(e) => handleInput('phone', e.target.value)}
												onKeyDown={(event) => {
													if (event.key === 'Enter') doSignUp();
												}}
											/>
										</div>
									</div>
								)}
							</Box>

							<Box className={'register'}>
								{!loginView && (
									<div className={'type-option'}>
										<span className={'type-label'}>{t('auth:registerAs')}</span>
										<div className={'type-btns'}>
											<button
												className={`type-btn${input.type === 'USER' ? ' active' : ''}`}
												onClick={() => handleInput('type', 'USER')}
											>
												<PersonRoundedIcon />
												{t('auth:user')}
											</button>
											<button
												className={`type-btn${input.type === 'AGENT' ? ' active' : ''}`}
												onClick={() => handleInput('type', 'AGENT')}
											>
												<SupportAgentRoundedIcon />
												{t('auth:agent')}
											</button>
										</div>
									</div>
								)}

								{loginView && (
									<div className={'remember-info'}>
										<FormGroup>
											<FormControlLabel control={<Checkbox defaultChecked size="small" />} label={t('auth:rememberMe')} />
										</FormGroup>
										<a>{t('auth:lostPassword')}</a>
									</div>
								)}

								<Button
									className={'submit-btn'}
									endIcon={<ArrowForwardRoundedIcon />}
									disabled={
										loginView
											? input.nick === '' || input.password === ''
											: input.nick === '' || input.password === '' || input.phone === '' || input.type === ''
									}
									onClick={loginView ? doLogin : doSignUp}
								>
									{loginView ? t('auth:signIn') : t('auth:createAccountButton')}
								</Button>
							</Box>

							<Box className={'ask-info'}>
								{loginView ? (
									<p>
										{t('auth:noAccount')}
										<b onClick={() => viewChangeHandler(false)}>{t('auth:signUp')}</b>
									</p>
								) : (
									<p>
										{t('auth:hasAccount')}
										<b onClick={() => viewChangeHandler(true)}>{t('auth:signIn')}</b>
									</p>
								)}
							</Box>
						</Stack>

						{/* ── RIGHT: decorative panel ── */}
						<Stack className={'right'}>
							<Box component={'div'} className={'join-bg-icons'} aria-hidden={'true'}>
								<span className={'join-bg-icon plane'}><FlightTakeoffRoundedIcon /></span>
								<span className={'join-bg-icon earth'}><PublicRoundedIcon /></span>
								<span className={'join-bg-icon bag'}><LuggageRoundedIcon /></span>
								<span className={'join-bg-icon location'}><LocationOnRoundedIcon /></span>
								<span className={'join-bg-icon compass'}><ExploreRoundedIcon /></span>
								<span className={'join-bg-icon map'}><MapRoundedIcon /></span>
								<span className={'join-bg-icon beach'}><BeachAccessRoundedIcon /></span>
								<span className={'join-bg-icon anchor'}><AnchorRoundedIcon /></span>
								<span className={'join-bg-icon sail'}><SailingRoundedIcon /></span>
								<span className={'join-bg-icon sun'}><WbSunnyRoundedIcon /></span>
								<span className={'join-bg-icon discover'}><TravelExploreRoundedIcon /></span>
								<span className={'join-bg-icon hike'}><HikingRoundedIcon /></span>
							</Box>
							<Box className={'right-content'}>
								<Typography className={'right-tagline'}>{t('auth:exploreWorld')}</Typography>
								<Typography className={'right-sub'}>{t('auth:platformTagline')}</Typography>
							</Box>
						</Stack>

					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(Join);
