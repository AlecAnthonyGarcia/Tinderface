import BaseStore from './BaseStore';
import SampleConstants from '../constants/SampleConstants';

class SampleStore extends BaseStore {
    constructor() {
        this._item = null;   // some arbritary item(s) that are associated with our store
        this.registerStore(this._actionList.bind(this))
    }

    _actionList(payload) {
        var action = payload.action;    // 'VIEW_ACTION' or 'SERVER_ACTION'

        switch (action.actionType) {
            case SampleConstants.SAMPLE_EVENT_ID:
                this._item = payload.item;
                this.emitChangeEvent(); // notify our callbacks that our state
                                        // has or should change
                break;
            default:
                break;
        }
    }

    get item() {
        return this.item;
    }
}

export default new SampleStore();