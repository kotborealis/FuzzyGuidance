/**
 *
 * @param {Number} min
 * @param {Number} max
 * @param {Number} value
 * @returns {number}
 */
export const clamp = (min, max, value) => Math.min(max, Math.max(min, value));

/**
 *
 * @param {Number} x
 * @returns {number}
 */
export const toDegrees = x => x * 180 / Math.PI;

/**
 *
 * @param {Number} x
 * @returns {number}
 */
export const toRadians = x => x / 180 * Math.PI;