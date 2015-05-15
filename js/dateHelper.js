var DateHelper = (function() {
    var DAY_NAMES = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];

    var OFFICE_LOCATIONS = {
        4: 'NY',
        7: 'SF'
    };


    return {
        getTimeOfTheDayGreeting: function() {
            var hour = moment().hour();

            if (hour < 12) {
                return "Morning";
            }

            if (hour < 19) {
                return "Afternoon";
            }

            if (hour >= 19) {
                return "Evening";
            }
        },

        getDayName: function () {
            var d = new Date();
            return DAY_NAMES[d.getDay()];
        },

        getCurrentTime: function() {
            return moment().format("h:mma");
        },

        getLocale: function () {
            var tzo = new Date().getTimezoneOffset()/60;
            return OFFICE_LOCATIONS[tzo];
        }
    }

})();

