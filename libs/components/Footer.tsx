import Link from 'next/link';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box } from '@mui/material';
import moment from 'moment';

const Footer = () => {
	const device = useDeviceDetect();

	const companyLinks = [
		{ label: 'About Us', href: '/about' },
		{ label: 'TourX Reviews', href: '/community?articleCategory=RECOMMEND' },
		{ label: 'Contact Us', href: '/cs' },
		{ label: 'Travel Guides', href: '/community?articleCategory=NEWS' },
		{ label: 'Data Policy', href: '/cs' },
		{ label: 'Cookie Policy', href: '/cs' },
		{ label: 'Legal', href: '/cs' },
		{ label: 'Sitemap', href: '/' },
	];

	const supportLinks = [
		{ label: 'Get in Touch', href: '/cs' },
		{ label: 'Help center', href: '/cs' },
		{ label: 'Live chat', href: '/cs' },
		{ label: 'How it works', href: '/about' },
	];

	const renderFooterBody = (showBottomRight: boolean) => (
		<>
			<Stack className={'footer-top'}>
				<Box component={'div'} className={'expert'}>
					<span>Speak to our expert at</span>
					<a className={'phone'} href={'tel:+18004536744'}>
						1-800-453-6744
					</a>
				</Box>
				<Box component={'div'} className={'follow'}>
					<span>Follow Us</span>
					<div className={'socials'}>
						<FacebookOutlinedIcon />
						<InstagramIcon />
						<TelegramIcon />
						<TwitterIcon />
					</div>
				</Box>
			</Stack>

			<div className={'footer-divider'} />

			<Stack className={'footer-cols'}>
				<Box component={'div'} className={'col contact'}>
					<h4>Contact</h4>
					<p>328 Queensberry Street, North Melbourne VIC3051, Australia.</p>
					<a href={'mailto:hi@tourx.com'} className={'mail'}>
						hi@tourx.com
					</a>
				</Box>
				<Box component={'div'} className={'col'}>
					<h4>Company</h4>
					<ul>
						{companyLinks.map((l) => (
							<li key={l.label}>
								<Link href={l.href}>{l.label}</Link>
							</li>
						))}
					</ul>
				</Box>
				<Box component={'div'} className={'col'}>
					<h4>Support</h4>
					<ul>
						{supportLinks.map((l) => (
							<li key={l.label}>
								<Link href={l.href}>{l.label}</Link>
							</li>
						))}
					</ul>
				</Box>
				<Box component={'div'} className={'col newsletter'}>
					<h4>Newsletter</h4>
					<p>Subscribe to the free newsletter and stay up to date</p>
					<form className={'subscribe'} onSubmit={(e) => e.preventDefault()}>
						<input type={'email'} placeholder={'Your email address'} />
						<button type={'submit'}>Send</button>
					</form>
					<h4 className={'apps-title'}>Mobile Apps</h4>
					<ul className={'apps'}>
						<li>
							<Link href={'/'}>iOS App</Link>
						</li>
						<li>
							<Link href={'/'}>Android App</Link>
						</li>
					</ul>
				</Box>
			</Stack>

			<Stack className={'footer-bottom'}>
				<span>© TourX - All rights reserved. {moment().year()}</span>
				{showBottomRight && <span>Privacy · Terms · Sitemap</span>}
			</Stack>
		</>
	);

	if (device == 'mobile') {
		return <Stack className={'footer-container'}>{renderFooterBody(false)}</Stack>;
	}

	return <Stack className={'footer-container'}>{renderFooterBody(true)}</Stack>;
};

export default Footer;
