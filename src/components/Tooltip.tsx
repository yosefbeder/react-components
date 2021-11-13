import React, { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { P2 } from '../typography';

interface ContainerProps {
	width: number;
	height: number;
}

const Container = styled.div<ContainerProps>`
	position: relative;
	width: ${props => props.width}px;
	height: ${props => props.height}px;
	cursor: pointer;
`;

type Position = 'top' | 'bottom' | 'left' | 'right';

interface ComponentProps {
	position: Position;
	isShown: boolean;
}

const Component = styled(P2)<ComponentProps>`
	position: absolute;
	${({ position }) => {
		if (position === 'top')
			return css`
				bottom: calc(100% + var(--space-sm));
				left: 50%;
				transform: translateX(-50%);
			`;

		if (position === 'left')
			return css`
				top: 50%;
				transform: translateY(-50%);
				right: calc(100% + var(--space-sm));
			`;

		if (position === 'right')
			return css`
				top: 50%;
				transform: translateY(-50%);
				left: calc(100% + var(--space-sm));
			`;

		return css`
			top: calc(100% + var(--space-sm));
			left: 50%;
			transform: translateX(-50%);
		`;
	}}
	margin: 0;
	padding: var(--space-sm) var(--space-md);
	border-radius: var(--rounded-sm);
	background-color: var(--color-gray-600);

	pointer-events: none;

	white-space: nowrap;
	line-height: 1;
	color: var(--color-gray-100);

	opacity: ${props => (props.isShown ? '1' : '0')};
	transition: 100ms opacity;
`;

interface TooltipProps {
	content: string;
	position: Position;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content, position }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isMouseIn, setIsMouseIn] = useState(false);
	const [{ width, height }, setSize] = useState({ width: 0, height: 0 });

	useEffect(() => {
		const container = containerRef.current!;
		const child = (Array.from(container.childNodes) as HTMLElement[]).find(
			node =>
				getComputedStyle(node).getPropertyValue('position') !== 'absolute',
		)!;

		const width = parseInt(getComputedStyle(child).getPropertyValue('width'));
		const height = parseInt(getComputedStyle(child).getPropertyValue('height'));

		setSize({ width, height });
	}, []);

	return (
		<Container
			ref={containerRef}
			width={width}
			height={height}
			onMouseEnter={() => setIsMouseIn(true)}
			onMouseLeave={() => setIsMouseIn(false)}
		>
			{children}
			<Component position={position} isShown={isMouseIn}>
				{content}
			</Component>
		</Container>
	);
};

export default Tooltip;
