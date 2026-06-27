import React from 'react';
import {
	Avatar,
	Box,
	Button,
	Chip,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import moment from 'moment';
import { Comment } from '../../../types/comment/comment';
import { CommentStatus } from '../../../enums/comment.enum';
import { REACT_APP_API_URL } from '../../../config';
import { useTranslation } from 'next-i18next';

interface CommentListProps {
	comments: Comment[];
	loading?: boolean;
	onDeleteRequest: (commentId: string) => void;
	onPause: (commentId: string) => void;
	onActivate: (commentId: string) => void;
}

export const CommentList = ({ comments, loading, onDeleteRequest, onPause, onActivate }: CommentListProps) => {
	const { t } = useTranslation(['common', 'admin']);
	const groupLabel = (group: string) =>
		({
			MEMBER: t('admin:labels.member'),
			ARTICLE: t('admin:labels.article'),
			PACKAGE: t('admin:labels.package'),
		}[group] || group);

	if (loading) {
		return (
			<Box sx={{ p: '32px 24px', textAlign: 'center' }}>
				<Typography sx={{ color: '#9ca3af', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px' }}>
					{t('admin:messages.loadingComments')}
				</Typography>
			</Box>
		);
	}

	if (!comments.length) {
		return (
			<Box sx={{ p: '48px 24px', textAlign: 'center' }}>
				<Typography className={'no-data'}>{t('common:empty.noComments')}</Typography>
			</Box>
		);
	}

	return (
		<TableContainer>
			<Table sx={{ minWidth: 860 }}>
				<TableHead>
					<TableRow>
						<TableCell>{t('admin:table.comment')}</TableCell>
						<TableCell>{t('admin:table.author')}</TableCell>
						<TableCell>{t('admin:table.target')}</TableCell>
						<TableCell>{t('admin:table.status')}</TableCell>
						<TableCell>{t('common:labels.date')}</TableCell>
						<TableCell align={'right'}>{t('admin:table.actions')}</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{comments.map((comment) => {
						const status = comment.commentStatus;
						const isDeleted = status === CommentStatus.DELETE;
						const isPaused = status === CommentStatus.PAUSED;
						const isActive = status === CommentStatus.ACTIVE;
						const avatarSrc = comment.memberData?.memberImage
							? `${REACT_APP_API_URL}/${comment.memberData.memberImage}`
							: '/img/profile/defaultUser.svg';
						const shortRef = comment.commentRefId.slice(-8);

						return (
							<TableRow key={comment._id} hover sx={{ opacity: isDeleted ? 0.55 : 1 }}>
								{/* Comment content */}
								<TableCell sx={{ maxWidth: 280 }}>
									<Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
										<Typography
											sx={{
												fontSize: '13px',
												color: '#374151',
												fontFamily: "'Plus Jakarta Sans', sans-serif",
												lineHeight: 1.5,
												overflow: 'hidden',
												display: '-webkit-box',
												WebkitLineClamp: 2,
												WebkitBoxOrient: 'vertical',
											}}
										>
											{comment.commentContent}
										</Typography>
										<Chip
											label={groupLabel(comment.commentGroup)}
											size={'small'}
											sx={{
												height: '20px',
												fontSize: '10px',
												fontWeight: 700,
												fontFamily: "'Plus Jakarta Sans', sans-serif",
												background: 'rgba(255,138,0,0.10)',
												color: '#ff8a00',
												width: 'fit-content',
											}}
										/>
									</Box>
								</TableCell>

								{/* Author */}
								<TableCell>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
										<Avatar src={avatarSrc} sx={{ width: 34, height: 34 }} />
										<Typography
											sx={{
												fontSize: '13px',
												fontWeight: 600,
												color: '#0d1c32',
												fontFamily: "'Plus Jakarta Sans', sans-serif",
											}}
										>
											{comment.memberData?.memberNick ?? '—'}
										</Typography>
									</Box>
								</TableCell>

								{/* Target */}
								<TableCell>
									<Typography
										sx={{
											fontSize: '12px',
											color: '#6b7280',
											fontFamily: "'Plus Jakarta Sans', sans-serif",
										}}
									>
										{groupLabel(comment.commentGroup)}
									</Typography>
									<Typography
										sx={{
											fontSize: '11px',
											color: '#9ca3af',
											fontFamily: 'monospace',
											letterSpacing: '0.04em',
										}}
									>
										…{shortRef}
									</Typography>
								</TableCell>

								{/* Status badge */}
								<TableCell>
									<span className={`badge ${isDeleted ? 'error' : isPaused ? 'warning' : 'success'}`}>
										{isDeleted
											? t('common:status.deleted')
											: isPaused
												? t('common:status.paused')
												: t('common:status.active')}
									</span>
								</TableCell>

								{/* Date */}
								<TableCell>
									<Typography
										sx={{
											fontSize: '12px',
											color: '#6b7280',
											fontFamily: "'Plus Jakarta Sans', sans-serif",
											whiteSpace: 'nowrap',
										}}
									>
										{moment(comment.createdAt).format('DD.MM.YY HH:mm')}
									</Typography>
								</TableCell>

								{/* Actions */}
								<TableCell align={'right'}>
									{isDeleted ? (
										<Typography sx={{ fontSize: '12px', color: '#9ca3af' }}>—</Typography>
									) : (
										<Stack direction={'row'} spacing={'6px'} justifyContent={'flex-end'}>
											{isActive && (
												<Button
													size={'small'}
													variant={'outlined'}
													startIcon={<PauseRoundedIcon sx={{ fontSize: '14px !important' }} />}
													onClick={() => onPause(comment._id)}
													sx={{
														height: '32px',
														borderRadius: '8px',
														fontSize: '12px',
														fontWeight: 700,
														fontFamily: "'Plus Jakarta Sans', sans-serif",
														textTransform: 'none',
														borderColor: 'rgba(234,179,8,0.45)',
														color: '#ca8a04',
														'&:hover': {
															borderColor: '#ca8a04',
															background: 'rgba(234,179,8,0.06)',
														},
													}}
												>
													{t('admin:actions.pause')}
												</Button>
											)}
											{isPaused && (
												<Button
													size={'small'}
													variant={'outlined'}
													startIcon={<PlayArrowRoundedIcon sx={{ fontSize: '14px !important' }} />}
													onClick={() => onActivate(comment._id)}
													sx={{
														height: '32px',
														borderRadius: '8px',
														fontSize: '12px',
														fontWeight: 700,
														fontFamily: "'Plus Jakarta Sans', sans-serif",
														textTransform: 'none',
														borderColor: 'rgba(34,197,94,0.45)',
														color: '#16a34a',
														'&:hover': {
															borderColor: '#16a34a',
															background: 'rgba(34,197,94,0.06)',
														},
													}}
												>
													{t('admin:actions.activate')}
												</Button>
											)}
											<Button
												size={'small'}
												variant={'outlined'}
												color={'error'}
												startIcon={<DeleteRoundedIcon sx={{ fontSize: '14px !important' }} />}
												onClick={() => onDeleteRequest(comment._id)}
												sx={{
													height: '32px',
													borderRadius: '8px',
													fontSize: '12px',
													fontWeight: 700,
													fontFamily: "'Plus Jakarta Sans', sans-serif",
													textTransform: 'none',
													borderColor: 'rgba(220,38,38,0.35)',
													color: '#dc2626',
													'&:hover': {
														borderColor: '#dc2626',
														background: 'rgba(220,38,38,0.06)',
													},
												}}
											>
												{t('admin:actions.delete')}
											</Button>
										</Stack>
									)}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</TableContainer>
	);
};
