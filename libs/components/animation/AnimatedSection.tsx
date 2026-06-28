import { motion, useReducedMotion } from 'framer-motion';
import { CSSProperties, PropsWithChildren } from 'react';
import { viewportSection } from '../../config/animations';

interface AnimatedSectionProps {
	delay?: number;
	className?: string;
	style?: CSSProperties;
}

const AnimatedSection = ({ children, delay = 0, className, style }: PropsWithChildren<AnimatedSectionProps>) => {
	const prefersReducedMotion = useReducedMotion();

	return (
		<motion.div
			className={className}
			style={style}
			initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 40 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={viewportSection}
			transition={{
				duration: prefersReducedMotion ? 0.2 : 0.6,
				ease: 'easeOut',
				delay,
			}}
		>
			{children}
		</motion.div>
	);
};

export default AnimatedSection;
