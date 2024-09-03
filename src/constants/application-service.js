import { IframeMessageProxy } from 'iframe-message-proxy';
import * as IMPActions from './iframe-message-proxy-actions';
import * as IMPContainer from './iframe-message-proxy-container';
// import env from '../config/appsettings.json';

// const CONFIGURATION_URL = `${env.blip.commands_url}/configuration`;
const BUILDER_CONTEXT_VARIABLES_URL = `/contexts`;
const CONTACTS_PATH = `/contacts`;
const THREADS_PATH = `/threads`;
const POST_TYPE = 'application/json';
const ANALYTICS_WEBHOOKS_URI = `lime://postmaster@analytics.msging.net/configuration`;
const JSON_TYPE = 'application/json';
const WEBHOOK_URLS_KEY = 'Webhook.Url';
const WEBHOOK_IS_VALID_KEY = 'Webhook.IsValid';

const getApplicationData = async (full_identity = null) => {
    const { response: application } = await IframeMessageProxy.sendMessage({
        action: IMPActions.get_application,
        content: full_identity
    });
    return application;
};

const getConfigurationData = async () => {
    const { response } = await IframeMessageProxy.sendMessage({
        action: IMPContainer.Actions.send_command,
        content: {
            command: {
                method: IMPContainer.CommandMethods.GET,
                uri: CONFIGURATION_URL
            }
        }
    });

    return response;
};

const getContactContextVariables = async (identity) => {
    const { response } = await IframeMessageProxy.sendMessage({
        action: IMPContainer.Actions.send_command,
        content: {
            command: {
                method: IMPContainer.CommandMethods.GET,
                uri: `${BUILDER_CONTEXT_VARIABLES_URL}/${identity}`
            }
        }
    });
    return response;
};

const setContactContextVariable = async (
    identity,
    variableName,
    variableValue
) => {
    const { response } = await IframeMessageProxy.sendMessage({
        action: IMPContainer.Actions.send_command,
        content: {
            command: {
                method: IMPContainer.CommandMethods.SET,
                uri: `${BUILDER_CONTEXT_VARIABLES_URL}/${identity}/${variableName}`,
                type: 'text/plain',
                resource: variableValue
            }
        }
    });
    return response;
};

const deleteContactContextVariable = async (identity, variableName) => {
    const { response } = await IframeMessageProxy.sendMessage({
        action: IMPContainer.Actions.send_command,
        content: {
            command: {
                method: IMPContainer.CommandMethods.DELETE,
                uri: `${BUILDER_CONTEXT_VARIABLES_URL}/${identity}/${variableName}`
            }
        }
    });
    return response;
};

const getContactContextVariableValue = async (identity, variableName) => {
    const { response } = await IframeMessageProxy.sendMessage({
        action: IMPContainer.Actions.send_command,
        content: {
            command: {
                method: IMPContainer.CommandMethods.GET,
                uri: `${BUILDER_CONTEXT_VARIABLES_URL}/${identity}/${variableName}`
            }
        }
    });
    return response;
};

const getBucketDocument = async (bucketId) => {
    const { response } = await IframeMessageProxy.sendMessage({
        action: IMPContainer.Actions.send_command,
        content: {
            command: {
                method: IMPContainer.CommandMethods.GET,
                uri: `/buckets/${bucketId}`
            }
        }
    });
    return response;
};

const setBucketDocument = async (bucketId, type, customDocument) => {
    const { response } = await IframeMessageProxy.sendMessage({
        action: IMPContainer.Actions.send_command,
        content: {
            command: {
                method: IMPContainer.CommandMethods.SET,
                uri: `/buckets/${bucketId}`,
                type,
                resource: customDocument
            }
        }
    });
    return response;
};

const getMediaUploadUrl = async () => {
    const { response } = await IframeMessageProxy.sendMessage({
        action: IMPContainer.Actions.send_command,
        content: {
            command: {
                method: IMPContainer.CommandMethods.GET,
                uri: '/upload-media-uri',
                to: "postmaster@media.msging.net"
            }
        }
    });
    return response;
};

const setConfigurationData = async (payload) => {
    const { response } = await IframeMessageProxy.sendMessage({
        action: IMPContainer.Actions.send_command,
        content: {
            command: {
                method: IMPContainer.CommandMethods.SET,
                uri: CONFIGURATION_URL,
                type: POST_TYPE,
                resource: payload
            }
        }
    });

    return response;
};

