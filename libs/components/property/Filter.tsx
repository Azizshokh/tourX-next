import React, { useCallback, useEffect, useState } from 'react';
import { Button, Checkbox, IconButton, OutlinedInput, Stack, Typography } from '@mui/material';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { PackageType } from '../../enums/package.enum';
import { packageCities, packageCountries, packageDurations } from '../../config';
import { TourPackagesInquiry } from '../../types/tour-package/tour-package.input';

interface FilterType {
	searchFilter: TourPackagesInquiry;
	setSearchFilter: any;
	initialInput: TourPackagesInquiry;
}

const Filter = (props: FilterType) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [searchText, setSearchText] = useState<string>(searchFilter.search.text ?? '');

	useEffect(() => {
		if (searchFilter?.search?.countryList?.length === 0) delete searchFilter.search.countryList;
		if (searchFilter?.search?.cityList?.length === 0) delete searchFilter.search.cityList;
		if (searchFilter?.search?.typeList?.length === 0) delete searchFilter.search.typeList;
		if (searchFilter?.search?.options?.length === 0) delete searchFilter.search.options;
	}, [searchFilter]);

	const pushFilter = useCallback(
		async (input: TourPackagesInquiry) => {
			await router.push(
				`/tour-package?input=${JSON.stringify(input)}`,
				`/tour-package?input=${JSON.stringify(input)}`,
				{ scroll: false },
			);
		},
		[router],
	);

	const toggleListValue = async (key: 'countryList' | 'cityList' | 'typeList' | 'options', value: string) => {
		const current = (searchFilter.search[key] || []) as string[];
		const nextList = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
		const nextFilter = {
			...searchFilter,
			page: 1,
			search: {
				...searchFilter.search,
				[key]: nextList,
			},
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
			search: {
				...searchFilter.search,
				text: searchText,
			},
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
		return <div>PACKAGES FILTER</div>;
	}

	return (
		<Stack className={'filter-main'}>
			<Stack className={'find-your-home'} mb={'40px'}>
				<Typography className={'title-main'}>Find A Tour</Typography>
				<Stack className={'input-box'}>
					<OutlinedInput
						value={searchText}
						type={'text'}
						className={'search-input'}
						placeholder={'What are you looking for?'}
						onChange={(e: any) => setSearchText(e.target.value)}
						onKeyDown={(event: any) => {
							if (event.key === 'Enter') textSearchHandler();
						}}
						endAdornment={<CancelRoundedIcon onClick={() => setSearchText('')} />}
					/>
					<img src={'/img/icons/search_icon.png'} alt={''} />
					<IconButton onClick={refreshHandler}>
						<RefreshIcon />
					</IconButton>
				</Stack>
			</Stack>

			<Stack className={'find-your-home'} mb={'30px'}>
				<Typography className={'title'}>Country</Typography>
				{packageCountries.map((country) => (
					<Stack className={'input-box'} key={country}>
						<Checkbox
							className="property-checkbox"
							color="default"
							size="small"
							value={country}
							checked={(searchFilter?.search?.countryList || []).includes(country)}
							onChange={() => toggleListValue('countryList', country)}
						/>
						<Typography className="property-type">{country}</Typography>
					</Stack>
				))}
			</Stack>

			<Stack className={'find-your-home'} mb={'30px'}>
				<Typography className={'title'}>City</Typography>
				{packageCities.map((city) => (
					<Stack className={'input-box'} key={city}>
						<Checkbox
							className="property-checkbox"
							color="default"
							size="small"
							value={city}
							checked={(searchFilter?.search?.cityList || []).includes(city)}
							onChange={() => toggleListValue('cityList', city)}
						/>
						<Typography className="property-type">{city}</Typography>
					</Stack>
				))}
			</Stack>

			<Stack className={'find-your-home'} mb={'30px'}>
				<Typography className={'title'}>Package Type</Typography>
				{Object.values(PackageType).map((type) => (
					<Stack className={'input-box'} key={type}>
						<Checkbox
							className="property-checkbox"
							color="default"
							size="small"
							value={type}
							checked={(searchFilter?.search?.typeList || []).includes(type)}
							onChange={() => toggleListValue('typeList', type)}
						/>
						<Typography className="property_type">{type}</Typography>
					</Stack>
				))}
			</Stack>

			<Stack className={'find-your-home'} mb={'30px'}>
				<Typography className={'title'}>Inclusions</Typography>
				{[
					['flightIncluded', 'Flight'],
					['hotelIncluded', 'Hotel'],
					['guideIncluded', 'Guide'],
				].map(([value, label]) => (
					<Stack className={'input-box'} key={value}>
						<Checkbox
							className="property-checkbox"
							color="default"
							size="small"
							value={value}
							checked={(searchFilter?.search?.options || []).includes(value)}
							onChange={() => toggleListValue('options', value)}
						/>
						<Typography className="propert-type">{label}</Typography>
					</Stack>
				))}
			</Stack>

			<Stack className={'find-your-home'} mb={'30px'}>
				<Typography className={'title'}>Duration</Typography>
				<Stack className="square-year-input">
					<select
						value={searchFilter?.search?.durationRange?.start ?? 1}
						onChange={(e: any) => durationRangeHandler(Number(e.target.value), 'start')}
					>
						{packageDurations.map((days) => (
							<option value={days} key={days}>
								{days} days
							</option>
						))}
					</select>
					<div className="central-divider"></div>
					<select
						value={searchFilter?.search?.durationRange?.end ?? 30}
						onChange={(e: any) => durationRangeHandler(Number(e.target.value), 'end')}
					>
						{packageDurations.map((days) => (
							<option value={days} key={days}>
								{days} days
							</option>
						))}
					</select>
				</Stack>
			</Stack>

			<Stack className={'find-your-home'}>
				<Typography className={'title'}>Price Range</Typography>
				<Stack className="square-year-input">
					<input
						type="number"
						placeholder="$ min"
						min={0}
						value={searchFilter?.search?.pricesRange?.start ?? 0}
						onChange={(e: any) => priceRangeHandler(Number(e.target.value), 'start')}
					/>
					<div className="central-divider"></div>
					<input
						type="number"
						placeholder="$ max"
						value={searchFilter?.search?.pricesRange?.end ?? 0}
						onChange={(e: any) => priceRangeHandler(Number(e.target.value), 'end')}
					/>
				</Stack>
			</Stack>

			<Button onClick={textSearchHandler}>Search</Button>
		</Stack>
	);
};

export default Filter;
