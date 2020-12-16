import nodeFetch from 'node-fetch';
import { getProxyForUrl } from 'proxy-from-env';
import { parse } from 'url';
import http from 'http';
import https from 'https';
import tunnelAgent from 'tunnel-agent';

const DefaultOptions = {
    keepAlive: true,
    timeout: 1000,
    keepAliveMsecs: 500,
    maxSockets: 200,
    maxFreeSockets: 5,
    maxCachedSessions: 500,
};

const selectAgentOptions = (options) => {
    const {
        keepAlive,
        timeout,
        keepAliveMsecs,
        maxSockets,
        maxFreeSockets,
        maxCachedSessions,
    } = { ...DefaultOptions, ...options };
    return {
        keepAlive,
        timeout,
        keepAliveMsecs,
        maxSockets,
        maxFreeSockets,
        maxCachedSessions,
    };
};

const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase().concat(string.slice(1));

const parseProxy = (url, proxyurl) => {
    const proxyObject = parse(proxyurl || '');
    const proxyProtocol = proxyObject.protocol.replace(':', '');
    const proxyPort = proxyObject.port || (proxyProtocol === 'https' ? 443 : 80);
    proxyObject.port = proxyPort;
    proxyObject.tunnelMethod = url.protocol.replace(':', '')
        .concat('Over')
        .concat(capitalizeFirstLetter(proxyProtocol));
    return proxyObject;
}

const chooseAgent = (url, options) => (
    url.protocol === 'https:' ? new https.Agent(options) : new http.Agent(options)
);

const buildTunnel = (proxy, options) => tunnelAgent[proxy.tunnelMethod]({
    ...options,
    proxy: {
        port: proxy.port,
        host: proxy.hostname,
        proxyAuth: proxy.auth,
    }});


export default function fetch(url, options) {
    const opts = options || {};
    const AgentOptions = selectAgentOptions(opts);
    const parsedURL = parse(url);
    const proxyurl = getProxyForUrl(parsedURL.href);
    let agent;
    if (proxyurl) {
        const parsedProxyURL = parseProxy(parsedURL, proxyurl);
        if (parsedProxyURL.tunnelMethod.startsWith('httpOver')) {
            parsedURL.path = parsedURL.protocol
                .concat('//')
                .concat(target.host)
                .concat(target.path);
            parsedURL.port = proxyurl.port;
            parsedURL.host = proxyurl.host;
            parsedURL.hostname = proxy.hostname;
            parsedURL.auth = proxy.auth;
            agent = chooseAgent(target, AgentOptions);
        } else {
            agent = buildTunnel(parsedProxyURL, AgentOptions) || chooseAgent(parsedURL, AgentOptions);
        }
    } else {
        agent = chooseAgent(parsedURL, AgentOptions);
    }
    if (opts.signal) {
        opts.signal.addEventListener('abort', () => {
            agent.destroy();
            agent = null;
        });
    }
    return nodeFetch(parsedURL, {
        ...options,
        agent,
    });
}
