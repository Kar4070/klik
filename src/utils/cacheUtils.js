export const getCachedData = (key) => {
    const cached = sessionStorage.getItem(key);
    if (!cached) return null;
    try {
        const { data, timestamp } = JSON.parse(cached);
        const fiveMinutes = 5 * 60 * 1000;
        if (Date.now() - timestamp > fiveMinutes) {
            sessionStorage.removeItem(key);
            return null;
        }
        return data;
    } catch (e) {
        return null;
    }
};

export const setCachedData = (key, data) => {
    sessionStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now()
    }));
};

export const clearCache = (key) => {
    sessionStorage.removeItem(key);
};
