/**
 * Deep compare two objects for equality
 * @param {Object} obj1 - First object to compare
 * @param {Object} obj2 - Second object to compare
 * @param {Object} options - Comparison options
 * @param {Function} options.transform - Transform function to apply to values before comparison
 * @returns {boolean} - True if objects are deeply equal, false otherwise
 */
export function deepEqual(obj1, obj2, options = {}) {
  if (obj1 === obj2) return true;

  if (
    obj1 == null ||
    obj2 == null ||
    typeof obj1 !== "object" ||
    typeof obj2 !== "object"
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  return keys1.every((key) => {
    if (!keys2.includes(key)) {
      return false;
    }

    let val1 = obj1[key];
    let val2 = obj2[key];

    // Apply transform if provided
    if (options.transform) {
      val1 = options.transform(key, val1);
      val2 = options.transform(key, val2);
    }

    // Recursive comparison for nested objects
    if (typeof val1 === "object" && typeof val2 === "object") {
      return deepEqual(val1, val2, options);
    }

    return val1 === val2;
  });
}

/**
 * Compare filter values with applied filters
 * Trims string values for companyName before comparison
 * @param {Object} values - Current filter values
 * @param {Object} appliedFilters - Previously applied filters
 * @returns {boolean} - True if filters are equal, false otherwise
 */
export function compareFilters(values, appliedFilters) {
  return deepEqual(values, appliedFilters, {
    transform: (key, value) => {
      // Trim companyName for comparison
      if (key === "companyName" && typeof value === "string") {
        return value.trim();
      }
      return value;
    },
  });
}
