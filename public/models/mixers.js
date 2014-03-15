define([
    './mixer',
    './entities'
], function (
    Mixer,
    EntityListType
) {
    return new EntityListType({
        name: 'mixers',
        model: Mixer
    });
});