const getCurrentLanguage = async () => {
    const { response } = await IframeMessageProxy.sendMessage({
        action: IMPContainer.Actions.get_current_language
    });

    return response;
};

const getContacts = async () => {
    const {
        response: { items }
    } = await IframeMessageProxy.sendMessage({
        action: IMPContainer.Actions.send_command,
        content: {
            destination: IMPContainer.Destinations.messaging_hub_service,
            command: {
                method: IMPContainer.CommandMethods.GET,
                uri: CONTACTS_PATH
            }
        }
    });

    return items;
};

const getThreads = async () => {
    const {
        response: { items }
    } = await IframeMessageProxy.sendMessage({
        action: IMPContainer.Actions.send_command,
        content: {
            destination: IMPContainer.Destinations.messaging_hub_service,
            command: {
                method: IMPContainer.CommandMethods.GET,
                uri: THREADS_PATH
            }
        }
    });

    return items;
};

const getAnalyticsWebhooks = async () => {
    const { response } = await IframeMessageProxy.sendMessage({
        action: IMPContainer.Actions.send_command,
        content: {
            destination: IMPContainer.Destinations.messaging_hub_service,
            command: {
                method: IMPContainer.CommandMethods.GET,
                uri: ANALYTICS_WEBHOOKS_URI
            }
        }
    });

    return response;
};

const setAnalyticsWebhooks = async (resource) => {
    const { response } = await IframeMessageProxy.sendMessage({
        action: IMPContainer.Actions.send_command,
        content: {
            destination: IMPContainer.Destinations.messaging_hub_service,
            command: {
                method: IMPContainer.CommandMethods.SET,
                uri: ANALYTICS_WEBHOOKS_URI,
                type: JSON_TYPE,
                resource
            }
        }
    });

    return response;
};

const addAnalyticsWebhooks = async (url) => {
    let currentWebhooks = '';
    let webhookSettings = {};
    let newWebhooks = '';
    try {
        webhookSettings = await getAnalyticsWebhooks();
        currentWebhooks = webhookSettings[WEBHOOK_URLS_KEY];
    } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('Analytics Webhooks configuration not found');
    }

    if (currentWebhooks && currentWebhooks.indexOf(url) === -1) {
        newWebhooks = `${currentWebhooks.trim()};${url}`;
    } else {
        newWebhooks = url;
    }

    const resource = {
        ...webhookSettings,
        [WEBHOOK_URLS_KEY]: newWebhooks,
        [WEBHOOK_IS_VALID_KEY]: true
    };

    await setAnalyticsWebhooks(resource);
};

const deleAnalyticsWebhooks = async (url) => {
    let currentWebhooks = '';
    let webhookSettings = {};
    let newWebhooks = '';
    try {
        webhookSettings = await getAnalyticsWebhooks();
        currentWebhooks = webhookSettings[WEBHOOK_URLS_KEY];
    } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('Analytics Webhooks configuration not found');
    }

    if (currentWebhooks && currentWebhooks.indexOf(url) === -1) {
        newWebhooks = currentWebhooks.trim().replace(`${url};`, '');
        newWebhooks = newWebhooks.replace(`${url}`, '');
    }

    const resource = {
        ...webhookSettings,
        [WEBHOOK_URLS_KEY]: newWebhooks,
        [WEBHOOK_IS_VALID_KEY]: webhookSettings[WEBHOOK_IS_VALID_KEY]
    };

    await setAnalyticsWebhooks(resource);
};

export const setOwnerConfiguration = async (ownerIdentity, configurations) => {
    const { response } = await IframeMessageProxy.sendMessage({
        action: IMPContainer.Actions.send_command,
        content: {
            command: {
                method: IMPContainer.CommandMethods.SET,
                uri: `lime://${ownerIdentity}/configuration`,
                type: POST_TYPE,
                resource: configurations
            }
        }
    });

    return response;
};

export {
    getApplicationData,
    getConfigurationData,
    setConfigurationData,
    getCurrentLanguage,
    getContacts,
    getThreads,
    getContactContextVariables,
    getContactContextVariableValue,
    setContactContextVariable,
    setBucketDocument,
    getBucketDocument,
    deleteContactContextVariable,
    addAnalyticsWebhooks,
    getAnalyticsWebhooks,
    setAnalyticsWebhooks,
    deleAnalyticsWebhooks,
    getMediaUploadUrl
};
