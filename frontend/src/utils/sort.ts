export interface SortOptions<T> {
    key: keyof T; // Key of the object to sort by
    order?: 'asc' | 'desc'; // Order: 'asc' for ascending (default), 'desc' for descending
}

export function sortArray<T>(array: T[], options: SortOptions<T>): T[] {
    const {key, order = 'asc'} = options;

    return array.sort((a, b) => {
        const valueA = a[key];
        const valueB = b[key];

        // Handle null and undefined values explicitly
        const isNullOrUndefinedA = valueA === null || valueA === undefined;
        const isNullOrUndefinedB = valueB === null || valueB === undefined;

        if (isNullOrUndefinedA && !isNullOrUndefinedB) {
            return 1; // Place null/undefined at the bottom
        }
        if (!isNullOrUndefinedA && isNullOrUndefinedB) {
            return -1; // Place valid values above null/undefined
        }
        if (isNullOrUndefinedA && isNullOrUndefinedB) {
            return 0; // Both are null/undefined, consider them equal
        }

        // Handle comparisons for various data types
        if (valueA < valueB) {
            return order === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
            return order === 'asc' ? 1 : -1;
        }
        return 0; // If equal
    });
}