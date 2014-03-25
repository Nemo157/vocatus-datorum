define(function (require) {
    var ko = require('knockout');

    ko.extenders.refresh = function (target, refresher) {
        return function () {
            refresher.refresh();
            return target.apply(this, arguments);
        };
    };

    return ko.extenders.refresh;
});
