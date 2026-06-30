import React from 'react';
import Link from 'next/link';
import { Stack, Box } from '@mui/material';
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useTranslation } from 'next-i18next';

const inspirationItems = [
	{ titleKey: 'home:inspiration.beachEscapes', image: '/img/banner/travelInsparation/beachEscape.png', href: '/tour-package' },
	{ titleKey: 'home:inspiration.adventureTravel', image: '/img/banner/travelInsparation/adventureTravel.png', href: '/tour-package' },
	{ titleKey: 'home:inspiration.culturalJourneys', image: '/img/banner/travelInsparation/culturalJourneys.png', href: '/tour-package' },
	{ titleKey: 'home:inspiration.familyHolidays', image: '/img/banner/travelInsparation/familyHolidays.png', href: '/tour-package' },
	{ titleKey: 'home:inspiration.cityBreaks', image: '/img/banner/travelInsparation/cityBreaks.png', href: '/tour-package' },
	{ titleKey: 'home:inspiration.hiddenRetreats', image: '/img/banner/travelInsparation/hiddenRetreates.png', href: '/tour-package' },
];

const TravelInspiration = () => {
	const device = useDeviceDetect();
	const { t } = useTranslation(['home']);

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
						<span>{t('home:sections.travelInspiration')}</span>
						<p>{t('home:sections.travelInspirationDesc')}</p>
					</div>
				</Stack>
				<div className={'inspiration-grid'}>
					{inspirationItems.map((item) => (
						<Link href={item.href} className={'inspiration-card'} key={item.titleKey}>
							<span className={'inspiration-media'} style={{ backgroundImage: `url(${item.image})` }} />
							<span className={'inspiration-overlay'} />
							<strong>{t(item.titleKey)}</strong>
						</Link>
					))}
				</div>
			</Stack>
		</Stack>
	);
};

export default TravelInspiration;
