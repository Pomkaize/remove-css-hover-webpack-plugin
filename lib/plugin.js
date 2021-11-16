const postcss = require('postcss');
const cssbyebye = require('css-byebye');
const postcssHover = require('postcss-hover');

const getAssetFileName = (asset, prefix) => {
    const filenameParts = asset.split('.');

    filenameParts.splice(filenameParts.length - 1, 0, prefix);

    return filenameParts.join('.');
}

class RemoveCssHoverWebpackPlugin {
    static name = 'RemoveCssHoverWebpackPlugin';

    static defaultOptions = {
        rulesToRemove: [],
        prefix: 'mobile'
    };

    constructor(options = {}) {
        this.options = { ...RemoveCssHoverWebpackPlugin.defaultOptions, ...options };
    }

    apply(compiler) {
        const pluginName = RemoveCssHoverWebpackPlugin.name;
        const { webpack } = compiler;
        const { Compilation, sources } = webpack;
        const { RawSource } = sources;

        compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
            compilation.hooks.processAssets.tap(
                {
                    name: pluginName,
                    stage: Compilation.PROCESS_ASSETS_STAGE_DERIVED,
                },
                (assets) => {
                    const cssAssets = Object.keys(assets).filter(asset => asset.endsWith('.css'));

                    const postCssPlugins = [postcssHover()];

                    if (this.options.rulesToRemove.length) {
                        postCssPlugins.push(cssbyebye({ rulesToRemove: this.options.rulesToRemove }));
                    }

                    cssAssets.forEach(asset => {
                        const css = assets[asset].source();
                        const withoutHoverStyles =  postcss(postCssPlugins).process(css).css;

                        compilation.emitAsset(
                            getAssetFileName(asset, this.options.prefix),
                            new RawSource(withoutHoverStyles)
                        );
                    });
                }
            );
        });
    }
}

module.exports = {
    RemoveCssHoverWebpackPlugin,
    getAssetFileName,
};
