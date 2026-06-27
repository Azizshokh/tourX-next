import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	InputAdornment,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Select,
	Stack,
	TextField,
} from '@mui/material';
import { List, ListItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { TabContext } from '@mui/lab';
import TablePagination from '@mui/material/TablePagination';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import { useMutation, useQuery } from '@apollo/client';
import { NoticeList } from '../../../libs/components/admin/cs/NoticeList';
import { Notice, NoticeCategory } from '../../../libs/types/notice/notice';
import {
	CreateNoticeCategoryInput,
	CreateNoticeInput,
	NoticeInquiry,
	UpdateNoticeInput,
} from '../../../libs/types/notice/notice.input';
import { NoticeStatus } from '../../../libs/enums/notice.enum';
import { T } from '../../../libs/types/common';
import {
	CREATE_NOTICE_BY_ADMIN,
	CREATE_NOTICE_CATEGORY_BY_ADMIN,
	DELETE_NOTICE_BY_ADMIN,
	UPDATE_NOTICE_BY_ADMIN,
} from '../../../apollo/admin/mutation';
import { GET_ALL_NOTICE_CATEGORIES_BY_ADMIN, GET_ALL_NOTICES_BY_ADMIN } from '../../../apollo/admin/query';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../../libs/sweetAlert';
import { useTranslation } from 'next-i18next';
import { ADMIN_NAMESPACES, getI18nProps } from '../../../libs/i18n';

const defaultNoticeCategories: CreateNoticeCategoryInput[] = [
	{ noticeCategoryTitle: 'Booking Help', noticeCategoryKey: 'booking-help', noticeCategoryOrder: 1 },
	{ noticeCategoryTitle: 'Payments & Refunds', noticeCategoryKey: 'payments-refunds', noticeCategoryOrder: 2 },
	{ noticeCategoryTitle: 'Tour Packages', noticeCategoryKey: 'tour-packages', noticeCategoryOrder: 3 },
	{ noticeCategoryTitle: 'Travel Agencies', noticeCategoryKey: 'travel-agencies', noticeCategoryOrder: 4 },
	{ noticeCategoryTitle: 'Account & Profile', noticeCategoryKey: 'account-profile', noticeCategoryOrder: 5 },
	{ noticeCategoryTitle: 'Travel Documents', noticeCategoryKey: 'travel-documents', noticeCategoryOrder: 6 },
	{ noticeCategoryTitle: 'Visa Information', noticeCategoryKey: 'visa-information', noticeCategoryOrder: 7 },
	{ noticeCategoryTitle: 'Travel Safety', noticeCategoryKey: 'travel-safety', noticeCategoryOrder: 8 },
];

const initialNoticeForm: CreateNoticeInput = {
	noticeCategoryId: '',
	noticeTitle: '',
	noticeContent: '',
};

const getMissingNoticeCategories = (categories: NoticeCategory[]) => {
	const existingKeys = new Set(categories.map((category) => category.noticeCategoryKey));
	return defaultNoticeCategories.filter((category) => !existingKeys.has(category.noticeCategoryKey));
};

const AdminNotice: NextPage = ({ initialInquiry, categoryInquiry, ...props }: any) => {
	const { t } = useTranslation(['common', 'admin']);
	const [noticeInquiry, setNoticeInquiry] = useState<NoticeInquiry>(initialInquiry);
	const [notices, setNotices] = useState<Notice[]>([]);
	const [noticeTotal, setNoticeTotal] = useState<number>(0);
	const [value, setValue] = useState<string>(initialInquiry?.search?.noticeStatus ?? 'ALL');
	const [categoryFilter, setCategoryFilter] = useState('ALL');
	const [searchInput, setSearchInput] = useState('');

	const [noticeCategories, setNoticeCategories] = useState<NoticeCategory[]>([]);
	const [openCreateModal, setOpenCreateModal] = useState(false);
	const [createForm, setCreateForm] = useState<CreateNoticeInput>(initialNoticeForm);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isCreatingCategories, setIsCreatingCategories] = useState(false);

	/** APOLLO REQUESTS **/
	const {
		loading: noticeCategoriesLoading,
		refetch: getAllNoticeCategoriesByAdminRefetch,
	} = useQuery(GET_ALL_NOTICE_CATEGORIES_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: categoryInquiry },
		onCompleted: (data: T) => {
			setNoticeCategories(data?.getAllNoticeCategoriesByAdmin?.list ?? []);
		},
		onError: (err) => {
			console.warn('getAllNoticeCategoriesByAdmin error:', err.message);
		},
	});

	const {
		loading: getAllNoticesByAdminLoading,
		refetch: getAllNoticesByAdminRefetch,
	} = useQuery(GET_ALL_NOTICES_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: noticeInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setNotices(data?.getAllNoticesByAdmin?.list ?? []);
			setNoticeTotal(data?.getAllNoticesByAdmin?.metaCounter?.[0]?.total ?? 0);
		},
		onError: (err) => {
			sweetErrorHandling(err).then();
		},
	});

	const [createNoticeByAdmin] = useMutation(CREATE_NOTICE_BY_ADMIN);
	const [createNoticeCategoryByAdmin] = useMutation(CREATE_NOTICE_CATEGORY_BY_ADMIN);
	const [updateNoticeByAdmin] = useMutation(UPDATE_NOTICE_BY_ADMIN);
	const [deleteNoticeByAdmin] = useMutation(DELETE_NOTICE_BY_ADMIN);

	/** LIFECYCLES **/
	useEffect(() => {
		if (openCreateModal && noticeCategories.length > 0 && !createForm.noticeCategoryId) {
			setCreateForm((prev) => ({ ...prev, noticeCategoryId: noticeCategories[0]._id }));
		}
	}, [openCreateModal, noticeCategories, createForm.noticeCategoryId]);

	/** HANDLERS **/
	const getValidCategoryId = (categories: NoticeCategory[], selectedId?: string) => {
		if (selectedId && categories.some((category) => category._id === selectedId)) return selectedId;
		return categories[0]?._id ?? '';
	};

	const openCreateModalHandler = () => {
		const initialId = getValidCategoryId(noticeCategories, createForm.noticeCategoryId);
		setCreateForm((prev) => ({ ...prev, noticeCategoryId: initialId }));
		setOpenCreateModal(true);
	};

	const closeCreateModalHandler = () => {
		if (isSubmitting || isCreatingCategories) return;
		setOpenCreateModal(false);
		setCreateForm(initialNoticeForm);
	};

	const isCreateDisabled = () => {
		if (isSubmitting || noticeCategories.length === 0) return true;
		return false;
	};

	const missingNoticeCategories = getMissingNoticeCategories(noticeCategories);

	const validateCreateForm = async () => {
		if (!createForm.noticeCategoryId) {
			await sweetMixinErrorAlert(t('admin:notices.categoryRequired'));
			return false;
		}
		if (!createForm.noticeTitle.trim()) {
			await sweetMixinErrorAlert(t('admin:notices.titleRequired'));
			return false;
		}
		if (!createForm.noticeContent.trim()) {
			await sweetMixinErrorAlert(t('admin:notices.contentRequired'));
			return false;
		}
		return true;
	};

	const changePageHandler = async (event: unknown, newPage: number) => {
		const nextInquiry = { ...noticeInquiry, page: newPage + 1 };
		setNoticeInquiry(nextInquiry);
		await getAllNoticesByAdminRefetch({ input: nextInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const nextInquiry = { ...noticeInquiry, limit: parseInt(event.target.value, 10), page: 1 };
		setNoticeInquiry(nextInquiry);
		await getAllNoticesByAdminRefetch({ input: nextInquiry });
	};

	const tabChangeHandler = async (newValue: string) => {
		setValue(newValue);
		const nextSearch = { ...noticeInquiry.search };

		if (newValue === 'ALL') delete nextSearch.noticeStatus;
		else nextSearch.noticeStatus = newValue as NoticeStatus;

		const nextInquiry = { ...noticeInquiry, page: 1, search: nextSearch };
		setNoticeInquiry(nextInquiry);
		await getAllNoticesByAdminRefetch({ input: nextInquiry });
	};

	const categoryFilterHandler = async (selectedValue: string) => {
		setCategoryFilter(selectedValue);
		const nextSearch = { ...noticeInquiry.search };

		if (selectedValue === 'ALL') delete nextSearch.noticeCategoryId;
		else nextSearch.noticeCategoryId = selectedValue;

		const nextInquiry = { ...noticeInquiry, page: 1, search: nextSearch };
		setNoticeInquiry(nextInquiry);
		await getAllNoticesByAdminRefetch({ input: nextInquiry });
	};

	const searchTextHandler = async () => {
		const text = searchInput.trim();
		const nextSearch = { ...noticeInquiry.search };

		if (text) nextSearch.text = text;
		else delete nextSearch.text;

		const nextInquiry = { ...noticeInquiry, page: 1, search: nextSearch };
		setNoticeInquiry(nextInquiry);
		await getAllNoticesByAdminRefetch({ input: nextInquiry });
	};

	const clearSearchTextHandler = async () => {
		setSearchInput('');
		const nextSearch = { ...noticeInquiry.search };
		delete nextSearch.text;
		const nextInquiry = { ...noticeInquiry, page: 1, search: nextSearch };
		setNoticeInquiry(nextInquiry);
		await getAllNoticesByAdminRefetch({ input: nextInquiry });
	};

	const createDefaultCategoriesHandler = async () => {
		if (isCreatingCategories) return;
		try {
			setIsCreatingCategories(true);
			const missingCategories = getMissingNoticeCategories(noticeCategories);

			for (const input of missingCategories) {
				await createNoticeCategoryByAdmin({ variables: { input } });
			}

			const result = await getAllNoticeCategoriesByAdminRefetch({ input: categoryInquiry });
			const categories = result?.data?.getAllNoticeCategoriesByAdmin?.list ?? [];
			const firstTourXCategory = categories.find((category: NoticeCategory) =>
				defaultNoticeCategories.some((defaultCategory) => defaultCategory.noticeCategoryKey === category.noticeCategoryKey),
			);

			setNoticeCategories(categories);
			setCreateForm((prev) => ({
				...prev,
				noticeCategoryId: firstTourXCategory?._id ?? getValidCategoryId(categories, prev.noticeCategoryId),
			}));
			await sweetTopSmallSuccessAlert(t('admin:notices.categoriesSynced'), 900);
		} catch (err: any) {
			sweetErrorHandling(err).then();
		} finally {
			setIsCreatingCategories(false);
		}
	};

	const createNoticeHandler = async () => {
		if (isCreateDisabled()) return;
		if (!(await validateCreateForm())) return;
		try {
			setIsSubmitting(true);
			const input: CreateNoticeInput = {
				noticeCategoryId: createForm.noticeCategoryId,
				noticeTitle: createForm.noticeTitle.trim(),
				noticeContent: createForm.noticeContent.trim(),
			};

			await createNoticeByAdmin({ variables: { input } });
			await getAllNoticeCategoriesByAdminRefetch({ input: categoryInquiry });
			await getAllNoticesByAdminRefetch({ input: noticeInquiry });
			await sweetTopSmallSuccessAlert(t('admin:messages.noticeCreated'), 900);
			setOpenCreateModal(false);
			setCreateForm(initialNoticeForm);
		} catch (err: any) {
			sweetErrorHandling(err).then();
		} finally {
			setIsSubmitting(false);
		}
	};

	const updateNoticeStatusHandler = async (input: UpdateNoticeInput) => {
		try {
			await updateNoticeByAdmin({ variables: { input } });
			await getAllNoticesByAdminRefetch({ input: noticeInquiry });
			await sweetTopSmallSuccessAlert(t('admin:messages.noticeStatus'), 900);
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const deleteNoticeHandler = async (noticeId: string) => {
		try {
			await deleteNoticeByAdmin({ variables: { input: noticeId } });
			await getAllNoticesByAdminRefetch({ input: noticeInquiry });
			await sweetTopSmallSuccessAlert(t('admin:messages.noticeDeleted'), 900);
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const selectedModalCategoryId = getValidCategoryId(noticeCategories, createForm.noticeCategoryId);

	return (
		<Box component={'div'} className={'content'}>
			<Box component={'div'} className={'title flex_space'}>
				<Box component={'div'} className={'admin-page-title compact'}>
					<span className={'title-icon'}>
						<CampaignRoundedIcon />
					</span>
					<Typography variant={'h2'}>{t('admin:pages.notice')}</Typography>
				</Box>
				<Button
					className="btn_add"
					variant={'contained'}
					size={'medium'}
					onClick={openCreateModalHandler}
				>
					<AddRoundedIcon sx={{ mr: '8px' }} />
					{t('admin:actions.addNotice')}
				</Button>
			</Box>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={value}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								<ListItem value="ALL" className={value === 'ALL' ? 'li on' : 'li'} onClick={() => tabChangeHandler('ALL')}>
									{t('admin:tabs.all')}
								</ListItem>
								<ListItem
									value={NoticeStatus.ACTIVE}
									className={value === NoticeStatus.ACTIVE ? 'li on' : 'li'}
									onClick={() => tabChangeHandler(NoticeStatus.ACTIVE)}
								>
									{t('admin:tabs.active')}
								</ListItem>
								<ListItem
									value={NoticeStatus.HOLD}
									className={value === NoticeStatus.HOLD ? 'li on' : 'li'}
									onClick={() => tabChangeHandler(NoticeStatus.HOLD)}
								>
									{t('admin:tabs.hold')}
								</ListItem>
								<ListItem
									value={NoticeStatus.DELETE}
									className={value === NoticeStatus.DELETE ? 'li on' : 'li'}
									onClick={() => tabChangeHandler(NoticeStatus.DELETE)}
								>
									{t('admin:tabs.deleted')}
								</ListItem>
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<OutlinedInput
									value={searchInput}
									onChange={(e: any) => setSearchInput(e.target.value)}
									onKeyDown={(e: any) => {
										if (e.key === 'Enter') searchTextHandler().then();
									}}
									sx={{ width: '100%' }}
									className={'search'}
									placeholder={t('admin:search.notice')}
									endAdornment={
										<>
											{searchInput && (
												<CancelRoundedIcon style={{ cursor: 'pointer' }} onClick={clearSearchTextHandler} />
											)}
											<InputAdornment position="end">
												<img src="/img/icons/search_icon.png" alt={'searchIcon'} onClick={searchTextHandler} />
											</InputAdornment>
										</>
									}
								/>
								<Select
									sx={{ width: '240px', ml: '20px' }}
									value={categoryFilter}
									onChange={(e: any) => categoryFilterHandler(String(e.target.value))}
								>
									<MenuItem value={'ALL'}>
										{t('admin:labels.allCategories')}
									</MenuItem>
									{noticeCategories.map((category: NoticeCategory) => (
										<MenuItem value={category._id} key={category._id}>
											{category.noticeCategoryTitle}
										</MenuItem>
									))}
								</Select>
							</Stack>
							<Divider />
						</Box>
						<NoticeList
							notices={notices}
							categories={noticeCategories}
							loading={getAllNoticesByAdminLoading}
							updateNoticeStatusHandler={updateNoticeStatusHandler}
							deleteNoticeHandler={deleteNoticeHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={noticeTotal}
							rowsPerPage={noticeInquiry.limit}
							page={noticeInquiry.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>

			<Dialog
				className={'admin-notice-modal'}
				open={openCreateModal}
				onClose={closeCreateModalHandler}
				maxWidth={'md'}
				fullWidth
				scroll={'body'}
			>
				<DialogTitle>{t('admin:actions.addNotice')}</DialogTitle>
				<DialogContent>
					<Stack className={'notice-modal-form'}>
						<FormControl fullWidth disabled={noticeCategoriesLoading || noticeCategories.length === 0}>
							<InputLabel id="notice-category-label">{t('admin:labels.noticeCategory')}</InputLabel>
							<Select
								labelId="notice-category-label"
								label={t('admin:labels.noticeCategory')}
								value={selectedModalCategoryId}
								onChange={(e: any) =>
									setCreateForm((p) => ({ ...p, noticeCategoryId: String(e.target.value) }))
								}
							>
								{noticeCategories.map((cat: NoticeCategory) => (
									<MenuItem value={cat._id} key={cat._id}>
										{cat.noticeCategoryTitle}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						{!noticeCategoriesLoading && missingNoticeCategories.length > 0 && (
							<Stack className={'notice-empty-category-box'}>
								<Typography className={'empty-helper'}>
									{noticeCategories.length === 0
										? t('admin:notices.noActiveCategories')
										: t('admin:notices.missingCategories', { count: missingNoticeCategories.length })}
								</Typography>
								<Button
									className={'btn_seed_notice_categories'}
									type={'button'}
									variant={'outlined'}
									onClick={createDefaultCategoriesHandler}
									disabled={isCreatingCategories}
								>
									<AutoFixHighRoundedIcon />
									{isCreatingCategories ? t('admin:actions.syncing') : t('admin:actions.syncCategories')}
								</Button>
							</Stack>
						)}

						<TextField
							label={t('admin:table.title')}
							value={createForm.noticeTitle}
							onChange={(e: any) => setCreateForm((p) => ({ ...p, noticeTitle: e.target.value }))}
							inputProps={{ maxLength: 200 }}
							fullWidth
						/>
						<TextField
							className={'notice-content-field'}
							label={t('admin:table.content')}
							value={createForm.noticeContent}
							onChange={(e: any) => setCreateForm((p) => ({ ...p, noticeContent: e.target.value }))}
							inputProps={{ maxLength: 5000 }}
							fullWidth
							multiline
							rows={5}
						/>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button
						className={'btn_cancel'}
						onClick={closeCreateModalHandler}
						disabled={isSubmitting || isCreatingCategories}
					>
						{t('admin:actions.cancel')}
					</Button>
					<Button
						className={'btn_submit'}
						variant={'contained'}
						onClick={createNoticeHandler}
						disabled={isCreateDisabled()}
					>
						{isSubmitting ? t('admin:actions.saving') : t('admin:actions.createNotice')}
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

AdminNotice.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
	categoryInquiry: {
		page: 1,
		limit: 100,
		sort: 'noticeCategoryOrder',
		direction: 'ASC',
		search: {
			noticeStatus: NoticeStatus.ACTIVE,
		},
	},
};

export default withAdminLayout(AdminNotice);

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await getI18nProps(locale, ADMIN_NAMESPACES)),
	},
});
