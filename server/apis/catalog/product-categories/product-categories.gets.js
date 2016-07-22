var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

gets.validate = function () {
    return function (req, res, next) {
        var PRODUCT = req.meta.std.product;

        if (req.query.size === undefined) req.query.size = req.meta.std.common.defaultLoadingLength;

        if (req.query.last !== undefined) {
            req.check('last', '400_5').isInt();
        }
        req.check('size', '400_5').isInt();

        req.utils.common.checkError(req, res, next);
        next();
    };
};

gets.setParam = function () {
    return function (req, res, next) {

        req.models.AppProductCategory.findProductsByOptions(req.query, function (status, data) {
            req.data = data;
            next();
        });
    };
};

gets.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = gets;
