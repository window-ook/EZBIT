export const sanitizeTitle = (title: string): string => {
    if (typeof title !== 'string') return '';
    return title
        .replace(/<\/?b>/g, '')
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, "'")
        .trim();
};