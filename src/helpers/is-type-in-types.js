/**
 * Checks if the type is in the list of interface types.
 * @param {Array<string|symbol>} type Type of event.
 * @param {Array<string|symbol>} types List of types in interface.
 * @return {boolean} Is type in the list of interface types.
 */
const isTypeInTypes = (type, types) => Array.isArray(type) && type.every(value => types.includes(value));

export default isTypeInTypes;
