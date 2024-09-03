import { IframeMessageProxy } from 'iframe-message-proxy';
import * as IMPContainer from '../constants/iframe-message-proxy-container';

const WHATSAPP_RECIPIENT = 'postmaster@wa.gw.msging.net';
const CONFIGURATION_PATH = `/configuration`;
const CONFIGURATION_URL = `lime://${WHATSAPP_RECIPIENT}${CONFIGURATION_PATH}`;

const getWhatsAppConfiguration = async () => {
    try {
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
    } catch (err) {
        return false;
    }
};

export { getWhatsAppConfiguration };
