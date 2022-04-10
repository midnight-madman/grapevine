module.exports = {
    trailingSlash: true,
    // swcMinify: true,
    env: {
        SITE: process.env.SITE,
    },
    exclude:
        [
            'node_modules',
            '**/__tests__',
            '**/*.test.js',
            '**/*.spec.js',
        ],
};
