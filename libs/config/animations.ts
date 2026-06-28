import type { Variants, Transition } from 'framer-motion';

// ── Timing ───────────────────────────────────────────────────────────────────
export const DURATION = 0.55;
export const EASE = 'easeOut';
export const STAGGER_DELAY = 0.08;

// ── Viewport configs ─────────────────────────────────────────────────────────
export const viewportOnce = { once: true, amount: 0.15 } as const;
export const viewportSection = { once: true, amount: 0.12 } as const;
export const viewportList = { once: true, amount: 0.1 } as const;

// ── Transition helpers ────────────────────────────────────────────────────────
export const baseTransition: Transition = { duration: DURATION, ease: EASE };
export const fastTransition: Transition = { duration: 0.35, ease: EASE };
export const reducedTransition: Transition = { duration: 0.25, ease: EASE };

// ── Inline motion prop spreads ────────────────────────────────────────────────
// These are spread onto `motion.*` or `motion(Component)` elements directly.

export const fadeUpMotionProps = {
	initial: { opacity: 0, y: 32 },
	whileInView: { opacity: 1, y: 0 },
	viewport: viewportOnce,
	transition: baseTransition,
} as const;

export const sectionMotionProps = {
	initial: { opacity: 0, y: 40 },
	whileInView: { opacity: 1, y: 0 },
	viewport: viewportSection,
	transition: { duration: 0.6, ease: EASE },
} as const;

export const fadeInMotionProps = {
	initial: { opacity: 0 },
	whileInView: { opacity: 1 },
	viewport: viewportOnce,
	transition: fastTransition,
} as const;

// ── Variant sets (used by StaggerContainer / StaggerItem) ───────────────────
export const staggerContainerVariants: Variants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: STAGGER_DELAY,
			delayChildren: 0,
		},
	},
};

export const staggerItemVariants: Variants = {
	hidden: { opacity: 0, y: 24 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: EASE },
	},
};

// Reduced-motion variants (only opacity, no movement)
export const reducedStaggerItemVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { duration: 0.25, ease: EASE },
	},
};

export const reducedFadeUpVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: reducedTransition,
	},
};
