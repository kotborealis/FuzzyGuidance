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

/**
 *
 * @param {[]} values
 * @param {Function} with_
 */
export const maxWith = (values, with_) =>
    values.reduce((prev, current) =>
        (with_(prev) > with_(current)) ? prev : current
    );

/**
 *
 * @param {[]} values
 * @param {Function} with_
 */
export const minWith = (values, with_) =>
    values.reduce((prev, current) =>
        (with_(prev) < with_(current)) ? prev : current
    );