import React from 'react';
import { Stack } from '@mui/material';
import AiChatBox from '../AiChatBox';

const HeaderFilter = () => {
	return (
		<Stack className="search-box search-box-with-ai ai-only-search-box">
			<AiChatBox />
		</Stack>
	);
};

export default HeaderFilter;
