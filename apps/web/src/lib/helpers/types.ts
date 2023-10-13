/**
 * Asserts that the given object property is null.
 */
export function isPropNull<T, K extends keyof T>(obj: T, propName: K): obj is T & Record<K, null> {
  return obj[propName] === null;
}

/**
 * Asserts that the given object property is not null.
 */
export function isPropNotNull<T, K extends keyof T>(
  obj: T,
  propName: K,
): obj is T & Record<K, NonNullable<T[K]>> {
  return obj[propName] !== null;
}

/**
 * Returns a new object type with the given property set to null.
 */
export type SetPropsToNull<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? null : T[P];
};

/**
 * Returns a new object type with the given property set to non-nullable.
 */
export type RemoveNullFromProps<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? NonNullable<T[P]> : T[P];
};
