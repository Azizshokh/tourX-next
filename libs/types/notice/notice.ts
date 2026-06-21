import { NoticeStatus } from '../../enums/notice.enum';
import { TotalCounter } from '../tour-package/tour-package';

export interface NoticeCategory {
	_id: string;
	noticeCategoryTitle: string;
	noticeCategoryKey: string;
	noticeCategoryStatus: NoticeStatus;
	noticeCategoryOrder: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface NoticeCategories {
	list: NoticeCategory[];
	metaCounter: TotalCounter[];
}

export interface Notice {
	_id: string;
	noticeCategoryId: string;
	noticeTitle: string;
	noticeContent: string;
	noticeStatus: NoticeStatus;
	noticeViews: number;
	memberId: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Notices {
	list: Notice[];
	metaCounter: TotalCounter[];
}
