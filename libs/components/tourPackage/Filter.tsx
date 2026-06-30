import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Checkbox, Stack, Typography } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useRouter } from 'next/router';
import { useLazyQuery, useQuery } from '@apollo/client';
import { PackageType } from '../../enums/package.enum';
import { packageCities, packageCountries, packageDurations } from '../../config';
import { TourPackagesInquiry } from '../../types/tour-package/tour-package.input';
import { TourPackage } from '../../types/tour-package/tour-package';
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
	const router = useRouter();
	const { t } = useTranslation(['common', 'package']);
	const [searchText, setSearchText] = useState<string>(searchFilter.search.text ?? '');
	const [isFiltering, setIsFiltering] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [checkTourPackages] = useLazyQuery(GET_TOUR_PACKAGES, { fetchPolicy: 'network-only' });

	const { data: availabilityData } = useQuery(GET_TOUR_PACKAGES, {
		fetchPolicy: 'cache-first',
		variables: {
			input: { page: 1, limit: 200, sort: 'createdAt', direction: 'DESC', search: { pricesRange: { start: 0, end: 2000000 } } },
		},
	});
	const isAvailabilityLoaded = Boolean(availabilityData);
	const allPackages: TourPackage[] = availabilityData?.getTourPackages?.list ?? [];

	const availableCountries = useMemo(
		() => new Set<string>(allPackages.map((p) => p.packageCountry).filter(Boolean)),
		[allPackages],
	);

	const availableTypesByCountry = useMemo(() => {
		const map = new Map<string, Set<string>>();
		for (const p of allPackages) {
			if (!p.packageCountry || !p.packageType) continue;
			if (!map.has(p.packageCountry)) map.set(p.packageCountry, new Set<string>());
			map.get(p.packageCountry)!.add(p.packageType as string);
		}
		return map;
	}, [allPackages]);

	const availableTypes = useMemo(() => {
		const selectedCountry = searchFilter?.search?.countryList?.[0];
		if (!selectedCountry) return new Set<string>(allPackages.map((p) => p.packageType as string).filter(Boolean));
		return availableTypesByCountry.get(selectedCountry) ?? new Set<string>();
	}, [searchFilter?.search?.countryList, availableTypesByCountry, allPackages]);

	const activeCount = useMemo(() => {
		const s = searchFilter.search;
		let n = 0;
		if (s.text) n++;
		if (s.countryList?.length) n++;
		if (s.cityList?.length) n++;
		if (s.typeList?.length) n++;
		if (s.options?.length) n++;
		if (s.durationRange) n++;
		const defaultPrice = s.pricesRange?.start === 0 && s.pricesRange?.end === 2000000;
		if (s.pricesRange && !defaultPrice) n++;
		return n;
	}, [searchFilter.search]);

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

	const countryChangeHandler = async (e: React.ChangeEvent<HTMLSelectElement>) => {
		const val = e.target.value;
		const typesForCountry: Set<string> = val
			? (availableTypesByCountry.get(val) ?? new Set<string>())
			: new Set<string>(allPackages.map((p) => p.packageType as string).filter(Boolean));
		const currentTypes = (searchFilter.search.typeList ?? []) as PackageType[];
		const validTypes: PackageType[] = currentTypes.filter((t) => typesForCountry.has(t as string));
		const nextFilter = {
			...searchFilter,
			page: 1,
			search: { ...searchFilter.search, countryList: val ? [val] : [], typeList: validTypes },
		};
		setSearchFilter(nextFilter);
		await pushFilter(nextFilter);
	};

	return (
		<>
			{/* Mobile toggle trigger — hidden on desktop via CSS */}
			<button
				type="button"
				className={`filter-toggle${isOpen ? ' is-open' : ''}`}
				onClick={() => setIsOpen((v) => !v)}
				aria-expanded={isOpen}
			>
				<Stack className="toggle-left">
					<TuneRoundedIcon className="toggle-icon" />
					<Typography className="toggle-label">{t('package:filter.title')}</Typography>
					{activeCount > 0 && <span className="toggle-badge">{activeCount}</span>}
				</Stack>
				<KeyboardArrowDownRoundedIcon className="toggle-chevron" />
			</button>

		<Stack className={`filter-main${isOpen ? ' is-open' : ''}`}>
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
							onChange={countryChangeHandler}
						>
							<option value="">{t('labels.all')}</option>
							{packageCountries.map((c) => (
								<option value={c} key={c} disabled={isAvailabilityLoaded && !availableCountries.has(c)}>
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
					{Object.values(PackageType).map((type) => {
						const isAvailable = !isAvailabilityLoaded || availableTypes.has(type as string);
						return (
							<Stack className={`type-item${isAvailable ? '' : ' type-item--disabled'}`} key={type}>
								<Checkbox
									className="type-checkbox"
									size="small"
									checked={(searchFilter?.search?.typeList || []).includes(type)}
									onChange={() => toggleListValue('typeList', type)}
									disabled={!isAvailable}
								/>
								<Typography className="type-label">{type}</Typography>
							</Stack>
						);
					})}
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
		</>
	);
};

export default Filter;
