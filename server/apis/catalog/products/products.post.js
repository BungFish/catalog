var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {
        var PRODUCT = req.meta.std.product;

        req.check('productName', '400_8').len(PRODUCT.minNameLength, PRODUCT.maxNameLength);

        if (req.body.description !== undefined) {
            req.check('description', '400_8').len(PRODUCT.minNameLength, PRODUCT.maxNameLength);
        }

        req.check('manufacturer', '400_8').len(PRODUCT.minManufacturerLength, PRODUCT.maxManufacturerLength);
        req.check('price', '400_5').isInt();
        req.check('productCategoryId', '400_12').isInt();
        req.check('imageIds', '400_12').isNumberIds(PRODUCT.maxImageCount);
        req.body.imageIds = req.body.imageIds.split(",");

        req.utils.common.checkError(req, res, next);
        next();
    };
};

post.existsImages = function () {
    return function (req, res, next) {
        req.models.Image.findImagesByIds(req.body.imageIds, req.user, function (status, data) {
            if (status == 200) {
                if (data.length == req.body.imageIds.length) {
                    next();
                } else {
                    return res.hjson(req, next, 400, {
                        code: "400_0001"
                    });
                }
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    }
};

post.setParam = function () {
    return function (req, res, next) {
        var body = {
            productName: req.body.productName,
            manufacturer: req.body.manufacturer,
            price: req.body.price,
            productCategoryId: req.body.productCategoryId,
            imageIds: req.body.imageIds
        };

        if (req.body.description !== undefined) {
            body.description = req.body.description;
        }

        req.models.AppProduct.createProduct(body, function (status, data) {
            if (status == 200) {
                req.instance = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

post.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.instance);
    };
};

module.exports = post;
