import React from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Box, Stack, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded';
import { useTranslation } from 'next-i18next';
const TuiEditor = dynamic(() => import('../community/Teditor'), { ssr: false });

const WriteArticle: NextPage = () => {
	const device = useDeviceDetect();
	const { t } = useTranslation(['common', 'community', 'mypage']);

	return (
			<div id="write-article-page">
				<Stack className="main-title-box">
					<Box className="title-icon">
						<EditNoteRoundedIcon />
					</Box>
					<Stack className="right-box">
						<Typography className="eyebrow">{t('community:editor.community')}</Typography>
						<Typography className="main-title">{t('mypage:articles.writeTitle')}</Typography>
						<Typography className="sub-title">
							{t('mypage:articles.writeSubtitle')}
						</Typography>
					</Stack>
					<Stack className="writing-hints">
						<Box className="hint-pill">
							<TravelExploreRoundedIcon />
							<span>{t('community:editor.destinationInsight')}</span>
						</Box>
						<Box className="hint-pill">
							<PhotoCameraRoundedIcon />
							<span>{t('community:editor.photosSupported')}</span>
						</Box>
					</Stack>
				</Stack>
				<Box className="editor-shell">
					<TuiEditor />
				</Box>
			</div>
	);
};

export default WriteArticle;
