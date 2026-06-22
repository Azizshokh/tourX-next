import { Direction } from '../../enums/common.enum';
import { FaqStatus } from '../../enums/faq.enum';

export interface CreateFaqInput {
	faqCategoryId: string;
	faqQuestion: string;
	faqAnswer: string;
	faqOrder?: number;
}

export interface CreateFaqCategoryInput {
	faqCategoryTitle: string;
	faqCategoryKey: string;
	faqCategoryOrder?: number;
}

export interface UpdateFaqInput {
	_id: string;
	faqCategoryId?: string;
	faqQuestion?: string;
	faqAnswer?: string;
	faqStatus?: FaqStatus;
	faqOrder?: number;
}

interface FaqSearch {
	faqCategoryId?: string;
	faqStatus?: FaqStatus;
	text?: string;
}

export interface FaqInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: FaqSearch;
}
