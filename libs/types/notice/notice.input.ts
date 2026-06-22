import { Direction } from '../../enums/common.enum';
import { NoticeStatus } from '../../enums/notice.enum';

export interface CreateNoticeCategoryInput {
	noticeCategoryTitle: string;
	noticeCategoryKey: string;
	noticeCategoryOrder?: number;
}

export interface CreateNoticeInput {
	noticeCategoryId: string;
	noticeTitle: string;
	noticeContent: string;
}

export interface UpdateNoticeInput {
	_id: string;
	noticeCategoryId?: string;
	noticeTitle?: string;
	noticeContent?: string;
	noticeStatus?: NoticeStatus;
	noticeOrder?: number;
}

interface NoticeCategorySearch {
	noticeCategoryId?: string;
	noticeStatus?: NoticeStatus;
	text?: string;
}

export interface NoticeInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: NoticeCategorySearch;
}
