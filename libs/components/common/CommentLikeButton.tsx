import React, { useState } from 'react';
import { IconButton, Stack, Typography } from '@mui/material';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import { useMutation, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { Message } from '../../enums/common.enum';
import { TOGGLE_COMMENT_LIKE } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';

interface CommentLikeButtonProps {
	commentId: string;
	initialLiked?: boolean;
	initialCount?: number;
}

const CommentLikeButton = ({ commentId, initialLiked = false, initialCount = 0 }: CommentLikeButtonProps) => {
	const user = useReactiveVar(userVar);
	const [liked, setLiked] = useState(!!initialLiked);
	const [count, setCount] = useState(initialCount ?? 0);
	const [loading, setLoading] = useState(false);

	const [toggleCommentLikeMutation] = useMutation(TOGGLE_COMMENT_LIKE);

	const toggleCommentLike = async () => {
		if (loading) return;
		if (!user._id) {
			sweetMixinErrorAlert(Message.NOT_AUTHENTICATED).then();
			return;
		}

		setLoading(true);
		const wasLiked = liked;

		setLiked(!wasLiked);
		setCount((c) => Math.max(0, c + (wasLiked ? -1 : 1)));

		try {
			const { data } = await toggleCommentLikeMutation({ variables: { input: commentId } });
			const res = data?.toggleCommentLike;
			if (res) {
				setLiked(res.isLiked);
				setCount(res.likesCount);
			}
			if (!wasLiked) await sweetTopSmallSuccessAlert('Liked!', 600);
		} catch (err: any) {
			setLiked(wasLiked);
			setCount((c) => Math.max(0, c + (wasLiked ? 1 : -1)));
			sweetMixinErrorAlert(err.message).then();
		} finally {
			setLoading(false);
		}
	};

	return (
		<Stack className={`comment-like-btn${liked ? ' liked' : ''}`} direction={'row'} alignItems={'center'}>
			<IconButton className={'like-icon-btn'} onClick={toggleCommentLike} disabled={loading} size={'small'}>
				{liked ? <ThumbUpRoundedIcon className={'like-icon'} /> : <ThumbUpOutlinedIcon className={'like-icon'} />}
			</IconButton>
			{count > 0 && <Typography className={'like-count'}>{count}</Typography>}
		</Stack>
	);
};

export default CommentLikeButton;
