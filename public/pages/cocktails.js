define([
    'jquery',
    'knockout',
    'knockout.mapping',
    'models/cocktail'
], function (
    $,
    ko,
    mapping,
    Cocktail
) {
    var page = {
        cocktails: ko.observableArray(),
        load: function () {
            $.get('/api/cocktails', function (data) {
                mapping.fromJS(data.items, Cocktail.mapping, page.cocktails);
            });
        }
    };

    return page;
});
