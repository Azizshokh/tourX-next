import { PackageStatus, PackageType } from '../../enums/package.enum';

export interface TourPackageUpdate {
	_id: string;
	packageType?: PackageType;
	packageStatus?: PackageStatus;
	packageTitle?: string;
	packageCountry?: string;
	packageCity?: string;
	packageAddress?: string;
	packageDesc?: string;
	packagePrice?: number;
	packageCurrency?: string;
	durationDays?: number;
	minPeople?: number;
	maxPeople?: number;
	flightIncluded?: boolean;
	hotelIncluded?: boolean;
	guideIncluded?: boolean;
	packageImages?: string[];
	startDate?: string;
	endDate?: string;
	deletedAt?: Date;
}
