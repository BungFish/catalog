var path = require('path');
var fs = require('fs');
var sequelize = require('../../../../core/server/config/sequelize');
var Profile = require('./profile');
var AppProductCategory = require('./app-product-category');
var AppProductImage = require('./app-product-image');
var AppProduct = require('./app-product');

var models = {
    Profile: Profile,
    AppProductCategory: AppProductCategory,
    AppProductImage: AppProductImage,
    AppProduct: AppProduct
};

module.exports = models;