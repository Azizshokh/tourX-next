import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_ALL_MEMBERS_BY_ADMIN = gql`
	query GetAllMembersByAdmin($input: MembersInquiry!) {
		getAllMembersByAdmin(input: $input) {
			list {
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
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *      TOUR PACKAGE      *
 *************************/

export const GET_ALL_TOUR_PACKAGES_BY_ADMIN = gql`
	query GetAllTourPackagesByAdmin($input: AllTourPackagesInquiry!) {
		getAllTourPackagesByAdmin(input: $input) {
			list {
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
				memberData {
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
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const GET_ALL_BOARD_ARTICLES_BY_ADMIN = gql`
	query GetAllBoardArticlesByAdmin($input: AllBoardArticlesInquiry!) {
		getAllBoardArticlesByAdmin(input: $input) {
			list {
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
				memberData {
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
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *          FAQ           *
 *************************/

export const GET_ALL_FAQ_CATEGORIES_BY_ADMIN = gql`
	query GetAllFaqCategoriesByAdmin($input: FaqInquiry!) {
		getAllFaqCategoriesByAdmin(input: $input) {
			list {
				_id
				faqCategoryTitle
				faqCategoryKey
				faqCategoryStatus
				faqCategoryOrder
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_ALL_FAQS_BY_ADMIN = gql`
	query GetAllFaqsByAdmin($input: FaqInquiry!) {
		getAllFaqsByAdmin(input: $input) {
			list {
				_id
				faqCategoryId
				faqQuestion
				faqAnswer
				faqStatus
				faqOrder
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         NOTICE         *
 *************************/

export const GET_ALL_NOTICE_CATEGORIES_BY_ADMIN = gql`
	query GetAllNoticeCategoriesByAdmin($input: NoticeInquiry!) {
		getAllNoticeCategoriesByAdmin(input: $input) {
			list {
				_id
				noticeCategoryTitle
				noticeCategoryKey
				noticeCategoryStatus
				noticeCategoryOrder
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_ALL_NOTICES_BY_ADMIN = gql`
	query GetAllNoticesByAdmin($input: NoticeInquiry!) {
		getAllNoticesByAdmin(input: $input) {
			list {
				_id
				noticeCategoryId
				noticeTitle
				noticeContent
				noticeStatus
				noticeOrder
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const GET_COMMENTS = gql`
	query GetComments($input: CommentsInquiry!) {
		getComments(input: $input) {
			list {
				_id
				commentStatus
				commentGroup
				commentContent
				commentRefId
				memberId
				createdAt
				updatedAt
				memberData {
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
			metaCounter {
				total
			}
		}
	}
`;

export const GET_ALL_COMMENTS_BY_ADMIN = gql`
	query GetAllCommentsByAdmin($input: AllCommentsInquiry!) {
		getAllCommentsByAdmin(input: $input) {
			list {
				_id
				commentStatus
				commentGroup
				commentContent
				commentRefId
				memberId
				createdAt
				updatedAt
				memberData {
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
			metaCounter {
				total
			}
		}
	}
`;
