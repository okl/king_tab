var BackgroundManager = (function () {
    var $body = $('body'),
        BG_NUM = 1,
        DEFAULT_OFFLINE_BACKGROUND_IMAGE = 'images/SalesEvent_52142_Lifestyle_3.jpeg';

    return {
        createWhiteBg: function () {
            $body.prepend(this.backgroundHTML(0));
        },

        incrementBgCount: function () {
            BG_NUM++;
        },

        loadBgImage: function (eventId, callback) {
            var self = this,
                image = new Image();

            image.onload = function () {
                self.setBackgroundImage(eventId);
                callback();
            };
            image.onerror = function () {
                self.setBackgroundImage();
            };

            image.src = ImageHelper.eventImageUrl(eventId);
        },

        preloadBgImages: function (eventIds) {
            var backgroundUrls = eventIds.map(function (eventId) {
                return 'url("' + ImageHelper.eventImageUrl(eventId) + '")';
            }, this).slice(1);

            $('<style>body:after {display: none; content: ' + backgroundUrls.join(' ') + '}</style>').appendTo('head');
        },

        setBackgroundImage: function (eventId) {
            $body.prepend(this.backgroundHTML(BG_NUM, eventId));
            $('#bg' + (BG_NUM - 1)).fadeOut(function () {
                this.remove();
            });
        },


        backgroundHTML: function (num, eventId) {
            var html = '<div id="bg' + num + '" ' +
                'class="background" ' +
                'style="z-index: ' + (0 - num) + '; ';

            if (eventId) {
                return html + 'background-image: url(' + ImageHelper.eventImageUrl(eventId) + ')"></div>';
            } else {
                if (num === 0) {
                    return html + 'background-color: #FFFFFF"></div>';
                }
                else {
                    console.log("html = ", html + 'background-image: url("SalesEvent_17944_Lifestyle_3.jpeg")"></div>');
                    return html + 'background-image: url(' + DEFAULT_OFFLINE_BACKGROUND_IMAGE + ')"></div>';
                }
            }
        }
    };
})();
