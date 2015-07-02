var cache = require("./lib/cache");
var cssOp = require("./lib/cssOperations");
var mock = "mock.json";

module.exports = function (service) {

    service.post('/mobile/custom/css/jobs', function (req, res) {
        res.send({status: "OK"});
        res.end();
    });

    service.get('/mobile/custom/css/jobs', function (req, res) {
        cache.getCache(mock, req.oracleMobile, function (err, data) {
            if (err) {
                res.status(500);
                res.send(err);
                res.end();
            }
            else {
                var obj = JSON.parse(data);
                res.send(obj.jobs);
                res.end();
            }
        });
    });

    service.get('/mobile/custom/css/user/jobs', function (req, res) {
        cache.getCache(mock, req.oracleMobile, function (err, data) {
            if (err) {
                res.status(500);
                res.send(err);
                res.end();
            }
            else {
                var obj = JSON.parse(data);
                var jobs = obj.jobs;
                cache.getUserDetails(req.oracleMobile, function (e, d) {
                    var user = (JSON.parse(d));
                    var name = user.firstName + " " + user.lastName;
                    console.log("Name: " + name);
                    var result = jobs.filter(function (el) {
                        return el.assignedTo == name;
                    });
                    res.send(result);
                    res.end();
                })
            }
        });
    });

    service.get('/mobile/custom/css/news', function (req, res) {
        cache.getCache(mock, req.oracleMobile, function (err, data) {
            if (err) {
                res.status(500);
                res.send(err);
                res.end();
            }
            else {
                var obj = JSON.parse(data);
                res.send(obj.news);
                res.end();
            }
        });
    });

    service.put('/mobile/custom/css/workOrders/:workOrderId', function (req, res) {
        var result = {};
        res.send(200, result);
    });

    service.get('/mobile/custom/css/workOrders/:workOrderId', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        cssOp.getWorkOrder(req, function (error, result) {
            if (error) {
                res.send(500, error);
            } else {
                res.send(200, result);
            }
            res.end();
        });
    });

    service.post('/mobile/custom/css/workOrders', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        cssOp.createWorkOrder(req, function (error, result) {
            if (error) {
                res.send(500, error);
            } else {
                res.send(201, {status: "Created",workOrder: result});
            }
            res.end();
        });
    });

    service.get('/mobile/custom/css/workOrders', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        cssOp.getWorkOrders(req, function (error, result) {
            if (error) {
                res.send(500, error);
            } else {
                res.send(200, result);
            }
            res.end();
        });
    });

    service.get('/mobile/custom/css/myWorkOrders', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        cssOp.getMyWorkOrders(req, function (error, result) {
            if (error) {
                res.send(500, error);
            } else {
                res.send(200, result);
            }
            res.end();
        });
    });

    service.get('/mobile/custom/css/myWorkOrders/:workOrderId', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        cssOp.getMyWorkOrder(req, function (error, result) {
            if (error) {
                res.send(500, error);
            } else {
                res.send(200, result);
            }
            res.end();
        });
    });

    service.patch('/mobile/custom/css/workOrders/:workOrderId', function(req,res) {
        res.setHeader('Content-Type', 'application/json');
        cssOp.patchWorkOrder(req, function (error, result) {
            if (error) {
                res.send(500, error);
            } else {
                res.send(201, {status: "Updated"});
            }
            res.end();
        });
    });

    service.post('/mobile/custom/css/workOrders/:workOrderId/insite', function(req,res) {
        res.setHeader('Content-Type', 'application/json');
        cssOp.patchWorkOrder(req, function (error, result) {
            if (error) {
                res.send(500, error);
            } else {
                res.send(201, {status: "Updated"});
            }
            res.end();
        });
    });
};
