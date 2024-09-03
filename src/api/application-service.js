import { IframeMessageProxy } from 'iframe-message-proxy';
import * as IMPActions from '../constants/iframe-message-proxy-actions';
import * as IMPContainer from '../constants/iframe-message-proxy-container';
import { filterPromiseArray } from '../utils/objects';

const PORTAL_RECIPIENT = 'postmaster@portal.blip.ai';
const WHATSAPP_RECIPIENT = 'postmaster@wa.gw.msging.net';
const PHONE_DETAILS_PATH = `/phone-number-details`;
const TEMPLATES_PATH = `/message-templates?status=APPROVED`;
const WHATSAPP_ACCOUNT_PATH = `/whatsapp-business-account`;
const APPLICATIONS_PATH = `/applications`;
const DELAY = 8000; // 8s

const promiseTimeout = (ms, promise) => {
    const timeout = new Promise((resolve, reject) => {
        const timeout_id = setTimeout(() => {
            clearTimeout(timeout_id);
            reject(new Error('Request timed out'));
        }, ms);
    });

    // Returns a race between timeout and the passed in promise
    return Promise.race([promise, timeout]);
};

const getApplicationData = async (full_identity = null) => {
    const { response: application } = await IframeMessageProxy.sendMessage({
        action: IMPActions.get_application,
        content: full_identity
    });

    return application;
};

const getAllowedSubbots = async (identity) => {
    const { response } = await IframeMessageProxy.sendMessage({
        action: IMPActions.send_command,
        content: {
            destination: IMPContainer.Destinations.blip_service,
            command: {
                method: IMPContainer.CommandMethods.GET,
                to: PORTAL_RECIPIENT,
                uri: `${APPLICATIONS_PATH}/${identity}`
            }
        }
    });

    const data = { ...response, identity };

    return data;
};

const getSubbotsData = async (application) => {
    const {
        applicationJson: { settings, identifier }
    } = application;

    if (!!settings && settings.children) {
        const { children } = settings;

        const identities = children.map((bot) => bot.identity);
        const get_allowed_promises = identities.map((identity) =>
            getAllowedSubbots(identity)
        );
        const allowed_promises_result = await Promise.allSettled(
            get_allowed_promises
        );
        const allowed_subbots = filterPromiseArray(allowed_promises_result);

        if (!!allowed_subbots) {
            const allowed_identities = allowed_subbots.map(
                (bot) => bot.identity
            );

               
            const promises = allowed_identities.map((identity) =>
                identifier === 'energisamatogrossoemtprd'
                    ? promiseTimeout(DELAY, getApplicationData(identity))
                    : getApplicationData(identity)
            );

            const promises_result = await Promise.allSettled(promises);
            const subbots_application = filterPromiseArray(promises_result);

            return subbots_application;
        }
    }
    return false;
};

const getCurrentLanguage = async () => {
    const { response } = await IframeMessageProxy.sendMessage({
        action: IMPActions.get_current_language
    });

    return response;
};

const getPhoneDetails = async () => {
    const { response } = await IframeMessageProxy.sendMessage({
        action: IMPActions.send_command,
        content: {
            command: {
                method: IMPContainer.CommandMethods.GET,
                uri: PHONE_DETAILS_PATH,
                to: WHATSAPP_RECIPIENT
            }
        }
    });

    return response;
};

const getTemplates = async () => {
    const { response } = await IframeMessageProxy.sendMessage({
        action: IMPActions.send_command,
        content: {
            command: {
                method: IMPContainer.CommandMethods.GET,
                uri: TEMPLATES_PATH,
                to: WHATSAPP_RECIPIENT
            }
        }
    });

    return response;
};

const getWhatsAppAccount = async () => {

    try {

        const { response } = await IframeMessageProxy.sendMessage({
            action: IMPActions.send_command,
            content: {
                command: {
                    method: IMPContainer.CommandMethods.GET,
                    to: WHATSAPP_RECIPIENT,
                    uri: WHATSAPP_ACCOUNT_PATH
                }
            }
        });
        return response;
    }catch (e) {

       return {currency:'', id:'', message_template_namespace:'', name:'', timezone_id:''}
    }

   
};

const createAuthorizationKey = (identifier, access_key) => {
    const encoded = btoa(`${identifier}:${atob(access_key)}`);
    return `Key ${encoded}`;
};

export {
    getApplicationData,
    getAllowedSubbots,
    getSubbotsData,
    getCurrentLanguage,
    getPhoneDetails,
    getTemplates,
    getWhatsAppAccount,
    createAuthorizationKey
};
