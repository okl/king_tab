var EventsManager = (function () {
    Array.prototype.shuffle = function () {
        var i = this.length,
            j,
            temp;

        while (--i) {
            j = Math.floor(Math.random() * (i - 1));
            temp = this[i];
            this[i] = this[j];
            this[j] = temp;
        }

        return this;
    };

    return {
        events: [],
        current: 0,

        currentEvent: function () {
            return this.events[this.current];
        },

        nextEvent: function () {
            if (this.current === this.events.length - 1) {
                this.current = 0;
            } else {
                this.current += 1;
            }
            return this.currentEvent();
        },

        fetchEvents: function (api, success) {
            var self = this;

            $.ajax(api, {
                success: function (res) {
                    self.events = JSON.parse(res).payload.slice(0, 10).shuffle();
                    success();
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }
    };
}());
