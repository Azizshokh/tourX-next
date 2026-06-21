import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { TourPackage } from '../../types/tour-package/tour-package';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL, topPackageRank } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface PopularTourPackageCardProps {
	tourPackage: TourPackage;
}

const PopularTourPackageCard = (props: PopularTourPackageCardProps) => {
	const { tourPackage } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

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
			<Stack className="popular-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${tourPackage?.packageImages[0]})` }}
					onClick={() => {
						pushDetailHandler(tourPackage._id);
					}}
				>
					{tourPackage && tourPackage?.packageRank >= topPackageRank ? (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					) : (
						''
					)}

					<div className={'price'}>${tourPackage.packagePrice}</div>
					<span className={'rating-badge'}>{tourPackage.packageViews || 0} views</span>
				</Box>
				<Box component={'div'} className={'info'}>
					<div className={'meta-row'}>
						<span>{tourPackage.packageCountry || 'Popular destination'}</span>
						<em>{tourPackage.packageType}</em>
					</div>
					<strong
						className={'title'}
						onClick={() => {
							pushDetailHandler(tourPackage._id);
						}}
					>
						{tourPackage.packageTitle}
					</strong>
					<p className={'desc'}>{tourPackage.packageAddress}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							<span>{tourPackage?.minPeople} min</span>
						</div>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{tourPackage?.maxPeople} max</span>
						</div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>{tourPackage?.durationDays} days</span>
						</div>
					</div>
					<div className={'trust-row'}>
						<span>{tourPackage.guideIncluded ? 'Guide' : 'Self guided'}</span>
						<span>{tourPackage.hotelIncluded ? 'Hotel' : 'Flexible stay'}</span>
						<span>{tourPackage.flightIncluded ? 'Flight' : 'Local pickup'}</span>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>{tourPackage?.hotelIncluded ? 'Hotel' : 'package'}</p>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{tourPackage?.packageViews}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		const destinationName = tourPackage?.packageCountry || tourPackage?.packageTitle || 'Destination';
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
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${tourPackage?.packageImages[0]})` }}
				/>
				<span className={'card-shade'} />

				{tourPackage && tourPackage?.packageRank >= topPackageRank && (
					<div className={'card-top-badge'}>
						<img src="/img/icons/electricity.svg" alt="" />
						<span>Top</span>
					</div>
				)}

				<div className={'card-base'}>
					<strong className={'city'}>{destinationName}</strong>
					<span className={'tours'}>{toursCount}+ Tours</span>
				</div>

				<div className={'card-hover'}>
					<div className={'hover-meta'}>
						<span className={'price'}>From ${tourPackage?.packagePrice}</span>
						<span className={'dot'}>•</span>
						<span className={'duration'}>{tourPackage?.durationDays} days</span>
					</div>
					<p className={'hover-title'}>{tourPackage?.packageTitle}</p>
					<div className={'hover-cta'}>
						<span>Explore Tours</span>
						<div className={'view-like-box'}>
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{tourPackage?.packageViews}</Typography>
						</div>
					</div>
				</div>
			</Stack>
		);
	}
};

export default PopularTourPackageCard;
