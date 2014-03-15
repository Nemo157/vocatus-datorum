define([
    'models/cocktails',
    'pages/entities/index'
], function (
    Cocktails,
    EntitiesIndex
) {
    return new EntitiesIndex({
        model: Cocktails
    });
});
