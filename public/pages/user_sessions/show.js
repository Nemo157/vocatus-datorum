define([
    'pages/entities/show',
    'models/user_session'
], function (
    ShowPage,
    UserSession
) {
    return new ShowPage({
        name: 'user_session',
        model: UserSession
    });
});
