/**
 * Computes an estimate of the number of pixels that the axis text and ticks take up.
 *
 * @param {d3.axis} axis The d3 axis for which to compute the estimate.
 * @param {number} fontSize The font size in pixels for the axis text.
 * @returns {number} The estimated number of pixels that the axis text and ticks occupy.
 */
export function computeAxisTextAndTickBuffer(axis, fontSize) {
  //! Assertions
  if (axis === undefined || axis === null)
    throw new Error("axis is a required argument and must be defined");

  if (fontSize === undefined || fontSize === null)
    throw new Error("fontSize is a required argument and must be defined");

  //! Retrieve Key Metrics
  const domain = axis.scale().domain();
  const tickFormat = axis.tickFormat(); // formatter of ticks
  const tickSize = axis.tickSize(); // Size of tick lines
  const tickSizeOuter = axis.tickSizeOuter(); // Size of the square ends that
  const tickPadding = axis.tickPadding(); // Padding between tick lines and axis text
  const maxTickSize = Math.max([tickSize + tickPadding, tickSizeOuter]); // The larger value of (tickSize + tickPadding) & tickSizeOuter
  let lengthOfLongestLabel = maxCharacters(domain);

  //! Deal with edge cases
  //? if tickValues is [] there are NO ticks or lables
  const tickValues = axis.tickValues();
  if (tickValues === []) return 0;

  //? if tickFormat == "" there are NO labels but ticks remain
  if (tickFormat === "") lengthOfLongestLabel = 0;

  //! Compute the buffer
  const axisTextAndTickBuffer = lengthOfLongestLabel * fontSize + maxTickSize;

  //!  Return
  return axisTextAndTickBuffer;
}

/**
 * Calculates the maximum number of characters in an array of strings.
 *
 * @param {Array} strings An array of strings.
 * @returns {number} The maximum number of characters in the array of strings.
 */
export function maxCharacters(strings) {
  if (!Array.isArray(strings) || strings.length === 0) {
    return 0; // If the input is not an array or empty, return 0
  }

  const maxLength = strings.reduce((max, str) => {
    const length = str.length;
    return length > max ? length : max;
  }, 0);

  return maxLength;
}
