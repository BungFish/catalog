var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {
        var PRODUCT_CATEGORY = req.meta.std.productCategory;
        req.check('name', '400_8').len(PRODUCT_CATEGORY.minNameLength, PRODUCT_CATEGORY.maxNameLength);
        req.utils.common.checkError(req, res, next);
        next();
    };
};

post.setParam = function () {
    return function (req, res, next) {
        var body = {
            name: req.body.name
        };
        var instance = req.models.AppProductCategory.build(body);
        instance.create(function (status, data) {
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
