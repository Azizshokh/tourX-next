module.exports = {
	i18n: {
		defaultLocale: 'en',
		locales: ['en', 'kr', 'ru'],
		localeDetection: false,
	},
	defaultNS: 'common',
	ns: ['common', 'auth', 'home', 'package', 'agent', 'community', 'admin', 'mypage', 'about', 'footer', 'errors'],
	fallbackLng: 'en',
	nonExplicitSupportedLngs: false,
	reloadOnPrerender: process.env.NODE_ENV === 'development',
	trailingSlash: true,
};
