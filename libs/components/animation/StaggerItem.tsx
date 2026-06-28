import { motion, useReducedMotion } from 'framer-motion';
import { CSSProperties, PropsWithChildren } from 'react';
import { staggerItemVariants, reducedStaggerItemVariants } from '../../config/animations';

interface StaggerItemProps {
	className?: string;
	style?: CSSProperties;
}

const StaggerItem = ({ children, className, style }: PropsWithChildren<StaggerItemProps>) => {
	const prefersReducedMotion = useReducedMotion();
	const variants = prefersReducedMotion ? reducedStaggerItemVariants : staggerItemVariants;

	return (
		<motion.div className={className} style={style} variants={variants}>
			{children}
		</motion.div>
	);
};

export default StaggerItem;
