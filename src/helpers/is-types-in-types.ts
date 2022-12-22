import { Types } from '../types';

/**
 * Checks if the type is in the list of interface types.
 * @param set Type of event.
 * @param types List of types in interface.
 * @return Is type in the list of interface types.
 */
const isTypesInTypes = (set: Types, types: Types) => set.every(value => types.includes(value));

export default isTypesInTypes;
