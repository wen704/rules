/**
 * @fileoverview Example of HTTP rewrite of request header.
 *
 * @supported Quantumult X (v1.0.5-build188)
 *
 * [rewrite_local]
 * ^https://.*.maotai519.com.cn/ url script-request-header sample-rewrite-request-header.js
 */

var modifiedHeaders = $request.headers;
modifiedHeaders['MT-APP-Version'] = '1.7.3';

$done({headers : modifiedHeaders});