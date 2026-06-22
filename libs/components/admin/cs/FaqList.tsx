import React, { useState } from 'react';
import { Button, Menu, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Moment from 'react-moment';
import { Faq, FaqCategory } from '../../../types/faq/faq';
import { FaqStatus } from '../../../enums/faq.enum';
import { UpdateFaqInput } from '../../../types/faq/faq.input';

interface Data {
	category: string;
	question: string;
	answer: string;
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
		id: 'question',
		numeric: true,
		disablePadding: false,
		label: 'QUESTION',
	},
	{
		id: 'answer',
		numeric: true,
		disablePadding: false,
		label: 'ANSWER',
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

interface FaqArticlesPanelListType {
	faqs: Faq[];
	categories: FaqCategory[];
	loading?: boolean;
	updateFaqStatusHandler: (input: UpdateFaqInput) => Promise<void>;
	deleteFaqHandler: (faqId: string) => Promise<void>;
}

export const FaqArticlesPanelList = (props: FaqArticlesPanelListType) => {
	const { faqs, categories, loading, updateFaqStatusHandler, deleteFaqHandler } = props;
	const [anchorEl, setAnchorEl] = useState<Array<HTMLElement | null>>([]);

	const getCategoryTitle = (categoryId: string) => {
		return categories.find((category) => category._id === categoryId)?.faqCategoryTitle ?? 'Uncategorized';
	};

	const getStatusBadgeClass = (status: FaqStatus) => {
		if (status === FaqStatus.ACTIVE) return 'badge success';
		if (status === FaqStatus.HOLD) return 'badge warning';
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

	const statusChangeHandler = async (faq: Faq, status: FaqStatus, index: number) => {
		closeStatusMenu(index);
		if (status === FaqStatus.DELETE) {
			await deleteFaqHandler(faq._id);
			return;
		}

		await updateFaqStatusHandler({ _id: faq._id, faqStatus: status });
	};

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					<EnhancedTableHead />
					<TableBody>
						{!loading && faqs.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={6}>
									<span className={'no-data'}>No FAQs found!</span>
								</TableCell>
							</TableRow>
						)}

						{loading && faqs.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={6}>
									<span className={'no-data'}>Loading FAQs...</span>
								</TableCell>
							</TableRow>
						)}

						{faqs.map((faq: Faq, index: number) => (
							<TableRow hover key={faq._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
								<TableCell align="left">{getCategoryTitle(faq.faqCategoryId)}</TableCell>
								<TableCell align="left" className={'name'}>
									{faq.faqQuestion}
								</TableCell>
								<TableCell align="left">
									<span className={'faq-answer-preview'}>{faq.faqAnswer}</span>
								</TableCell>
								<TableCell align="center">{faq.faqOrder ?? 0}</TableCell>
								<TableCell align="left">
									<Moment format={'DD.MM.YY HH:mm'}>{faq.createdAt}</Moment>
								</TableCell>
								<TableCell align="center">
									<Button
										className={getStatusBadgeClass(faq.faqStatus)}
										onClick={(event: React.MouseEvent<HTMLButtonElement>) => openStatusMenu(event, index)}
										disabled={faq.faqStatus === FaqStatus.DELETE}
									>
										{faq.faqStatus}
									</Button>
									<Menu
										anchorEl={anchorEl[index]}
										open={Boolean(anchorEl[index])}
										onClose={() => closeStatusMenu(index)}
									>
										{faq.faqStatus !== FaqStatus.ACTIVE && (
											<MenuItem onClick={() => statusChangeHandler(faq, FaqStatus.ACTIVE, index)}>Move to Active</MenuItem>
										)}
										{faq.faqStatus !== FaqStatus.HOLD && (
											<MenuItem onClick={() => statusChangeHandler(faq, FaqStatus.HOLD, index)}>Move to Hold</MenuItem>
										)}
										<MenuItem onClick={() => statusChangeHandler(faq, FaqStatus.DELETE, index)}>Delete</MenuItem>
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
