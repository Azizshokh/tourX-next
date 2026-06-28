import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiHeart, FiMenu, FiUser } from 'react-icons/fi';

type NavbarProps = {
	activeRoute?: string;
};

const BRAND_COLOR = '#EC662A';

const navLinks = [
	{ label: 'Home', href: '/', match: '/' },
	{ label: 'Packages', href: '/tour-package', match: '/tour-package' },
	{ label: 'Agents', href: '/agent', match: '/agent' },
	{ label: 'Community', href: '/community?articleCategory=FREE', match: '/community' },
	{ label: 'Help', href: '/cs', match: '/cs' },
	{ label: 'About Us', href: '/about', match: '/about' },
];

const normalizeRoute = (route?: string) => {
	if (!route) return '';

	const [pathname] = route.split('?');
	return pathname.replace(/\/$/, '') || '/';
};

const Navbar = ({ activeRoute }: NavbarProps) => {
	const router = useRouter();
	const currentRoute = normalizeRoute(activeRoute || router.pathname);

	const isActive = (match: string) => {
		const normalizedMatch = normalizeRoute(match);

		if (normalizedMatch === '/') {
			return currentRoute === '/';
		}

		return currentRoute === normalizedMatch || currentRoute.startsWith(`${normalizedMatch}/`);
	};

	return (
		<header className="tourx-navbar">
			<Link href="/" className="tourx-navbar__logo" aria-label="TourX home">
				TourX
			</Link>

			<nav className="tourx-navbar__links" aria-label="Primary navigation">
				{navLinks.map((link) => (
					<Link
						key={link.label}
						href={link.href}
						className={`tourx-navbar__link${isActive(link.match) ? ' tourx-navbar__link--active' : ''}`}
					>
						{link.label}
					</Link>
				))}
			</nav>

			<div className="tourx-navbar__actions">
				<Link href="/account/join" className="tourx-navbar__login">
					Login
				</Link>
				<Link href="/account/join" className="tourx-navbar__register">
					Register
				</Link>
				<Link href="/mypage?category=myFavorites" className="tourx-navbar__icon" aria-label="Wishlist">
					<FiHeart aria-hidden="true" />
				</Link>
				<Link href="/mypage" className="tourx-navbar__icon" aria-label="User account">
					<FiUser aria-hidden="true" />
				</Link>
			</div>

			<button className="tourx-navbar__menu" type="button" aria-label="Open menu">
				<FiMenu aria-hidden="true" />
			</button>

			<style jsx>{`
				.tourx-navbar {
					align-items: center;
					background: #ffffff;
					border-bottom: 1px solid #f0ede8;
					box-sizing: border-box;
					display: grid;
					font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
					grid-template-columns: 1fr auto 1fr;
					height: 60px;
					padding: 0 32px;
					width: 100%;
				}

				.tourx-navbar__logo {
					color: ${BRAND_COLOR};
					font-size: 24px;
					font-weight: 800;
					line-height: 1;
					text-decoration: none;
					width: max-content;
				}

				.tourx-navbar__links {
					align-items: center;
					display: flex;
					gap: 28px;
					height: 100%;
					justify-content: center;
				}

				.tourx-navbar__link {
					align-items: center;
					border-bottom: 2px solid transparent;
					color: #333333;
					display: inline-flex;
					font-size: 15px;
					font-weight: 600;
					height: 100%;
					line-height: 1;
					text-decoration: none;
					transition: border-color 160ms ease, color 160ms ease;
				}

				.tourx-navbar__link:hover,
				.tourx-navbar__link--active {
					color: ${BRAND_COLOR};
				}

				.tourx-navbar__link--active {
					border-bottom-color: ${BRAND_COLOR};
				}

				.tourx-navbar__actions {
					align-items: center;
					display: flex;
					gap: 16px;
					justify-content: flex-end;
				}

				.tourx-navbar__login {
					color: #333333;
					font-size: 15px;
					font-weight: 600;
					line-height: 1;
					text-decoration: none;
					transition: color 160ms ease;
				}

				.tourx-navbar__login:hover {
					color: ${BRAND_COLOR};
				}

				.tourx-navbar__register {
					background: ${BRAND_COLOR};
					border-radius: 8px;
					color: #ffffff;
					font-size: 15px;
					font-weight: 700;
					line-height: 1;
					padding: 8px 20px;
					text-decoration: none;
				}

				.tourx-navbar__icon {
					align-items: center;
					color: #333333;
					display: inline-flex;
					font-size: 20px;
					height: 28px;
					justify-content: center;
					text-decoration: none;
					transition: color 160ms ease;
					width: 28px;
				}

				.tourx-navbar__icon:hover {
					color: ${BRAND_COLOR};
				}

				.tourx-navbar__menu {
					align-items: center;
					background: transparent;
					border: 0;
					color: #333333;
					cursor: pointer;
					display: none;
					font-size: 24px;
					height: 36px;
					justify-content: center;
					margin: 0;
					padding: 0;
					transition: color 160ms ease;
					width: 36px;
				}

				.tourx-navbar__menu:hover {
					color: ${BRAND_COLOR};
				}

				@media (max-width: 768px) {
					.tourx-navbar {
						display: flex;
						justify-content: space-between;
						padding: 0 20px;
					}

					.tourx-navbar__links,
					.tourx-navbar__actions {
						display: none;
					}

					.tourx-navbar__menu {
						display: inline-flex;
					}
				}
			`}</style>
		</header>
	);
};

export default Navbar;
