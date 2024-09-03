import API from '../factory/api';

const sendNotification = async (params) => {
    const api = API('v1');
    const { data } = await api.post('/Notification', params);
    return data;
};

const broadcastNotificationCsv = async (body, params) => {
    const api = API('v2');
    const { data } = await api.post('/Broadcast/csv', body, { params });
    return data;
};

const broadcastNotificationList = async (params) => {
    const api = API('v2');
    const { data } = await api.post('/Broadcast/list', params);
    return data;
};

const getBotStates = async (params) => {
    const api = API('v2');
    const { data } = await api.get('/Flow/states', { headers: params });
    return data;
};

export {
    sendNotification,
    broadcastNotificationCsv,
    broadcastNotificationList,
    getBotStates
};
