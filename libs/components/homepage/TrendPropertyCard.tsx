import React from 'react';
import { Stack, Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import { TourPackage as Property } from '../../types/tour-package/tour-package';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';

interface TrendPropertyCardProps {
	property: Property;
	likePropertyHandler: any;
	variant?: 'featured' | 'compact';
}

const TrendPropertyCard = (props: TrendPropertyCardProps) => {
	const { property, variant = 'compact' } = props;
	const router = useRouter();
	const imageUrl = property?.packageImages?.[0]
		? `${REACT_APP_API_URL}/${property.packageImages[0]}`
		: '/img/banner/TourX%20background.png';
	const isFeatured = variant === 'featured';
	const priceLabel = `From $${Number(property?.packagePrice || 0).toLocaleString()}`;
	const ratingLabel = `${Math.min(5, 4.6 + ((property?.packageRank || 0) % 4) / 10).toFixed(1)} Rating`;
	const toursCount = Math.max(property?.packageViews || 0, 24);
	const toursLabel = isFeatured ? `${toursCount}+ Tours Available` : `${toursCount}+ Tours`;

	/** HANDLERS **/
	const pushDetailHandler = async (propertyId: string) => {
		console.log('ID:', propertyId);
		await router.push({
			pathname: '/tour-package/detail',
			query: { id: propertyId },
		});
	};

	return (
		<Stack
			className={`trend-card-box ${variant}`}
			key={property._id}
			onClick={() => {
				pushDetailHandler(property._id);
			}}
		>
			<span className={'trend-card-media'} style={{ backgroundImage: `url(${imageUrl})` }} />
			<span className={'trend-card-overlay'} />
			<span className={'trend-card-chip'}>{property.packageTitle || 'Signature Escape'}</span>
			<Box component={'div'} className={'trend-card-content'}>
				<div className={'trend-card-topline'}>
					<span>{property.packageType}</span>
					{!isFeatured && <strong>{priceLabel}</strong>}
				</div>
				<h3>{property.packageTitle}</h3>
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
					{property.packageDesc || property.packageAddress || 'Curated travel experience with trusted TourX experts.'}
				</p>
				<div className={'trend-card-actions'}>
					<button
						type="button"
						onClick={(event) => {
							event.stopPropagation();
							pushDetailHandler(property._id);
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

export default TrendPropertyCard;
