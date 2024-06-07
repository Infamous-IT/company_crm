export const formatDate = (dateStr: Date): string => {
    const date = new Date(dateStr);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    // @ts-ignore
    return date.toLocaleDateString('en-US', options);
}