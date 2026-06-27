import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography, Box, List, ListItem, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Link from 'next/link';
import { Member } from '../../types/member/member';
import { REACT_APP_API_URL } from '../../config';
import { useQuery } from '@apollo/client';
import { GET_MEMBER } from '../../../apollo/user/query';
import { T } from '../../types/common';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import LuggageRoundedIcon from '@mui/icons-material/LuggageRounded';
import PhoneIphoneRoundedIcon from '@mui/icons-material/PhoneIphoneRounded';

interface MemberMenuProps {
	subscribeHandler: any;
	unsubscribeHandler: any;
}

const MemberMenu = (props: MemberMenuProps) => {
	const { subscribeHandler, unsubscribeHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const category: any = router.query?.category;
	const activeCategory = category === 'properties' ? 'tourPackages' : category;
	const [member, setMember] = useState<Member | null>(null);
	const { memberId } = router.query;

	/** APOLLO REQUESTS **/
	const {
		loading: getMemberLoading,
		data: getMemberData,
		error: getMemberError,
		refetch: getMemberRefetch,
	} = useQuery(GET_MEMBER, {
		fetchPolicy: 'network-only',
		variables: { input: memberId },
		skip: !memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setMember(data?.getMember);
		},
	});

	if (device === 'mobile') {
		return <div>MEMBER MENU MOBILE</div>;
	} else {
		return (
			<Stack width={'100%'} padding={'30px 24px'}>
				<Stack className={'profile'}>
					<Box component={'div'} className={'profile-img'}>
						<img
							src={member?.memberImage ? `${REACT_APP_API_URL}/${member?.memberImage}` : '/img/profile/defaultUser.svg'}
							alt={'member-photo'}
						/>
					</Box>
					<Stack className={'user-info'}>
						<Typography className={'user-name'}>{member?.memberNick}</Typography>
						<Box component={'div'} className={'user-phone'}>
							<PhoneIphoneRoundedIcon />
							<Typography className={'p-number'}>{member?.memberPhone}</Typography>
						</Box>
						<Typography className={'view-list'}>{member?.memberType}</Typography>
					</Stack>
				</Stack>

				<Stack className="follow-button-box">
					{member?.meFollowed && member?.meFollowed[0]?.myFollowing ? (
						<>
							<Button
								variant="outlined"
								sx={{ background: '#b9b9b9' }}
								onClick={() => unsubscribeHandler(member?._id, getMemberRefetch, memberId)}
							>
								Unfollow
							</Button>
							<Typography>Following</Typography>
						</>
					) : (
						<Button
							variant="contained"
							sx={{ background: '#ff5d18', ':hover': { background: '#ff5d18' } }}
							onClick={() => subscribeHandler(member?._id, getMemberRefetch, memberId)}
						>
							Follow
						</Button>
					)}
				</Stack>

				<Stack className={'sections'}>
					<Stack className={'section'}>
						<Typography className="title" variant={'h5'}>
							Details
						</Typography>
						<List className={'sub-section'}>
							{member?.memberType === 'AGENT' && (
								<ListItem className={activeCategory === 'tourPackages' ? 'focus' : ''}>
									<Link
										href={{
											pathname: '/member',
											query: { ...router.query, category: 'tourPackages' },
										}}
										scroll={false}
										style={{ width: '100%' }}
									>
										<div className={'flex-box'} style={{ ['--menu-accent' as string]: '#ff8a00' }}>
											<Box className={'menu-icon'}><LuggageRoundedIcon /></Box>
											<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
												Packages
											</Typography>
											<Typography className="count-title" variant="subtitle1">
												{member?.memberTours}
											</Typography>
										</div>
									</Link>
								</ListItem>
							)}
							<ListItem className={category === 'followers' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/member',
										query: { ...router.query, category: 'followers' },
									}}
									scroll={false}
									style={{ width: '100%' }}
								>
									<div className={'flex-box'} style={{ ['--menu-accent' as string]: '#7c3aed' }}>
										<Box className={'menu-icon'}><GroupsRoundedIcon /></Box>
										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											Followers
										</Typography>
										<Typography className="count-title" variant="subtitle1">
											{member?.memberFollowers}
										</Typography>
									</div>
								</Link>
							</ListItem>
							<ListItem className={category === 'followings' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/member',
										query: { ...router.query, category: 'followings' },
									}}
									scroll={false}
									style={{ width: '100%' }}
								>
									<div className={'flex-box'} style={{ ['--menu-accent' as string]: '#0f766e' }}>
										<Box className={'menu-icon'}><PersonAddAltRoundedIcon /></Box>
										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											Following
										</Typography>
										<Typography className="count-title" variant="subtitle1">
											{member?.memberFollowings}
										</Typography>
									</div>
								</Link>
							</ListItem>
						</List>
					</Stack>

					<Stack className={'section'} sx={{ marginTop: '10px' }}>
						<Stack>
							<Typography className="title" variant={'h5'}>
								Community
							</Typography>
							<List className={'sub-section'}>
								<ListItem className={category === 'articles' ? 'focus' : ''}>
									<Link
										href={{
											pathname: '/member',
											query: { ...router.query, category: 'articles' },
										}}
										scroll={false}
										style={{ width: '100%' }}
									>
										<div className={'flex-box'} style={{ ['--menu-accent' as string]: '#2563eb' }}>
											<Box className={'menu-icon'}><ArticleRoundedIcon /></Box>
											<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
												Articles
											</Typography>
											<Typography className="count-title" variant="subtitle1">
												{member?.memberArticles}
											</Typography>
										</div>
									</Link>
								</ListItem>
							</List>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default MemberMenu;
