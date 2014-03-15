define([
    'models/spirits',
    'pages/entities/index'
], function (
    Spirits,
    EntitiesIndex
) {
    return new EntitiesIndex({
        model: Spirits
    });
});
