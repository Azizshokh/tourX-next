import React from 'react';
import { Stack, Typography, Box, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import VerifiedIcon from '@mui/icons-material/Verified';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { TourPackage as Property } from '../../types/tour-package/tour-package';
import Link from 'next/link';
import { formatterStr } from '../../utils';
import { REACT_APP_API_URL, topPackageRank } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';

interface PropertyCardType {
	property: Property;
	likePropertyHandler?: any;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
}

const PropertyCard = (props: PropertyCardType) => {
	const { property, likePropertyHandler, myFavorites, recentlyVisited } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath: string = property?.packageImages[0]
		? `${REACT_APP_API_URL}/${property?.packageImages[0]}`
		: '/img/banner/header1.svg';

	const isLiked = myFavorites || (property?.meLiked && property?.meLiked[0]?.myFavorite);
	const isFeatured = property?.packageRank >= topPackageRank;
	const nights = Math.max(0, (property.durationDays ?? 1) - 1);

	if (device === 'mobile') {
		return <div>PROPERTY CARD</div>;
	} else {
		return (
			<Stack direction="row" className="card-config">
				{/* ── Left: image ── */}
				<Box className="card-img-wrap">
					<Link href={{ pathname: '/tour-package/detail', query: { id: property?._id } }}>
						<img src={imagePath} alt={property.packageTitle} className="card-img" />
					</Link>
					{isFeatured && <div className="card-badge badge-featured">FEATURED</div>}
					{!recentlyVisited && (
						<IconButton
							className="fav-btn"
							onClick={(e) => {
								e.preventDefault();
								likePropertyHandler && likePropertyHandler(user, property?._id);
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
								{[property.packageCity, property.packageCountry].filter(Boolean).join(', ')}
							</Typography>
						</Stack>
						<Stack direction="row" className="meta-duration">
							<AccessTimeRoundedIcon className="meta-dur-icon" />
							<Typography className="meta-dur-text">
								{property.durationDays} days {nights} nights
							</Typography>
						</Stack>
					</Stack>

					{/* Title */}
					<Link href={{ pathname: '/tour-package/detail', query: { id: property?._id } }}>
						<Typography className="card-title">{property.packageTitle}</Typography>
					</Link>

					{/* Stats */}
					<Stack direction="row" className="card-stats">
						<PeopleOutlinedIcon className="stat-icon" />
						<Typography className="stat-text">Up to {property.maxPeople} people</Typography>
						{property.packageLikes > 0 && (
							<>
								<span className="stat-dot">·</span>
								<FavoriteIcon sx={{ fontSize: 12, color: '#FF383C' }} />
								<Typography className="stat-text">{property.packageLikes}</Typography>
							</>
						)}
					</Stack>

					{/* Description */}
					{property.packageDesc && (
						<Typography className="card-desc">{property.packageDesc}</Typography>
					)}

					{/* Tags */}
					<Stack direction="row" className="card-tags">
						<Stack direction="row" className="tag-item">
							<VerifiedIcon className="tag-icon" />
							<Typography className="tag-text">Best Price Guarantee</Typography>
						</Stack>
						<span className="tag-sep">·</span>
						<Stack direction="row" className="tag-item">
							<EventAvailableIcon className="tag-icon" />
							<Typography className="tag-text">Free Cancellation</Typography>
						</Stack>
					</Stack>

					{/* Price + CTA */}
					<Stack direction="row" className="card-price-row">
						<Stack direction="row" className="price-block">
							<Typography className="price-from">From</Typography>
							<Typography className="price-value">
								{property.packageCurrency ?? 'USD'} {formatterStr(property.packagePrice)}
							</Typography>
						</Stack>
						<Link href={{ pathname: '/tour-package/detail', query: { id: property?._id } }}>
							<Button className="view-btn" variant="outlined" disableElevation>
								View Details
							</Button>
						</Link>
					</Stack>
				</Box>
			</Stack>
		);
	}
};

export default PropertyCard;
