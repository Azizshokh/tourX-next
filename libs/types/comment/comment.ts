import { CommentGroup, CommentStatus } from '../../enums/comment.enum';
import { MeLiked, TotalCounter } from '../tour-package/tour-package';
import { Member } from '../member/member';

export interface Comment {
	_id: string;
	commentStatus: CommentStatus;
	commentGroup: CommentGroup;
	commentContent: string;
	commentImages?: string[];
	commentVideo?: string | null;
	commentRefId: string;
	memberId: string;
	likesCount?: number;
	isLiked?: boolean;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface Comments {
	list: Comment[];
	metaCounter: TotalCounter[];
}
