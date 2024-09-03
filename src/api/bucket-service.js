import { IframeMessageProxy } from 'iframe-message-proxy';
import * as IMPActions from '../constants/iframe-message-proxy-actions';
import * as IMPContainer from '../constants/iframe-message-proxy-container';

const POST_TYPE = 'application/json';
const BUCKETS_PATH = `/buckets`;

const getBucketVariable = async (variable) => {
    try {
        const { response } = await IframeMessageProxy.sendMessage({
            action: IMPActions.send_command,
            content: {
                destination: IMPContainer.Destinations.messaging_hub_service,
                command: {
                    method: IMPContainer.CommandMethods.GET,
                    uri: `${BUCKETS_PATH}/${variable}`
                }
            }
        });

        return response;
    } catch (err) {
        return false;
    }
};

const storeBucketVariable = async (variable, resource = {}) => {
    const { response } = await IframeMessageProxy.sendMessage({
        action: IMPActions.send_command,
        content: {
            destination: IMPContainer.Destinations.messaging_hub_service,
            command: {
                method: IMPContainer.CommandMethods.SET,
                uri: `${BUCKETS_PATH}/${variable}`,
                type: POST_TYPE,
                resource
            }
        }
    });

    return response;
};

export { getBucketVariable, storeBucketVariable };
