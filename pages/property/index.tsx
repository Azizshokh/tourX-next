import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ resolvedUrl }) => {
	return {
		redirect: {
			destination: resolvedUrl.replace(/^\/property/, '/tour-package'),
			permanent: false,
		},
	};
};

export default function PropertyRedirect() {
	return null;
}
