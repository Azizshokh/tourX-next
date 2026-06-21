import React from 'react';
import { Stack, Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import { TourPackage } from '../../types/tour-package/tour-package';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';

interface TrendTourPackageCardProps {
	tourPackage: TourPackage;
	likeTourPackageHandler: any;
	variant?: 'featured' | 'compact';
}

const TrendTourPackageCard = (props: TrendTourPackageCardProps) => {
	const { tourPackage, variant = 'compact' } = props;
	const router = useRouter();
	const imageUrl = tourPackage?.packageImages?.[0]
		? `${REACT_APP_API_URL}/${tourPackage.packageImages[0]}`
		: '/img/banner/TourX%20background.png';
	const isFeatured = variant === 'featured';
	const priceLabel = `From $${Number(tourPackage?.packagePrice || 0).toLocaleString()}`;
	const ratingLabel = `${Math.min(5, 4.6 + ((tourPackage?.packageRank || 0) % 4) / 10).toFixed(1)} Rating`;
	const toursCount = Math.max(tourPackage?.packageViews || 0, 24);
	const toursLabel = isFeatured ? `${toursCount}+ Tours Available` : `${toursCount}+ Tours`;

	/** HANDLERS **/
	const pushDetailHandler = async (tourPackageId: string) => {
		console.log('ID:', tourPackageId);
		await router.push({
			pathname: '/tour-package/detail',
			query: { id: tourPackageId },
		});
	};

	return (
		<Stack
			className={`trend-card-box ${variant}`}
			key={tourPackage._id}
			onClick={() => {
				pushDetailHandler(tourPackage._id);
			}}
		>
			<span className={'trend-card-media'} style={{ backgroundImage: `url(${imageUrl})` }} />
			<span className={'trend-card-overlay'} />
			<span className={'trend-card-chip'}>{tourPackage.packageTitle || 'Signature Escape'}</span>
			<Box component={'div'} className={'trend-card-content'}>
				<div className={'trend-card-topline'}>
					<span>{tourPackage.packageType}</span>
					{!isFeatured && <strong>{priceLabel}</strong>}
				</div>
				<h3>{tourPackage.packageTitle}</h3>
				<div className={'trend-card-meta'}>
					{isFeatured ? (
						<>
							<span>
								<ExploreOutlinedIcon /> {toursLabel}
							</span>
							<span>
								<StarIcon /> {ratingLabel}
							</span>
						</>
					) : (
						<>
							<span>
								<StarIcon /> {ratingLabel}
							</span>
							<span>• {toursLabel}</span>
						</>
					)}
				</div>
				<p>
					{tourPackage.packageDesc || tourPackage.packageAddress || 'Curated travel experience with trusted TourX experts.'}
				</p>
				<div className={'trend-card-actions'}>
					<button
						type="button"
						onClick={(event) => {
							event.stopPropagation();
							pushDetailHandler(tourPackage._id);
						}}
					>
						{isFeatured ? 'Explore Now' : 'Explore'}
					</button>
				</div>
			</Box>
			{isFeatured && <span className={'trend-card-price'}>{priceLabel}</span>}
		</Stack>
	);
};

export default TrendTourPackageCard;
