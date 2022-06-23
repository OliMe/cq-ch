import Queue from './queue';
import EventTargetTransport from '../event-transport/event-target-transport';

/**
 * Channel.
 */
export default class Channel<T> {
  puts;
  takes;
  notificator: EventTargetTransport | undefined;

  /**
   * Create instance of Channel.
   * @param {EventTargetTransport} notificator Instance of EventTargetTransport.
   */
  constructor(notificator: EventTargetTransport | null = null) {
    if (notificator && notificator instanceof EventTargetTransport) {
      this.notificator = notificator;
    }
    this.puts = new Queue<T>(this._listener.bind(this));
    this.takes = new Queue<(value: T | Promise<T>) => void>(this._listener.bind(this));
  }

  /**
   * Puts value to channel.
   * @param {*} value Element for add in channel.
   */
  put(value: T) {
    if (value !== undefined) {
      this.puts.put(value);
    }
  }

  /**
   * Takes data from channel.
   * @return {Promise<*>} Returns element from channel.
   */
  async take(): Promise<T> {
    return new Promise(resolve => {
      this.takes.put(resolve);
    });
  }

  /**
   * Binds puts to takes.
   */
  _listener() {
    if (this.takes.length && this.puts.length) {
      const take = this.takes.take();
      const put = this.puts.take();
      take && put && take(put);
      if (this.notificator) {
        this.notificator.trigger('change');
      }
    }
  }
}
