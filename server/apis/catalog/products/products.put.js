var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {
        var PRODUCT = req.meta.std.product;

        req.check('id', '400_12').isInt();
        if (req.body.productName !== undefined) {
            req.check('productName', '400_8').len(PRODUCT.minNameLength, PRODUCT.maxNameLength);
        }

        if (req.body.description !== undefined) {
            req.check('description', '400_8').len(PRODUCT.minNameLength, PRODUCT.maxNameLength);
        }

        if (req.body.manufacturer !== undefined) {
            req.check('manufacturer', '400_8').len(PRODUCT.minManufacturerLength, PRODUCT.maxManufacturerLength);
        }
        if (req.body.price !== undefined) {
            req.check('price', '400_5').isInt();
        }
        if (req.body.productCategoryId !== undefined) {
            req.check('productCategoryId', '400_12').isInt();
        }
        if (req.body.imageIds !== undefined) {
            req.check('imageIds', '400_12').isNumberIds(PRODUCT.maxImageCount);
            req.body.imageIds = req.body.imageIds.split(",");
        }

        req.utils.common.checkError(req, res, next);
        next();
    };
};

put.update = function () {
    return function (req, res, next) {
        var update = {};

        if (req.body.productName !== undefined) {
            update.productName = req.body.productName
        }
        if (req.body.description !== undefined) {
            update.description = req.body.description
        }
        if (req.body.manufacturer !== undefined) {
            update.manufacturer = req.body.manufacturer
        }
        if (req.body.price !== undefined) {
            update.price = req.body.price
        }
        if (req.body.productCategoryId !== undefined) {
            update.productCategoryId = req.body.productCategoryId
        }
        if (req.body.imageIds !== undefined) {
            update.imageIds = req.body.imageIds
        }

        req.models.AppProduct.updateProduct(req.params.id, update, function (status, data) {
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
