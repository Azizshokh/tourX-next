import React from 'react';
import { Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Moment from 'react-moment';
import { Faq, FaqCategory } from '../../../types/faq/faq';
import { FaqStatus } from '../../../enums/faq.enum';

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
}

export const FaqArticlesPanelList = (props: FaqArticlesPanelListType) => {
	const { faqs, categories, loading } = props;

	const getCategoryTitle = (categoryId: string) => {
		return categories.find((category) => category._id === categoryId)?.faqCategoryTitle ?? 'Uncategorized';
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

						{faqs.map((faq: Faq) => (
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
									<Button className={faq.faqStatus === FaqStatus.ACTIVE ? 'badge success' : 'badge error'}>
										{faq.faqStatus}
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
