import { CustomEvent as PolyfillCustomEvent, getCustomEventConstructor } from '../custom-event';

describe('CustomEvent', () => {
  it('should create instance without options correctly.', () => {
    const event = new PolyfillCustomEvent('test');
    expect(event).toBeInstanceOf(window.CustomEvent);
    expect(event.type).toBe('test');
    expect(event.preventDefault).toBeInstanceOf(Function);
    event.preventDefault();
    expect(event.defaultPrevented).toBe(true);
  });
  it('should create instance with options correctly.', () => {
    const detail = { test: 'test' };
    const event = new PolyfillCustomEvent('test', { bubbles: true, cancelable: true, detail });
    expect(event.bubbles).toBe(true);
    expect(event.cancelable).toBe(true);
    expect(event.detail).toBe(detail);
  });
  it('should set defaultPrevented in true if defineProperty throws.', () => {
    const event = new PolyfillCustomEvent('test');
    Object.defineProperty(event, 'defaultPrevented', {
      value: false,
      writable: true,
    });
    jest.spyOn(Object, 'defineProperty');
    Object.defineProperty.mockImplementation(() => {
      throw new Error('test');
    });
    event.preventDefault();
    expect(event.defaultPrevented).toBe(true);
  });
});

describe('getCustomEventConstructor', () => {
  it('should return native CustomEvent constructor if it defined.', () => {
    const CustomEvent = getCustomEventConstructor();
    expect(new CustomEvent('test')).toBeInstanceOf(window.CustomEvent);
  });
  it('should return CustomEvent constructor polyfill.', () => {
    jest.spyOn(window, 'CustomEvent');
    window.CustomEvent.mockImplementation(function CustomEvent () {
      throw new Error('test');
    });
    const CustomEvent = getCustomEventConstructor();
    expect(new CustomEvent('test')).toBeInstanceOf(PolyfillCustomEvent);
  });
});
