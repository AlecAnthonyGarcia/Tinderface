import { Dispatcher } from 'flux';

/**
 * This is a basic app dispatcher to be used in your Flux applications.
 * The handleViewAction and handleServerAction are simple implementations
 * for each of those, but they are not required. You can simply dispatch
 * an action directly, but with larger applications this becomes tedious!
 */
class AppDispatcher extends Dispatcher {
    /**
     * Simple implementation to dispatch a view update action
     * @param action
     */
    handleViewAction(action) {
        this.dispatch({
            source: 'VIEW_ACTION',
            action: action
        })
    }

    /**
     * Simple implementation to dispatch a server event action,
     * such as a new socket.io message for example.
     * @param action
     */
    handleServerAction(action) {
        this.dispatch({
            source: 'SERVER_ACTION',
            action: action
        })
    }
}

export default new AppDispatcher();