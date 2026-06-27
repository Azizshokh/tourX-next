import React from 'react';
import { useRouter } from 'next/router';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';
import { REACT_APP_API_URL } from '../../config';
import { useTranslation } from 'next-i18next';

interface TopAgentProps {
	agent: Member;
}
const TopAgentCard = (props: TopAgentProps) => {
	const { agent } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const { t } = useTranslation(['agent']);
	const agentImage = agent?.memberImage
		? `${REACT_APP_API_URL}/${agent?.memberImage}`
		: '/img/profile/defaultUser.svg';
	const ratingLabel = Math.min(5, 4.6 + ((agent?.memberRank || 0) % 4) / 10).toFixed(1);
	const likesLabel =
		(agent?.memberLikes || 0) >= 1000
			? `${((agent?.memberLikes || 0) / 1000).toFixed(1)}k`
			: `${agent?.memberLikes || 0}`;

	/** HANDLERS **/
	const pushAgentHandler = async () => {
		await router.push({
			pathname: '/agent/detail',
			query: { agentId: agent?._id },
		});
	};

	if (device === 'mobile') {
		return (
			<Stack className="top-agent-card">
				<img src={agentImage} alt="" />

				<strong>{agent?.memberNick}</strong>
				<span>{t('agent:role')}</span>
			</Stack>
		);
	} else {
		return (
			<Stack className="top-agent-card">
				<div className={'avatar'} onClick={pushAgentHandler}>
					<img src={agentImage} alt="" />
				</div>
				<strong onClick={pushAgentHandler}>{agent?.memberNick}</strong>
				<span className={'role'}>{t('agent:role')}</span>
				<div className={'agent-stats'}>
					<div>
						<b>{agent?.memberTours || 0}</b>
						<em>{t('agent:card.tours')}</em>
					</div>
					<div>
						<b>{ratingLabel}</b>
						<em>{t('agent:card.rating')}</em>
					</div>
					<div>
						<b>{likesLabel}</b>
						<em>{t('agent:card.likes')}</em>
					</div>
				</div>
				<button type="button" className={'view-profile'} onClick={pushAgentHandler}>
					{t('agent:card.viewProfile')}
				</button>
			</Stack>
		);
	}
};

export default TopAgentCard;
