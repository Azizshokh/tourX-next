import { FaqStatus } from '../../enums/faq.enum';
import { TotalCounter } from '../tour-package/tour-package';

export interface FaqCategory {
	_id: string;
	faqCategoryTitle: string;
	faqCategoryKey: string;
	faqCategoryStatus: FaqStatus;
	faqCategoryOrder: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface Faq {
	_id: string;
	faqCategoryId: string;
	faqQuestion: string;
	faqAnswer: string;
	faqStatus: FaqStatus;
	faqOrder: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface FaqCategories {
	list: FaqCategory[];
	metaCounter: TotalCounter[];
}

export interface Faqs {
	list: Faq[];
	metaCounter: TotalCounter[];
}
