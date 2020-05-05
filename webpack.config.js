const path = require('path');

module.exports = env => ({
    target : 'web',
    entry  : {
        app : [ './src/app.js' ]
    },
    output : {
        path          :  path.resolve(__dirname, 'dist'),
        filename      : 'pSEngine.min.js',
        libraryTarget : 'var',
        library       : 'pSEngine',
        publicPath    : '/'
    },
    devServer: {
        contentBase : path.join(__dirname, 'dev'),
        compress    : true,
        port        : 8080
    },
    watch : env.watchV == 'true' ? true : false,
    devtool : 'inline-source-map'
});
