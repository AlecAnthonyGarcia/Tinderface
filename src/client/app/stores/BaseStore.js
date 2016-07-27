import EventEmitter from 'events';
import AppDispatcher from '../dispatchers/AppDispatcher';

var CHANGE_EVENT = 'CHANGE';

export default class BaseStore extends EventEmitter {

    constructor() {
        this._dispatchToken = null;
    }

    /**
     * Retrieves our dispatch token, in the event a wait is needed
     * for the store to finish it's changes.
     * @returns {null|*}
     */
    get dispatchToken() {
        return this._dispatchToken;
    }

    /**
     * Register's a child store's action list to the app dispatcher.
     * See SampleStore for an example.
     * @param storeActionList
     */
    registerStore(storeActionList) {
        this._dispatchToken = AppDispatcher.register(storeActionList);
    }

    /**
     * Emits a change event, for all listenining callbacks and/or components
     */
    emitChangeEvent() {
        this.emit(this.CHANGE_EVENT);
    }

    /**
     * Adds a change listener to the end of our
     * event emitters callback list.
     * @param callback
     */
    addOnChangeListener(callback) {
        this.on(this.CHANGE_EVENT, callback);
    }

    /**
     * Removes a specified callback from our event
     * emitters callback list.
     * @param callback
     */
    removeOnChangeListener(callback) {
        this.removeListener(this.CHANGE_EVENT, callback);
    }

}