/**
 * Converts long data into wide count data format compatible with stacked barplot visualisations.
 *
 * @param {Array<Object>} data - The long data array to be converted.
 * @param {string} yCategory - The key representing the y category.
 * @param {string} ySubCategory - The key representing the y subcategory.
 * @returns {Array<Object>} The converted wide data array.
 *
 * @example
 * const longData = [
 *   { x: "Patient1", gene: "BRCA1", type: "missense" },
 *   { x: "Patient2", gene: "BRCA1", type: "missense" },
 *   { x: "Patient3", gene: "BRCA1", type: "nonsense" },
 *   { x: "Patient4", gene: "BRCA1", type: "nonsense" },
 *   { x: "Patient5", gene: "TP53", type: "missense" },
 *   { x: "Patient6", gene: "TP53", type: "missense" },
 *   { x: "Patient6", gene: "TP53", type: "nonsense" }
 * ];
 * const dataCounts = count(longData, 'gene', 'type');
 *
 * console.log(dataCounts);
 * // Output:
 * // [
 * //   {"gene": "BRCA1", "missense": 2, "nonsense": 2 },
 * //   {"gene": "TP53",  "missense": 2, "nonsense": 1 }
 * // ]
 * //
 */
export function count(data, yCategory, ySubCategory) {
  if (yCategory === undefined || yCategory === null)
    throw new Error("yCategory must be defined");

  if (data === undefined || data === null)
    throw new Error("data must be defined");

  const distinctYValues = [...new Set(data.map((item) => item[yCategory]))];

  const result = [];

  distinctYValues.forEach((currentCategory) => {
    if (ySubCategory) {
      const yData = { [yCategory]: currentCategory };
      // Get distinct ySubCategory values
      const distinctSubCategories = [
        ...new Set(data.map((item) => item[ySubCategory])),
      ];

      // Iterate through each distinct ySubCategory value
      distinctSubCategories.forEach((currentSubCategory) => {
        const count = data.filter(
          (item) =>
            item[yCategory] === currentCategory &&
            item[ySubCategory] === currentSubCategory
        ).length;

        yData[currentSubCategory] = count;
      });

      result.push(yData);
    } else {
      const count = data.filter(
        (item) => item[yCategory] === currentCategory
      ).length;
      result.push({ [yCategory]: currentCategory, count: count });
    }
  });

  return result;
}

/**
 * Converts a JavaScript object to a formatted JSON string.
 *
 * @param {Object} object - The object to be converted to JSON.
 * @returns {string} The formatted JSON string.
 *
 * @example
 * const exampleObject = { key1: 'value1', key2: 'value2' };
 * const jsonString = dputJS(exampleObject);
 * console.log(jsonString);
 */
export function dputJS(object) {
  return JSON.stringify(object, null, 2);
}
