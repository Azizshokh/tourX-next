import React, { useEffect, useRef, useState } from 'react';
import { Stack, Modal, Divider, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useLazyQuery } from '@apollo/client';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { packageCountries, packageDurations } from '../../config';
import { PackageType } from '../../enums/package.enum';
import { TourPackagesInquiry } from '../../types/tour-package/tour-package.input';
import { GET_TOUR_PACKAGES } from '../../../apollo/user/query';
import {
	cleanTourPackageInquiry,
	hasActiveTourPackageFilters,
	isTourPackageInquiryValid,
	tourPackageSearchUrl,
	tourPackageInquiryUrl,
} from '../../utils/tourPackageFilter';
import { sweetWarningAlert } from '../../sweetAlert';

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 'auto',
	backgroundColor: 'transparent',
	outline: 'none',
};

interface HeaderFilterProps {
	initialInput: TourPackagesInquiry;
}

const HeaderFilter = (props: HeaderFilterProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const { t } = useTranslation(['common', 'home']);
	const [searchFilter, setSearchFilter] = useState<TourPackagesInquiry>(initialInput);
	const [openAdvancedFilter, setOpenAdvancedFilter] = useState(false);
	const [openCountry, setOpenCountry] = useState(false);
	const [openType, setOpenType] = useState(false);
	const [openDuration, setOpenDuration] = useState(false);
	const [optionCheck, setOptionCheck] = useState('all');
	const [isSearching, setIsSearching] = useState(false);
	const router = useRouter();
	const searchBoxRef = useRef<HTMLDivElement | null>(null);
	const [checkTourPackages] = useLazyQuery(GET_TOUR_PACKAGES, { fetchPolicy: 'network-only' });

	const closeAllDropdowns = () => {
		setOpenCountry(false);
		setOpenType(false);
		setOpenDuration(false);
	};

	const toggleCountry = () => {
		setOpenCountry((prev) => !prev);
		setOpenType(false);
		setOpenDuration(false);
	};

	const toggleType = () => {
		setOpenType((prev) => !prev);
		setOpenCountry(false);
		setOpenDuration(false);
	};

	const toggleDuration = () => {
		setOpenDuration((prev) => !prev);
		setOpenCountry(false);
		setOpenType(false);
	};

	useEffect(() => {
		const handleOutside = (event: MouseEvent) => {
			if (!searchBoxRef.current) return;
			if (!searchBoxRef.current.contains(event.target as Node)) {
				closeAllDropdowns();
			}
		};
		const handleEsc = (event: KeyboardEvent) => {
			if (event.key === 'Escape') closeAllDropdowns();
		};
		document.addEventListener('mousedown', handleOutside);
		document.addEventListener('keydown', handleEsc);
		return () => {
			document.removeEventListener('mousedown', handleOutside);
			document.removeEventListener('keydown', handleEsc);
		};
	}, []);

	const pushSearchHandler = async () => {
		if (isSearching) return;

		const nextFilter = cleanTourPackageInquiry({ ...searchFilter, page: 1 }, initialInput.limit ?? 9);
		setSearchFilter(nextFilter);

		if (!isTourPackageInquiryValid(nextFilter)) {
			await sweetWarningAlert(t('alerts.invalidFilterInput'), t('alerts.invalidFilterInput'));
			return;
		}

		if (!hasActiveTourPackageFilters(nextFilter)) {
			await router.push('/tour-package');
			return;
		}

		setIsSearching(true);
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
			await router.push(url, url);
		} finally {
			setIsSearching(false);
		}
	};

	const submitAdvancedTextSearch = async () => {
		if (isSearching) return;
		const text = (searchFilter.search.text ?? '').trim();
		if (!text) return;

		const nextFilter = cleanTourPackageInquiry(
			{
				...initialInput,
				page: 1,
				search: {
					...initialInput.search,
					text,
				},
			},
			initialInput.limit ?? 9,
		);

		setIsSearching(true);
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

			setOpenAdvancedFilter(false);
			await router.push(tourPackageSearchUrl(text), tourPackageSearchUrl(text));
		} finally {
			setIsSearching(false);
		}
	};

	const clearAdvancedTextSearch = () => {
		const nextSearch = { ...searchFilter.search };
		delete nextSearch.text;
		setSearchFilter({ ...searchFilter, search: nextSearch });
	};

	const resetFilterHandler = () => {
		setSearchFilter(initialInput);
		setOptionCheck('all');
	};

	return (
		<>
			<Stack className={'search-box'} ref={searchBoxRef as any}>
				<Stack className={'select-box'}>
					<div className={`box ${openCountry ? 'on' : ''}`} onClick={toggleCountry}>
						<div className={'field-copy'}>
							<small>{t('home:filters.destination')}</small>
							<span>{searchFilter?.search?.countryList?.[0] ?? t('Location')}</span>
						</div>
						<ExpandMoreIcon />
					</div>
					<div className={`box ${openType ? 'on' : ''}`} onClick={toggleType}>
						<div className={'field-copy'}>
							<small>{t('home:filters.experience')}</small>
							<span>{searchFilter?.search?.typeList?.[0] ?? t('home:filters.packageType')}</span>
						</div>
						<ExpandMoreIcon />
					</div>
					<div className={`box ${openDuration ? 'on' : ''}`} onClick={toggleDuration}>
						<div className={'field-copy'}>
							<small>{t('home:filters.tripLength')}</small>
							<span>
								{searchFilter?.search?.durationRange
									? `${searchFilter.search.durationRange.start}-${searchFilter.search.durationRange.end} days`
									: t('home:filters.duration')}
							</span>
						</div>
						<ExpandMoreIcon />
					</div>
				</Stack>
				<Stack className={'search-box-other'}>
					<div className={'advanced-filter'} onClick={() => setOpenAdvancedFilter(true)}>
						<img src="/img/icons/tune.svg" alt="" />
						<span>{t('Advanced')}</span>
					</div>
					<div className={`search-btn ${isSearching ? 'disabled' : ''}`} onClick={pushSearchHandler}>
						<img src="/img/icons/search_white.svg" alt="" />
						<span>{isSearching ? t('searchPackages') : t('actions.search')}</span>
					</div>
				</Stack>

				<div className={`filter-location ${openCountry ? 'on' : ''}`}>
					{packageCountries.map((country) => (
						<div
							onClick={() => {
								setSearchFilter({ ...searchFilter, search: { ...searchFilter.search, countryList: [country] } });
								setOpenCountry(false);
							}}
							key={country}
						>
							<span>{country}</span>
						</div>
					))}
				</div>

				<div className={`filter-type ${openType ? 'on' : ''}`}>
					{Object.values(PackageType).map((type) => (
						<div
							onClick={() => {
								setSearchFilter({ ...searchFilter, search: { ...searchFilter.search, typeList: [type] } });
								setOpenType(false);
							}}
							key={type}
						>
							<span>{type}</span>
						</div>
					))}
				</div>

				<div className={`filter-rooms ${openDuration ? 'on' : ''}`}>
					{packageDurations.slice(0, 6).map((days) => (
						<span
							onClick={() => {
								setSearchFilter({
									...searchFilter,
									search: { ...searchFilter.search, durationRange: { start: 1, end: days } },
								});
								setOpenDuration(false);
							}}
							key={days}
						>
							{t('home:filters.upToDays', { count: days })}
						</span>
					))}
				</div>
			</Stack>

			<Modal open={openAdvancedFilter} onClose={() => setOpenAdvancedFilter(false)}>
				<div style={style}>
					<div className={'advanced-filter-modal'}>
						<div className={'close'} onClick={() => setOpenAdvancedFilter(false)}>
							<CloseIcon />
						</div>
						<div className={'top'}>
							<span>{t('home:filters.findTour')}</span>
							<div className={'search-input-box'}>
								<button
									type={'button'}
									className={'modal-search-icon'}
									onClick={submitAdvancedTextSearch}
									disabled={isSearching}
									aria-label={t('actions.search')}
								>
									<img src="/img/icons/search.svg" alt="" />
								</button>
								<input
									value={searchFilter?.search?.text ?? ''}
									type="text"
									placeholder={t('home:filters.searchPlaceholder')}
									disabled={isSearching}
									onChange={(e: any) =>
										setSearchFilter({ ...searchFilter, search: { ...searchFilter.search, text: e.target.value } })
									}
									onKeyDown={(e) => {
										if (e.key === 'Enter') submitAdvancedTextSearch();
									}}
								/>
								{searchFilter?.search?.text && (
									<button
										type={'button'}
										className={'modal-clear-search'}
										onClick={clearAdvancedTextSearch}
										disabled={isSearching}
										aria-label={t('clearSearch')}
									>
										<CloseIcon />
									</button>
								)}
							</div>
						</div>
						<Divider sx={{ mt: '30px', mb: '35px' }} />
						<div className={'middle'}>
							<div className={'row-box'}>
								<div className={'box'}>
									<span>{t('labels.inclusions')}</span>
									<div className={'inside'}>
										<FormControl>
											<Select
												value={optionCheck}
												onChange={(event) => {
													const value = event.target.value;
													setOptionCheck(value);
													if (value === 'all') {
														const nextSearch = { ...searchFilter.search };
														delete nextSearch.options;
														setSearchFilter({ ...searchFilter, search: nextSearch });
													} else {
														setSearchFilter({ ...searchFilter, search: { ...searchFilter.search, options: [value] } });
													}
												}}
											>
												<MenuItem value={'all'}>{t('home:filters.allOptions')}</MenuItem>
												<MenuItem value={'flightIncluded'}>{t('labels.flight')}</MenuItem>
												<MenuItem value={'hotelIncluded'}>{t('labels.hotel')}</MenuItem>
												<MenuItem value={'guideIncluded'}>{t('labels.guide')}</MenuItem>
											</Select>
										</FormControl>
									</div>
								</div>
								<div className={'box'}>
									<span>{t('home:filters.duration')}</span>
									<div className={'inside space-between align-center'}>
										<FormControl sx={{ width: '122px' }}>
											<Select
												value={searchFilter?.search?.durationRange?.start ?? 1}
												onChange={(event) =>
													setSearchFilter({
														...searchFilter,
														search: {
															...searchFilter.search,
															durationRange: {
																start: Number(event.target.value),
																end: searchFilter.search.durationRange?.end ?? 30,
															},
														},
													})
												}
											>
												{packageDurations.map((days) => (
													<MenuItem value={days} key={days}>
														{days}
													</MenuItem>
												))}
											</Select>
										</FormControl>
										<div className={'minus-line'}></div>
										<FormControl sx={{ width: '122px' }}>
											<Select
												value={searchFilter?.search?.durationRange?.end ?? 30}
												onChange={(event) =>
													setSearchFilter({
														...searchFilter,
														search: {
															...searchFilter.search,
															durationRange: {
																start: searchFilter.search.durationRange?.start ?? 1,
																end: Number(event.target.value),
															},
														},
													})
												}
											>
												{packageDurations.map((days) => (
													<MenuItem value={days} key={days}>
														{days}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									</div>
								</div>
							</div>
						</div>
						<Divider sx={{ mt: '60px', mb: '18px' }} />
						<div className={'bottom'}>
							<div onClick={resetFilterHandler}>
								<img src="/img/icons/reset.svg" alt="" />
								<span>{t('home:filters.resetAll')}</span>
							</div>
							<Button
								startIcon={<img src={'/img/icons/search.svg'} />}
								className={'search-btn'}
								disabled={isSearching}
								onClick={pushSearchHandler}
							>
								{isSearching ? t('searchPackages') : t('actions.search')}
							</Button>
						</div>
					</div>
				</div>
			</Modal>
		</>
	);
};

HeaderFilter.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		search: {
			pricesRange: {
				start: 0,
				end: 2000000,
			},
		},
	},
};

export default HeaderFilter;
