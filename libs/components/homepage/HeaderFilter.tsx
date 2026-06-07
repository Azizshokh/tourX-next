import React, { useState } from 'react';
import { Stack, Modal, Divider, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { packageCountries, packageDurations } from '../../config';
import { PackageType } from '../../enums/package.enum';
import { TourPackagesInquiry } from '../../types/tour-package/tour-package.input';

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 'auto',
	backgroundColor: '#fff',
	borderRadius: '12px',
	outline: 'none',
	boxShadow: '0 11px 15px -7px rgba(0,0,0,0.2), 0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12)',
};

interface HeaderFilterProps {
	initialInput: TourPackagesInquiry;
}

const HeaderFilter = (props: HeaderFilterProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const { t } = useTranslation('common');
	const [searchFilter, setSearchFilter] = useState<TourPackagesInquiry>(initialInput);
	const [openAdvancedFilter, setOpenAdvancedFilter] = useState(false);
	const [openCountry, setOpenCountry] = useState(false);
	const [openType, setOpenType] = useState(false);
	const [openDuration, setOpenDuration] = useState(false);
	const [optionCheck, setOptionCheck] = useState('all');
	const router = useRouter();

	const pushSearchHandler = async () => {
		const nextFilter = { ...searchFilter, search: { ...searchFilter.search } };
		if (nextFilter.search.countryList?.length === 0) delete nextFilter.search.countryList;
		if (nextFilter.search.typeList?.length === 0) delete nextFilter.search.typeList;
		if (nextFilter.search.options?.length === 0) delete nextFilter.search.options;

		await router.push(
			`/tour-package?input=${JSON.stringify(nextFilter)}`,
			`/tour-package?input=${JSON.stringify(nextFilter)}`,
		);
	};

	const resetFilterHandler = () => {
		setSearchFilter(initialInput);
		setOptionCheck('all');
	};

	if (device === 'mobile') {
		return <div>HEADER FILTER MOBILE</div>;
	}

	return (
		<>
			<Stack className={'search-box'}>
				<Stack className={'select-box'}>
					<div className={`box ${openCountry ? 'on' : ''}`} onClick={() => setOpenCountry((prev) => !prev)}>
						<span>{searchFilter?.search?.countryList?.[0] ?? t('Location')}</span>
						<ExpandMoreIcon />
					</div>
					<div className={`box ${openType ? 'on' : ''}`} onClick={() => setOpenType((prev) => !prev)}>
						<span>{searchFilter?.search?.typeList?.[0] ?? 'Package type'}</span>
						<ExpandMoreIcon />
					</div>
					<div className={`box ${openDuration ? 'on' : ''}`} onClick={() => setOpenDuration((prev) => !prev)}>
						<span>
							{searchFilter?.search?.durationRange
								? `${searchFilter.search.durationRange.start}-${searchFilter.search.durationRange.end} days`
								: 'Duration'}
						</span>
						<ExpandMoreIcon />
					</div>
				</Stack>
				<Stack className={'search-box-other'}>
					<div className={'advanced-filter'} onClick={() => setOpenAdvancedFilter(true)}>
						<img src="/img/icons/tune.svg" alt="" />
						<span>{t('Advanced')}</span>
					</div>
					<div className={'search-btn'} onClick={pushSearchHandler}>
						<img src="/img/icons/search_white.svg" alt="" />
					</div>
				</Stack>

				<div className={`filter-location ${openCountry ? 'on' : ''}`}>
					{packageCountries.map((country) => (
						<div
							onClick={() => {
								setSearchFilter({ ...searchFilter, search: { ...searchFilter.search, countryList: [country] } });
								setOpenCountry(false);
								setOpenType(true);
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
								setOpenDuration(true);
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
							Up to {days} days
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
							<span>Find your tour</span>
							<div className={'search-input-box'}>
								<img src="/img/icons/search.svg" alt="" />
								<input
									value={searchFilter?.search?.text ?? ''}
									type="text"
									placeholder={'What are you looking for?'}
									onChange={(e: any) =>
										setSearchFilter({ ...searchFilter, search: { ...searchFilter.search, text: e.target.value } })
									}
								/>
							</div>
						</div>
						<Divider sx={{ mt: '30px', mb: '35px' }} />
						<div className={'middle'}>
							<div className={'row-box'}>
								<div className={'box'}>
									<span>Inclusions</span>
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
												<MenuItem value={'all'}>All Options</MenuItem>
												<MenuItem value={'flightIncluded'}>Flight</MenuItem>
												<MenuItem value={'hotelIncluded'}>Hotel</MenuItem>
												<MenuItem value={'guideIncluded'}>Guide</MenuItem>
											</Select>
										</FormControl>
									</div>
								</div>
								<div className={'box'}>
									<span>Duration</span>
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
								<span>Reset all filters</span>
							</div>
							<Button startIcon={<img src={'/img/icons/search.svg'} />} className={'search-btn'} onClick={pushSearchHandler}>
								Search
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
