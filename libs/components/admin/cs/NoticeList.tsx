import React, { useState } from 'react';
import { Button, Menu, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Moment from 'react-moment';
import { Notice, NoticeCategory } from '../../../types/notice/notice';
import { NoticeStatus } from '../../../enums/notice.enum';
import { UpdateNoticeInput } from '../../../types/notice/notice.input';

interface Data {
	category: string;
	title: string;
	content: string;
	order: number;
	register: string;
	status: string;
}

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'category',
		numeric: true,
		disablePadding: false,
		label: 'CATEGORY',
	},
	{
		id: 'title',
		numeric: true,
		disablePadding: false,
		label: 'TITLE',
	},
	{
		id: 'content',
		numeric: true,
		disablePadding: false,
		label: 'CONTENT',
	},
	{
		id: 'order',
		numeric: false,
		disablePadding: false,
		label: 'ORDER',
	},
	{
		id: 'register',
		numeric: true,
		disablePadding: false,
		label: 'REGISTER DATE',
	},
	{
		id: 'status',
		numeric: false,
		disablePadding: false,
		label: 'STATUS',
	},
];

function EnhancedTableHead() {
	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'left' : 'center'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
					>
						{headCell.label}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

interface NoticeListType {
	notices: Notice[];
	categories: NoticeCategory[];
	loading?: boolean;
	updateNoticeStatusHandler: (input: UpdateNoticeInput) => Promise<void>;
	deleteNoticeHandler: (noticeId: string) => Promise<void>;
}

export const NoticeList = (props: NoticeListType) => {
	const { notices, categories, loading, updateNoticeStatusHandler, deleteNoticeHandler } = props;
	const [anchorEl, setAnchorEl] = useState<Array<HTMLElement | null>>([]);

	const getCategoryTitle = (categoryId: string) => {
		return categories.find((category) => category._id === categoryId)?.noticeCategoryTitle ?? 'Uncategorized';
	};

	const getStatusBadgeClass = (status: NoticeStatus) => {
		if (status === NoticeStatus.ACTIVE) return 'badge success';
		if (status === NoticeStatus.HOLD) return 'badge warning';
		return 'badge error';
	};

	const openStatusMenu = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
		const nextAnchor = [...anchorEl];
		nextAnchor[index] = event.currentTarget;
		setAnchorEl(nextAnchor);
	};

	const closeStatusMenu = (index: number) => {
		const nextAnchor = [...anchorEl];
		nextAnchor[index] = null;
		setAnchorEl(nextAnchor);
	};

	const statusChangeHandler = async (notice: Notice, status: NoticeStatus, index: number) => {
		closeStatusMenu(index);
		if (status === NoticeStatus.DELETE) {
			await deleteNoticeHandler(notice._id);
			return;
		}

		await updateNoticeStatusHandler({ _id: notice._id, noticeStatus: status });
	};

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					<EnhancedTableHead />
					<TableBody>
						{!loading && notices.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={6}>
									<span className={'no-data'}>No notices found!</span>
								</TableCell>
							</TableRow>
						)}

						{loading && notices.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={6}>
									<span className={'no-data'}>Loading notices...</span>
								</TableCell>
							</TableRow>
						)}

						{notices.map((notice: Notice, index: number) => (
							<TableRow hover key={notice._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
								<TableCell align="left">{getCategoryTitle(notice.noticeCategoryId)}</TableCell>
								<TableCell align="left" className={'name'}>
									{notice.noticeTitle}
								</TableCell>
								<TableCell align="left">
									<span className={'notice-content-preview'}>{notice.noticeContent}</span>
								</TableCell>
								<TableCell align="center">{notice.noticeOrder ?? 0}</TableCell>
								<TableCell align="left">
									<Moment format={'DD.MM.YY HH:mm'}>{notice.createdAt}</Moment>
								</TableCell>
								<TableCell align="center">
									<Button
										className={getStatusBadgeClass(notice.noticeStatus)}
										onClick={(event: React.MouseEvent<HTMLButtonElement>) => openStatusMenu(event, index)}
										disabled={notice.noticeStatus === NoticeStatus.DELETE}
									>
										{notice.noticeStatus}
									</Button>
									<Menu
										anchorEl={anchorEl[index]}
										open={Boolean(anchorEl[index])}
										onClose={() => closeStatusMenu(index)}
									>
										{notice.noticeStatus !== NoticeStatus.ACTIVE && (
											<MenuItem onClick={() => statusChangeHandler(notice, NoticeStatus.ACTIVE, index)}>
												Move to Active
											</MenuItem>
										)}
										{notice.noticeStatus !== NoticeStatus.HOLD && (
											<MenuItem onClick={() => statusChangeHandler(notice, NoticeStatus.HOLD, index)}>
												Move to Hold
											</MenuItem>
										)}
										<MenuItem onClick={() => statusChangeHandler(notice, NoticeStatus.DELETE, index)}>Delete</MenuItem>
									</Menu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
