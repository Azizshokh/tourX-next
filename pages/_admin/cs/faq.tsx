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
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import { useMutation, useQuery } from '@apollo/client';
import { FaqArticlesPanelList } from '../../../libs/components/admin/cs/FaqList';
import { Faq, FaqCategory } from '../../../libs/types/faq/faq';
import { CreateFaqCategoryInput, CreateFaqInput, FaqInquiry } from '../../../libs/types/faq/faq.input';
import { FaqStatus } from '../../../libs/enums/faq.enum';
import { T } from '../../../libs/types/common';
import { GET_ALL_FAQ_CATEGORIES_BY_ADMIN, GET_ALL_FAQS_BY_ADMIN } from '../../../apollo/admin/query';
import { CREATE_FAQ_BY_ADMIN, CREATE_FAQ_CATEGORY_BY_ADMIN } from '../../../apollo/admin/mutation';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../../libs/sweetAlert';

interface FaqFormState {
	faqCategoryId: string;
	faqQuestion: string;
	faqAnswer: string;
}

const initialFaqForm: FaqFormState = {
	faqCategoryId: '',
	faqQuestion: '',
	faqAnswer: '',
};

const defaultFaqCategories: CreateFaqCategoryInput[] = [
	{ faqCategoryTitle: 'Booking', faqCategoryKey: 'booking', faqCategoryOrder: 1 },
	{ faqCategoryTitle: 'Payments & Refunds', faqCategoryKey: 'payments', faqCategoryOrder: 2 },
	{ faqCategoryTitle: 'Tour Packages', faqCategoryKey: 'packages', faqCategoryOrder: 3 },
	{ faqCategoryTitle: 'Travel Agencies', faqCategoryKey: 'agencies', faqCategoryOrder: 4 },
	{ faqCategoryTitle: 'Account', faqCategoryKey: 'account', faqCategoryOrder: 5 },
	{ faqCategoryTitle: 'Travel Policies', faqCategoryKey: 'policies', faqCategoryOrder: 6 },
	{ faqCategoryTitle: 'Community', faqCategoryKey: 'community', faqCategoryOrder: 7 },
	{ faqCategoryTitle: 'General Questions', faqCategoryKey: 'general', faqCategoryOrder: 8 },
];

