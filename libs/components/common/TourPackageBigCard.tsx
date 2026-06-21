import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import { TourPackage } from '../../types/tour-package/tour-package';
import { REACT_APP_API_URL, topPackageRank } from '../../config';
import { formatterStr } from '../../utils';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';

interface TourPackageBigCardProps {
	tourPackage?: TourPackage;
	property?: TourPackage;
	likeTourPackageHandler?: any;
}

const TourPackageBigCard = (props: TourPackageBigCardProps) => {
	const { tourPackage: inputTourPackage, property, likeTourPackageHandler } = props;
	const tourPackage = inputTourPackage ?? property;
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
		return <div>TOUR PACKAGE BIG CARD</div>;
	} else {
		return (
			<Stack className="tour-package-big-card-box" onClick={() => goTourPackageDetailPage(tourPackage?._id)}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${tourPackage?.packageImages?.[0]})` }}
				>
					<div className={'img-overlay'} />
					{tourPackage && tourPackage?.packageRank >= topPackageRank && (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					)}
					{tourPackage?.packageType && (
						<div className={'pkg-type'}>{tourPackage.packageType.replace(/_/g, ' ')}</div>
					)}
					<div className={'price'}>
						{tourPackage?.packageCurrency ?? 'USD'} {formatterStr(tourPackage?.packagePrice)}
					</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'}>{tourPackage?.packageTitle}</strong>
					<p className={'desc'}>
						{[tourPackage?.packageCity, tourPackage?.packageCountry].filter(Boolean).join(', ')}
					</p>
					<div className={'options'}>
						<div className={'opt-item'}>
							<AccessTimeRoundedIcon className={'opt-icon'} />
							<span>{tourPackage?.durationDays} {tourPackage?.durationDays === 1 ? 'day' : 'days'}</span>
						</div>
						<div className={'opt-item'}>
							<PeopleOutlinedIcon className={'opt-icon'} />
							<span>{tourPackage?.minPeople}–{tourPackage?.maxPeople} pax</span>
						</div>
					</div>
					{(tourPackage?.flightIncluded || tourPackage?.hotelIncluded || tourPackage?.guideIncluded) && (
						<div className={'inclusions'}>
							{tourPackage?.flightIncluded && <span className={'tag'}>Flight</span>}
							{tourPackage?.hotelIncluded && <span className={'tag'}>Hotel</span>}
							{tourPackage?.guideIncluded && <span className={'tag'}>Guide</span>}
						</div>
					)}
					<div className={'bott'}>
						<div className="buttons-box">
							<IconButton color={'default'} size={'small'}>
								<RemoveRedEyeIcon fontSize={'small'} />
							</IconButton>
							<Typography className="view-cnt">{tourPackage?.packageViews}</Typography>
							<IconButton
								color={'default'}
								size={'small'}
								onClick={(e) => {
									e.stopPropagation();
									likeTourPackageHandler(user, tourPackage?._id);
								}}
							>
								{tourPackage?.meLiked && tourPackage?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon fontSize={'small'} style={{ color: '#ff8a00' }} />
								) : (
									<FavoriteBorderIcon fontSize={'small'} />
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

export default TourPackageBigCard;
