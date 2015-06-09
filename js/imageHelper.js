var ImageHelper = (function () {
    var scene7BaseUrl = 'https://okl-scene7.insnw.net/is/image/OKL/',
        EVENT_IMAGE_CONFIG = {
            wid: 1656,
            hei: 1128,
            fmt: 'jpeg',
            qlt: [90, 0],
            op_sharpen: 0,
            resMode: 'sharp2',
            op_usm: [1, 1, 6, 0],
            iccEmbed: 0,
            printRes: 72,
            fit: ['fit', 1]
        },
        PRODUCT_IMAGE_CONFIG = {
            wid: 160,
            hei: 109
        };

    return {
        eventImageUrl: function (eventId) {
            return scene7BaseUrl + 'SalesEvent_' + eventId + '_Lifestyle_3?' + this.imageUrlParams(EVENT_IMAGE_CONFIG);
        },

        productImageUrl: function (product) {
            if (product.is_vintage) {
                return this.vintageImageUrl();
            } else {
                return this.nonVintageImageUrl();
            }
        },

        nonVintageImageUrl: function (sku) {
            return scene7BaseUrl + 'Product_' + sku + '_Image_1?' + this.imageUrlParams(PRODUCT_IMAGE_CONFIG);
        },

        vintageImageUrl: function (sku) {
            return scene7BaseUrl + sku + '?' + this.imageUrlParams(PRODUCT_IMAGE_CONFIG);
        },

        imageUrlParams: function (config) {
            return Object.keys(config).map(function (key) {
                return this.prepareImageParam(key, config);
            }, this).join('');
        },

        prepareImageParam: function (key, config) {
            return key + '=' + this.prepareImageParamValue(config[key]) + '&';
        },

        prepareImageParamValue: function (value) {
            return (value instanceof Array ? value.join(',') : value);
        }
    };
})();
