'use client';
import { Component, ReactNode } from 'react';

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
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-soft-stone)' }}>
            <p>Something went wrong. Please go back and try again.</p>
            <p style={{ fontSize: 14, marginTop: 8 }}>
              If you need immediate help, call or text <strong>988</strong>.
            </p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
