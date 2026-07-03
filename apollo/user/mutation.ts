import { gql } from '@apollo/client';

/**************************
 *       TOURX AI         *
 *************************/

export const ASK_TOURX_AI = gql`
	mutation AskTourxAI($input: AiChatInput!) {
		askTourxAI(input: $input)
	}
`;

/**************************
 *      NOTIFICATION      *
 *************************/

export const MARK_NOTIFICATION_AS_READ = gql`
	mutation MarkNotificationAsRead($notificationId: String!) {
		markNotificationAsRead(notificationId: $notificationId) {
			_id
			isRead
			notificationStatus
			updatedAt
		}
	}
`;

/**************************
 *         MEMBER         *
 *************************/

export const SIGN_UP = gql`
	mutation Signup($input: MemberInput!) {
		signup(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberWarnings
			memberBlocks
			memberTours
			memberRank
			memberArticles
			memberPoints
			memberLikes
			memberViews
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

export const LOGIN = gql`
	mutation Login($input: LoginInput!) {
		login(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberWarnings
			memberBlocks
			memberTours
			memberRank
			memberPoints
			memberLikes
			memberViews
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

export const UPDATE_MEMBER = gql`
	mutation UpdateMember($input: MemberUpdate!) {
		updateMember(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberTours
			memberRank
			memberArticles
			memberPoints
			memberLikes
			memberViews
			memberWarnings
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

export const LIKE_TARGET_MEMBER = gql`
	mutation LikeTargetMember($input: String!) {
		likeTargetMember(memberId: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberWarnings
			memberBlocks
			memberTours
			memberRank
			memberPoints
			memberLikes
			memberViews
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

/**************************
 *      TOUR PACKAGE      *
 *************************/

export const CREATE_TOUR_PACKAGE = gql`
	mutation CreateTourPackage($input: TourPackageInput!) {
		createTourPackage(input: $input) {
			_id
			packageType
			packageStatus
			packageTitle
			packageCountry
			packageCity
			packageAddress
			packageDesc
			packagePrice
			packageCurrency
			durationDays
			minPeople
			maxPeople
			flightIncluded
			hotelIncluded
			guideIncluded
			packageViews
			packageLikes
			packageComments
			packageRank
			packageImages
			memberId
			startDate
			endDate
			deletedAt
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_TOUR_PACKAGE = gql`
	mutation UpdateTourPackage($input: TourPackageUpdate!) {
		updateTourPackage(input: $input) {
			_id
			packageType
			packageStatus
			packageTitle
			packageCountry
			packageCity
			packageAddress
			packageDesc
			packagePrice
			packageCurrency
			durationDays
			minPeople
			maxPeople
			flightIncluded
			hotelIncluded
			guideIncluded
			packageViews
			packageLikes
			packageComments
			packageRank
			packageImages
			memberId
			startDate
			endDate
			deletedAt
			createdAt
			updatedAt
		}
	}
`;

export const LIKE_TARGET_TOUR_PACKAGE = gql`
	mutation LikeTargetTourPackage($input: String!) {
		likeTargetTourPackage(packageId: $input) {
			_id
			packageType
			packageStatus
			packageTitle
			packageCountry
			packageCity
			packageAddress
			packageDesc
			packagePrice
			packageCurrency
			durationDays
			minPeople
			maxPeople
			flightIncluded
			hotelIncluded
			guideIncluded
			packageViews
			packageLikes
			packageComments
			packageRank
			packageImages
			memberId
			startDate
			endDate
			deletedAt
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const CREATE_BOARD_ARTICLE = gql`
	mutation CreateBoardArticle($input: BoardArticleInput!) {
		createBoardArticle(input: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_BOARD_ARTICLE = gql`
	mutation UpdateBoardArticle($input: BoardArticleUpdate!) {
		updateBoardArticle(input: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const LIKE_TARGET_BOARD_ARTICLE = gql`
	mutation LikeTargetBoardArticle($input: String!) {
		likeTargetBoardArticle(articleId: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const CREATE_COMMENT = gql`
	mutation CreateComment($input: CommentInput!) {
		createComment(input: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentImages
			commentVideo
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_COMMENT = gql`
	mutation UpdateComment($input: CommentUpdate!) {
		updateComment(input: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentImages
			commentVideo
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         FOLLOW         *
 *************************/

export const SUBSCRIBE = gql`
	mutation Subscribe($input: String!) {
		subscribe(input: $input) {
			_id
			followingId
			followerId
			createdAt
			updatedAt
		}
	}
`;

export const UNSUBSCRIBE = gql`
	mutation Unsubscribe($input: String!) {
		unsubscribe(input: $input) {
			_id
			followingId
			followerId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const TOGGLE_COMMENT_LIKE = gql`
	mutation ToggleCommentLike($input: String!) {
		toggleCommentLike(commentId: $input) {
			commentId
			likesCount
			isLiked
		}
	}
`;
