import React from 'react';
import { motion } from 'framer-motion';
import { fadeUpMotionProps } from '../../config/animations';
import { Stack, Typography, Box, Button } from '@mui/material';
const MotionStack = motion(Stack);
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import VerifiedIcon from '@mui/icons-material/Verified';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { TourPackage } from '../../types/tour-package/tour-package';
import Link from 'next/link';
import { formatterStr } from '../../utils';
import { REACT_APP_API_URL, topPackageRank } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import { useTranslation } from 'next-i18next';

interface TourPackageCardType {
	tourPackage: TourPackage;
	likeTourPackageHandler?: any;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
}

const TourPackageCard = (props: TourPackageCardType) => {
	const { tourPackage, likeTourPackageHandler, myFavorites, recentlyVisited } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const { t } = useTranslation(['common', 'package']);
	const imagePath: string = tourPackage?.packageImages[0]
		? `${REACT_APP_API_URL}/${tourPackage?.packageImages[0]}`
		: '/img/banner/header1.svg';

	const isLiked = myFavorites || (tourPackage?.meLiked && tourPackage?.meLiked[0]?.myFavorite);
	const isFeatured = tourPackage?.packageRank >= topPackageRank;
	const nights = Math.max(0, (tourPackage.durationDays ?? 1) - 1);

	if (device === 'mobile') {
		return <div>{t('common:mobile.packages')}</div>;
	} else {
		return (
			<MotionStack direction="row" className="card-config" {...fadeUpMotionProps}>
				{/* ── Left: image ── */}
				<Box className="card-img-wrap">
					<Link href={{ pathname: '/tour-package/detail', query: { id: tourPackage?._id } }}>
						<img src={imagePath} alt={tourPackage.packageTitle} className="card-img" />
					</Link>
					{isFeatured && <div className="card-badge badge-featured">{t('package:card.featured')}</div>}
					{!recentlyVisited && (
						<IconButton
							className="fav-btn"
							onClick={(e) => {
								e.preventDefault();
								likeTourPackageHandler && likeTourPackageHandler(user, tourPackage?._id);
							}}
						>
							{isLiked ? (
								<FavoriteIcon sx={{ fontSize: 15, color: '#FF383C' }} />
							) : (
								<FavoriteBorderIcon sx={{ fontSize: 15, color: '#fff' }} />
							)}
						</IconButton>
					)}
				</Box>

				{/* ── Right: content ── */}
				<Box className="card-content">
					{/* Location + duration */}
					<Stack direction="row" className="card-meta">
						<Stack direction="row" className="meta-location">
							<LocationOnIcon className="meta-loc-icon" />
							<Typography className="meta-loc-text">
								{[tourPackage.packageCity, tourPackage.packageCountry].filter(Boolean).join(', ')}
							</Typography>
						</Stack>
						<Stack direction="row" className="meta-duration">
							<AccessTimeRoundedIcon className="meta-dur-icon" />
							<Typography className="meta-dur-text">
								{t('package:card.durationNights', { days: tourPackage.durationDays, nights })}
							</Typography>
						</Stack>
					</Stack>

					{/* Title */}
					<Link href={{ pathname: '/tour-package/detail', query: { id: tourPackage?._id } }}>
						<Typography className="card-title">{tourPackage.packageTitle}</Typography>
					</Link>

					{/* Stats */}
					<Stack direction="row" className="card-stats">
						<PeopleOutlinedIcon className="stat-icon" />
						<Typography className="stat-text">{t('package:card.upToPeople', { count: tourPackage.maxPeople })}</Typography>
						{tourPackage.packageLikes > 0 && (
							<>
								<span className="stat-dot">·</span>
								<FavoriteIcon sx={{ fontSize: 12, color: '#FF383C' }} />
								<Typography className="stat-text">{tourPackage.packageLikes}</Typography>
							</>
						)}
					</Stack>

					{/* Description */}
					{tourPackage.packageDesc && (
						<Typography className="card-desc">{tourPackage.packageDesc}</Typography>
					)}

					{/* Tags */}
					<Stack direction="row" className="card-tags">
						<Stack direction="row" className="tag-item">
							<VerifiedIcon className="tag-icon" />
							<Typography className="tag-text">{t('package:card.bestPrice')}</Typography>
						</Stack>
						<span className="tag-sep">·</span>
						<Stack direction="row" className="tag-item">
							<EventAvailableIcon className="tag-icon" />
							<Typography className="tag-text">{t('package:card.freeCancellation')}</Typography>
						</Stack>
					</Stack>

					{/* Price + CTA */}
					<Stack direction="row" className="card-price-row">
						<Stack direction="row" className="price-block">
							<Typography className="price-from">{t('package:card.from')}</Typography>
							<Typography className="price-value">
								{tourPackage.packageCurrency ?? 'USD'} {formatterStr(tourPackage.packagePrice)}
							</Typography>
						</Stack>
						<Link href={{ pathname: '/tour-package/detail', query: { id: tourPackage?._id } }}>
							<Button className="view-btn" variant="outlined" disableElevation>
								{t('package:card.viewDetails')}
							</Button>
						</Link>
					</Stack>
				</Box>
			</MotionStack>
		);
	}
};

export default TourPackageCard;
