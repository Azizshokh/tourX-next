import React from 'react';
import Link from 'next/link';
import { Stack, Box } from '@mui/material';
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const inspirationItems = [
	{ title: 'Beach Escapes', image: '/img/banner/TourX%20background.png', href: '/tour-package' },
	{ title: 'Adventure Travel', image: '/img/banner/cities/JEJU.webp', href: '/tour-package' },
	{ title: 'Cultural Journeys', image: '/img/banner/cities/GYEONGJU.webp', href: '/tour-package' },
	{ title: 'Family Holidays', image: '/img/banner/cities/BUSAN.webp', href: '/tour-package' },
	{ title: 'City Breaks', image: '/img/banner/cities/SEOUL.webp', href: '/tour-package' },
	{ title: 'Hidden Retreats', image: '/img/banner/cities/CHONJU.webp', href: '/tour-package' },
];

const TravelInspiration = () => {
	const device = useDeviceDetect();

	return (
		<Stack className={'travel-inspiration'}>
			{device !== 'mobile' && (
				<Box component={'div'} className={'inspiration-bg-icons'} aria-hidden={'true'}>
					<span className={'inspiration-bg-icon compass'}>
						<ExploreRoundedIcon />
					</span>
					<span className={'inspiration-bg-icon map'}>
						<MapRoundedIcon />
					</span>
					<span className={'inspiration-bg-icon camera'}>
						<PhotoCameraRoundedIcon />
					</span>
					<span className={'inspiration-bg-icon discover'}>
						<TravelExploreRoundedIcon />
					</span>
				</Box>
			)}
			<Stack className={'container'}>
				<Stack className={'info-box'}>
					<div className={'left'}>
						<span>Travel Inspiration</span>
						<p>Choose your journey based on what moves you.</p>
					</div>
				</Stack>
				<div className={'inspiration-grid'}>
					{inspirationItems.map((item) => (
						<Link href={item.href} className={'inspiration-card'} key={item.title}>
							<span className={'inspiration-media'} style={{ backgroundImage: `url(${item.image})` }} />
							<span className={'inspiration-overlay'} />
							<strong>{item.title}</strong>
						</Link>
					))}
				</div>
			</Stack>
		</Stack>
	);
};

export default TravelInspiration;
