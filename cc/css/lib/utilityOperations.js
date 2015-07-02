/*========================================================================================================+
 | Copyright (c) 2008, 2015, Oracle and/or its affiliates. All rights reserved.                           |
 +========================================================================================================+
 |                                                                                                        |
 |                                                                                                        |
 | Provided on an 'as is' basis, without warranties or conditions of any kind, either express or implied, |
 | including, without limitation, any warranties or conditions of title, non-infringement,                |
 | merchantability, or fitness for a particular purpose. You are solely responsible for determining the   |
 | appropriateness of using and assume any risks. You may not redistribute.                               |
 |                                                                                                        |
 | Please refer to http://www.ateam-oracle.com/a-team-chronicles for details                              |
 |                                                                                                        |
 | HISTORY                                                                                                |
 | 1.0 01-07-2015 Christopher Karl Chan (A-Team Cloud Solution Architects) CREATED                        |
 |                                                                                                        |
 +=======================================================================================================*/
//Exports
exports.wrap = wrap;
exports.getCache = getCache;
exports.getUserCache = getUserCache;
exports.updateCache = updateCache;
exports.getAuthenticatedUser = getAuthenticatedUser;
exports.getRandomNumber = getRandomNumber;

//Requirements
var cf = require('./config.json');
var endpoints = require("./endpoints.json");
var async = require('async');

/**
 * Get the cache from the MCS store
 * @param req
 * @param callback
 */
function getCache(sdk, agg, callback) {
    var functions = [
        wrap(getStorageCache, sdk, agg)
    ];
    async.series(functions, function (error, result) {
        callback(error, JSON.parse(agg.result), agg);
    })
}

/**
 * Get the cache from the MCS store
 * @param req
 * @param callback
 */
function getUserCache(sdk, agg, callback) {
    var functions = [
        wrap(getAuthenticatedUser, sdk, agg),
        wrap(getStorageCache, sdk, agg)
    ];
    async.series(functions, function (error, result) {
        callback(error, JSON.parse(agg.result), agg);
    })
}

/**
 * Wrapper function
 * @param functionToWrap
 * @param sdk
 * @param agg
 * @returns {Function}
 */
function wrap(functionToWrap, sdk, agg) {
    return function (callback) {
        return functionToWrap(agg, sdk, callback);
    }
};

/**
 * Get the json from the MCS storage cache
 * @param req
 * @param agg
 * @param sdk
 * @param callback
 */
function getStorageCache(agg, sdk, callback) {
    var handler = function (error, response, body) {
        if (error != null && error != undefined) {
            callback(error, null);
        }
        else {
            agg.result = body;
            callback(null, null);
        }
    };
    var optionsList = {};

    optionsList.headers = cf.jsonType;
    optionsList.uri = endpoints.cacheCOLLECTION + cf.mock;

    sdk.rest.get(optionsList, handler);
};

/**
 * Gets the currently authenticated user
 * @param agg
 * @param sdk
 * @param callback
 */
function getAuthenticatedUser(agg, sdk, callback) {

    var handler = function (error, response, body) {
        if (error != null && error != undefined) {
            callback(error, null);
        }
        else {
            agg.user = JSON.parse(body);
            agg.user.fullname = agg.user.firstName + " " + agg.user.lastName;
            return callback(null, null);
        }
    };

    var optionsList = {};
    optionsList.headers = cf.jsonType;
    optionsList.uri = endpoints.platformAPI + 'users/~';
    sdk.rest.get(optionsList, handler);
};

/**
 * Update the MCS cache
 * @param agg
 * @param sdk
 * @param callback
 */
function updateCache(sdk, agg, callback) {

    var optionsList = {};
    optionsList.headers = cf.jsonType;
    optionsList.body = JSON.stringify(agg.payload);
    optionsList.uri = endpoints.cacheCOLLECTION + cf.mock;

    sdk.rest.put(optionsList, function (error, response, body) {
        if (error != null && error != undefined) {
            callback(error, null);
        }
        else {
            agg.result = body;
            callback(null, body);
        }
    });
};

/**
 * Get a random number
 * @param max
 * @returns {number}
 */
function getRandomNumber(max){
   var m = 9999;
    if(max != undefined){
       m = max;
   }
    return Math.floor((Math.random() * m) + 1);
}








