var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

gets.validate = function () {
    return function (req, res, next) {
        var PRODUCT = req.meta.std.product;

        if (req.query.size === undefined) req.query.size = req.meta.std.common.defaultLoadingLength;
        if (req.query.orderBy === undefined) req.query.orderBy = PRODUCT.defaultOrderBy;

        if (req.query.last !== undefined) {
            req.check('last', '400_5').isInt();
        }

        req.check('size', '400_5').isInt();

        if (req.query.orderBy !== undefined) {
            req.check('orderBy', '400_3').isEnum(PRODUCT.orderBy);
        }
        if (req.query.productName !== undefined) {
            req.check('productName', '400_8').len(PRODUCT.minNameLength, PRODUCT.maxNameLength);
        }
        if (req.query.productCategory !== undefined) {
            req.check('productCategory', '400_12').isInt();
        }
        if (req.query.manufacturer !== undefined) {
            req.check('manufacturer', '400_8').len(PRODUCT.minManufacturerLength, PRODUCT.maxManufacturerLength);
        }

        req.utils.common.checkError(req, res, next);
        next();
    };
};

gets.setParam = function () {
    return function (req, res, next) {

        req.models.AppProduct.findProductsByOptions(req.query, function (status, data) {
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
