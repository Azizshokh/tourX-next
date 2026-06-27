export interface NotificationSearch {
	isRead?: boolean;
}

export interface NotificationsInquiry {
	page: number;
	limit: number;
	search: NotificationSearch;
}
