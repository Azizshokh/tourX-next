import { PackageStatus, PackageType } from '../../enums/package.enum';
import { Member } from '../member/member';

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}

export interface TotalCounter {
	total: number;
}

export interface TourPackage {
	_id: string;
	packageType: PackageType;
	packageStatus: PackageStatus;
	packageTitle: string;
	packageCountry: string;
	packageCity: string;
	packageAddress: string;
	packageDesc?: string;
	packagePrice: number;
	packageCurrency: string;
	durationDays: number;
	minPeople: number;
	maxPeople: number;
	flightIncluded: boolean;
	hotelIncluded: boolean;
	guideIncluded: boolean;
	packageViews: number;
	packageLikes: number;
	packageComments: number;
	packageRank: number;
	packageImages: string[];
	memberId: string;
	startDate: Date | string;
	endDate: Date | string;
	deletedAt?: Date;
	closedAt?: Date;
	activatedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface TourPackages {
	list: TourPackage[];
	metaCounter: TotalCounter[];
}
