/**
 * Profile model module.
 * @module core/server/models/sequelize/app-product
 */

/**
 * 응답콜백
 * @callback responseCallback
 * @param {number} status - 상태코드
 * @param {Object} data - 성공일 경우 반환된 데이터
 */

var Sequelize = require('sequelize');
var sequelize = require('../../../../core/server/config/sequelize');

var mixin = require('../../../../core/server/models/sequelize/mixin');
var errorHandler = require('sg-sequelize-error-handler');

var STD = require('../../../../bridge/metadata/standards');
module.exports = {
    'fields': {
        'productName': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'description': {
            'type': Sequelize.STRING,
            'allowNull': true
        },
        'manufacturer': {
            'type': Sequelize.STRING,
            'allowNull': false
        },
        'price': {
            'type': Sequelize.INTEGER,
            'allowNull': false
        },
        'productCategoryId': {
            reference: 'AppProductCategory',
            referenceKey: 'id',
            'as': 'productCategory',
            allowNull: false
        },
        'createdAt': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        },
        'updatedAt': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        },
        'deletedAt': {
            'type': Sequelize.DATE,
            'allowNull': true
        }
    },
    'options': {
        'timestamps': true,
        'updatedAt': false,
        'charset': 'utf8',
        'paranoid': true, // deletedAt 추가. delete안함.
        'hooks': {
            'beforeCreate': mixin.options.hooks.microCreatedAt,
            'beforeBulkUpdate': mixin.options.hooks.useIndividualHooks,
            'beforeUpdate': mixin.options.hooks.microUpdatedAt
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'createProduct': function (body, callback) {
                var createdProduct = null;
                var createdImages = null;

                sequelize.transaction(function (t) {
                    return sequelize.models.AppProduct.create(
                        body,
                        {
                            transaction: t
                        }
                    ).then(function (product) {
                        createdProduct = product;
                        if (body.imageIds !== undefined) {
                            var productImages = [];
                            for (var i = 0; i < body.imageIds.length; i++) {
                                var temp = {
                                    productId: product.id,
                                    imageId: body.imageIds[i]
                                };
                                productImages.push(temp);
                            }

                            return sequelize.models.AppProductImage.bulkCreate(productImages, {
                                individualHooks: true,
                                transaction: t
                            });

                        }

                    }).then(function (images) {
                        console.log(images);
                        createdImages = images;
                        return true
                    });
                }).catch(errorHandler.catchCallback(callback)).done(function (done) {

                    if (done) {
                        createdProduct.images = createdImages;
                        callback(200, createdProduct);
                    } else {
                        callback(500);
                    }
                });
            },
            'findProductsByOptions': function (options, callback) {
                sequelize.models.AppProduct.hasMany(sequelize.models.AppProductImage, {
                    foreignKey: 'productId',
                    as: 'productImages'
                });

                var where = {};

                if (options.productName !== undefined) {
                    where['name'] = {
                        '$like': "%" + options.productName + "%"
                    }
                }

                if (options.productCategory !== undefined) {
                    where.productCategory = options.productCategory;
                }

                if (options.manufacturer !== undefined) {
                    where.manufacturer = options.manufacturer;
                }

                if (options.orderBy !== undefined && options.last !== undefined) {
                    where[options.orderBy] = {
                        '$lt': options.last
                    };
                }

                var query = {
                    'limit': parseInt(options.size),
                    'where': where,
                    'order': [[options.orderBy, 'DESC']],
                    'include': [{
                        'model': sequelize.models.AppProductCategory,
                        'as': 'productCategory'
                    }, {
                        model: sequelize.models.AppProductImage,
                        as: 'productImages',
                        "include": [{
                            'model': sequelize.models.Image,
                            'as': 'image'
                        }]
                    }]
                };
                sequelize.models.AppProduct.findAllDataForQuery(query, function (status, data) {

                    // var result = data;

                    var result = {
                        list: data
                    };

                    callback(status, result);
                });
            }

        })
    }
};