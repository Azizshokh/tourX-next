import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const COMMON_NAMESPACES = ['common', 'footer', 'errors'];
export const HOME_NAMESPACES = [...COMMON_NAMESPACES, 'home', 'package', 'agent', 'community'];
export const AUTH_NAMESPACES = [...COMMON_NAMESPACES, 'auth'];
export const PACKAGE_NAMESPACES = [...COMMON_NAMESPACES, 'package'];
export const AGENT_NAMESPACES = [...COMMON_NAMESPACES, 'agent', 'package', 'community'];
export const COMMUNITY_NAMESPACES = [...COMMON_NAMESPACES, 'community'];
export const ADMIN_NAMESPACES = [...COMMON_NAMESPACES, 'admin', 'package', 'community'];
export const MYPAGE_NAMESPACES = [...COMMON_NAMESPACES, 'mypage', 'package', 'agent', 'community'];
export const CS_NAMESPACES = [...COMMON_NAMESPACES, 'community'];
export const ABOUT_NAMESPACES = [...COMMON_NAMESPACES, 'about'];
export const ALL_NAMESPACES = ['common', 'auth', 'home', 'package', 'agent', 'community', 'admin', 'mypage', 'about', 'footer', 'errors'];

export const getI18nProps = async (locale: string | undefined, namespaces: string[] = COMMON_NAMESPACES) => ({
	...(await serverSideTranslations(locale ?? 'en', namespaces)),
});
