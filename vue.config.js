module.exports = {
    publicPath:'./',
    outputDir: 'dist',
    /* The directory (relative to outputDir) where generated static resources (json, css, img, fonts) are placed */
    assetsDir: 'static',
    configureWebpack: config => {
        return {
            module:{
                rules:[{
                    test:/\.mjs$/,
                    include: /node_modules/,
                    type: "javascript/auto"
                }]
            }
        }
    },

    productionSourceMap: true,
};
