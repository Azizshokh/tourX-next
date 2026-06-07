import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { TourPackage as Property } from '../../types/tour-package/tour-package';
import { REACT_APP_API_URL, topPackageRank } from '../../config';
import { formatterStr } from '../../utils';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

interface PropertyBigCardProps {
	property: Property;
	likePropertyHandler?: any;
}

const PropertyBigCard = (props: PropertyBigCardProps) => {
	const { property, likePropertyHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** HANDLERS **/
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
					{property && property?.packageRank >= topPackageRank && (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					)}

					<div className={'price'}>${formatterStr(property?.packagePrice)}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'}>{property?.packageTitle}</strong>
					<p className={'desc'}>{property?.packageAddress}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							<span>{property?.minPeople} min</span>
						</div>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{property?.maxPeople} max</span>
						</div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>{property?.durationDays} days</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<div>
							{property?.hotelIncluded ? <p>Hotel</p> : <span>Hotel</span>}
							{property?.flightIncluded ? <p>Flight</p> : <span>Flight</span>}
						</div>
						<div className="buttons-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{property?.packageViews}</Typography>
							<IconButton
								color={'default'}
								onClick={(e) => {
									e.stopPropagation();
									likePropertyHandler(user, property?._id);
								}}
							>
								{property?.meLiked && property?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteBorderIcon />
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
