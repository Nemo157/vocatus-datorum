define([
    'pages/entities/show',
    'models/user'
], function (
    ShowPage,
    User
) {
    return new ShowPage({
        name: 'user',
        model: User
    });
});
