import styles from './Spinner.module.scss';
import { classNames } from '@/utils/helpers';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div className={classNames(styles.wrapper, className)}>
      <div className={classNames(styles.spinner, styles[size])} />
    </div>
  );
}
