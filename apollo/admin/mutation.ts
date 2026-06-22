import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const UPDATE_MEMBER_BY_ADMIN = gql`
	mutation UpdateMemberByAdmin($input: MemberUpdate!) {
		updateMemberByAdmin(input: $input) {
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

/**************************
 *      TOUR PACKAGE      *
 *************************/

export const UPDATE_TOUR_PACKAGE_BY_ADMIN = gql`
	mutation UpdateTourPackageByAdmin($input: TourPackageUpdate!) {
		updateTourPackageByAdmin(input: $input) {
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

export const REMOVE_TOUR_PACKAGE_BY_ADMIN = gql`
	mutation RemoveTourPackageByAdmin($input: String!) {
		removeTourPackageByAdmin(packageId: $input) {
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

export const UPDATE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation UpdateBoardArticleByAdmin($input: BoardArticleUpdate!) {
		updateBoardArticleByAdmin(input: $input) {
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

export const REMOVE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation RemoveBoardArticleByAdmin($input: String!) {
		removeBoardArticleByAdmin(articleId: $input) {
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
 *          FAQ           *
 *************************/

export const CREATE_FAQ_BY_ADMIN = gql`
	mutation CreateFaqByAdmin($input: CreateFaqInput!) {
		createFaqByAdmin(input: $input) {
			_id
			faqCategoryId
			faqQuestion
			faqAnswer
			faqStatus
			faqOrder
			createdAt
			updatedAt
		}
	}
`;

export const CREATE_FAQ_CATEGORY_BY_ADMIN = gql`
	mutation CreateFaqCategoryByAdmin($input: CreateFaqCategoryInput!) {
		createFaqCategoryByAdmin(input: $input) {
			_id
			faqCategoryTitle
			faqCategoryKey
			faqCategoryStatus
			faqCategoryOrder
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_FAQ_BY_ADMIN = gql`
	mutation UpdateFaqByAdmin($input: UpdateFaqInput!) {
		updateFaqByAdmin(input: $input) {
			_id
			faqCategoryId
			faqQuestion
			faqAnswer
			faqStatus
			faqOrder
			createdAt
			updatedAt
		}
	}
`;

export const DELETE_FAQ_BY_ADMIN = gql`
	mutation DeleteFaqByAdmin($input: String!) {
		deleteFaqByAdmin(faqId: $input) {
			_id
			faqCategoryId
			faqQuestion
			faqAnswer
			faqStatus
			faqOrder
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const REMOVE_COMMENT_BY_ADMIN = gql`
	mutation RemoveCommentByAdmin($input: String!) {
		removeCommentByAdmin(commentId: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         NOTICE         *
 *************************/

export const CREATE_NOTICE_BY_ADMIN = gql`
	mutation CreateNoticeByAdmin($input: CreateNoticeInput!) {
		createNoticeByAdmin(input: $input) {
			_id
			noticeCategoryId
			noticeTitle
			noticeContent
			noticeStatus
			noticeOrder
			createdAt
			updatedAt
		}
	}
`;

export const CREATE_NOTICE_CATEGORY_BY_ADMIN = gql`
	mutation CreateNoticeCategoryByAdmin($input: CreateNoticeCategoryInput!) {
		createNoticeCategoryByAdmin(input: $input) {
			_id
			noticeCategoryTitle
			noticeCategoryKey
			noticeCategoryStatus
			noticeCategoryOrder
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_NOTICE_BY_ADMIN = gql`
	mutation UpdateNoticeByAdmin($input: UpdateNoticeInput!) {
		updateNoticeByAdmin(input: $input) {
			_id
			noticeCategoryId
			noticeTitle
			noticeContent
			noticeStatus
			noticeOrder
			createdAt
			updatedAt
		}
	}
`;

export const DELETE_NOTICE_BY_ADMIN = gql`
	mutation DeleteNoticeByAdmin($input: String!) {
		deleteNoticeByAdmin(noticeId: $input) {
			_id
			noticeCategoryId
			noticeTitle
			noticeContent
			noticeStatus
			noticeOrder
			createdAt
			updatedAt
		}
	}
`;
