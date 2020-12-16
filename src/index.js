import nodeFetch from 'node-fetch';
import { getProxyForUrl } from 'proxy-from-env';
import http from 'http';
import https from 'https';
import { Agent } from 'better-https-proxy-agent';

const DefaultOptions = {
    keepAlive: true,
    timeout: 1000,
    keepAliveMsecs: 500,
    maxSockets: 200,
    maxFreeSockets: 5,
    maxCachedSessions: 500,
};
const chooseAgent = (parsedURL, options) => {
    const proxyurl = getProxyForUrl(parsedURL.href);
    if (proxyurl) {
        const proxyRequestOptions = new URL(proxyurl);
        return new Agent(options, proxyRequestOptions);
    }
    if (parsedURL.protocol === 'https:') {
        return new https.Agent(options);
    }
    return new http.Agent(options);
};

export default function fetch(url, options) {
    const opts = options || {};
    const {
        keepAlive,
        timeout,
        keepAliveMsecs,
        maxSockets,
        maxFreeSockets,
        maxCachedSessions,
    } = { ...options, ...DefaultOptions };

    let agent = chooseAgent(new URL(url), {
        keepAlive,
        timeout,
        keepAliveMsecs,
        maxSockets,
        maxFreeSockets,
        maxCachedSessions,
    });
    opts.agent = agent;
    if (opts.signal) {
        opts.signal.addEventListener('abort', () => {
            agent.destroy();
            agent = null;
        });
    }
    return nodeFetch(url, options);
}
