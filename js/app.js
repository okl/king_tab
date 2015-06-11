var kingTab = (function (window, $) {
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
        eventLookContainer: $('.event-look-container'),
        eventLookBtn: $('.event-look')
    };

    var baseUrl = 'https://www.onekingslane.com/';

    return {
        init: function () {
            BackgroundManager.createWhiteBg();
            EventsManager.fetchEvents(baseUrl + 'api/sales-events-by-days/1',
                function () {
                    BackgroundManager.loadBgImage(EventsManager.currentEventId(), function () {
                        BackgroundManager.preloadBgImages(EventsManager.eventIds());
                    });
                },
                BackgroundManager.setBackgroundImage.bind(BackgroundManager));
            this.setMessages(textElements);
            this.createEventHandlers();
        },

        refresh: function () {
            BackgroundManager.incrementBgCount();
            this.loadEvent(EventsManager.nextEvent());
        },

        loadEvent: function () {
            BackgroundManager.setBackgroundImage(EventsManager.currentEventId());
            this.setEvent(eventElements, EventsManager.currentEvent());
        },

        eventUrl: function (eventId) {
            return baseUrl + 'sales/' + eventId;
        },

        productEventUrl: function(eventId, productId) {
            return baseUrl + 'product/' + eventId + "/" + productId;
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

        setEvent: function(ems, currentEvent) {
            $(ems.eventTitle).html(currentEvent.event_title);
            $(ems.eventDescription).html(currentEvent.event_description);
            $(ems.eventDialogTitle).html(currentEvent.event_title);
            $(ems.eventDialogUrl).attr("href", this.eventUrl(EventsManager.currentEvent().sales_sales_event_id));

            this.setEventProducts(ems, currentEvent);
        },

        setEventProducts: function(ems, currentEvent) {
            var allProducts = '', currentProduct;
            var productTemplate = '<div class="product"><a href="#LINK_URL"><img src="#IMG_URL"/></a></div>';

            for (var i=0, len = currentEvent.products.length; i < len; i++) {
                currentProduct = currentEvent.products[i];
                allProducts += productTemplate.replace('#LINK_URL', this.productEventUrl(currentEvent.sales_event_id, currentProduct.product_id))
                    .replace('#IMG_URL', ImageHelper.productImageUrl(currentEvent.products[i]));
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

            eventElements.eventLookBtn.on('click', function() {
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
