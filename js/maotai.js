/**
 * @fileoverview Example of HTTP rewrite of request header.
 *
 * @supported Quantumult X (v1.0.5-build188)
 *
 * [rewrite_local]
 * ^https?:\/\/.*?\.moutai519\.com\.cn/.* url script-request-header sample-rewrite-request-header.js
 */

var modifiedHeaders = $request.headers;
modifiedHeaders['MT-APP-Version'] = '1.7.3';

$done({headers : modifiedHeaders});


//^https?:\/\/.*?\.moutai519\.com\.cn/.* url request-header (\r\n)MT-APP-Version:.+(\r\n) request-header $1MT-APP-Version: 1.7.3$2
