import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_AGENTS = gql`
	query GetAgents($input: AgentsInquiry!) {
		getAgents(input: $input) {
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
				memberPoints
				memberLikes
				memberViews
				deletedAt
				createdAt
				updatedAt
				accessToken
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_MEMBER = gql`
	query GetMember($input: String!) {
		getMember(memberId: $input) {
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
			memberArticles
			memberFollowers
			memberFollowings
			memberPoints
			memberLikes
			memberViews
			memberComments
			memberRank
			memberWarnings
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			accessToken
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
			meFollowed {
				followingId
				followerId
				myFollowing
			}
		}
	}
`;

/**************************
 *      TOUR PACKAGE      *
 *************************/

export const GET_TOUR_PACKAGE = gql`
	query GetTourPackage($input: String!) {
		getTourPackage(packageId: $input) {
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
				memberPoints
				memberLikes
				memberViews
				deletedAt
				createdAt
				updatedAt
				accessToken
			}
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

export const GET_TOUR_PACKAGES = gql`
	query GetTourPackages($input: TourPackagesInquiry!) {
		getTourPackages(input: $input) {
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
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
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
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_AGENT_TOUR_PACKAGES = gql`
	query GetAgentTourPackages($input: AgentTourPackagesInquiry!) {
		getAgentTourPackages(input: $input) {
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
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_FAVORITES = gql`
	query GetFavorites($input: OrdinaryInquiry!) {
		getFavorites(input: $input) {
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
					memberTours
					memberArticles
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberFollowings
					memberFollowers
					memberRank
					memberWarnings
					memberBlocks
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

export const GET_VISITED_TOURS = gql`
	query GetVisitedTours($input: OrdinaryInquiry!) {
		getVisitedTours(input: $input) {
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
					memberTours
					memberArticles
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberFollowings
					memberFollowers
					memberRank
					memberWarnings
					memberBlocks
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

export const GET_BOARD_ARTICLE = gql`
	query GetBoardArticle($input: String!) {
		getBoardArticle(articleId: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			articleComments
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
			}
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

export const GET_BOARD_ARTICLES = gql`
	query GetBoardArticles($input: BoardArticlesInquiry!) {
		getBoardArticles(input: $input) {
			list {
				_id
				articleCategory
				articleStatus
				articleTitle
				articleContent
				articleImage
				articleViews
				articleLikes
				articleComments
				memberId
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
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
				}
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
				commentImages
				commentVideo
				commentRefId
				memberId
				likesCount
				isLiked
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
 *         FOLLOW         *
 *************************/

export const GET_MEMBER_FOLLOWERS = gql`
	query GetMemberFollowers($input: FollowInquiry!) {
		getMemberFollowers(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
				followerData {
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
					memberArticles
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberFollowings
					memberFollowers
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_MEMBER_FOLLOWINGS = gql`
	query GetMemberFollowings($input: FollowInquiry!) {
		getMemberFollowings(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				followingData {
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
					memberArticles
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberFollowings
					memberFollowers
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
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

export const GET_FAQ_CATEGORIES = gql`
	query GetFaqCategories($input: FaqInquiry!) {
		getFaqCategories(input: $input) {
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

export const GET_FAQS = gql`
	query GetFaqs($input: FaqInquiry!) {
		getFaqs(input: $input) {
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

export const GET_NOTICE_CATEGORIES = gql`
	query GetNoticeCategories($input: NoticeInquiry!) {
		getNoticeCategories(input: $input) {
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

export const GET_NOTICES = gql`
	query GetNotices($input: NoticeInquiry!) {
		getNotices(input: $input) {
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

export const GET_TOP_LIKED_COMMENTS = gql`
	query GetTopLikedComments($limit: Int) {
		getTopLikedComments(limit: $limit) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			likesCount
			isLiked
			createdAt
			updatedAt
			memberData {
				_id
				memberNick
				memberImage
				memberType
			}
		}
	}
`;
