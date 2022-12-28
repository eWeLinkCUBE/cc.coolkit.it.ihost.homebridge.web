module.exports = {
    publicPath:'./',
    outputDir: 'dist',
    /* 放置生成的静态资源 (json、css、img、fonts) 的 (相对于 outputDir 的) 目录 */
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
