/**
 * Profile model module.
 * @module core/server/models/sequelize/app-product-category
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
        'categoryName': {
            'type': Sequelize.STRING,
            'allowNull': false
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
            'findProductCategoriesByOption': function (options, callback) {

                var where = {};

                if (options.orderBy !== undefined && options.last !== undefined) {
                    where[options.orderBy] = {
                        '$lt': options.last
                    };
                }

                var query = {
                    'limit': parseInt(options.size),
                    'where': where,
                    'order': [[options.orderBy, options.sort]]
                };
                
                sequelize.models.AppProductCategory.findAllDataForQuery(query, function (status, data) {

                    var result = {
                        list: data
                    };

                    callback(status, result);
                });
            }
        })
    }
};