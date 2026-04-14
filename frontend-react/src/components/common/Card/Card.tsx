import type { ReactNode } from 'react';
import styles from './Card.module.scss';
import { classNames } from '@/utils/helpers';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className, hoverable, onClick }: CardProps) {
  return (
    <div
      className={classNames(styles.card, hoverable ? styles.hoverable : undefined, className)}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
