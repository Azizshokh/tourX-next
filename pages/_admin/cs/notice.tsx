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
import { NoticeCategory } from '../../../libs/types/notice/notice';
import { CreateNoticeCategoryInput, CreateNoticeInput, NoticeInquiry } from '../../../libs/types/notice/notice.input';
import { NoticeStatus } from '../../../libs/enums/notice.enum';
import { T } from '../../../libs/types/common';
import { GET_ALL_NOTICE_CATEGORIES_BY_ADMIN } from '../../../apollo/admin/query';
import { CREATE_NOTICE_BY_ADMIN, CREATE_NOTICE_CATEGORY_BY_ADMIN } from '../../../apollo/admin/mutation';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../../libs/sweetAlert';

const defaultNoticeCategories: CreateNoticeCategoryInput[] = [
	{ noticeCategoryTitle: 'FAQ', noticeCategoryKey: 'faq', noticeCategoryOrder: 1 },
	{ noticeCategoryTitle: 'Terms', noticeCategoryKey: 'terms', noticeCategoryOrder: 2 },
	{ noticeCategoryTitle: 'Inquiry', noticeCategoryKey: 'inquiry', noticeCategoryOrder: 3 },
];

const initialNoticeForm: CreateNoticeInput = {
	noticeCategoryId: '',
	noticeTitle: '',
	noticeContent: '',
};

