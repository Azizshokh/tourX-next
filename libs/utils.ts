import numeral from 'numeral';
import { sweetMixinErrorAlert } from './sweetAlert';

export const formatterStr = (value: number | undefined): string => {
	return numeral(value).format('0,0') != '0' ? numeral(value).format('0,0') : '';
};

export const likeTargetTourPackageHandler = async (likeTargetTourPackage: any, id: string) => {
	try {
		await likeTargetTourPackage({
			variables: {
				input: id,
			},
		});
	} catch (err: any) {
		console.error('likeTargetTourPackageHandler failed:', err.message);
		sweetMixinErrorAlert(err.message).then();
	}
};

export const likeTargetBoardArticleHandler = async (likeTargetBoardArticle: any, id: string) => {
	try {
		await likeTargetBoardArticle({
			variables: {
				input: id,
			},
		});
	} catch (err: any) {
		console.error('likeTargetBoardArticleHandler failed:', err.message);
		sweetMixinErrorAlert(err.message).then();
	}
};

export const likeTargetMemberHandler = async (likeTargetMember: any, id: string) => {
	try {
		await likeTargetMember({
			variables: {
				input: id,
			},
		});
	} catch (err: any) {
		console.error('likeTargetMemberHandler failed:', err.message);
		sweetMixinErrorAlert(err.message).then();
	}
};
