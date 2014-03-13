define([
    'jquery',
    'knockout',
    'knockout.mapping'
], function (
    $,
    ko,
    mapping
) {
    var page = {
        cocktails: ko.observableArray()
    };

    $.get('/api/cocktails', function (data) {
        mapping.fromJS(data.items, {}, page.cocktails);
    });

    return page;
});
