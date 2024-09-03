import { IframeMessageProxy } from 'iframe-message-proxy';
import * as IMPConstants from '../constants/iframe-message-proxy-container';
import * as toastTypes from '../constants/blip-portal-toast-types';

const startLoading = () =>
    IframeMessageProxy.sendMessage({
        action: IMPConstants.Actions.start_loading
    });

const stopLoading = () =>
    IframeMessageProxy.sendMessage({
        action: IMPConstants.Actions.stop_loading
    });

const setHeight = (height) =>
    IframeMessageProxy.sendMessage({
        action: IMPConstants.Actions.height_change,
        content: height
    });

const showToast = (type, message, title) =>
    IframeMessageProxy.sendMessage({
        action: IMPConstants.Actions.toast,
        content: {
            type: toastTypes[type],
            title,
            message
        }
    });

const showModal = (title, body, confirm = 'ok', cancel = 'cancel') =>
    IframeMessageProxy.sendMessage({
        action: IMPConstants.Actions.show_modal,
        content: {
            title,
            body,
            confirm,
            cancel
        }
    });

const withLoading = async (func) => {
    startLoading();
    try {
        return await func();
    } finally {
        stopLoading();
    }
};

export {
    startLoading,
    stopLoading,
    setHeight,
    showToast,
    withLoading,
    showModal
};
