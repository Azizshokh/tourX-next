import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ resolvedUrl }) => {
	return {
		redirect: {
			destination: resolvedUrl.replace(/^\/property\/detail/, '/tour-package/detail'),
			permanent: false,
		},
	};
};

export default function PropertyDetailRedirect() {
	return null;
}
