/**
 * locationUtils.js
 *
 * Legacy Firestore documents stored location as opaque keys ("location_a", etc.).
 * New documents store the city name directly ("Mumbai", "Delhi", …).
 *
 * normalizeLocation() transparently resolves both formats to a plain city name
 * so the rest of the app never has to think about the old keys.
 *
 * HOW TO EXTEND: add more entries to LOCATION_MAP if old keys exist in your DB.
 * HOW TO RETIRE:  once every Firestore document has been migrated, this file can
 *                 be deleted and all callers simplified to just use user.location.
 */

export const LOCATION_MAP = {
  location_a: "Chennai",
  location_b: "Gift City",
  location_c: "Hyderabad",
  location_d: "Mumbai",
  // Add further legacy keys here as needed, e.g.:
  // location_d: "Mumbai",
};

/**
 * Returns the human-readable city name for a stored location value.
 * - If the value is a legacy key  → mapped city name ("location_a" → "Hyderabad")
 * - If the value is already a city → returned unchanged           ("Mumbai"     → "Mumbai")
 * - If the value is falsy          → empty string
 *
 * @param {string} location - raw location value from Firestore
 * @returns {string} normalized city name
 */
export function normalizeLocation(location) {
  if (!location) return "";
  return (LOCATION_MAP[location] || location).toLowerCase(); // 👈 add .toLowerCase()
}

/**
 * Applies normalizeLocation to a single user object.
 * Returns a new object — the original is never mutated.
 *
 * @param {Object} user - raw user data from Firestore
 * @returns {Object} user with location resolved to a city name
 */
export function normalizeUserLocation(user) {
  if (!user) return user;
  return {
    ...user,
    location: normalizeLocation(user.location),
  };
}
