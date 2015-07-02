/**
 * Created by yanni_000 on 26/06/2015.
 */
/**
 * Created by yanni_000 on 05/05/2015.
 */

var cacheEndpoint = "/mobile/platform/storage/collections/css/objects/";
var userEndpoint = "/mobile/platform/users/~";

exports.getCache = function (obj, sdk, callback) {
    var handler = function (error, response, body) {
        if (error != null && error != undefined) {
            callback(error, null);
        }
        else {
            callback(null, body);
        }
    };
    var optionsList = {};
    optionsList.headers = {"content-type": "application/json"};
    optionsList.uri = cacheEndpoint + obj;
    sdk.rest.get(optionsList, handler);
};

exports.getUserDetails = function (sdk, callback) {
    var handler = function (error, response, body) {
        if (error != null && error != undefined) {
            callback(error, null);
        }
        else {
            callback(null, body);
        }
    };
    var optionsList = {};
    optionsList.headers = {"content-type": "application/json"};
    optionsList.uri = userEndpoint;
    sdk.rest.get(optionsList, handler);
};

exports.updateCache = function (payload, obj, sdk, callback) {
    var handler = function (error, response, body) {
        if (error != null && error != undefined) {
            callback(error, null);
        }
        else {
            callback(null, payload);
        }
    };

    var optionsList = {};
    optionsList.headers = {"content-type": "application/json"};
    optionsList.body = JSON.stringify(payload);
    optionsList.uri = cacheEndpoint + obj;
    sdk.rest.put(optionsList, handler);
};
