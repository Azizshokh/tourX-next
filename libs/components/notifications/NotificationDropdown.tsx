import React, { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, CircularProgress, ClickAwayListener, Stack } from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import { GET_MY_NOTIFICATIONS, GET_MY_UNREAD_NOTIFICATION_COUNT } from '../../../apollo/user/query';
import { MARK_NOTIFICATION_AS_READ } from '../../../apollo/user/mutation';
import { Notification } from '../../types/notification/notification';
import { NotificationsInquiry } from '../../types/notification/notification.input';

interface NotificationDropdownProps {
	isAuthenticated: boolean;
}

const notificationsInput: NotificationsInquiry = {
	page: 1,
	limit: 8,
	search: {},
};

const NotificationDropdown = ({ isAuthenticated }: NotificationDropdownProps) => {
	const router = useRouter();
	const panelRef = useRef<HTMLDivElement | null>(null);
	const { t } = useTranslation(['common']);
	const [open, setOpen] = useState(false);
	const [hasLoadedList, setHasLoadedList] = useState(false);
	const [activeNotificationId, setActiveNotificationId] = useState<string | null>(null);
	const locale = router.locale === 'kr' ? 'ko-KR' : router.locale === 'ru' ? 'ru-RU' : 'en-US';

	const {
		data: unreadData,
		refetch: refetchUnreadCount,
	} = useQuery(GET_MY_UNREAD_NOTIFICATION_COUNT, {
		skip: !isAuthenticated,
		fetchPolicy: 'cache-and-network',
		nextFetchPolicy: 'cache-first',
	});

	const [
		getMyNotifications,
		{
			data: notificationsData,
			loading: notificationsLoading,
			error: notificationsError,
			refetch: refetchNotifications,
		},
	] = useLazyQuery(GET_MY_NOTIFICATIONS, {
		variables: { input: notificationsInput },
		fetchPolicy: 'cache-and-network',
		nextFetchPolicy: 'cache-first',
		onCompleted: () => setHasLoadedList(true),
	});

	const [markNotificationAsRead] = useMutation(MARK_NOTIFICATION_AS_READ);

	const unreadCount = unreadData?.getMyUnreadNotificationCount?.total ?? 0;
	const notifications: Notification[] = notificationsData?.getMyNotifications?.list ?? [];

	const badgeLabel = useMemo(() => {
		if (unreadCount > 99) return '99+';
		return String(unreadCount);
	}, [unreadCount]);

	const openPanelHandler = async () => {
		if (!isAuthenticated) return;
		const nextOpen = !open;
		setOpen(nextOpen);
		if (nextOpen && !hasLoadedList) {
			await getMyNotifications();
		}
	};

	const retryHandler = async () => {
		if (refetchNotifications) {
			await refetchNotifications({ input: notificationsInput });
			return;
		}
		await getMyNotifications();
	};

	const viewPackageHandler = async (notification: Notification) => {
		const packageId = notification.packageId || notification.packageData?._id;
		if (!packageId || activeNotificationId) return;

		try {
			setActiveNotificationId(notification._id);
			if (!notification.isRead) {
				await markNotificationAsRead({
					variables: {
						notificationId: notification._id,
					},
				});
				await refetchUnreadCount();
				if (refetchNotifications) await refetchNotifications({ input: notificationsInput });
			}
			setOpen(false);
			await router.push(`/tour-package/detail?id=${packageId}`);
		} finally {
			setActiveNotificationId(null);
		}
	};

	const formatCreatedAt = (value: string | Date) => {
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return '';
		return new Intl.DateTimeFormat(locale, {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		}).format(date);
	};

	const senderLabel = (notification: Notification) =>
		notification.senderData?.memberFullName || notification.senderData?.memberNick || t('notifications.senderFallback');

	const packageTitle = (notification: Notification) =>
		notification.packageData?.packageTitle || notification.notificationTitle || t('notifications.packageFallback');

	const message = (notification: Notification) =>
		notification.notificationDesc || t('notifications.defaultMessage', { agent: senderLabel(notification) });

	if (!isAuthenticated) return null;

	return (
		<ClickAwayListener onClickAway={() => setOpen(false)}>
			<Box className={'notification-root'} ref={panelRef}>
				<button
					type={'button'}
					className={`notification-trigger ${open ? 'active' : ''}`}
					onClick={openPanelHandler}
					aria-label={t('notifications.open')}
					aria-expanded={open}
				>
					<NotificationsOutlinedIcon />
					{unreadCount > 0 && <span className={'notification-badge'}>{badgeLabel}</span>}
				</button>

				{open && (
					<Stack className={'notification-panel'}>
						<Stack className={'notification-panel-head'}>
							<Box>
								<strong>{t('notifications.title')}</strong>
								<span>{t('notifications.subtitle')}</span>
							</Box>
							{unreadCount > 0 && <em>{t('notifications.unreadCount', { count: unreadCount })}</em>}
						</Stack>

						{notificationsLoading && !hasLoadedList ? (
							<Stack className={'notification-state'}>
								<CircularProgress size={24} />
								<span>{t('notifications.loading')}</span>
							</Stack>
						) : notificationsError ? (
							<Stack className={'notification-state error'}>
								<ErrorOutlineRoundedIcon />
								<span>{t('notifications.error')}</span>
								<Button className={'notification-retry'} onClick={retryHandler}>
									{t('notifications.retry')}
								</Button>
							</Stack>
						) : notifications.length === 0 ? (
							<Stack className={'notification-state empty'}>
								<TravelExploreRoundedIcon />
								<strong>{t('notifications.emptyTitle')}</strong>
								<span>{t('notifications.emptyBody')}</span>
							</Stack>
						) : (
							<Stack className={'notification-list'}>
								{notifications.map((notification) => {
									const loadingAction = activeNotificationId === notification._id;
									return (
										<article className={`notification-item ${!notification.isRead ? 'unread' : ''}`} key={notification._id}>
											<div className={'notification-dot'} />
											<Stack className={'notification-copy'}>
												<Stack className={'notification-meta'}>
													<strong>{senderLabel(notification)}</strong>
													<span>{formatCreatedAt(notification.createdAt)}</span>
												</Stack>
												<h4>{packageTitle(notification)}</h4>
												<p>{message(notification)}</p>
								<Button
									className={'view-package-btn'}
									disabled={loadingAction || !(notification.packageId || notification.packageData?._id)}
									onClick={() => viewPackageHandler(notification)}
								>
													{loadingAction ? t('notifications.opening') : t('notifications.viewPackage')}
												</Button>
											</Stack>
										</article>
									);
								})}
							</Stack>
						)}
					</Stack>
				)}
			</Box>
		</ClickAwayListener>
	);
};

export default NotificationDropdown;
