const StorageService = {
    setItem(key: string, value: string) {
        localStorage.setItem(key, value);
    },

    getItem(key: string) {
        return localStorage.getItem(key);
    },

    removeItem(key: string) {
        localStorage.removeItem(key);
    },
};
export default StorageService;
