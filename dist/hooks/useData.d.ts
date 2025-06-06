export declare function useData<T>(fetchFn: () => Promise<T>, dependencies?: unknown[]): {
    data: T | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
};
