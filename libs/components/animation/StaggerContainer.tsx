import { motion } from 'framer-motion';
import { CSSProperties, PropsWithChildren } from 'react';
import { staggerContainerVariants, viewportList, STAGGER_DELAY } from '../../config/animations';

interface StaggerContainerProps {
	className?: string;
	style?: CSSProperties;
	delay?: number;
	stagger?: number;
}

const StaggerContainer = ({
	children,
	className,
	style,
	delay = 0,
	stagger,
}: PropsWithChildren<StaggerContainerProps>) => {
	const variants =
		delay > 0 || stagger != null
			? {
					hidden: {},
					visible: {
						transition: {
							staggerChildren: stagger ?? STAGGER_DELAY,
							delayChildren: delay,
						},
					},
			  }
			: staggerContainerVariants;

	return (
		<motion.div
			className={className}
			style={style}
			variants={variants}
			initial="hidden"
			whileInView="visible"
			viewport={viewportList}
		>
			{children}
		</motion.div>
	);
};

export default StaggerContainer;
