import { Menu, MenuItem, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUpMotionProps } from '../../config/animations';
const MotionStack = motion(Stack);
import useDeviceDetect from '../../hooks/useDeviceDetect';
import IconButton from '@mui/material/IconButton';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import ImageSearchRoundedIcon from '@mui/icons-material/ImageSearchRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { TourPackage } from '../../types/tour-package/tour-package';
import { formatterStr } from '../../utils';
import Moment from 'react-moment';
import { useRouter } from 'next/router';
import { PackageStatus } from '../../enums/package.enum';

interface TourPackageCardProps {
	tourPackage: TourPackage;
	deleteTourPackageHandler?: any;
	memberPage?: boolean;
	updateTourPackageHandler?: any;
}

export const TourPackageCard = (props: TourPackageCardProps) => {
	const { tourPackage, deleteTourPackageHandler, memberPage, updateTourPackageHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const packageImage = tourPackage.packageImages?.[0];

	/** HANDLERS **/
	const pushEditTourPackage = async (id: string) => {
		console.log('+pushEditTourPackage: ', id);
		await router.push({
			pathname: '/mypage',
			query: { category: 'addTourPackage', packageId: id },
		});
	};

	const pushTourPackageDetail = async (id: string) => {
		if (memberPage)
			await router.push({
				pathname: '/tour-package/detail',
				query: { id: id },
			});
		else return;
	};

	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	if (device === 'mobile') {
		return <div>MOBILE PACKAGE CARD</div>;
	} else
		return (
			<MotionStack className="tour-package-card-box" {...fadeUpMotionProps}>
				<Stack className="image-box" onClick={() => pushTourPackageDetail(tourPackage?._id)}>
					{packageImage ? (
						<img src={`${process.env.REACT_APP_API_URL}/${packageImage}`} alt={tourPackage.packageTitle} />
					) : (
						<Stack className="empty-card-image">
							<ImageSearchRoundedIcon />
						</Stack>
					)}
					<Stack className="image-badge">
						<Typography>{tourPackage.packageType}</Typography>
					</Stack>
				</Stack>
				<Stack className="information-box" onClick={() => pushTourPackageDetail(tourPackage?._id)}>
					<Typography className="name">{tourPackage.packageTitle}</Typography>
					<Stack className="destination-row">
						<LocationOnRoundedIcon />
						<Typography className="address">
							{tourPackage.packageCity}, {tourPackage.packageCountry}
						</Typography>
					</Stack>
					<Stack className="meta-row">
						<Stack className="meta-chip">
							<CalendarMonthRoundedIcon />
							<Typography>{tourPackage.durationDays} days</Typography>
						</Stack>
						<Stack className="meta-chip">
							<GroupsRoundedIcon />
							<Typography>
								{tourPackage.minPeople}-{tourPackage.maxPeople} people
							</Typography>
						</Stack>
					</Stack>
					<Typography className="price">
						From <strong>{tourPackage.packageCurrency || '$'} {formatterStr(tourPackage?.packagePrice)}</strong>
					</Typography>
				</Stack>
				<Stack className="date-box">
					<Typography className="date">
						<Moment format="DD MMMM, YYYY">{tourPackage.createdAt}</Moment>
					</Typography>
				</Stack>
				<Stack className={`status-box ${tourPackage.packageStatus === PackageStatus.CLOSED ? 'closed-status-box' : 'active-status-box'}`}>
					<Stack className="coloured-box" sx={{ background: '#E5F0FD' }} onClick={handleClick}>
						<Typography className="status" sx={{ color: '#3554d1' }}>
							{tourPackage.packageStatus}
						</Typography>
					</Stack>
				</Stack>
				{!memberPage && tourPackage.packageStatus !== PackageStatus.CLOSED && (
					<Menu
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						PaperProps={{
							elevation: 0,
							sx: {
								width: '70px',
								mt: 1,
								ml: '10px',
								overflow: 'visible',
								filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
							},
							style: {
								padding: 0,
								display: 'flex',
								justifyContent: 'center',
							},
						}}
					>
						{tourPackage.packageStatus === PackageStatus.ACTIVE && (
							<>
								<MenuItem
									disableRipple
									onClick={() => {
										handleClose();
										updateTourPackageHandler(PackageStatus.CLOSED, tourPackage?._id);
									}}
								>
									Close
								</MenuItem>
							</>
						)}
					</Menu>
				)}

				<Stack className="views-box">
					<VisibilityRoundedIcon />
					<Typography className="views">{tourPackage.packageViews.toLocaleString()}</Typography>
				</Stack>
				{!memberPage && tourPackage.packageStatus === PackageStatus.ACTIVE && (
					<Stack className="action-box">
						<IconButton className="icon-button" onClick={() => pushEditTourPackage(tourPackage._id)}>
							<EditRoundedIcon className="buttons" />
						</IconButton>
						<IconButton className="icon-button" onClick={() => deleteTourPackageHandler(tourPackage._id)}>
							<DeleteIcon className="buttons" />
						</IconButton>
					</Stack>
				)}
			</MotionStack>
		);
};
