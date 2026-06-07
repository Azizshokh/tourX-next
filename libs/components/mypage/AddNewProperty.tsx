import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { PackageType } from '../../enums/package.enum';
import { packageCities, packageCountries, packageCurrencies, packageDurations, REACT_APP_API_URL } from '../../config';
import { TourPackageInput } from '../../types/tour-package/tour-package.input';
import { getJwtToken } from '../../auth';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetMixinSuccessAlert } from '../../sweetAlert';
import { userVar } from '../../../apollo/store';
import { GET_TOUR_PACKAGE } from '../../../apollo/user/query';
import { CREATE_TOUR_PACKAGE, UPDATE_TOUR_PACKAGE } from '../../../apollo/user/mutation';

const AddProperty = ({ initialValues, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const inputRef = useRef<any>(null);
	const [insertPackageData, setInsertPackageData] = useState<TourPackageInput>(initialValues);
	const token = getJwtToken();
	const user = useReactiveVar(userVar);
	const packageId = router.query.packageId ?? router.query.propertyId;

	const [createTourPackage] = useMutation(CREATE_TOUR_PACKAGE);
	const [updateTourPackage] = useMutation(UPDATE_TOUR_PACKAGE);

	const { data: getTourPackageData } = useQuery(GET_TOUR_PACKAGE, {
		fetchPolicy: 'network-only',
		variables: {
			input: packageId,
		},
		skip: !packageId,
	});

	useEffect(() => {
		const tourPackage = getTourPackageData?.getTourPackage;
		if (!tourPackage) return;

		setInsertPackageData({
			packageTitle: tourPackage.packageTitle ?? '',
			packagePrice: tourPackage.packagePrice ?? 0,
			packageCurrency: tourPackage.packageCurrency ?? 'USD',
			packageType: tourPackage.packageType ?? '',
			packageCountry: tourPackage.packageCountry ?? '',
			packageCity: tourPackage.packageCity ?? '',
			packageAddress: tourPackage.packageAddress ?? '',
			flightIncluded: !!tourPackage.flightIncluded,
			hotelIncluded: !!tourPackage.hotelIncluded,
			guideIncluded: !!tourPackage.guideIncluded,
			durationDays: tourPackage.durationDays ?? 1,
			minPeople: tourPackage.minPeople ?? 1,
			maxPeople: tourPackage.maxPeople ?? 1,
			startDate: String(tourPackage.startDate ?? '').slice(0, 10),
			endDate: String(tourPackage.endDate ?? '').slice(0, 10),
			packageDesc: tourPackage.packageDesc ?? '',
			packageImages: tourPackage.packageImages ?? [],
		});
	}, [getTourPackageData]);

	async function uploadImages() {
		try {
			const formData = new FormData();
			const selectedFiles = inputRef.current.files;

			if (selectedFiles.length == 0) return false;
			if (selectedFiles.length > 5) throw new Error('Cannot upload more than 5 images!');

			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImagesUploader($files: [Upload!]!, $target: String!) {
						imagesUploader(files: $files, target: $target)
					}`,
					variables: {
						files: [null, null, null, null, null],
						target: 'tourPackage',
					},
				}),
			);
			formData.append(
				'map',
				JSON.stringify({
					'0': ['variables.files.0'],
					'1': ['variables.files.1'],
					'2': ['variables.files.2'],
					'3': ['variables.files.3'],
					'4': ['variables.files.4'],
				}),
			);
			for (const key in selectedFiles) {
				if (/^\d+$/.test(key)) formData.append(`${key}`, selectedFiles[key]);
			}

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			setInsertPackageData({ ...insertPackageData, packageImages: response.data.data.imagesUploader });
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}

	const doDisabledCheck = () => {
		return (
			insertPackageData.packageTitle.trim() === '' ||
			insertPackageData.packagePrice <= 0 ||
			!insertPackageData.packageType ||
			insertPackageData.packageCountry.trim() === '' ||
			insertPackageData.packageCity.trim() === '' ||
			insertPackageData.packageAddress.trim() === '' ||
			insertPackageData.durationDays <= 0 ||
			insertPackageData.minPeople <= 0 ||
			insertPackageData.maxPeople < insertPackageData.minPeople ||
			insertPackageData.startDate === '' ||
			insertPackageData.endDate === '' ||
			insertPackageData.packageImages.length === 0
		);
	};

	const insertPackageHandler = useCallback(async () => {
		try {
			await createTourPackage({
				variables: {
					input: insertPackageData,
				},
			});

			await sweetMixinSuccessAlert('This package has been created successfully.');
			await router.push({ pathname: '/mypage', query: { category: 'myProperties' } });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	}, [insertPackageData]);

	const updatePackageHandler = useCallback(async () => {
		try {
			await updateTourPackage({
				variables: {
					input: {
						_id: getTourPackageData?.getTourPackage?._id,
						...insertPackageData,
					},
				},
			});

			await sweetMixinSuccessAlert('This package has been updated successfully.');
			await router.push({ pathname: '/mypage', query: { category: 'myProperties' } });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	}, [insertPackageData, getTourPackageData]);

	if (user?.memberType !== 'AGENT') router.back();

	if (device === 'mobile') {
		return <div>ADD NEW PACKAGE MOBILE PAGE</div>;
	}

	return (
		<div id="add-property-page">
			<Stack className="main-title-box">
				<Typography className="main-title">{packageId ? 'Edit Tour Package' : 'Add Tour Package'}</Typography>
				<Typography className="sub-title">Manage your travel package listing.</Typography>
			</Stack>

			<Stack className="config">
				<Stack className="description-box">
					<Stack className="config-column">
						<Typography className="title">Package Title</Typography>
						<input
							type="text"
							className="description-input"
							placeholder="Package title"
							value={insertPackageData.packageTitle}
							onChange={({ target: { value } }) => setInsertPackageData({ ...insertPackageData, packageTitle: value })}
						/>
					</Stack>

					<Stack className="config-row">
						<Stack className="price-year-after-price">
							<Typography className="title">Price</Typography>
							<input
								type="number"
								className="description-input"
								placeholder="Price"
								value={insertPackageData.packagePrice}
								onChange={({ target: { value } }) =>
									setInsertPackageData({ ...insertPackageData, packagePrice: Number(value) })
								}
							/>
						</Stack>
						<Stack className="price-year-after-price">
							<Typography className="title">Currency</Typography>
							<select
								className="select-description"
								value={insertPackageData.packageCurrency || 'USD'}
								onChange={({ target: { value } }) => setInsertPackageData({ ...insertPackageData, packageCurrency: value })}
							>
								{packageCurrencies.map((currency) => (
									<option value={currency} key={currency}>
										{currency}
									</option>
								))}
							</select>
						</Stack>
					</Stack>

					<Stack className="config-row">
						<Stack className="price-year-after-price">
							<Typography className="title">Package Type</Typography>
							<select
								className="select-description"
								value={insertPackageData.packageType || 'select'}
								onChange={({ target: { value } }) =>
									setInsertPackageData({ ...insertPackageData, packageType: value as PackageType })
								}
							>
								<option disabled value="select">
									Select
								</option>
								{Object.values(PackageType).map((type) => (
									<option value={type} key={type}>
										{type}
									</option>
								))}
							</select>
						</Stack>
						<Stack className="price-year-after-price">
							<Typography className="title">Duration</Typography>
							<select
								className="select-description"
								value={insertPackageData.durationDays}
								onChange={({ target: { value } }) =>
									setInsertPackageData({ ...insertPackageData, durationDays: Number(value) })
								}
							>
								{packageDurations.map((days) => (
									<option value={days} key={days}>
										{days} days
									</option>
								))}
							</select>
						</Stack>
					</Stack>

					<Stack className="config-row">
						<Stack className="price-year-after-price">
							<Typography className="title">Country</Typography>
							<input
								list="package-countries"
								className="description-input"
								value={insertPackageData.packageCountry}
								onChange={({ target: { value } }) => setInsertPackageData({ ...insertPackageData, packageCountry: value })}
							/>
							<datalist id="package-countries">
								{packageCountries.map((country) => (
									<option value={country} key={country} />
								))}
							</datalist>
						</Stack>
						<Stack className="price-year-after-price">
							<Typography className="title">City</Typography>
							<input
								list="package-cities"
								className="description-input"
								value={insertPackageData.packageCity}
								onChange={({ target: { value } }) => setInsertPackageData({ ...insertPackageData, packageCity: value })}
							/>
							<datalist id="package-cities">
								{packageCities.map((city) => (
									<option value={city} key={city} />
								))}
							</datalist>
						</Stack>
					</Stack>

					<Stack className="config-column">
						<Typography className="title">Address</Typography>
						<input
							type="text"
							className="description-input"
							placeholder="Meeting point or package address"
							value={insertPackageData.packageAddress}
							onChange={({ target: { value } }) => setInsertPackageData({ ...insertPackageData, packageAddress: value })}
						/>
					</Stack>

					<Stack className="config-row">
						<Stack className="price-year-after-price">
							<Typography className="title">Minimum People</Typography>
							<input
								type="number"
								min={1}
								className="description-input"
								value={insertPackageData.minPeople}
								onChange={({ target: { value } }) => setInsertPackageData({ ...insertPackageData, minPeople: Number(value) })}
							/>
						</Stack>
						<Stack className="price-year-after-price">
							<Typography className="title">Maximum People</Typography>
							<input
								type="number"
								min={1}
								className="description-input"
								value={insertPackageData.maxPeople}
								onChange={({ target: { value } }) => setInsertPackageData({ ...insertPackageData, maxPeople: Number(value) })}
							/>
						</Stack>
					</Stack>

					<Stack className="config-row">
						<Stack className="price-year-after-price">
							<Typography className="title">Start Date</Typography>
							<input
								type="date"
								className="description-input"
								value={insertPackageData.startDate}
								onChange={({ target: { value } }) => setInsertPackageData({ ...insertPackageData, startDate: value })}
							/>
						</Stack>
						<Stack className="price-year-after-price">
							<Typography className="title">End Date</Typography>
							<input
								type="date"
								className="description-input"
								value={insertPackageData.endDate}
								onChange={({ target: { value } }) => setInsertPackageData({ ...insertPackageData, endDate: value })}
							/>
						</Stack>
					</Stack>

					<Stack className="config-row">
						{[
							['flightIncluded', 'Flight Included'],
							['hotelIncluded', 'Hotel Included'],
							['guideIncluded', 'Guide Included'],
						].map(([key, label]) => (
							<Stack className="price-year-after-price" key={key}>
								<Typography className="title">{label}</Typography>
								<select
									className="select-description"
									value={insertPackageData[key as keyof TourPackageInput] ? 'yes' : 'no'}
									onChange={({ target: { value } }) =>
										setInsertPackageData({ ...insertPackageData, [key]: value === 'yes' })
									}
								>
									<option value="yes">Yes</option>
									<option value="no">No</option>
								</select>
							</Stack>
						))}
					</Stack>

					<Typography className="property-title">Package Description</Typography>
					<Stack className="config-column">
						<Typography className="title">Description</Typography>
						<textarea
							className="description-text"
							value={insertPackageData.packageDesc}
							onChange={({ target: { value } }) => setInsertPackageData({ ...insertPackageData, packageDesc: value })}
						></textarea>
					</Stack>
				</Stack>

				<Typography className="upload-title">Upload package photos</Typography>
				<Stack className="images-box">
					<Stack className="upload-box">
						<Stack className="text-box">
							<Typography className="drag-title">Drag and drop images here</Typography>
							<Typography className="format-title">Photos must be JPEG or PNG format and at least 2048x768</Typography>
						</Stack>
						<Button className="browse-button" onClick={() => inputRef.current.click()}>
							<Typography className="browse-button-text">Browse Files</Typography>
							<input
								ref={inputRef}
								type="file"
								hidden={true}
								onChange={uploadImages}
								multiple={true}
								accept="image/jpg, image/jpeg, image/png"
							/>
						</Button>
					</Stack>
					<Stack className="gallery-box">
						{insertPackageData?.packageImages.map((image: string) => (
							<Stack className="image-box" key={image}>
								<img src={`${REACT_APP_API_URL}/${image}`} alt="" />
							</Stack>
						))}
					</Stack>
				</Stack>

				<Stack className="buttons-row">
					<Button
						className="next-button"
						disabled={doDisabledCheck()}
						onClick={packageId ? updatePackageHandler : insertPackageHandler}
					>
						<Typography className="next-button-text">Save</Typography>
					</Button>
				</Stack>
			</Stack>
		</div>
	);
};

AddProperty.defaultProps = {
	initialValues: {
		packageTitle: '',
		packagePrice: 0,
		packageCurrency: 'USD',
		packageType: '',
		packageCountry: '',
		packageCity: '',
		packageAddress: '',
		flightIncluded: false,
		hotelIncluded: false,
		guideIncluded: false,
		durationDays: 1,
		minPeople: 1,
		maxPeople: 1,
		startDate: '',
		endDate: '',
		packageDesc: '',
		packageImages: [],
	},
};

export default AddProperty;
