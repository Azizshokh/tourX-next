import React from 'react';
import Link from 'next/link';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Button,
	Menu,
	Fade,
	MenuItem,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { Stack } from '@mui/material';
import { TourPackage } from '../../../types/tour-package/tour-package';
import { REACT_APP_API_URL } from '../../../config';
import Typography from '@mui/material/Typography';
import { PackageStatus } from '../../../enums/package.enum';
import { useTranslation } from 'next-i18next';

interface Data {
	id: string;
	title: string;
	price: string;
	agent: string;
	location: string;
	type: string;
	status: string;
}

type Order = 'asc' | 'desc';

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	labelKey: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{ id: 'id', numeric: true, disablePadding: false, labelKey: 'admin:table.packageId' },
	{ id: 'title', numeric: true, disablePadding: false, labelKey: 'admin:table.title' },
	{ id: 'price', numeric: false, disablePadding: false, labelKey: 'admin:table.price' },
	{ id: 'agent', numeric: false, disablePadding: false, labelKey: 'admin:table.agent' },
	{ id: 'location', numeric: false, disablePadding: false, labelKey: 'admin:table.destination' },
	{ id: 'type', numeric: false, disablePadding: false, labelKey: 'admin:table.type' },
	{ id: 'status', numeric: false, disablePadding: false, labelKey: 'admin:table.status' },
];

interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, tourPackage: keyof Data) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
	const { t } = useTranslation(['admin']);

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'left' : 'center'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
					>
						{t(headCell.labelKey)}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

interface TourPackagePanelListType {
	packages: TourPackage[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateTourPackageHandler: any;
	updatingPackageId: string | null;
}

const statusBadgeClass: Record<PackageStatus, string> = {
	[PackageStatus.ACTIVE]: 'badge success',
	[PackageStatus.CLOSED]: 'badge warning',
	[PackageStatus.DELETE]: 'badge error',
};

export const TourPackagePanelList = (props: TourPackagePanelListType) => {
	const {
		packages,
		anchorEl,
		menuIconClickHandler,
		menuIconCloseHandler,
		updateTourPackageHandler,
		updatingPackageId,
	} = props;
	const { t } = useTranslation(['common', 'admin', 'package']);

	const statusLabel = (status: PackageStatus) =>
		({
			[PackageStatus.ACTIVE]: t('common:status.active'),
			[PackageStatus.CLOSED]: t('common:status.closed'),
			[PackageStatus.DELETE]: t('common:status.deleted'),
		}[status] || status);

	const packageTypeLabel = (type: string) => t(`package:type.${type}`, { defaultValue: type });

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					{/*@ts-ignore*/}
					<EnhancedTableHead />
					<TableBody>
						{packages.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={8}>
									<span className={'no-data'}>{t('common:empty.noData')}</span>
								</TableCell>
							</TableRow>
						)}

						{packages.length !== 0 &&
							packages.map((tourPackage: TourPackage, index: number) => {
								const packageImage = `${REACT_APP_API_URL}/${tourPackage?.packageImages?.[0] ?? ''}`;

								return (
									<TableRow
										hover
										key={tourPackage?._id}
										sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
									>
										<TableCell align="left">{tourPackage._id}</TableCell>
										<TableCell align="left" className={'name'}>
											{tourPackage.packageStatus === PackageStatus.ACTIVE ? (
												<Stack direction={'row'}>
													<Link href={`/tour-package/detail?id=${tourPackage?._id}`}>
														<div>
															<Avatar alt={tourPackage.packageTitle} src={packageImage} sx={{ ml: '2px', mr: '10px' }} />
														</div>
													</Link>
													<Link href={`/tour-package/detail?id=${tourPackage?._id}`}>
														<div style={{ marginTop: '10px' }}>{tourPackage.packageTitle}</div>
													</Link>
												</Stack>
											) : (
												<Stack direction={'row'}>
													<div>
														<Avatar alt={tourPackage.packageTitle} src={packageImage} sx={{ ml: '2px', mr: '10px' }} />
													</div>
													<div style={{ marginTop: '10px' }}>{tourPackage.packageTitle}</div>
												</Stack>
											)}
										</TableCell>
										<TableCell align="center">{tourPackage.packagePrice}</TableCell>
										<TableCell align="center">{tourPackage.memberData?.memberNick}</TableCell>
										<TableCell align="center">
											{tourPackage.packageCountry}, {tourPackage.packageCity}
										</TableCell>
										<TableCell align="center">{packageTypeLabel(tourPackage.packageType)}</TableCell>
										<TableCell align="center">
											<Button
												onClick={(e) => menuIconClickHandler(e, index)}
												className={statusBadgeClass[tourPackage.packageStatus]}
												disabled={updatingPackageId === tourPackage._id}
											>
												{statusLabel(tourPackage.packageStatus)}
											</Button>

											<Menu
												className={'menu-modal'}
												MenuListProps={{ 'aria-labelledby': 'fade-button' }}
												anchorEl={anchorEl[index]}
												open={Boolean(anchorEl[index])}
												onClose={menuIconCloseHandler}
												TransitionComponent={Fade}
												sx={{ p: 1 }}
											>
												{Object.values(PackageStatus)
													.filter((s) => s !== tourPackage.packageStatus)
													.map((status: PackageStatus) => (
														<MenuItem
															key={status}
															disabled={Boolean(updatingPackageId)}
															onClick={() =>
																updateTourPackageHandler({ _id: tourPackage._id, packageStatus: status })
															}
														>
															<Typography variant={'subtitle1'} component={'span'}>
																{statusLabel(status)}
															</Typography>
														</MenuItem>
													))}
											</Menu>
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
