import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, Box, Stack } from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
import HeadsetMicRoundedIcon from '@mui/icons-material/HeadsetMicRounded';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { RippleBadge } from '../../scss/MaterialTheme/styled';
import { useReactiveVar } from '@apollo/client';
import { socketVar, userVar } from '../../apollo/store';
import { Member } from '../types/member/member';
import { Messages, REACT_APP_API_URL } from '../config';
import { sweetErrorAlert } from '../sweetAlert';

interface MessagePayload {
	event: string;
	text: string;
	memberData: Member;
}

interface InfoPayload {
	event: string;
	totalClients: number;
	memberData: Member;
	action: string;
}

const Chat = () => {
	const { t } = useTranslation(['common']);
	const chatContentRef = useRef<HTMLDivElement>(null);
	const bottomRef = useRef<HTMLDivElement>(null);
	const [messagesList, setMessagesList] = useState<MessagePayload[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<number>(0);
	const [messageInput, setMessageInput] = useState<string>('');
	const [open, setOpen] = useState(false);
	const [openButton, setOpenButton] = useState(false);
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const socket = useReactiveVar(socketVar);

	/** LIFECYCLES **/
	useEffect(() => {
		socket.onmessage = (msg) => {
			const data = JSON.parse(msg.data);

			switch (data.event) {
				case 'info':
					const newInfo: InfoPayload = data;
					setOnlineUsers(newInfo.totalClients);
					break;
				case 'getMessages':
					const list: MessagePayload[] = data.list;
					setMessagesList(list);
					break;
				case 'message':
					const newMessage: MessagePayload = data;
					messagesList.push(newMessage);
					setMessagesList([...messagesList]);
					break;
			}
		};
	}, [socket, messagesList]);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messagesList]);

	useEffect(() => {
		const timeoutId = setTimeout(() => setOpenButton(true), 100);
		return () => clearTimeout(timeoutId);
	}, []);

	useEffect(() => {
		setOpenButton(false);
	}, [router.pathname]);

	/** HANDLERS **/
	const handleOpenChat = () => setOpen((prev) => !prev);

	const getInputMessageHandler = useCallback(
		(e: any) => setMessageInput(e.target.value),
		[messageInput],
	);

	const getKeyHandler = (e: any) => {
		try {
			if (e.key === 'Enter') onClickHandler();
		} catch (err: any) {
			console.log(err);
		}
	};

	const onClickHandler = () => {
		if (!messageInput) sweetErrorAlert(Messages.error4);
		else {
			socket.send(JSON.stringify({ event: 'message', data: messageInput }));
			setMessageInput('');
		}
	};

	return (
		<Stack className={'chatting'}>
			{/* Floating toggle button */}
			{openButton && (
				<button className={'chat-button'} onClick={handleOpenChat} aria-label={t('common:chat.toggleChat')}>
					{open ? <CloseRoundedIcon /> : <ChatRoundedIcon />}
					{!open && onlineUsers > 0 && (
						<span className={'chat-badge'}>{onlineUsers}</span>
					)}
				</button>
			)}

			{/* Chat frame */}
			<Stack className={`chat-frame${open ? ' open' : ''}`}>
				{/* Header */}
				<Box className={'chat-top'} component={'div'}>
					<Box className={'chat-agent-wrap'}>
						<Box className={'chat-agent-avatar'}>
							<HeadsetMicRoundedIcon />
							<span className={'chat-online-dot'} />
						</Box>
						<Box>
							<div className={'chat-agent-name'}>{t('common:chat.support')}</div>
							<div className={'chat-agent-status'}>
								<RippleBadge badgeContent={onlineUsers} style={{ marginRight: 6 }} />
								<span style={{ paddingLeft: '7px' }}>{t('common:chat.online')}</span>
							</div>
						</Box>
					</Box>
					<button className={'chat-close-btn'} onClick={handleOpenChat} aria-label={t('common:actions.close')}>
						<CloseRoundedIcon />
					</button>
				</Box>

				{/* Messages */}
				<Box className={'chat-content'} ref={chatContentRef} component={'div'}>
					<Stack className={'chat-main'}>
						{/* Welcome */}
						<Box className={'chat-welcome-row'} component={'div'}>
							<div className={'welcome-msg'}>
								{t('common:chat.welcome')}
							</div>
						</Box>

						{/* Messages */}
						{messagesList.map((ele: MessagePayload, idx: number) => {
							const { text, memberData } = ele;
							const memberImage = memberData?.memberImage
								? `${REACT_APP_API_URL}/${memberData.memberImage}`
								: '/img/profile/defaultUser.svg';

							return memberData?._id === user._id ? (
								<Box
									key={idx}
									component={'div'}
									className={'chat-msg-row chat-msg-right'}
								>
									<div className={'msg-right'}>{text}</div>
								</Box>
							) : (
								<Box
									key={idx}
									component={'div'}
									className={'chat-msg-row chat-msg-left'}
								>
									<Avatar
										className={'chat-msg-avatar'}
										alt={memberData?.memberNick}
										src={memberImage}
										sx={{ width: 28, height: 28 }}
									/>
									<div className={'msg-left'}>{text}</div>
								</Box>
							);
						})}

						<div ref={bottomRef} />
					</Stack>
				</Box>

				{/* Input */}
				<Box className={'chat-bott'} component={'div'}>
					<input
						type={'text'}
						name={'message'}
						className={'msg-input'}
						placeholder={t('common:chat.placeholder')}
						value={messageInput}
						onChange={getInputMessageHandler}
						onKeyDown={getKeyHandler}
					/>
					<button className={'send-msg-btn'} onClick={onClickHandler} disabled={!messageInput.trim()}>
						<SendRoundedIcon />
					</button>
				</Box>
			</Stack>
		</Stack>
	);
};

export default Chat;
