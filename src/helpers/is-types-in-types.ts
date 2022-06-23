import { Types } from '../types';

/**
 * Checks if the type is in the list of interface types.
 * @param {Array<string|symbol>} set Type of event.
 * @param {Array<string|symbol>} types List of types in interface.
 * @return {boolean} Is type in the list of interface types.
 */
const isTypesInTypes = (set: Types, types: Types) => set.every(value => types.includes(value));

export default isTypesInTypes;
