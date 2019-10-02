export function CustomEvent (event, { bubbles, cancelable, detail } = {}) {
  const evt = document.createEvent('CustomEvent');
  evt.initCustomEvent(
    event,
    Boolean(bubbles),
    Boolean(cancelable),
    detail
  );
  const origPrevent = evt.preventDefault;
  evt.preventDefault = function () {
    origPrevent.call(this);
    try {
      Object.defineProperty(this, 'defaultPrevented', {
        get () {
          return true;
        },
      });
    } catch (e) {
      this.defaultPrevented = true;
    }
  };
  return evt;
}

CustomEvent.prototype = window.Event.prototype;

export function getCustomEventConstructor () {
  let constructor;
  try {
    new window.CustomEvent('test');
    constructor = window.CustomEvent;
  } catch (e) {
    constructor = CustomEvent;
  }
  return constructor;
}

export default getCustomEventConstructor();
