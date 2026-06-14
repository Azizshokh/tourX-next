import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import { TourPackage as Property } from '../../types/tour-package/tour-package';
import { REACT_APP_API_URL, topPackageRank } from '../../config';
import { formatterStr } from '../../utils';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';

interface PropertyBigCardProps {
	property: Property;
	likePropertyHandler?: any;
}

const PropertyBigCard = (props: PropertyBigCardProps) => {
	const { property, likePropertyHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();

	const goTourPackageDetailPage = (packageId?: string) => {
		if (!packageId) return;
		router.push({
			pathname: '/tour-package/detail',
			query: { id: packageId },
		});
	};

	if (device === 'mobile') {
		return <div>APARTMEND BIG CARD</div>;
	} else {
		return (
			<Stack className="property-big-card-box" onClick={() => goTourPackageDetailPage(property?._id)}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.packageImages?.[0]})` }}
				>
					<div className={'img-overlay'} />
					{property && property?.packageRank >= topPackageRank && (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					)}
					{property?.packageType && (
						<div className={'pkg-type'}>{property.packageType.replace(/_/g, ' ')}</div>
					)}
					<div className={'price'}>
						{property?.packageCurrency ?? 'USD'} {formatterStr(property?.packagePrice)}
					</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'}>{property?.packageTitle}</strong>
					<p className={'desc'}>
						{[property?.packageCity, property?.packageCountry].filter(Boolean).join(', ')}
					</p>
					<div className={'options'}>
						<div className={'opt-item'}>
							<AccessTimeRoundedIcon className={'opt-icon'} />
							<span>{property?.durationDays} {property?.durationDays === 1 ? 'day' : 'days'}</span>
						</div>
						<div className={'opt-item'}>
							<PeopleOutlinedIcon className={'opt-icon'} />
							<span>{property?.minPeople}–{property?.maxPeople} pax</span>
						</div>
					</div>
					{(property?.flightIncluded || property?.hotelIncluded || property?.guideIncluded) && (
						<div className={'inclusions'}>
							{property?.flightIncluded && <span className={'tag'}>Flight</span>}
							{property?.hotelIncluded && <span className={'tag'}>Hotel</span>}
							{property?.guideIncluded && <span className={'tag'}>Guide</span>}
						</div>
					)}
					<div className={'bott'}>
						<div className="buttons-box">
							<IconButton color={'default'} size={'small'}>
								<RemoveRedEyeIcon fontSize={'small'} />
							</IconButton>
							<Typography className="view-cnt">{property?.packageViews}</Typography>
							<IconButton
								color={'default'}
								size={'small'}
								onClick={(e) => {
									e.stopPropagation();
									likePropertyHandler(user, property?._id);
								}}
							>
								{property?.meLiked && property?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon fontSize={'small'} style={{ color: '#ff8a00' }} />
								) : (
									<FavoriteBorderIcon fontSize={'small'} />
								)}
							</IconButton>
							<Typography className="view-cnt">{property?.packageLikes}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default PropertyBigCard;
