import Queue from './queue';
import EventTargetTransport from '../event-transport/event-target-transport';

/**
 * Channel.
 */
export default class Channel<T> {
  puts;
  takes;
  notificator?: EventTargetTransport;

  /**
   * Create instance of Channel.
   * @param notificator Instance of EventTargetTransport.
   */
  constructor(notificator?: EventTargetTransport) {
    if (notificator) {
      this.notificator = notificator;
    }
    this.puts = new Queue<T>(this._listener.bind(this));
    this.takes = new Queue<(value: T | Promise<T>) => void>(this._listener.bind(this));
  }

  /**
   * Puts value to channel.
   * @param value Element for add in channel.
   */
  put(value: T) {
    if (value !== undefined) {
      this.puts.put(value);
    }
  }

  /**
   * Takes data from channel.
   * @return Returns element from channel.
   */
  async take(): Promise<T> {
    return new Promise(resolve => {
      this.takes.put(resolve);
    });
  }

  /**
   * Listener for new message event.
   */
  _listener() {
    if (this.takes.length && this.puts.length) {
      this._pass();
      if (this.notificator) {
        this.notificator.trigger('change');
      }
    }
  }
  /**
   * Binds puts to takes.
   */
  _pass() {
    const take = this.takes.take();
    const put = this.puts.take();
    // TODO The reverse version of the condition is not possible with the current usage. It needs to be simplified.
    if (take && put) {
      take(put);
    }
  }
}
