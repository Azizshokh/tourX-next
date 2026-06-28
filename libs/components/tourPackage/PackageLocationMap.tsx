import React, { MouseEvent, useEffect, useMemo, useState } from 'react';
import { Button, IconButton, Stack, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MapIcon from '@mui/icons-material/Map';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'next-i18next';

interface PackageLocationMapProps {
	packageCountry?: string;
	packageCity?: string;
	packageAddress?: string;
	packageTitle?: string;
}

const PackageLocationMap = ({
	packageCountry,
	packageCity,
	packageAddress,
	packageTitle,
}: PackageLocationMapProps) => {
	const { t } = useTranslation('package');
	const [isMapOpen, setIsMapOpen] = useState(false);

	const locationQuery = useMemo(
		() => [packageAddress, packageCity, packageCountry].filter(Boolean).join(', '),
		[packageAddress, packageCity, packageCountry],
	);

	const encodedQuery = encodeURIComponent(locationQuery);
	const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
	const embedUrl = `https://www.google.com/maps?q=${encodedQuery}&output=embed`;

	useEffect(() => {
		if (!isMapOpen) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setIsMapOpen(false);
		};
		const previousOverflow = document.body.style.overflow;

		document.addEventListener('keydown', handleKeyDown);
		document.body.style.overflow = 'hidden';

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.body.style.overflow = previousOverflow;
		};
	}, [isMapOpen]);

	const openGoogleMaps = (event?: MouseEvent<HTMLElement>) => {
		event?.preventDefault();
		event?.stopPropagation();
		window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
	};

	const openMapModal = (event: MouseEvent<HTMLElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setIsMapOpen(true);
	};

	if (!locationQuery) {
		return (
			<Stack className={'package-location-map'}>
				<Stack className={'map-fallback'}>
					<MapIcon />
					<Typography>{t('map.locationUnavailable')}</Typography>
				</Stack>
			</Stack>
		);
	}

	return (
		<Stack className={'package-location-map'}>
			<Stack className={'map-title-row'}>
				<Stack className={'map-title-copy'}>
					<LocationOnIcon />
					<Stack>
						<Typography className={'map-kicker'}>{t('map.title')}</Typography>
						<Typography className={'map-address'}>{locationQuery}</Typography>
					</Stack>
				</Stack>
			</Stack>

			<div
				className={'map-preview'}
				onClick={openMapModal}
				onKeyDown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						event.preventDefault();
						event.stopPropagation();
						setIsMapOpen(true);
					}
				}}
				role={'button'}
				tabIndex={0}
				aria-label={t('map.openLarge')}
			>
				<iframe
					className={'map-preview-frame'}
					src={embedUrl}
					title={t('map.previewTitle', { title: packageTitle || locationQuery })}
					loading={'lazy'}
					referrerPolicy={'no-referrer-when-downgrade'}
				/>
				<span className={'map-preview-overlay'}>
					<MapIcon />
					{t('map.openLarge')}
				</span>
			</div>

			{isMapOpen && (
				<Stack className={'map-modal-backdrop'} onClick={() => setIsMapOpen(false)} role={'presentation'}>
					<Stack
						className={'map-modal'}
						onClick={(event) => event.stopPropagation()}
						role={'dialog'}
						aria-modal={'true'}
						aria-label={t('map.dialogLabel')}
					>
						<Stack className={'map-modal-header'}>
							<Stack className={'map-modal-title'}>
								<LocationOnIcon />
								<Stack>
									<Typography className={'map-modal-heading'}>{t('map.title')}</Typography>
									<Typography className={'map-modal-subtitle'}>
										{[packageCity, packageCountry].filter(Boolean).join(', ') || locationQuery}
									</Typography>
								</Stack>
							</Stack>
							<IconButton className={'map-close-button'} aria-label={t('map.close')} onClick={() => setIsMapOpen(false)}>
								<CloseIcon />
							</IconButton>
						</Stack>
						<iframe
							className={'map-modal-frame'}
							src={embedUrl}
							title={t('map.previewTitle', { title: packageTitle || locationQuery })}
							loading={'lazy'}
							referrerPolicy={'no-referrer-when-downgrade'}
						/>
						<Stack className={'map-modal-footer'}>
							<Button className={'map-open-button'} onClick={openGoogleMaps} endIcon={<OpenInNewIcon />}>
								{t('map.openGoogle')}
							</Button>
						</Stack>
					</Stack>
				</Stack>
			)}
		</Stack>
	);
};

export default PackageLocationMap;
