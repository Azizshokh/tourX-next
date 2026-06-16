import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { REACT_APP_API_URL } from '../../config';
import IconButton from '@mui/material/IconButton';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface AgentCardProps {
	agent: any;
	likeAgentHandler: any;
}

const AgentCard = (props: AgentCardProps) => {
	const { agent } = props;
	const device = useDeviceDetect();
	useReactiveVar(userVar);

	const imagePath: string = agent?.memberImage
		? `${REACT_APP_API_URL}/${agent?.memberImage}`
		: '/img/profile/defaultUser.svg';

	const agentDetailHref = { pathname: '/agent/detail', query: { agentId: agent?._id } };

	const ratingDisplay =
		typeof agent?.memberRank === 'number' ? Math.min(5, agent.memberRank).toFixed(1) : '5.0';

	const yearsExp = agent?.createdAt
		? Math.max(1, new Date().getFullYear() - new Date(agent.createdAt).getFullYear())
		: 1;

	const subtitle = [
		'Travel Agent',
		agent?.memberAddress ? agent.memberAddress : null,
	]
		.filter(Boolean)
		.join(' • ');

	if (device === 'mobile') {
		return <div>AGENT CARD</div>;
	} else {
		return (
			<Box className="agent-general-card">
				{/* Left — large photo with own border-radius */}
				<Box className="agent-img-col">
					<Link href={agentDetailHref}>
						<img
							src={imagePath}
							alt={agent?.memberFullName ?? agent?.memberNick ?? ''}
							className="agent-img"
						/>
					</Link>
				</Box>

				{/* Right — glassmorphism card overlapping the image */}
				<Box className="agent-info-col">
					<Box className="info-card">
						{/* Header: avatar + name/subtitle + rating pill */}
						<Box className="card-header">
							<Box className="agent-profile">
								<img
									src={imagePath}
									alt={agent?.memberFullName ?? agent?.memberNick ?? ''}
									className="agent-avatar"
								/>
								<Box className="name-block">
									<Typography className="agent-name">
										{agent?.memberFullName ?? agent?.memberNick}
									</Typography>
									<Typography className="agent-subtitle">{subtitle}</Typography>
								</Box>
							</Box>
							<Box className="rating-pill">
								<StarRoundedIcon className="star-icon" />
								<Typography className="rating-num">{ratingDisplay}</Typography>
							</Box>
						</Box>

						{/* Stats: 2-column grid */}
						<Box className="stats-grid">
							<Box className="stat-box">
								<Typography className="stat-lbl">Experience</Typography>
								<Typography className="stat-val">{yearsExp} Years</Typography>
							</Box>
							<Box className="stat-box">
								<Typography className="stat-lbl">Tours Managed</Typography>
								<Typography className="stat-val">{agent?.memberTours ?? 0} Tours</Typography>
							</Box>
						</Box>

						{/* Bio */}
						<Typography className="agent-bio">
							{agent?.memberDesc ??
								'Experienced travel agent offering curated tour packages and personalized travel experiences for discerning adventurers.'}
						</Typography>

						{/* CTA row */}
						<Box className="cta-row">
							<Link href={agentDetailHref}>
								<Button
									className="btn-view-profile"
									endIcon={<ArrowForwardRoundedIcon />}
									disableRipple
									fullWidth
								>
									View Profile
								</Button>
							</Link>
							<Link href={agentDetailHref}>
								<IconButton className="btn-mail" disableRipple>
									<EmailOutlinedIcon />
								</IconButton>
							</Link>
						</Box>
					</Box>
				</Box>
			</Box>
		);
	}
};

export default AgentCard;
