import React from 'react';
import Link from 'next/link';
import { Stack } from '@mui/material';

const inspirationItems = [
	{ title: 'Beach Escapes', image: '/img/banner/TourX%20background.png', href: '/tour-package' },
	{ title: 'Adventure Travel', image: '/img/banner/cities/JEJU.webp', href: '/tour-package' },
	{ title: 'Cultural Journeys', image: '/img/banner/cities/GYEONGJU.webp', href: '/tour-package' },
	{ title: 'Family Holidays', image: '/img/banner/cities/BUSAN.webp', href: '/tour-package' },
	{ title: 'City Breaks', image: '/img/banner/cities/SEOUL.webp', href: '/tour-package' },
	{ title: 'Hidden Retreats', image: '/img/banner/cities/CHONJU.webp', href: '/tour-package' },
];

const TravelInspiration = () => {
	return (
		<Stack className={'travel-inspiration'}>
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
