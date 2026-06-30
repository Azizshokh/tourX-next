import React from 'react';
import { Stack, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { TourPackage } from '../../types/tour-package/tour-package';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { resolveImageUrl, topPackageRank } from '../../config';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

interface PopularTourPackageCardProps {
	tourPackage: TourPackage;
}

const PopularTourPackageCard = (props: PopularTourPackageCardProps) => {
	const { tourPackage } = props;
	const router = useRouter();
	const { t } = useTranslation(['common', 'package']);

	/** HANDLERS **/
	const pushDetailHandler = async (tourPackageId: string) => {
		console.log('ID:', tourPackageId);
		await router.push({
			pathname: '/tour-package/detail',
			query: { id: tourPackageId },
		});
	};

	const destinationName = tourPackage?.packageCountry || tourPackage?.packageTitle || t('common:labels.destination');
	const toursCount = Math.max(20, Math.round((tourPackage?.packageViews || 100) / 10) * 10);

	return (
		<Stack
			className="popular-card-box"
			onClick={() => {
				pushDetailHandler(tourPackage._id);
			}}
		>
			<span
				className={'card-media'}
				style={{ backgroundImage: `url(${resolveImageUrl(tourPackage?.packageImages[0])})` }}
			/>
			<span className={'card-shade'} />

			{tourPackage && tourPackage?.packageRank >= topPackageRank && (
				<div className={'card-top-badge'}>
					<img src="/img/icons/electricity.svg" alt="" />
					<span>{t('package:card.top')}</span>
				</div>
			)}

			<div className={'card-base'}>
				<strong className={'city'}>{destinationName}</strong>
				<span className={'tours'}>{toursCount}+ {t('common:labels.tours')}</span>
			</div>

			<div className={'card-hover'}>
				<div className={'hover-meta'}>
					<span className={'price'}>{t('package:card.from')} ${tourPackage?.packagePrice}</span>
					<span className={'dot'}>•</span>
					<span className={'duration'}>{t('package:card.durationDays', { count: tourPackage?.durationDays ?? 0 })}</span>
				</div>
				<p className={'hover-title'}>{tourPackage?.packageTitle}</p>
				<div className={'hover-cta'}>
					<span>{t('actions.exploreTours')}</span>
					<div className="view-like-box">
						<IconButton color={'default'}>
							<RemoveRedEyeIcon />
						</IconButton>
						<Typography className="view-cnt">{tourPackage?.packageViews}</Typography>
					</div>
				</div>
			</div>
		</Stack>
	);
};

export default PopularTourPackageCard;
