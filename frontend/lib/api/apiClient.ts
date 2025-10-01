import { RequestInit } from 'next/dist/server/web/spec-extension/request';

interface FetchOptions extends RequestInit {
    next?: { revalidate?: number },
    cache?: 'force-cache' | 'no-store';
}

/** 요청 도메인 타입 정의 */
type RequestDomain = 'local' | 'websocket' | 'external';

/**
 * @param url 요청 URL
 * @param options 요청 옵션
 * @param type 요청 도메인 타입 (기본값: 'local')
 * @returns {T} Response JSON
 */
export async function apiClient<T = unknown>(
    url: string,
    options?: FetchOptions,
    type: RequestDomain = 'local'
): Promise<T> {
    const defaultHeaders = { 'Content-Type': 'application/json' };

    const mergedOptions: RequestInit = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...(options?.headers || {}),
        },
    };

    let fullUrl: string;

    switch (type) {
        case 'websocket':
            const websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_SERVER || 'http://localhost:4000';
            fullUrl = `${websocketUrl}${url}`;
            break;
        case 'external':
            fullUrl = url;
            break;
        default:
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            fullUrl = `${baseUrl}${url}`;
            break;
    }

    const response = await fetch(fullUrl, mergedOptions);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`apiClient: ${response.status} ${response.statusText} - ${errorText}`);
    }

    try {
        return await response.json();
    } catch (error) {
        console.error('apiClient: ', error);
        return (await response.text()) as T;
    }
}