import settings from '../config';

const init = () => {
    window.analytics.load(settings.segment.key);
};

const toKebabCase = (str) =>
    str &&
    str
        .match(
            /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
        )
        .map((x) => x.toLowerCase())
        .join('-');

const trackEvent = (
    event = '',
    properties = {},
    options = {},
    callback = () => { }
) => {
    event = `${settings.segment.prefix}-${event}`;
    window.analytics.track(event, properties, options, callback);
};

const trackPage = (
    name = '',
    properties = {},
    options = {},
    callback = () => { }
) => trackEvent(`page-${toKebabCase(name)}`, properties, options, callback);

const trackForm = (form, event = '', properties = {}) => {
    event = `${settings.segment.prefix}-${event}`;
    window.analytics.trackForm(form, event, properties);
};

const trackLink = (element, event = '', properties = {}) => {
    event = `${settings.segment.prefix}-${event}`;
    window.analytics.trackLink(element, event, properties);
};

const trackUser = (
    user_id = '',
    traits = {},
    options = {},
    callback = () => { }
) => {
    window.analytics.identify(user_id, traits, options, callback);
};

export { init, trackPage, trackEvent, trackForm, trackLink, trackUser };