const AdminNotice: NextPage = ({ categoryInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [searchCategory, setSearchCategory] = useState('TITLE');
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

	const [createNoticeByAdmin] = useMutation(CREATE_NOTICE_BY_ADMIN);
	const [createNoticeCategoryByAdmin] = useMutation(CREATE_NOTICE_CATEGORY_BY_ADMIN);

	/** LIFECYCLES **/
	useEffect(() => {
		if (openCreateModal && noticeCategories.length > 0 && !createForm.noticeCategoryId) {
			setCreateForm((prev) => ({ ...prev, noticeCategoryId: noticeCategories[0]._id }));
		}
	}, [openCreateModal, noticeCategories, createForm.noticeCategoryId]);

	/** HANDLERS **/
	const openCreateModalHandler = () => {
		const initialId = noticeCategories[0]?._id ?? '';
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
		if (!createForm.noticeCategoryId) return true;
		if (!createForm.noticeTitle.trim()) return true;
		if (!createForm.noticeContent.trim()) return true;
		return false;
	};

	const createDefaultCategoriesHandler = async () => {
		if (isCreatingCategories) return;
		try {
			setIsCreatingCategories(true);
			for (const input of defaultNoticeCategories) {
				await createNoticeCategoryByAdmin({ variables: { input } });
			}
			const result = await getAllNoticeCategoriesByAdminRefetch({ input: categoryInquiry });
			const categories = result?.data?.getAllNoticeCategoriesByAdmin?.list ?? [];
			setNoticeCategories(categories);
			setCreateForm((prev) => ({ ...prev, noticeCategoryId: categories[0]?._id ?? '' }));
			await sweetTopSmallSuccessAlert('Notice categories created!', 900);
		} catch (err: any) {
			sweetErrorHandling(err).then();
		} finally {
			setIsCreatingCategories(false);
		}
	};

	const createNoticeHandler = async () => {
		if (isCreateDisabled()) return;
		try {
			setIsSubmitting(true);
			await createNoticeByAdmin({ variables: { input: createForm } });
			await sweetTopSmallSuccessAlert('Notice created!', 900);
			setOpenCreateModal(false);
			setCreateForm(initialNoticeForm);
		} catch (err: any) {
			sweetErrorHandling(err).then();
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		// @ts-ignore
		<Box component={'div'} className={'content'}>
			<Box component={'div'} className={'title flex_space'}>
				<Box component={'div'} className={'admin-page-title compact'}>
					<span className={'title-icon'}>
						<CampaignRoundedIcon />
					</span>
					<Typography variant={'h2'}>Notice</Typography>
				</Box>
				<Button
					className="btn_add"
					variant={'contained'}
					size={'medium'}
					onClick={openCreateModalHandler}
				>
					<AddRoundedIcon sx={{ mr: '8px' }} />
					Add Notice
				</Button>
			</Box>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={'value'}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								<ListItem value="all" className={'li on'}>
									All (0)
								</ListItem>
								<ListItem value="active" className={'li'}>
									Active (0)
								</ListItem>
								<ListItem value="blocked" className={'li'}>
									Blocked (0)
								</ListItem>
								<ListItem value="deleted" className={'li'}>
									Deleted (0)
								</ListItem>
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<OutlinedInput
									value={searchInput}
									onChange={(e: any) => setSearchInput(e.target.value)}
									sx={{ width: '100%' }}
									className={'search'}
									placeholder="Search notice title or content"
									endAdornment={
										<>
											{searchInput && (
												<CancelRoundedIcon style={{ cursor: 'pointer' }} onClick={() => setSearchInput('')} />
											)}
											<InputAdornment position="end">
												<img src="/img/icons/search_icon.png" alt={'searchIcon'} />
											</InputAdornment>
										</>
									}
								/>
								<Select sx={{ width: '180px', ml: '20px' }} value={searchCategory}>
									<MenuItem value={'TITLE'} onClick={() => setSearchCategory('TITLE')}>
										Title
									</MenuItem>
									<MenuItem value={'CONTENT'} onClick={() => setSearchCategory('CONTENT')}>
										Content
									</MenuItem>
									<MenuItem value={'STATUS'} onClick={() => setSearchCategory('STATUS')}>
										Status
									</MenuItem>
								</Select>
							</Stack>
							<Divider />
						</Box>
						<NoticeList anchorEl={anchorEl} />

						<TablePagination
							rowsPerPageOptions={[20, 40, 60]}
							component="div"
							count={4}
							rowsPerPage={10}
							page={1}
							onPageChange={() => {}}
							onRowsPerPageChange={() => {}}
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
			>
				<DialogTitle>Add Notice</DialogTitle>
				<DialogContent>
					<Stack className={'notice-modal-form'}>
						<FormControl fullWidth disabled={noticeCategoriesLoading || noticeCategories.length === 0}>
							<InputLabel id="notice-category-label">Category</InputLabel>
							<Select
								labelId="notice-category-label"
								label="Category"
								value={createForm.noticeCategoryId}
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

						{!noticeCategoriesLoading && noticeCategories.length === 0 && (
							<Stack className={'notice-empty-category-box'}>
								<Typography className={'empty-helper'}>No active notice categories available.</Typography>
								<Button
									className={'btn_seed_notice_categories'}
									type={'button'}
									variant={'outlined'}
									onClick={createDefaultCategoriesHandler}
									disabled={isCreatingCategories}
								>
									<AutoFixHighRoundedIcon />
									{isCreatingCategories ? 'Creating...' : 'Create Default Categories'}
								</Button>
							</Stack>
						)}

						<TextField
							label="Title"
							value={createForm.noticeTitle}
							onChange={(e: any) => setCreateForm((p) => ({ ...p, noticeTitle: e.target.value }))}
							inputProps={{ maxLength: 200 }}
							fullWidth
						/>
						<TextField
							className={'notice-content-field'}
							label="Content"
							value={createForm.noticeContent}
							onChange={(e: any) => setCreateForm((p) => ({ ...p, noticeContent: e.target.value }))}
							inputProps={{ maxLength: 5000 }}
							fullWidth
							multiline
							minRows={8}
						/>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button
						className={'btn_cancel'}
						onClick={closeCreateModalHandler}
						disabled={isSubmitting || isCreatingCategories}
					>
						Cancel
					</Button>
					<Button
						className={'btn_submit'}
						variant={'contained'}
						onClick={createNoticeHandler}
						disabled={isCreateDisabled()}
					>
						{isSubmitting ? 'Saving...' : 'Create Notice'}
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

AdminNotice.defaultProps = {
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
