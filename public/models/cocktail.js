define([
    'lodash',
    'knockout',
    'knockout.mapping'
], function (
    _,
    ko,
    mapping
) {
    var Cocktail = function (data) {
        mapping.fromJS(data, Cocktail.mapping, this);

        this.url = ko.computed(_.bind(_.template('/cocktails/${id()}'), _, this));
    };

    Cocktail.mapping = {
        create: function (options) {
            return new Cocktail(options.data);
        },
        key: function (data) {
            return ko.utils.unwrapObservable(data.id);
        }
    };

    return Cocktail;
});
