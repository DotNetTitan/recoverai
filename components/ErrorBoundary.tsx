'use client';
import { Component, ReactNode } from 'react';
import { CRISIS_HOTLINE, EMERGENCY_NUMBER } from '@/utils/constants';
import styles from './ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  label?: string;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className={styles.fallback}>
            <p>Something went wrong. Please go back and try again.</p>
            <p className={styles.fallbackSupport}>
              If you need immediate help, call <strong>{CRISIS_HOTLINE}</strong> (Tele-MANAS) or dial <strong>{EMERGENCY_NUMBER}</strong>.
            </p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
