export interface SortOptions<T> {
    key: keyof T; // Key of the object to sort by
    order?: 'asc' | 'desc'; // Order: 'asc' for ascending (default), 'desc' for descending
}

function getNestedValue(obj: any, path: string): any {
    const keys = path.split("."); // Split the string (e.g., "field.subfield") into an array ['field', 'subfield']
    let result = obj;

    for (const key of keys) {
        if (result && typeof result === "object") {
            result = result[key];
        } else {
            return undefined; // Return undefined if the key doesn't exist in the current level
        }
    }

    return result; // Return the final resolved value
}

export function sortArray<T>(array: T[], options: SortOptions<T>): T[] {
    const {key, order = 'asc'} = options;

    return array.sort((a, b) => {
        const valueA = getNestedValue(a, key);
        const valueB = getNestedValue(b, key);

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