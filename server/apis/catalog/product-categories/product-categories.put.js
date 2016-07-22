var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {
        var PRODUCT = req.meta.std.product;

        req.check('id', '400_12').isInt();
        if (req.body.categoryName !== undefined) {
            req.check('categoryName', '400_8').len(PRODUCT.minNameLength, PRODUCT.maxNameLength);
        }

        req.utils.common.checkError(req, res, next);
        next();
    };
};

put.update = function () {
    return function (req, res, next) {
        var update = {};

        if (req.body.categoryName !== undefined) {
            update.categoryName = req.body.categoryName
        }

        req.models.AppProductCategory.updateDataById(req.params.id, update, function (status, data) {
            if (status == 200) {
                req.data = data;
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

put.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = put;
