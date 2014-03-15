define([
    'models/mixer',
    './entities'
], function (
    Mixer,
    EntitiesPage
) {
    return new EntitiesPage({
        model: Mixer,
        url: '/api/mixers'
    });
});
