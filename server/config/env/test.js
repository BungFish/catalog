module.exports = {
    app: {
        secret: 'test',
        port: 9001
    },
    db: {
        redis: 'redis://localhost:6379/slogup2',
        mysql: 'mysql://localhost:3306/test_analytics'
    }
};