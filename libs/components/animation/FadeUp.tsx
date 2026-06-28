import { motion, useReducedMotion } from 'framer-motion';
import { CSSProperties, PropsWithChildren } from 'react';
import { viewportOnce, baseTransition } from '../../config/animations';

interface FadeUpProps {
	delay?: number;
	duration?: number;
	className?: string;
	style?: CSSProperties;
}

const FadeUp = ({ children, delay = 0, duration, className, style }: PropsWithChildren<FadeUpProps>) => {
	const prefersReducedMotion = useReducedMotion();

	return (
		<motion.div
			className={className}
			style={style}
			initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 32 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={viewportOnce}
			transition={{
				duration: prefersReducedMotion ? 0.2 : (duration ?? baseTransition.duration),
				ease: baseTransition.ease as string,
				delay,
			}}
		>
			{children}
		</motion.div>
	);
};

export default FadeUp;
