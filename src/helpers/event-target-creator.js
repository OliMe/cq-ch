import { EventTarget as EventTargetShim } from 'event-target-shim';
import 'custom-event-polyfill';

/**
 * Creates EventTarget instance.
 * @return { EventTarget | EventTargetShim }
 */
export default function createEventTarget () {
  let instance;
  try {
    instance = new EventTarget();
  } catch (e) {
    instance = new EventTargetShim();
  }
  return instance;
}
