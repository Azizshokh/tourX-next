import { Direction } from '../../enums/common.enum';
import { PackageStatus, PackageType } from '../../enums/package.enum';

export interface TourPackageInput {
	packageType: PackageType | '';
	packageTitle: string;
	packageCountry: string;
	packageCity: string;
	packageAddress: string;
	packageDesc?: string;
	packagePrice: number;
	packageCurrency?: string;
	durationDays: number;
	minPeople: number;
	maxPeople: number;
	flightIncluded?: boolean;
	hotelIncluded?: boolean;
	guideIncluded?: boolean;
	packageImages: string[];
	memberId?: string;
	startDate: string;
	endDate: string;
}

interface Range {
	start: number;
	end: number;
}

interface DatesRange {
	start: string;
	end: string;
}

interface TPISearch {
	memberId?: string;
	countryList?: string[];
	cityList?: string[];
	typeList?: PackageType[];
	options?: string[];
	pricesRange?: Range;
	datesRange?: DatesRange;
	durationRange?: Range;
	text?: string;
}

export interface TourPackagesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: TPISearch;
}

interface ATPSearch {
	packageStatus?: PackageStatus;
}

export interface AgentTourPackagesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ATPSearch;
}

interface ALTSearch {
	packageStatus?: PackageStatus;
	packageCountryList?: string[];
	packageCityList?: string[];
	text?: string;
}

export interface AllTourPackagesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ALTSearch;
}
