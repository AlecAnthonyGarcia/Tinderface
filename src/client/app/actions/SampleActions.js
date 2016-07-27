import AppDispatcher from '../dispatchers/AppDispatcher';
import SampleConstants from '../constants/SampleConstants';

class SampleActions {
    /**
     * Sample action to set our store's item value to a specified item
     * @param item
     */
    setItem(item) {
        AppDispatcher.handleViewAction({
            actionType: SampleConstants.SAMPLE_EVENT_ID,
            item: item  // passes our 'item' to become our new item in our store
        })
    }
}

export default new SampleActions();