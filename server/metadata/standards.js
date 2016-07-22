var standards = {
    "cdn": {
        "rootUrl": "uploads"
    },
    "flag": {
        "isMoreInfo": true,
        "isAutoVerifiedEmail": false,
        "isJoinFriendNotifications": true,
        "isUseS3Bucket": false,
        "isUseRedis": false
    },
    "product": {
        "minNameLength": 1,
        "maxNameLength": 10000,
        "minManufacturerLength": 1,
        "maxManufacturerLength": 10000,
        "maxImageCount": 12,
        "orderBy": ["createdAt", "price"],
        "defaultOrderBy": "createdAt"
    },
    "productCategory": {
        "minNameLength": 1,
        "maxNameLength": 1000
    }
};

if (!this.window && module && module.exports) {
    module.exports = standards;
} else {
    if (!window.meta) window.meta = {};
    window.meta.std = standards;
}