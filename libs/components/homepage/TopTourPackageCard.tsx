import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { TourPackage } from '../../types/tour-package/tour-package';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { resolveImageUrl } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useTranslation } from 'next-i18next';

interface TopTourPackageCardProps {
	tourPackage: TourPackage;
	likeTourPackageHandler: any;
}

const TopTourPackageCard = (props: TopTourPackageCardProps) => {
	const { tourPackage, likeTourPackageHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { t } = useTranslation(['common', 'package']);

	/** HANDLERS **/
	const pushDetailHandler = async (tourPackageId: string) => {
		console.log('ID:', tourPackageId);
		await router.push({
			pathname: '/tour-package/detail',
			query: { id: tourPackageId },
		});
	};

	if (device === 'mobile') {
		return (
			<Stack className="top-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${resolveImageUrl(tourPackage?.packageImages[0])})` }}
					onClick={() => {
						pushDetailHandler(tourPackage._id);
					}}
				>
					<div className={'price-badge'}>${tourPackage?.packagePrice}</div>
					<span className={'rating-badge'}>{tourPackage?.packageLikes || 0} {t('common:labels.saved')}</span>
				</Box>
				<Box component={'div'} className={'info'}>
					<div className={'meta-row'}>
						<span>{tourPackage?.packageCountry || t('common:labels.destination')}</span>
						<em>{tourPackage?.packageType}</em>
					</div>
					<strong
						className={'title'}
						onClick={() => {
							pushDetailHandler(tourPackage._id);
						}}
					>
						{tourPackage?.packageTitle}
					</strong>
					<p className={'desc'}>{tourPackage?.packageAddress}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							<span>{tourPackage?.minPeople} {t('common:labels.min')}</span>
						</div>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{tourPackage?.maxPeople} {t('common:labels.max')}</span>
						</div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>{t('package:card.durationDays', { count: tourPackage?.durationDays ?? 0 })}</span>
						</div>
					</div>
					<div className={'trust-row'}>
						<span>{tourPackage.guideIncluded ? t('common:labels.guide') : t('common:labels.selfGuided')}</span>
						<span>{tourPackage.hotelIncluded ? t('common:labels.hotel') : t('common:labels.flexibleStay')}</span>
						<span>{tourPackage.flightIncluded ? t('common:labels.flight') : t('common:labels.localPickup')}</span>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>
							{' '}
							{tourPackage.hotelIncluded ? t('common:labels.hotel') : ''} {tourPackage.hotelIncluded && tourPackage.flightIncluded && '/'}{' '}
							{tourPackage.flightIncluded ? t('common:labels.flight') : ''}
						</p>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{tourPackage?.packageViews}</Typography>
							<IconButton color={'default'} onClick={() => likeTourPackageHandler(user, tourPackage?._id)}>
								{tourPackage?.meLiked && tourPackage?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{tourPackage?.packageLikes}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="top-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${resolveImageUrl(tourPackage?.packageImages[0])})` }}
					onClick={() => {
						pushDetailHandler(tourPackage._id);
					}}
				>
					<div className={'price-badge'}>${tourPackage?.packagePrice}</div>
					<span className={'rating-badge'}>{tourPackage?.packageLikes || 0} {t('common:labels.saved')}</span>
				</Box>
				<Box component={'div'} className={'info'}>
					<div className={'meta-row'}>
						<span>{tourPackage?.packageCountry || t('common:labels.destination')}</span>
						<em>{tourPackage?.packageType}</em>
					</div>
					<strong
						className={'title'}
						onClick={() => {
							pushDetailHandler(tourPackage._id);
						}}
					>
						{tourPackage?.packageTitle}
					</strong>
					<p className={'desc'}>{tourPackage?.packageAddress}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							<span>{tourPackage?.minPeople} {t('common:labels.min')}</span>
						</div>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{tourPackage?.maxPeople} {t('common:labels.max')}</span>
						</div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>{t('package:card.durationDays', { count: tourPackage?.durationDays ?? 0 })}</span>
						</div>
					</div>
					<div className={'trust-row'}>
						<span>{tourPackage.guideIncluded ? t('common:labels.guide') : t('common:labels.selfGuided')}</span>
						<span>{tourPackage.hotelIncluded ? t('common:labels.hotel') : t('common:labels.flexibleStay')}</span>
						<span>{tourPackage.flightIncluded ? t('common:labels.flight') : t('common:labels.localPickup')}</span>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>
							{' '}
							{tourPackage.hotelIncluded ? t('common:labels.hotel') : ''} {tourPackage.hotelIncluded && tourPackage.flightIncluded && '/'}{' '}
							{tourPackage.flightIncluded ? t('common:labels.flight') : ''}
						</p>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{tourPackage?.packageViews}</Typography>
							<IconButton color={'default'} onClick={() => likeTourPackageHandler(user, tourPackage?._id)}>
								{tourPackage?.meLiked && tourPackage?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{tourPackage?.packageLikes}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default TopTourPackageCard;
