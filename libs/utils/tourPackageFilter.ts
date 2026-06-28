import { Direction } from '../enums/common.enum';
import { TourPackagesInquiry } from '../types/tour-package/tour-package.input';

export const PACKAGE_SEARCH_PRICE_MAX = 2000000;

export const normalizeTourPackageInquiry = (
	input: TourPackagesInquiry,
	limit: number,
): TourPackagesInquiry => ({
	...input,
	page: input?.page && input.page > 0 ? input.page : 1,
	limit,
	sort: input?.sort ?? 'createdAt',
	direction: input?.direction ?? Direction.DESC,
	search: input?.search ?? {},
});

export const cleanTourPackageInquiry = (
	input: TourPackagesInquiry,
	limit: number,
): TourPackagesInquiry => {
	const normalized = normalizeTourPackageInquiry(input, limit);
	const search = { ...normalized.search };

	if (search.text !== undefined) {
		const trimmedText = search.text.trim();
		if (trimmedText) search.text = trimmedText;
		else delete search.text;
	}

	(['countryList', 'cityList', 'typeList', 'options'] as const).forEach((key) => {
		const values = search[key]?.map((value) => value.trim()).filter(Boolean);
		if (values?.length) {
			(search as any)[key] = values;
		} else {
			delete search[key];
		}
	});

	if (search.durationRange) {
		const start = Number(search.durationRange.start);
		const end = Number(search.durationRange.end);
		if (Number.isFinite(start) && Number.isFinite(end)) search.durationRange = { start, end };
		else delete search.durationRange;
	}

	if (search.pricesRange) {
		const start = Number(search.pricesRange.start);
		const end = Number(search.pricesRange.end);
		if (Number.isFinite(start) && Number.isFinite(end)) search.pricesRange = { start, end };
		else delete search.pricesRange;
	}

	return {
		...normalized,
		search,
	};
};

export const hasActiveTourPackageFilters = (input: TourPackagesInquiry): boolean => {
	const search = input.search ?? {};
	const hasDefaultPriceRange =
		search.pricesRange?.start === 0 && search.pricesRange?.end === PACKAGE_SEARCH_PRICE_MAX;

	return Boolean(
		search.text ||
			search.countryList?.length ||
			search.cityList?.length ||
			search.typeList?.length ||
			search.options?.length ||
			search.durationRange ||
			(search.pricesRange && !hasDefaultPriceRange),
	);
};

export const isTourPackageInquiryValid = (input: TourPackagesInquiry): boolean => {
	const { durationRange, pricesRange } = input.search ?? {};
	if (durationRange && durationRange.start > durationRange.end) return false;
	if (pricesRange && pricesRange.start > pricesRange.end) return false;
	return true;
};

export const parseTourPackageInquiry = (
	input: string | string[] | undefined,
	fallback: TourPackagesInquiry,
	limit: number,
): TourPackagesInquiry => {
	if (typeof input !== 'string') return cleanTourPackageInquiry(fallback, limit);

	try {
		return cleanTourPackageInquiry(JSON.parse(input), limit);
	} catch (err) {
		return cleanTourPackageInquiry(fallback, limit);
	}
};

export const parseTourPackageInquiryFromQuery = (
	input: string | string[] | undefined,
	search: string | string[] | undefined,
	page: string | string[] | undefined,
	fallback: TourPackagesInquiry,
	limit: number,
): TourPackagesInquiry => {
	const parsedInput = parseTourPackageInquiry(input, fallback, limit);
	const searchText = typeof search === 'string' ? search.trim() : '';
	const pageNumber = typeof page === 'string' ? Number(page) : parsedInput.page;

	if (!searchText) return parsedInput;

	return cleanTourPackageInquiry(
		{
			...parsedInput,
			page: Number.isFinite(pageNumber) && pageNumber > 0 ? pageNumber : 1,
			search: {
				...parsedInput.search,
				text: searchText,
			},
		},
		limit,
	);
};

export const tourPackageInquiryUrl = (input: TourPackagesInquiry): string =>
	`/tour-package?input=${encodeURIComponent(JSON.stringify(input))}`;

export const tourPackageSearchUrl = (searchText: string, page?: number): string => {
	const params = new URLSearchParams({ search: searchText.trim() });
	if (page && page > 1) params.set('page', String(page));
	return `/tour-package?${params.toString()}`;
};
