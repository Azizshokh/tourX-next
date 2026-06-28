import React, { useCallback, useEffect, useState } from 'react';
import { Button, Checkbox, Stack, Typography } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useRouter } from 'next/router';
import { useLazyQuery } from '@apollo/client';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { PackageType } from '../../enums/package.enum';
import { packageCities, packageCountries, packageDurations } from '../../config';
import { TourPackagesInquiry } from '../../types/tour-package/tour-package.input';
import { useTranslation } from 'next-i18next';
import { GET_TOUR_PACKAGES } from '../../../apollo/user/query';
import {
	cleanTourPackageInquiry,
	hasActiveTourPackageFilters,
	isTourPackageInquiryValid,
	tourPackageInquiryUrl,
} from '../../utils/tourPackageFilter';
import { sweetWarningAlert } from '../../sweetAlert';

interface FilterType {
	searchFilter: TourPackagesInquiry;
	setSearchFilter: any;
	initialInput: TourPackagesInquiry;
}

const Filter = (props: FilterType) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const { t } = useTranslation(['common', 'package']);
	const [searchText, setSearchText] = useState<string>(searchFilter.search.text ?? '');
	const [isFiltering, setIsFiltering] = useState(false);
	const [checkTourPackages] = useLazyQuery(GET_TOUR_PACKAGES, { fetchPolicy: 'network-only' });

	useEffect(() => {
		setSearchText(searchFilter.search.text ?? '');
	}, [searchFilter.search.text]);

	const pushFilter = useCallback(
		async (input: TourPackagesInquiry) => {
			if (isFiltering) return;
			const nextFilter = cleanTourPackageInquiry(input, input.limit);

			if (!isTourPackageInquiryValid(nextFilter)) {
				await sweetWarningAlert(t('alerts.invalidFilterInput'), t('alerts.invalidFilterInput'));
				return;
			}

			if (!hasActiveTourPackageFilters(nextFilter)) {
				await router.push('/tour-package', '/tour-package', { scroll: false });
				return;
			}

			setIsFiltering(true);
			try {
				const result = await checkTourPackages({
					variables: {
						input: { ...nextFilter, page: 1, limit: 1 },
					},
				});
				const total = result.data?.getTourPackages?.metaCounter?.[0]?.total ?? 0;

				if (total < 1) {
					await sweetWarningAlert(t('alerts.noPackagesFound'), t('alerts.noPackagesFoundForSearch'));
					return;
				}

				const url = tourPackageInquiryUrl(nextFilter);
				await router.push(url, url, { scroll: false });
			} finally {
				setIsFiltering(false);
			}
		},
		[checkTourPackages, isFiltering, router, t],
	);

	const toggleListValue = async (key: 'countryList' | 'cityList' | 'typeList' | 'options', value: string) => {
		const current = (searchFilter.search[key] || []) as string[];
		const nextList = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
		const nextFilter = {
			...searchFilter,
			page: 1,
			search: { ...searchFilter.search, [key]: nextList },
		};
		setSearchFilter(nextFilter);
		await pushFilter(nextFilter);
	};

	const durationRangeHandler = async (value: number, type: 'start' | 'end') => {
		const nextFilter = {
			...searchFilter,
			page: 1,
			search: {
				...searchFilter.search,
				durationRange: {
					start: type === 'start' ? value : searchFilter.search.durationRange?.start ?? 1,
					end: type === 'end' ? value : searchFilter.search.durationRange?.end ?? 30,
				},
			},
		};
		setSearchFilter(nextFilter);
		await pushFilter(nextFilter);
	};

	const priceRangeHandler = async (value: number, type: 'start' | 'end') => {
		const nextFilter = {
			...searchFilter,
			page: 1,
			search: {
				...searchFilter.search,
				pricesRange: {
					start: type === 'start' ? value : searchFilter.search.pricesRange?.start ?? 0,
					end: type === 'end' ? value : searchFilter.search.pricesRange?.end ?? 2000000,
				},
			},
		};
		setSearchFilter(nextFilter);
		await pushFilter(nextFilter);
	};

	const textSearchHandler = async () => {
		const nextFilter = {
			...searchFilter,
			page: 1,
			search: { ...searchFilter.search, text: searchText.trim() },
		};
		setSearchFilter(nextFilter);
		await pushFilter(nextFilter);
	};

	const refreshHandler = async () => {
		setSearchText('');
		setSearchFilter(initialInput);
		await pushFilter(initialInput);
	};

	if (device === 'mobile') {
		return <div>{t('mobile.packages')}</div>;
	}

	return (
		<Stack className="filter-main">
			{/* Header */}
			<Stack className="filter-header">
				<Typography className="filter-title">{t('package:filter.title')}</Typography>
				<Button className="clear-btn" onClick={refreshHandler} disableRipple>
					{t('actions.clearFilters')}
				</Button>
			</Stack>

			{/* Keywords */}
			<Stack className="filter-section">
				<Typography className="section-label">{t('package:filter.keywords')}</Typography>
				<Stack className="search-wrap">
					<SearchRoundedIcon className="search-icon" />
					<input
						type="text"
						className="search-input"
						placeholder={t('package:filter.searchDestinations')}
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') textSearchHandler();
						}}
					/>
				</Stack>
			</Stack>

			{/* Country / City */}
			<Stack className="filter-section">
				<Stack className="select-row">
					<Stack className="select-group">
						<Typography className="section-label">{t('labels.country')}</Typography>
						<select
							className="filter-select"
							value={searchFilter?.search?.countryList?.[0] ?? ''}
							onChange={(e) => {
								const val = e.target.value;
								const nextFilter = {
									...searchFilter,
									page: 1,
									search: { ...searchFilter.search, countryList: val ? [val] : [] },
								};
								setSearchFilter(nextFilter);
								pushFilter(nextFilter);
							}}
						>
							<option value="">{t('labels.all')}</option>
							{packageCountries.map((c) => (
								<option value={c} key={c}>
									{c}
								</option>
							))}
						</select>
					</Stack>
					<Stack className="select-group">
						<Typography className="section-label">{t('labels.city')}</Typography>
						<select
							className="filter-select"
							value={searchFilter?.search?.cityList?.[0] ?? ''}
							onChange={(e) => {
								const val = e.target.value;
								const nextFilter = {
									...searchFilter,
									page: 1,
									search: { ...searchFilter.search, cityList: val ? [val] : [] },
								};
								setSearchFilter(nextFilter);
								pushFilter(nextFilter);
							}}
						>
							<option value="">{t('labels.all')}</option>
							{packageCities.map((c) => (
								<option value={c} key={c}>
									{c}
								</option>
							))}
						</select>
					</Stack>
				</Stack>
			</Stack>

			{/* Experience Type */}
			<Stack className="filter-section">
				<Typography className="section-label">{t('package:filter.experienceType')}</Typography>
				<Stack className="type-grid">
					{Object.values(PackageType).map((type) => (
						<Stack className="type-item" key={type}>
							<Checkbox
								className="type-checkbox"
								size="small"
								checked={(searchFilter?.search?.typeList || []).includes(type)}
								onChange={() => toggleListValue('typeList', type)}
							/>
							<Typography className="type-label">{type}</Typography>
						</Stack>
					))}
				</Stack>
			</Stack>

			{/* Inclusions */}
			<Stack className="filter-section">
				<Typography className="section-label">{t('package:filter.inclusions')}</Typography>
				<Stack className="type-grid">
					{(['flightIncluded', 'hotelIncluded', 'guideIncluded'] as const).map((key) => {
						const label =
							key === 'flightIncluded'
								? t('labels.flight')
								: key === 'hotelIncluded'
								? t('labels.hotel')
								: t('labels.guide');
						return (
							<Stack className="type-item" key={key}>
								<Checkbox
									className="type-checkbox"
									size="small"
									checked={(searchFilter?.search?.options || []).includes(key)}
									onChange={() => toggleListValue('options', key)}
								/>
								<Typography className="type-label">{label}</Typography>
							</Stack>
						);
					})}
				</Stack>
			</Stack>

			{/* Price Range */}
			<Stack className="filter-section">
				<Stack className="section-header-row">
					<Typography className="section-label">{t('package:filter.priceRange')}</Typography>
					<Typography className="range-display">
						${(searchFilter?.search?.pricesRange?.start ?? 0).toLocaleString()} — $
						{(searchFilter?.search?.pricesRange?.end ?? 2000000).toLocaleString()}
					</Typography>
				</Stack>
				<Stack className="range-inputs">
					<input
						type="number"
						className="range-num"
						placeholder={t('package:filter.min')}
						min={0}
						value={searchFilter?.search?.pricesRange?.start ?? 0}
						onChange={(e) => priceRangeHandler(Number(e.target.value), 'start')}
					/>
					<span className="range-sep">—</span>
					<input
						type="number"
						className="range-num"
						placeholder={t('package:filter.max')}
						value={searchFilter?.search?.pricesRange?.end ?? 0}
						onChange={(e) => priceRangeHandler(Number(e.target.value), 'end')}
					/>
				</Stack>
			</Stack>

			{/* Duration */}
			<Stack className="filter-section">
				<Stack className="section-header-row">
					<Typography className="section-label">{t('package:filter.durationDays')}</Typography>
					<Typography className="range-display">
						{searchFilter?.search?.durationRange?.start ?? 1} —{' '}
						{searchFilter?.search?.durationRange?.end ?? 30} days
					</Typography>
				</Stack>
				<Stack className="range-inputs">
					<select
						className="filter-select-sm"
						value={searchFilter?.search?.durationRange?.start ?? 1}
						onChange={(e) => durationRangeHandler(Number(e.target.value), 'start')}
					>
						{packageDurations.map((d) => (
							<option value={d} key={d}>
								{d}
							</option>
						))}
					</select>
					<span className="range-sep">—</span>
					<select
						className="filter-select-sm"
						value={searchFilter?.search?.durationRange?.end ?? 30}
						onChange={(e) => durationRangeHandler(Number(e.target.value), 'end')}
					>
						{packageDurations.map((d) => (
							<option value={d} key={d}>
								{d}
							</option>
						))}
					</select>
				</Stack>
			</Stack>

			{/* Apply */}
			<Button className="apply-btn" onClick={textSearchHandler} disabled={isFiltering} disableElevation>
				{isFiltering ? t('searchPackages') : t('actions.applyFilters')}
			</Button>
		</Stack>
	);
};

export default Filter;
