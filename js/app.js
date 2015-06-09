var kingTab = (function (window, $) {
    var IMAGE_CONFIG = {
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
    };

    var BG_NUM = 1;

    var textElements = {
        welcome: $('#welcome-message'),
        clock: $('#clock')
    };

    var controlElements = {
        magnify: $('#search-wrap').find('img'),
        searchInput: $('#search-input'),
        refresh: $('#refresh')
    };

    var eventElements = {
        eventTitle: $('#event-title'),
        eventDescription: $('#event-description'),
        eventDialog: $('#event-dialog'),
        eventContainer: $('#event'),
        eventDialogTitle: $('#event-dialog-title'),
        eventDialogImage: $('#event-dialog-image'),
        eventDialogUrl: $('.event-dialog-url'),
        eventDialogProducts: $('#event-dialog-products'),
        getThisLookBtn: $('#get-this-look-btn'),
        eventLookContainer: $('.event-look-container')
    };

    var baseUrl = 'https://www.onekingslane.com/',
        scene7BaseUrl = 'https://okl-scene7.insnw.net/is/image/OKL/',
        $body = $('body');

    return {
        init: function () {
            var self = this;

            self.createWhiteBackground();
            EventsManager.fetchEvents(baseUrl + '/api/sales-events-by-days/1', function () {
                self.initBackgroundImage(function () {
                    self.setBackgroundImage(EventsManager.currentEvent().sales_event_id, IMAGE_CONFIG);
                    self.setEvent(eventElements, EventsManager.currentEvent());
                    self.preloadBackgroundImages(EventsManager.events);
                });
            });
            self.setMessages(textElements);
            self.createEventHandlers();
        },

        refresh: function () {
            BG_NUM++;
            this.loadEvent(EventsManager.nextEvent());
        },

        createWhiteBackground: function () {
            $body.prepend('<div id="bg0" class="background"></div>');
            $('#bg0').css({
                'zIndex': 0,
                'background-color':'#FFFFFF'
            });
        },

        initBackgroundImage: function (callback) {
            var self = this,
                image = new Image();

            image.onload = callback;
            image.src = self.imageUrl(EventsManager.currentEvent().sales_event_id, IMAGE_CONFIG);
        },

        preloadBackgroundImages: function (events) {
            var backgroundUrls = events.map(function (event) {
                return 'url("' + this.imageUrl(event.sales_event_id) + '")';
            }, this).slice(1);

            $('<style>body:after {display: none; content: ' + backgroundUrls.join(' ') + '}</style>').appendTo('head');
        },

        loadEvent: function () {
            this.setBackgroundImage(EventsManager.currentEvent().sales_event_id);
            this.setEvent(eventElements, EventsManager.currentEvent());
        },

        backgroundHTML: function (num, eventId) {
            return '<div id="bg' + num + '" ' +
                'class="background" ' +
                'style="z-index: ' + (0 - num) + '; ' +
                'background-image: url(' + this.imageUrl(eventId) + ')">' +
                '</div>';
        },

        setBackgroundImage: function (eventId) {
            $body.prepend(this.backgroundHTML(BG_NUM, eventId));
            $('#bg' + (BG_NUM - 1)).fadeOut(function () {
                this.remove();
            });
        },

        imageUrlParams: function () {
            var key, params = '';
            for (key in IMAGE_CONFIG) {
                if (IMAGE_CONFIG.hasOwnProperty(key)) {
                    params += this.prepareImageParam(key);
                }
            }
            return params;
        },

        prepareImageParam: function (key) {
            return key + '=' + this.prepareImageParamValue(IMAGE_CONFIG[key]) + '&';

        },

        prepareImageParamValue: function (value) {
            return (value instanceof Array ? value.join(',') : value);
        },

        imageUrl: function (eventId) {
            return scene7BaseUrl + 'SalesEvent_' + eventId + '_Lifestyle_3?' + this.imageUrlParams();
        },

        eventUrl: function (eventId) {
            return baseUrl + 'sales/' + eventId;
        },

        productEventUrl: function(eventId, productId) {
            return baseUrl + 'product/' + eventId + "/" + productId;
        },

        productImageUrl: function(product) {
            if (product.is_vintage) {
                return scene7BaseUrl + product.okl_sku + "?wid=160&hei=109";
            }
            else {
                return scene7BaseUrl + "Product_" + product.okl_sku + "_Image_1?wid=160&hei=109";
            }
        },

        setMessages: function (ems) {
            $(ems.welcome).html('Happy '+DateHelper.getDayName()+', '+DateHelper.getLocale()+'!');
            this.setTime(ems.clock);
        },

        setTime: function (clock) {
            var callee = arguments.callee;
            clock.html(DateHelper.getCurrentTime());
            requestAnimationFrame(function () {
                callee(clock);
            });
        },

        fullBleedImageUrl: function(eventId) {
            return "https://okl-scene7.insnw.net/is/image/OKL/fullbleed_" + eventId + "?$story-full-bleed$";
        },

        setEvent: function(ems, currentEvent) {
            $(ems.eventTitle).html(currentEvent.event_title);
            $(ems.eventDescription).html(currentEvent.event_description);
            $(ems.eventDialogTitle).html(currentEvent.event_title);
            //$(ems.eventDialogImage).attr("src", this.fullBleedImageUrl(EventsManager.currentEvent().sales_sales_event_id));
            $(ems.eventDialogUrl).attr("href", this.eventUrl(EventsManager.currentEvent().sales_sales_event_id));

            this.setEventProducts(ems, currentEvent);
        },

        setEventProducts: function(ems, currentEvent) {
            var allProducts = '', currentProduct;
            var productTemplate = '<div class="product"><a href="#LINK_URL"><img src="#IMG_URL"/></a></div>';

            for (var i=0, len = currentEvent.products.length; i < len; i++) {
                currentProduct = currentEvent.products[i];
                allProducts += productTemplate.replace('#LINK_URL', this.productEventUrl(currentEvent.sales_event_id, currentProduct.product_id))
                    .replace('#IMG_URL', this.productImageUrl(currentEvent.products[i]));
            }
            $(ems.eventDialogProducts).html(allProducts);
        },

        createEventHandlers: function () {
            var self = this;

            controlElements.searchInput.keydown(function (event) {
                if (event.keyCode === 13) {
                    window.location = baseUrl + 'search?q=' + controlElements.searchInput.val().replace(/\s/g, '+');
                }
            });

            controlElements.magnify.on('click', function () {
                controlElements.searchInput.addClass('expanded').focus();
                controlElements.searchInput.on('blur', function () {
                    controlElements.searchInput.removeClass('expanded');
                });
            });

            controlElements.refresh.on('click', function () {
                self.refresh();
            });

            eventElements.eventContainer.on('mouseenter', function() {
                eventElements.eventDialog.fadeIn(250, 'swing');
            });

            eventElements.eventContainer.on('mouseleave', function() {
                eventElements.eventDialog.fadeOut(250, 'swing');
            });

            eventElements.getThisLookBtn.on('click', function() {
                window.location = self.eventUrl(EventsManager.currentEvent().sales_event_id);
            });

            eventElements.eventLookContainer.fadeIn(3000);
        }
    };
})(window, $);

$(document).on('ready', function () {
    kingTab.init();
});

$(window).on('load', function () {
    $('#init-overlay').fadeOut(function () {
        this.remove();
    });
});
