function isMobile() {
    /**
     * Source: developer.mozilla.org
     * Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
     */
    if ("maxTouchPoints" in navigator) {
        return navigator.maxTouchPoints > 0;
    }
    if ("msMaxTouchPoints" in navigator) {
        return navigator.msMaxTouchPoints > 0;
    }

    let mQ = window.matchMedia && matchMedia("(pointer:coarse)");
    if (mQ && mQ.media === "(pointer:coarse)") {
        return !!mQ.matches;
    }

    if ('orientation' in window) {
        return true;
    }

    // Only as a last resort, fall back to user agent sniffing
    return /\b(BlackBerry|webOS|iPhone|IEMobile|Android|Windows Phone|iPad|iPod)\b/i.test(navigator.userAgent);
}

var SUPPORTED_BROWSER_VERSION = [
    { browserName: "Chrome", name: 'chrome', version: 54 },
    { browserName: "Chromium", name: 'chromium', version: 54 },
    { browserName: "Edge", name: 'edg', version: 79 },
    { browserName: "Firefox", name: 'firefox', version: 63 },
    { browserName: "Safari", name: 'safari', version: 10.1 },
    { browserName: "Opera", name: 'opr', version: 41 }
];

var MOST_USED_MOBILE_BROWSERS = [
    "Android Browser",
    "Chrome for Android",
    "Firefox for Android",
    "iOS Safari"
];

function isBrowserSupported() {
    let userAgent = window.navigator.userAgent.toLowerCase();

    let browserSupported = SUPPORTED_BROWSER_VERSION.filter(function(type) {
        if (userAgent.indexOf(type.name) > -1) {
            let version = userAgent.substr(userAgent.indexOf(type.name) + type.name.length + 1, 4);
            return parseInt(version) >= type.version;
        }

        return false;
    });

    return browserSupported.length > 0;
}

function isWebCompSupported() {
    return isMobile() || isBrowserSupported();
}

document.addEventListener("DOMContentLoaded", function() {
    if (isWebCompSupported()) {
        return;
    }

    (function(arr) {
        arr.forEach(function(item) {
            if (item.hasOwnProperty('append')) {
                return;
            }
            Object.defineProperty(item, 'append', {
                configurable: true,
                enumerable: true,
                writable: true,
                value: function append() {
                    var argArr = Array.prototype.slice.call(arguments),
                        docFrag = document.createDocumentFragment();

                    argArr.forEach(function(argItem) {
                        var isNode = argItem instanceof Node;
                        docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
                    });

                    this.appendChild(docFrag);
                }
            });
        });
    })([Element.prototype, Document.prototype, DocumentFragment.prototype]);

    var div = document.createElement('div');
    div.className = 'browser-support';

    var h1 = document.createElement('h1');
    h1.textContent = 'Your browser does not support Web Components!';

    var h3 = document.createElement('h3');
    h3.textContent = 'See below the accepted browsers and versions.';

    var ul = document.createElement('ul');
    SUPPORTED_BROWSER_VERSION.forEach(function(type) {
        var li = document.createElement('li');
        li.innerHTML = "<strong>" + type.browserName + "</strong> - at least version " + type.version;

        ul.append(li);
    });

    MOST_USED_MOBILE_BROWSERS.forEach(function(browserName) {
        var li = document.createElement('li');
        li.innerHTML = "<strong>" + browserName + "</strong> - up to date";

        ul.append(li);
    });

    div.append(h1, h3, ul);

    document.body.innerHTML = div.outerHTML;
});