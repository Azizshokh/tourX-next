import React, { useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	InputAdornment,
	MenuItem,
	OutlinedInput,
	Select,
	Stack,
	Typography,
} from '@mui/material';
import { List, ListItem } from '@mui/material';
import Divider from '@mui/material/Divider';
import { TabContext } from '@mui/lab';
import TablePagination from '@mui/material/TablePagination';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import { useMutation, useQuery } from '@apollo/client';
import { CommentList } from '../../../libs/components/admin/comment/CommentList';
import { Comment } from '../../../libs/types/comment/comment';
import { AllCommentsInquiry } from '../../../libs/types/comment/comment.input';
import { CommentGroup, CommentStatus } from '../../../libs/enums/comment.enum';
import { T } from '../../../libs/types/common';
import { GET_ALL_COMMENTS_BY_ADMIN } from '../../../apollo/admin/query';
import {
	ACTIVATE_COMMENT_BY_ADMIN,
	DELETE_COMMENT_BY_ADMIN,
	PAUSE_COMMENT_BY_ADMIN,
} from '../../../apollo/admin/mutation';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../../libs/sweetAlert';

const AdminComments: NextPage = ({ initialInquiry, ...props }: any) => {
	const [commentInquiry, setCommentInquiry] = useState<AllCommentsInquiry>(initialInquiry);
	const [comments, setComments] = useState<Comment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);
	const [value, setValue] = useState<string>('ALL');
	const [groupFilter, setGroupFilter] = useState<string>('ALL');
	const [searchInput, setSearchInput] = useState('');
	const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	/** APOLLO REQUESTS **/
	const { loading: commentsLoading, refetch: refetchComments } = useQuery(GET_ALL_COMMENTS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: commentInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setComments(data?.getAllCommentsByAdmin?.list ?? []);
			setCommentTotal(data?.getAllCommentsByAdmin?.metaCounter?.[0]?.total ?? 0);
		},
		onError: (err) => {
			sweetErrorHandling(err).then();
		},
	});

	const [pauseCommentByAdmin] = useMutation(PAUSE_COMMENT_BY_ADMIN);
	const [activateCommentByAdmin] = useMutation(ACTIVATE_COMMENT_BY_ADMIN);
	const [deleteCommentByAdmin] = useMutation(DELETE_COMMENT_BY_ADMIN);

	/** HANDLERS **/
	const tabChangeHandler = async (newValue: string) => {
		setValue(newValue);
		const nextSearch: any = { ...commentInquiry.search };

		if (newValue === 'ALL') delete nextSearch.commentStatus;
		else nextSearch.commentStatus = newValue as CommentStatus;

		const nextInquiry = { ...commentInquiry, page: 1, search: nextSearch };
		setCommentInquiry(nextInquiry);
		await refetchComments({ input: nextInquiry });
	};

	const groupFilterHandler = async (newValue: string) => {
		setGroupFilter(newValue);
		const nextSearch: any = { ...commentInquiry.search };

		if (newValue === 'ALL') delete nextSearch.commentGroup;
		else nextSearch.commentGroup = newValue as CommentGroup;

		const nextInquiry = { ...commentInquiry, page: 1, search: nextSearch };
		setCommentInquiry(nextInquiry);
		await refetchComments({ input: nextInquiry });
	};

	const searchTextHandler = async () => {
		const text = searchInput.trim();
		const nextSearch: any = { ...commentInquiry.search };

		if (text) nextSearch.text = text;
		else delete nextSearch.text;

		const nextInquiry = { ...commentInquiry, page: 1, search: nextSearch };
		setCommentInquiry(nextInquiry);
		await refetchComments({ input: nextInquiry });
	};

	const clearSearchTextHandler = async () => {
		setSearchInput('');
		const nextSearch: any = { ...commentInquiry.search };
		delete nextSearch.text;
		const nextInquiry = { ...commentInquiry, page: 1, search: nextSearch };
		setCommentInquiry(nextInquiry);
		await refetchComments({ input: nextInquiry });
	};

	const changePageHandler = async (event: unknown, newPage: number) => {
		const nextInquiry = { ...commentInquiry, page: newPage + 1 };
		setCommentInquiry(nextInquiry);
		await refetchComments({ input: nextInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const nextInquiry = { ...commentInquiry, limit: parseInt(event.target.value, 10), page: 1 };
		setCommentInquiry(nextInquiry);
		await refetchComments({ input: nextInquiry });
	};

	const deleteCommentHandler = (commentId: string) => {
		setDeleteTargetId(commentId);
	};

	const cancelDeleteHandler = () => {
		setDeleteTargetId(null);
	};

	const confirmDeleteHandler = async () => {
		if (!deleteTargetId || isDeleting) return;

		const snapshot = [...comments];
		setComments((prev) => prev.filter((c) => c._id !== deleteTargetId));
		setCommentTotal((prev) => Math.max(0, prev - 1));
		setDeleteTargetId(null);

		try {
			setIsDeleting(true);
			await deleteCommentByAdmin({ variables: { input: deleteTargetId } });
			await sweetTopSmallSuccessAlert('Comment deleted.', 900);
		} catch (err: any) {
			setComments(snapshot);
			setCommentTotal((prev) => prev + 1);
			sweetErrorHandling(err).then();
		} finally {
			setIsDeleting(false);
		}
	};

	const pauseCommentHandler = async (commentId: string) => {
		const snapshot = [...comments];
		setComments((prev) =>
			prev.map((c) => (c._id === commentId ? { ...c, commentStatus: CommentStatus.PAUSED } : c)),
		);

		try {
			await pauseCommentByAdmin({ variables: { input: commentId } });
			await sweetTopSmallSuccessAlert('Comment paused.', 900);
		} catch (err: any) {
			setComments(snapshot);
			sweetErrorHandling(err).then();
		}
	};

	const activateCommentHandler = async (commentId: string) => {
		const snapshot = [...comments];
		setComments((prev) =>
			prev.map((c) => (c._id === commentId ? { ...c, commentStatus: CommentStatus.ACTIVE } : c)),
		);

		try {
			await activateCommentByAdmin({ variables: { input: commentId } });
			await sweetTopSmallSuccessAlert('Comment activated.', 900);
		} catch (err: any) {
			setComments(snapshot);
			sweetErrorHandling(err).then();
		}
	};

	return (
		// @ts-ignore
		<Box component={'div'} className={'content'}>
			<Box component={'div'} className={'title flex_space'}>
				<Box component={'div'} className={'admin-page-title compact'}>
					<span className={'title-icon'}>
						<ChatBubbleOutlineRoundedIcon />
					</span>
					<Typography variant={'h2'}>Comments</Typography>
				</Box>
			</Box>

			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={value}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								<ListItem
									onClick={() => tabChangeHandler('ALL')}
									value="ALL"
									className={value === 'ALL' ? 'li on' : 'li'}
								>
									All
								</ListItem>
								<ListItem
									onClick={() => tabChangeHandler(CommentStatus.ACTIVE)}
									value={CommentStatus.ACTIVE}
									className={value === CommentStatus.ACTIVE ? 'li on' : 'li'}
								>
									Active
								</ListItem>
								<ListItem
									onClick={() => tabChangeHandler(CommentStatus.PAUSED)}
									value={CommentStatus.PAUSED}
									className={value === CommentStatus.PAUSED ? 'li on' : 'li'}
								>
									Paused
								</ListItem>
								<ListItem
									onClick={() => tabChangeHandler(CommentStatus.DELETE)}
									value={CommentStatus.DELETE}
									className={value === CommentStatus.DELETE ? 'li on' : 'li'}
								>
									Deleted
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
									placeholder="Search comment content"
									endAdornment={
										<>
											{searchInput && (
												<CancelRoundedIcon style={{ cursor: 'pointer' }} onClick={clearSearchTextHandler} />
											)}
											<InputAdornment position="end">
												<img
													src="/img/icons/search_icon.png"
													alt={'searchIcon'}
													onClick={searchTextHandler}
													style={{ cursor: 'pointer' }}
												/>
											</InputAdornment>
										</>
									}
								/>
								<Select
									sx={{ width: '200px', ml: '20px' }}
									value={groupFilter}
									onChange={(e: any) => groupFilterHandler(e.target.value)}
								>
									<MenuItem value={'ALL'}>All Types</MenuItem>
									<MenuItem value={CommentGroup.MEMBER}>Member</MenuItem>
									<MenuItem value={CommentGroup.ARTICLE}>Article</MenuItem>
									<MenuItem value={CommentGroup.PACKAGE}>Package</MenuItem>
								</Select>
							</Stack>
							<Divider />
						</Box>

						<CommentList
							comments={comments}
							loading={commentsLoading}
							onDeleteRequest={deleteCommentHandler}
							onPause={pauseCommentHandler}
							onActivate={activateCommentHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={commentTotal}
							rowsPerPage={commentInquiry.limit}
							page={commentInquiry.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>

			{/* Delete Confirmation Dialog */}
			<Dialog open={!!deleteTargetId} onClose={cancelDeleteHandler} maxWidth={'xs'} fullWidth>
				<DialogTitle
					sx={{
						fontFamily: "'Plus Jakarta Sans', sans-serif",
						fontWeight: 800,
						fontSize: '18px',
						color: '#0d1c32',
						pb: '8px',
					}}
				>
					Delete Comment
				</DialogTitle>
				<DialogContent>
					<Typography
						sx={{
							fontFamily: "'Plus Jakarta Sans', sans-serif",
							fontSize: '14px',
							color: '#6b7280',
						}}
					>
						Are you sure you want to delete this comment? This action cannot be undone.
					</Typography>
				</DialogContent>
				<DialogActions sx={{ px: '24px', pb: '20px', gap: '8px' }}>
					<Button
						onClick={cancelDeleteHandler}
						disabled={isDeleting}
						sx={{
							fontFamily: "'Plus Jakarta Sans', sans-serif",
							fontWeight: 700,
							color: '#6b7280',
							border: '1px solid rgba(148,163,184,0.35)',
							borderRadius: '10px',
							textTransform: 'none',
							px: '20px',
						}}
					>
						Cancel
					</Button>
					<Button
						onClick={confirmDeleteHandler}
						disabled={isDeleting}
						variant={'contained'}
						color={'error'}
						sx={{
							fontFamily: "'Plus Jakarta Sans', sans-serif",
							fontWeight: 700,
							borderRadius: '10px',
							textTransform: 'none',
							px: '20px',
							background: '#dc2626',
							boxShadow: '0 8px 20px rgba(220,38,38,0.22)',
							'&:hover': { background: '#b91c1c' },
						}}
					>
						{isDeleting ? 'Deleting…' : 'Delete'}
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

AdminComments.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withAdminLayout(AdminComments);
