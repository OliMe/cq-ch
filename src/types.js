// @flow
export interface Channel {
    on(type: string, callback: Function): void;
    trigger(type: string, payload: Object): void;
}