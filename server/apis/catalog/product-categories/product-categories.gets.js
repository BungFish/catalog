var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

gets.validate = function () {
    return function (req, res, next) {
        var PRODUCT_CATEGORY = req.meta.std.productCategory;
        var COMMON = req.meta.std.common;
        
        if (req.query.size === undefined) req.query.size = req.meta.std.common.defaultLoadingLength;

        if (req.query.last !== undefined) {
            req.check('last', '400_5').isInt();
        }
        req.check('size', '400_5').isInt();

        if (req.query.orderBy !== undefined) {
            req.check('orderBy').isEnum(PRODUCT_CATEGORY.orderBy);
        } else {
            req.query.orderBy = PRODUCT_CATEGORY.defaultOrderBy
        }
        if (req.query.sort !== undefined) {
            req.check('sort', '400_3').isEnum(COMMON.enumSortTypes);
        } else {
            req.query.sort = COMMON.ASC;
        }

        req.utils.common.checkError(req, res, next);
        next();
    };
};

gets.setParam = function () {
    return function (req, res, next) {

        req.models.AppProductCategory.findProductCategoriesByOption(req.query, function (status, data) {
            if (status == 200) {
                req.data = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

gets.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = gets;
