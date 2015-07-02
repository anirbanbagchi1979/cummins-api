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
 | 1.0 30-06-2015 Christopher Karl Chan (A-Team Cloud Solution Architects) CREATED                        |
 |                                                                                                        |
 +=======================================================================================================*/

//Exports
exports.createWorkOrder = createWorkOrder;

exports.getWorkOrder = getWorkOrder;
exports.patchWorkOrder = patchWorkOrder;
exports.getWorkOrders = getWorkOrders;

exports.getMyWorkOrder = getMyWorkOrder;
exports.getMyWorkOrders = getMyWorkOrders;

//Requirements
var ch = require('./cache');
var ut = require('./utilityOperations');
var cf = require('./config.json');

/**
 * Create a new work order
 * @param payload
 * @param sdk
 * @param callback
 */
function createWorkOrder(req, callback) {
    var agg = {};
    ut.getUserCache(req.oracleMobile, agg, function (error, cache, agg) {
        var payload = req.body;
        var updatedCache = cache;
        var orders = updatedCache.workOrders;
        var orderCount = orders.length;
        var newOrderNums = updatedCache.newOrderNums;
        var techs = updatedCache.technicians;
        var jobTypes = updatedCache.jobTypes;
        var newOrder = {};

        if (error) {
            return callback(error, null);
        }
        else if (newOrderNums.length == 0) {
            return callback({
                'Error': 'No more Work orders available',
                'Action': 'Please load more work order numbers'
            }, null);
        }
        else {
            //Choose a random wo
            var orderNum = newOrderNums[0];

            //remove from list
            newOrderNums.splice(newOrderNums.indexOf(orderNum), 1);

            //Alternate technicians
            var t0 = techs[0];
            techs[0] = techs[1];
            techs[1] = t0;
            updatedCache.technicians = techs;

            //Alternate job types
            var jt0 = jobTypes[0];
            jobTypes[0] = jobTypes[1];
            jobTypes[1] = jt0;
            updatedCache.jobTypes = jobTypes;

            //Build new work order
            newOrder = {
                'workOrder': orderNum,
                'serviceWriter': agg.user.fullname,
                'customer': payload.customer,
                "jobType": jobTypes[0],
                'status': "New! Begin Diagnosis",
                'assignedTo': updatedCache.technicians[0],
                'customerComplaint': payload.customerComplaint,
                'esn': payload.esn,
                'mileage': payload.mileage
            };

            //Add hardcoded values as per anirban, some values are duplicated
            newOrder.customers = updatedCache.customers[0];
            newOrder.customers.name = payload.customer

            newOrder.unitEngines = updatedCache.unitEngines[0];
            newOrder.unitEngines.esn = payload.esn,

            newOrder.customerComplaint = updatedCache.customerComplaints[0];
            newOrder.customerComplaint.generalSymptoms = payload.customerComplaint;
            newOrder.customerComplaint.failurePoint = payload.mileage;

            updatedCache.workOrders[orderCount] = newOrder;

            agg.payload = updatedCache;
            ut.updateCache(req.oracleMobile, agg, function (error, result, agg) {
                    callback(error, orderNum);
                }
            );
        }
    });
}

/**
 * Get a work order
 * @param req
 * @param callback
 */
function getWorkOrder(req, callback) {
    var agg = {};
    var result = {};
    ut.getCache(req.oracleMobile, agg, function (error, cache, agg) {
        var order = cache.workOrders.filter(
            function (arg) {
                return arg.workOrder === req.params.workOrderId
            }
        );
        if (order.length > 0) {
            result = order[0];
        }
        callback(error, result);
    });
}

/**
 * Get only the work orders assigned to the current user
 * @param req
 * @param callback
 */
function getMyWorkOrders(req, callback) {
    var result = [];
    var agg = {};
    ut.getUserCache(req.oracleMobile, agg, function (error, cache, agg) {
        var orders = cache.workOrders.filter(
            function (arg) {
                return (arg.assignedTo === agg.user.fullname ? true : false);
            }
        );
        callback(error, orders.length > 0 ? orders : result);
    });
}

/**
 * Get only the work orders assigned to the current user
 * @param req
 * @param callback
 */
function getWorkOrders(req, callback) {
    var result = [];
    var agg = {};
    ut.getCache(req.oracleMobile, agg, function (error, cache, agg) {
        callback(error, cache.workOrders !== undefined && cache.workOrders.length > 0 ? cache.workOrders : result);
    });
}

/**
 * Get a work order assigned to the current user
 * @param req
 * @param callback
 */
function getMyWorkOrder(req, callback) {
    var agg = {};
    var result = {};
    ut.getUserCache(req.oracleMobile, agg, function (error, cache, agg) {
        var order = cache.workOrders.filter(
            function (arg) {
                return arg.workOrder === req.params.workOrderId && arg.assignedTo === agg.user.fullname;
            }
        );
        if (order.length > 0) {
            result = order[0];
        }
        callback(error, result);
    });
}

/**
 * Temporary search function
 * @param workOrderId
 * @param workOrders
 * @returns {number}
 */
function getWoIndex(workOrderId, workOrders) {
    var index = -1;
    for (var i = 0; i < workOrders.length; i++) {
        if (workOrders[i].workOrder === workOrderId) {
            index = i;
            break;
        }
    }
    return index;
}

/**
 * patch a work order
 * @param req
 * @param callback
 */
function patchWorkOrder(req, callback) {
    var payload = req.body;

    var agg = {};

    ut.getCache(req.oracleMobile, agg, function (error, cache, agg) {

        var updatedCache = cache;

        var workOrders = updatedCache.workOrders;

        payload.forEach(function (op) {
            switch (op.op) {
                case 'add':
                    var index = getWoIndex(req.params.workOrderId, workOrders);

                    if (index != -1) {
                        if (op.path === '/workOrders/faultCodes') {
                            updatedCache.workOrders[index].faultCodes = op.value;
                            updatedCache.workOrders[index].dsid = ut.getRandomNumber();
                        }
                        else if (op.path === '/workOrders/edsSolutions') {
                            updatedCache.workOrders[index].edsSolutions = op.value;
                        }
                        break;
                    }
                case 'remove':
                    console.log('remove');
                    break;
                case 'replace':
                    console.log('replace');
                    break;
                default:
                    console.log('do nothing');
            }
        });
        agg.payload = updatedCache;
        ut.updateCache(req.oracleMobile, agg, function (error, result, agg) {
                callback(error, result);
            }
        );
    });
}