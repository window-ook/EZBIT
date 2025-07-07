'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface IProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface IState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): IState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.props.onError?.(error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
                    <h2 className="text-lg font-semibold text-red-800 mb-2">
                        문제가 발생했습니다
                    </h2>
                    <p className="text-red-600 text-center mb-4 max-w-md">
                        {this.state.error?.message || '알 수 없는 오류가 발생했습니다.'}
                    </p>
                    <button
                        onClick={this.handleRetry}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        다시 시도
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}