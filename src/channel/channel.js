import Queue from './queue';
import EventTargetTransport from '../event-transport/event-target-transport';

/**
 * Channel.
 */
export default class Channel {
  puts;
  takes;
  notificator;

  /**
   * Create instance of Channel.
   * @param {EventTargetTransport} notificator Instance of EventTargetTransport.
   */
  constructor (notificator = null) {
    if (notificator && notificator instanceof EventTargetTransport) {
      this.notificator = notificator;
    }
    this.puts = new Queue(this._listener.bind(this));
    this.takes = new Queue(this._listener.bind(this));
  }

  /**
   * Puts value to channel.
   * @param {*} value Element for add in channel.
   */
  put (value) {
    if (value !== undefined) {
      this.puts.put(value);
    }
  }

  /**
   * Takes data from channel.
   * @return {Promise<*>} Returns element from channel.
   */
  async take () {
    return new Promise(resolve => {
      this.takes.put(resolve);
    });
  }

  /**
   * Binds puts to takes.
   */
  _listener () {
    if (this.takes.length && this.puts.length) {
      const take = this.takes.take();
      const put = this.puts.take();
      take(put);
      if (this.notificator) {
        this.notificator.trigger('change');
      }
    }
  }
}
