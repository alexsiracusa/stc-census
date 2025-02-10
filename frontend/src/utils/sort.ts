export interface SortOptions<T> {
    key: keyof T; // Key of the object to sort by
    order?: 'asc' | 'desc'; // Order: 'asc' for ascending (default), 'desc' for descending
}

export function sortArray<T>(array: T[], options: SortOptions<T>): T[] {
    const {key, order = 'asc'} = options;

    return array.sort((a, b) => {
        const valueA = a[key];
        const valueB = b[key];

        // Handle comparisons for various data types
        if (valueA < valueB) {
            return order === 'asc' ? -1 : 1;
        } else if (valueA > valueB) {
            return order === 'asc' ? 1 : -1;
        }
        return 0; // If equal
    });
}