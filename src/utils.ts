let timeout: number | null = null;
export const debounceImmediate = <T>(func: (...args: T[]) => void, wait: number) => {
    return (...args: T[]) => {
        const later = () => {
            timeout = null;
        };
        if (timeout === null) {
            timeout = setTimeout(later, wait);
            func(...args);
        }
    };
};