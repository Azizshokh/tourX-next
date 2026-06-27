import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Stack, Typography } from '@mui/material';
import CollectionsRoundedIcon from '@mui/icons-material/CollectionsRounded';
import ImageSearchRoundedIcon from '@mui/icons-material/ImageSearchRounded';
import TipsAndUpdatesRoundedIcon from '@mui/icons-material/TipsAndUpdatesRounded';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
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
import { useTranslation } from 'next-i18next';

const MAX_PACKAGE_IMAGES = 5;

interface NumericInputDraft {
	packagePrice: string;
	minPeople: string;
	maxPeople: string;
}

const AddTourPackage = ({ initialValues, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { t } = useTranslation(['common', 'mypage']);
	const inputRef = useRef<any>(null);
	const [insertPackageData, setInsertPackageData] = useState<TourPackageInput>(initialValues);
	const [numericInputDraft, setNumericInputDraft] = useState<NumericInputDraft>({
		packagePrice: String(initialValues.packagePrice ?? 0),
		minPeople: String(initialValues.minPeople ?? 1),
		maxPeople: String(initialValues.maxPeople ?? 1),
	});
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const token = getJwtToken();
	const user = useReactiveVar(userVar);
	const packageId = router.query.packageId;

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
		setNumericInputDraft({
			packagePrice: String(tourPackage.packagePrice ?? 0),
			minPeople: String(tourPackage.minPeople ?? 1),
			maxPeople: String(tourPackage.maxPeople ?? 1),
		});
	}, [getTourPackageData]);

	const numericInputChangeHandler = (field: keyof NumericInputDraft, value: string) => {
		setNumericInputDraft((prev) => ({ ...prev, [field]: value }));

		const numericValue = Number(value);
		if (value.trim() === '' || Number.isNaN(numericValue)) return;

		setInsertPackageData((prev) => ({ ...prev, [field]: numericValue }));
	};

	const getNormalizedPackageInput = (): TourPackageInput => ({
		...insertPackageData,
		packagePrice: Number(numericInputDraft.packagePrice),
		minPeople: Number(numericInputDraft.minPeople),
		maxPeople: Number(numericInputDraft.maxPeople),
	});

	async function uploadImages() {
		try {
			const formData = new FormData();
			const selectedFiles = Array.from(inputRef.current?.files ?? []) as File[];
			const currentImages = insertPackageData.packageImages.slice(0, MAX_PACKAGE_IMAGES);
			const availableSlots = MAX_PACKAGE_IMAGES - currentImages.length;

			if (selectedFiles.length === 0) return false;
			if (availableSlots <= 0) {
				throw new Error(`You already added ${MAX_PACKAGE_IMAGES} package images.`);
			}
			if (selectedFiles.length > availableSlots) {
				throw new Error(`You can upload up to ${MAX_PACKAGE_IMAGES} package images.`);
			}

			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImagesUploader($files: [Upload!]!, $target: String!) {
						imagesUploader(files: $files, target: $target)
					}`,
					variables: {
						files: selectedFiles.map(() => null),
						target: 'tourPackage',
					},
				}),
			);
			formData.append(
				'map',
				JSON.stringify(
					selectedFiles.reduce<Record<string, string[]>>((acc, _file, index) => {
						acc[index] = [`variables.files.${index}`];
						return acc;
					}, {}),
				),
			);
			selectedFiles.forEach((file, index) => formData.append(`${index}`, file));

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const uploadedImages = response.data.data.imagesUploader ?? [];
			setInsertPackageData((prev) => ({
				...prev,
				packageImages: [...(prev.packageImages ?? []).slice(0, MAX_PACKAGE_IMAGES), ...uploadedImages].slice(0, MAX_PACKAGE_IMAGES),
			}));
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		} finally {
			if (inputRef.current) inputRef.current.value = '';
		}
	}

	const removePackageImageHandler = (index: number) => {
		setInsertPackageData((prev) => ({
			...prev,
			packageImages: (prev.packageImages ?? []).filter((_image, imageIndex) => imageIndex !== index),
		}));
	};

	const validatePackageForm = async () => {
		const normalizedInput = getNormalizedPackageInput();

		if (insertPackageData.packageTitle.trim() === '') {
			await sweetMixinErrorAlert('Please enter a package title.');
			return false;
		}
		if (!Number.isFinite(normalizedInput.packagePrice) || normalizedInput.packagePrice <= 0) {
			await sweetMixinErrorAlert('Please enter a valid package price.');
			return false;
		}
		if (!insertPackageData.packageType) {
			await sweetMixinErrorAlert('Please select a package type.');
			return false;
		}
		if (insertPackageData.packageCountry.trim() === '') {
			await sweetMixinErrorAlert('Please enter a destination country.');
			return false;
		}
		if (insertPackageData.packageCity.trim() === '') {
			await sweetMixinErrorAlert('Please enter a destination city.');
			return false;
		}
		if (insertPackageData.packageAddress.trim() === '') {
			await sweetMixinErrorAlert('Please enter a meeting point or package address.');
			return false;
		}
		if (insertPackageData.durationDays <= 0) {
			await sweetMixinErrorAlert('Please select a valid package duration.');
			return false;
		}
		if (!Number.isFinite(normalizedInput.minPeople) || normalizedInput.minPeople <= 0) {
			await sweetMixinErrorAlert('Minimum people must be at least 1.');
			return false;
		}
		if (!Number.isFinite(normalizedInput.maxPeople) || normalizedInput.maxPeople < normalizedInput.minPeople) {
			await sweetMixinErrorAlert('Maximum people must be greater than or equal to minimum people.');
			return false;
		}
		if (insertPackageData.startDate === '') {
			await sweetMixinErrorAlert('Please select a package start date.');
			return false;
		}
		if (insertPackageData.endDate === '') {
			await sweetMixinErrorAlert('Please select a package end date.');
			return false;
		}
		if (new Date(insertPackageData.endDate).getTime() < new Date(insertPackageData.startDate).getTime()) {
			await sweetMixinErrorAlert('End date must be the same as or later than the start date.');
			return false;
		}
		if (insertPackageData.packageImages.length === 0) {
			await sweetMixinErrorAlert('Please upload at least one package image.');
			return false;
		}
		if (insertPackageData.packageImages.length > MAX_PACKAGE_IMAGES) {
			await sweetMixinErrorAlert(`You can upload up to ${MAX_PACKAGE_IMAGES} package images.`);
			return false;
		}

		return true;
	};

	const insertPackageHandler = useCallback(async () => {
		if (isSubmitting) return;
		if (!(await validatePackageForm())) return;

		try {
			setIsSubmitting(true);
			const normalizedInput = getNormalizedPackageInput();
			await createTourPackage({
				variables: {
					input: normalizedInput,
				},
			});

			await sweetMixinSuccessAlert('This package has been created successfully.');
			await router.push({ pathname: '/mypage', query: { category: 'myTourPackages' } });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		} finally {
			setIsSubmitting(false);
		}
	}, [insertPackageData, isSubmitting, numericInputDraft]);

	const updatePackageHandler = useCallback(async () => {
		if (isSubmitting) return;
		if (!(await validatePackageForm())) return;

		try {
			setIsSubmitting(true);
			const normalizedInput = getNormalizedPackageInput();
			await updateTourPackage({
				variables: {
					input: {
						_id: getTourPackageData?.getTourPackage?._id,
						...normalizedInput,
					},
				},
			});

			await sweetMixinSuccessAlert('This package has been updated successfully.');
			await router.push({ pathname: '/mypage', query: { category: 'myTourPackages' } });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		} finally {
			setIsSubmitting(false);
		}
	}, [insertPackageData, getTourPackageData, isSubmitting, numericInputDraft]);

	if (user?.memberType !== 'AGENT') router.back();

	if (device === 'mobile') {
		return <div>{t('mypage:packages.addTitle')}</div>;
	}

	return (
		<div id="add-tour-package-page">
				<Stack className="main-title-box">
					<Typography className="main-title">{packageId ? t('mypage:packages.editTitle') : t('mypage:packages.addTitle')}</Typography>
					<Typography className="sub-title">{t('mypage:packages.formSubtitle')}</Typography>
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
								value={numericInputDraft.packagePrice}
								onChange={({ target: { value } }) => numericInputChangeHandler('packagePrice', value)}
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
								value={numericInputDraft.minPeople}
								onChange={({ target: { value } }) => numericInputChangeHandler('minPeople', value)}
							/>
						</Stack>
						<Stack className="price-year-after-price">
							<Typography className="title">Maximum People</Typography>
							<input
								type="number"
								min={1}
								className="description-input"
								value={numericInputDraft.maxPeople}
								onChange={({ target: { value } }) => numericInputChangeHandler('maxPeople', value)}
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

					<Typography className="tour-package-title">Package Description</Typography>
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
						<Stack className="upload-icon-box">
							<UploadFileRoundedIcon />
						</Stack>
						<Stack className="text-box">
							<Typography className="drag-title">Add up to {MAX_PACKAGE_IMAGES} tour package images</Typography>
							<Typography className="format-title">
								Use clear destination, activity, hotel, guide, and experience photos. JPEG or PNG recommended.
							</Typography>
						</Stack>
						<Stack className="upload-guide-grid">
							<Stack className="guide-pill">
								<ImageSearchRoundedIcon />
								<Typography>Show real trip moments</Typography>
							</Stack>
							<Stack className="guide-pill">
								<TipsAndUpdatesRoundedIcon />
								<Typography>Tips & Guides friendly</Typography>
							</Stack>
							<Stack className="guide-pill">
								<CollectionsRoundedIcon />
								<Typography>{insertPackageData.packageImages.length}/{MAX_PACKAGE_IMAGES} selected</Typography>
							</Stack>
						</Stack>
						<Button className="browse-button" onClick={() => inputRef.current.click()}>
							<UploadFileRoundedIcon />
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
						{Array.from({ length: MAX_PACKAGE_IMAGES }).map((_, index: number) => {
							const image = insertPackageData?.packageImages?.[index];

							return (
								<Stack
									className={`image-box ${image ? 'filled-image-box' : 'empty-image-box'}`}
									key={image || `package-image-slot-${index}`}
									onClick={!image ? () => inputRef.current?.click() : undefined}
								>
									{image ? (
										<>
											<img src={`${REACT_APP_API_URL}/${image}`} alt={`Tour package photo ${index + 1}`} />
											<button
												type="button"
												className="remove-image-button"
												aria-label={t('mypage:packages.removePhotoLabel', { index: index + 1 })}
												onClick={(event) => {
													event.stopPropagation();
													removePackageImageHandler(index);
												}}
											>
												<CloseRoundedIcon />
											</button>
										</>
									) : (
										<Stack className="empty-image-content">
											<ImageSearchRoundedIcon />
											<Typography>Add photo</Typography>
										</Stack>
									)}
									<Stack className="image-count-badge">
										<Typography>{index + 1}</Typography>
									</Stack>
								</Stack>
							);
						})}
					</Stack>
				</Stack>

				<Stack className="buttons-row">
					<Button
						className="next-button"
						disabled={isSubmitting}
						onClick={packageId ? updatePackageHandler : insertPackageHandler}
					>
						<Typography className="next-button-text">{isSubmitting ? t('mypage:packages.saving') : t('common:actions.save')}</Typography>
					</Button>
				</Stack>
			</Stack>
		</div>
	);
};

AddTourPackage.defaultProps = {
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

export default AddTourPackage;