const FaqArticles: NextPage = ({ initialInquiry, categoryInquiry, ...props }: any) => {
	const [faqInquiry, setFaqInquiry] = useState<FaqInquiry>(initialInquiry);
	const [activeCategoryInquiry] = useState<FaqInquiry>(categoryInquiry);
	const [faqs, setFaqs] = useState<Faq[]>([]);
	const [faqCategories, setFaqCategories] = useState<FaqCategory[]>([]);
	const [faqTotal, setFaqTotal] = useState<number>(0);
	const [value, setValue] = useState<string>(faqInquiry?.search?.faqStatus ?? 'ALL');
	const [searchInput, setSearchInput] = useState('');
	const [categoryFilter, setCategoryFilter] = useState('ALL');
	const [openCreateModal, setOpenCreateModal] = useState(false);
	const [createForm, setCreateForm] = useState<FaqFormState>(initialFaqForm);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isCreatingCategories, setIsCreatingCategories] = useState(false);

	/** APOLLO REQUESTS **/
	const {
		loading: faqCategoriesLoading,
		refetch: getAllFaqCategoriesByAdminRefetch,
	} = useQuery(GET_ALL_FAQ_CATEGORIES_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: activeCategoryInquiry },
		onCompleted: (data: T) => {
			setFaqCategories(data?.getAllFaqCategoriesByAdmin?.list ?? []);
		},
		onError: (err) => {
			console.warn('getAllFaqCategoriesByAdmin error:', err.message);
		},
	});

	const {
		loading: getAllFaqsByAdminLoading,
		refetch: getAllFaqsByAdminRefetch,
	} = useQuery(GET_ALL_FAQS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: faqInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setFaqs(data?.getAllFaqsByAdmin?.list ?? []);
			setFaqTotal(data?.getAllFaqsByAdmin?.metaCounter?.[0]?.total ?? 0);
		},
		onError: (err) => {
			sweetErrorHandling(err).then();
		},
	});

	const [createFaqByAdmin] = useMutation(CREATE_FAQ_BY_ADMIN);
	const [createFaqCategoryByAdmin] = useMutation(CREATE_FAQ_CATEGORY_BY_ADMIN);

	/** LIFECYCLES **/
	useEffect(() => {
		if (openCreateModal && faqCategories.length > 0 && !createForm.faqCategoryId) {
			setCreateForm((prev) => ({ ...prev, faqCategoryId: faqCategories[0]._id }));
		}
	}, [openCreateModal, faqCategories, createForm.faqCategoryId]);

	/** HANDLERS **/
	const getValidCategoryId = (categories: FaqCategory[], selectedId?: string) => {
		if (selectedId && categories.some((category) => category._id === selectedId)) return selectedId;
		return categories[0]?._id ?? '';
	};

	const changePageHandler = async (event: unknown, newPage: number) => {
		const nextInquiry = { ...faqInquiry, page: newPage + 1 };
		setFaqInquiry(nextInquiry);
		await getAllFaqsByAdminRefetch({ input: nextInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const nextInquiry = { ...faqInquiry, limit: parseInt(event.target.value, 10), page: 1 };
		setFaqInquiry(nextInquiry);
		await getAllFaqsByAdminRefetch({ input: nextInquiry });
	};

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);
		const nextSearch = { ...faqInquiry.search };

		if (newValue === 'ALL') delete nextSearch.faqStatus;
		else nextSearch.faqStatus = newValue as FaqStatus;

		const nextInquiry = { ...faqInquiry, page: 1, search: nextSearch };
		setFaqInquiry(nextInquiry);
		await getAllFaqsByAdminRefetch({ input: nextInquiry });
	};

	const categoryFilterHandler = async (newValue: string | unknown) => {
		const selectedValue = String(newValue);
		setCategoryFilter(selectedValue);
		const nextSearch = { ...faqInquiry.search };

		if (selectedValue === 'ALL') delete nextSearch.faqCategoryId;
		else nextSearch.faqCategoryId = selectedValue;

		const nextInquiry = { ...faqInquiry, page: 1, search: nextSearch };
		setFaqInquiry(nextInquiry);
		await getAllFaqsByAdminRefetch({ input: nextInquiry });
	};

	const searchTextHandler = async () => {
		const text = searchInput.trim();
		const nextSearch = { ...faqInquiry.search };

		if (text) nextSearch.text = text;
		else delete nextSearch.text;

		const nextInquiry = { ...faqInquiry, page: 1, search: nextSearch };
		setFaqInquiry(nextInquiry);
		await getAllFaqsByAdminRefetch({ input: nextInquiry });
	};

	const clearSearchTextHandler = async () => {
		setSearchInput('');
		const nextSearch = { ...faqInquiry.search };
		delete nextSearch.text;
		const nextInquiry = { ...faqInquiry, page: 1, search: nextSearch };
		setFaqInquiry(nextInquiry);
		await getAllFaqsByAdminRefetch({ input: nextInquiry });
	};

	const openCreateModalHandler = async () => {
		const initialCategoryId = getValidCategoryId(faqCategories, createForm.faqCategoryId);
		setCreateForm((prev) => ({ ...prev, faqCategoryId: initialCategoryId }));
		setOpenCreateModal(true);
	};

	const closeCreateModalHandler = () => {
		if (isSubmitting || isCreatingCategories) return;
		setOpenCreateModal(false);
		setCreateForm(initialFaqForm);
	};

	const createFormChangeHandler = (field: keyof FaqFormState, value: string) => {
		setCreateForm((prev) => ({ ...prev, [field]: value }));
	};

	const validateCreateForm = async () => {
		if (!createForm.faqCategoryId) {
			await sweetMixinErrorAlert('Please select an FAQ category.');
			return false;
		}
		if (!createForm.faqQuestion.trim()) {
			await sweetMixinErrorAlert('Please enter an FAQ question.');
			return false;
		}
		if (!createForm.faqAnswer.trim()) {
			await sweetMixinErrorAlert('Please enter an FAQ answer.');
			return false;
		}
		return true;
	};

	const isCreateFaqDisabled = () => {
		if (isSubmitting || faqCategories.length === 0) return true;
		if (!createForm.faqCategoryId) return true;
		if (!createForm.faqQuestion.trim()) return true;
		if (!createForm.faqAnswer.trim()) return true;
		return false;
	};

	const createDefaultCategoriesHandler = async () => {
		if (isCreatingCategories) return;

		try {
			setIsCreatingCategories(true);

			for (const input of defaultFaqCategories) {
				await createFaqCategoryByAdmin({ variables: { input } });
			}

			const result = await getAllFaqCategoriesByAdminRefetch({ input: activeCategoryInquiry });
			const categories = result?.data?.getAllFaqCategoriesByAdmin?.list ?? [];

			setFaqCategories(categories);
			setCreateForm((prev) => ({ ...prev, faqCategoryId: getValidCategoryId(categories, prev.faqCategoryId) }));
			await sweetTopSmallSuccessAlert('FAQ categories created!', 900);
		} catch (err: any) {
			sweetErrorHandling(err).then();
		} finally {
			setIsCreatingCategories(false);
		}
	};

	const createFaqHandler = async () => {
		if (isSubmitting || isCreateFaqDisabled()) return;
		if (!(await validateCreateForm())) return;

		try {
			setIsSubmitting(true);

			const input: CreateFaqInput = {
				faqCategoryId: createForm.faqCategoryId,
				faqQuestion: createForm.faqQuestion.trim(),
				faqAnswer: createForm.faqAnswer.trim(),
			};

			await createFaqByAdmin({ variables: { input } });
			await getAllFaqCategoriesByAdminRefetch({ input: activeCategoryInquiry });
			await getAllFaqsByAdminRefetch({ input: faqInquiry });
			await sweetTopSmallSuccessAlert('FAQ created!', 900);
			setOpenCreateModal(false);
			setCreateForm(initialFaqForm);
		} catch (err: any) {
			sweetErrorHandling(err).then();
		} finally {
			setIsSubmitting(false);
		}
	};

	const selectedModalCategoryId = getValidCategoryId(faqCategories, createForm.faqCategoryId);

	return (
		<Box component={'div'} className={'content'}>
			<Box component={'div'} className={'title flex_space'}>
				<Box component={'div'} className={'admin-page-title compact'}>
					<span className={'title-icon'}>
						<HelpOutlineRoundedIcon />
					</span>
					<Typography variant={'h2'}>FAQ</Typography>
				</Box>
				<Button className="btn_add" variant={'contained'} size={'medium'} type={'button'} onClick={openCreateModalHandler}>
					<AddRoundedIcon sx={{ mr: '8px' }} />
					Add FAQ
				</Button>
			</Box>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={value}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								<ListItem
									onClick={(e) => tabChangeHandler(e, 'ALL')}
									value="ALL"
									className={value === 'ALL' ? 'li on' : 'li'}
								>
									All
								</ListItem>
								<ListItem
									onClick={(e) => tabChangeHandler(e, FaqStatus.ACTIVE)}
									value={FaqStatus.ACTIVE}
									className={value === FaqStatus.ACTIVE ? 'li on' : 'li'}
								>
									Active
								</ListItem>
								<ListItem
									onClick={(e) => tabChangeHandler(e, FaqStatus.DELETE)}
									value={FaqStatus.DELETE}
									className={value === FaqStatus.DELETE ? 'li on' : 'li'}
								>
									Delete
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
									placeholder="Search FAQ question or answer"
									endAdornment={
										<>
											{searchInput && <CancelRoundedIcon style={{ cursor: 'pointer' }} onClick={clearSearchTextHandler} />}
											<InputAdornment position="end">
												<img src="/img/icons/search_icon.png" alt={'searchIcon'} onClick={searchTextHandler} />
											</InputAdornment>
										</>
									}
								/>
								<Select
									sx={{ width: '240px', ml: '20px' }}
									value={categoryFilter}
									onChange={(e: any) => categoryFilterHandler(e.target.value)}
								>
									<MenuItem value={'ALL'}>
										All Categories
									</MenuItem>
									{faqCategories.map((category: FaqCategory) => (
										<MenuItem value={category._id} key={category._id}>
											{category.faqCategoryTitle}
										</MenuItem>
									))}
								</Select>
							</Stack>
							<Divider />
						</Box>
						<FaqArticlesPanelList faqs={faqs} categories={faqCategories} loading={getAllFaqsByAdminLoading} />

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={faqTotal}
							rowsPerPage={faqInquiry?.limit}
							page={faqInquiry?.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>

			<Dialog className={'admin-faq-modal'} open={openCreateModal} onClose={closeCreateModalHandler} maxWidth={'md'} fullWidth>
				<DialogTitle>Add FAQ</DialogTitle>
				<DialogContent>
					<Stack className={'faq-modal-form'}>
						<FormControl fullWidth disabled={faqCategoriesLoading || faqCategories.length === 0}>
							<InputLabel id="faq-category-label">FAQ Category</InputLabel>
							<Select
								labelId="faq-category-label"
								label="FAQ Category"
								value={selectedModalCategoryId}
								onChange={(e: any) => createFormChangeHandler('faqCategoryId', String(e.target.value))}
							>
								{faqCategories.map((category: FaqCategory) => (
									<MenuItem value={category._id} key={category._id}>
										{category.faqCategoryTitle}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						{!faqCategoriesLoading && faqCategories.length === 0 && (
							<Stack className={'faq-empty-category-box'}>
								<Typography className={'empty-helper'}>No active FAQ categories available.</Typography>
								<Button
									className={'btn_seed_categories'}
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
							label="Question"
							value={createForm.faqQuestion}
							onChange={(e: any) => createFormChangeHandler('faqQuestion', e.target.value)}
							inputProps={{ maxLength: 300 }}
							fullWidth
							multiline
							minRows={2}
						/>
						<TextField
							className={'faq-answer-field'}
							label="Answer"
							value={createForm.faqAnswer}
							onChange={(e: any) => createFormChangeHandler('faqAnswer', e.target.value)}
							inputProps={{ maxLength: 2000 }}
							fullWidth
							multiline
							minRows={10}
						/>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button className={'btn_cancel'} onClick={closeCreateModalHandler} disabled={isSubmitting || isCreatingCategories}>
						Cancel
					</Button>
					<Button className={'btn_submit'} variant={'contained'} onClick={createFaqHandler} disabled={isCreateFaqDisabled()}>
						{isSubmitting ? 'Saving...' : 'Create FAQ'}
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

FaqArticles.defaultProps = {
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
		sort: 'faqCategoryOrder',
		direction: 'ASC',
		search: {
			faqStatus: FaqStatus.ACTIVE,
		},
	},
};

export default withAdminLayout(FaqArticles);
