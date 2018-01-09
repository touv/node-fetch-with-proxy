import { parse } from 'url';
import isoFetch from 'isomorphic-fetch';
import tunnelAgent from 'tunnel-agent';
import { getProxyForUrl } from 'proxy-from-env';
import util from 'util';

const debug = util.debuglog('fetch');

function getProxy(url) {

    debug('fetch %s', url);

    const urlObject = parse(url);
    const urlProtocol = urlObject.protocol.replace(':', '');


    const proxyUrl = getProxyForUrl(url);
    if (!proxyUrl) {
        debug('use no proxy');
        return {
            proxy: null,
            url: null,
            method: 'noProxy',
        }
    }

    debug('proxy %s', proxyUrl);

    const proxyObject = parse(proxyUrl || '');
    const proxyProtocol = proxyObject.protocol.replace(':', '');
    const proxyPort = proxyObject.port || (proxyProtocol === 'https' ? 443 : 80);
    proxyObject.port = proxyPort;
    const tunnelMethod = urlProtocol
        .concat('Over')
        .concat(capitalizeFirstLetter(proxyProtocol));

    debug('method %s', tunnelMethod);
    return {
        proxy: proxyObject,
        target: urlObject,
        method : tunnelMethod,
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function fetch(url, options = {}) {

    const { proxy, target, method } = getProxy(url);

    if (method === 'noProxy' || options.agent) {
        return isoFetch(url, options);
    }

    // https://github.com/request/request/blob/b12a6245d9acdb1e13c6486d427801e123fdafae/lib/tunnel.js#L124-L130
    if (method.startsWith('httpOver')) {
        target.path = target.protocol
            .concat('//')
            .concat(target.host)
            .concat(target.path);
        target.port = proxy.port;
        target.host = proxy.host;
        target.hostname = proxy.hostname;
        target.auth = proxy.auth;
        debug('request with no tunnel');
        return isoFetch(target, {
            ...options,
        });
    }

    debug('request with tunnel');
    const tunnel = tunnelAgent[method](Object.assign({
        proxy: {
            port: proxy.port,
            host: proxy.hostname,
            proxyAuth: proxy.auth
        }
    }));
    const agent = tunnel ? {agent : tunnel} : {};

    return isoFetch(url, {
        ...options,
        ...agent,
    });
}

fetch.default = fetch;
export default fetch;
