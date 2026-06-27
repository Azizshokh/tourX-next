import { NotificationGroup, NotificationStatus, NotificationType } from '../../enums/notification.enum';
import { Member } from '../member/member';
import { TotalCounter, TourPackage } from '../tour-package/tour-package';

export interface Notification {
	_id: string;
	notificationType: NotificationType;
	notificationTitle: string;
	notificationDesc?: string;
	notificationGroup: NotificationGroup;
	receiverMemberId: string;
	senderMemberId: string;
	packageId?: string;
	isRead: boolean;
	notificationStatus: NotificationStatus;
	createdAt: Date | string;
	updatedAt: Date | string;
	senderData?: Member;
	packageData?: TourPackage;
}

export interface Notifications {
	list: Notification[];
	metaCounter: TotalCounter[];
}

export interface NotificationCount {
	total: number;
}
