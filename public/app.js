/* global console */
define([
    'lodash',
    'jquery',
    'knockout',
    'knockout.validation',
    'require',
    'bootstrap',
    'router',
    'jquery.cookie',
    'models/user_sessions',
    'models/user'
], function (
    _,
    $,
    ko,
    validation,
    require,
    bootstrap,
    router,
    cookie,
    UserSessions,
    User
) {
    validation.init({
        insertMessages: false,
        decorateElement: true,
        errorElementClass: 'has-error',
        parseInputAttributes: true
    });

    var app = {
        pages: ko.observableArray(),
        current_page: ko.observable(),
        last_page: ko.observable(),
        user: ko.observable({
            email: ko.observable(),
            logged_in: ko.observable(false),
            can_edit: ko.observable(false)
        }),
        session: ko.observable(),
        logout: function () {
            if (this.session()) {
                $.ajax({
                    type: 'DELETE',
                    url: this.session().uri()
                });
                if (this.current_page().id === 'user_sessions-show') {
                    var pageHolder = _.find(this.pages(), { id: 'user_sessions-show' });
                    if (pageHolder.params.user_session_id === this.session().id()) {
                        router.redirect('/');
                    }
                }
                this.session(null);
                this.user({
                    email: ko.observable(),
                    logged_in: ko.observable(false),
                    can_edit: ko.observable(false)
                });
            }
        },
        goToPage: function (path, params, originalPath) {
            this.last_page(this.current_page());
            var id = path.replace(/\//g, '-');
            var pageHolder = _.find(this.pages(), { id: id });
            if (pageHolder) {
                pageHolder.params = params;
                if (pageHolder.model() && pageHolder.model().refresh) {
                    pageHolder.model().refresh(params);
                }
            } else {
                this.loadPage(path, id, params);
            }
            this.current_page({
                id: id,
                path: path,
                originalPath: originalPath
            });
        },
        loadPage: function (path, id, params) {
            var pageHolder = {
                id: id,
                templateLoaded: ko.observable($('#' + id).length > 0),
                model: ko.observable(),
                params: params
            };
            pageHolder.loaded = ko.computed(function () {
                return pageHolder.templateLoaded() && !!pageHolder.model();
            });
            pageHolder.ready = ko.computed(function () {
                return pageHolder.loaded() && (!pageHolder.model().ready || pageHolder.model().ready());
            });
            if (!pageHolder.templateLoaded()) {
                require(['text!templates/' + path + '.html'], _.bind(this.pageTemplateLoaded, this, pageHolder), _.bind(this.pageTemplateLoadFailed, this, pageHolder));
            }
            require(['pages/' + path], _.bind(this.pageModelLoaded, this, pageHolder), _.bind(this.pageModelLoadFailed, this, pageHolder));
            this.pages.push(pageHolder);
        },
        pageModelLoaded: function (pageHolder, pageModel) {
            if (pageModel && pageModel.refresh) {
                pageModel.refresh(pageHolder.params);
            }
            pageModel.app = this;
            pageHolder.model(pageModel);
        },
        pageTemplateLoaded: function (pageHolder, pageTemplate) {
            if (_.isString(pageTemplate)) {
                $('body').append($('<script>').attr({ id: pageHolder.id, type: 'text/html' }).text(pageTemplate));
            }
            pageHolder.templateLoaded(true);
        },
        pageModelLoadFailed: function (pageHolder, error) {
            console.log("Failed to load model for page " + pageHolder.id + ", using an empty one");
            console.log(error);
            this.pageModelLoaded(pageHolder, {});
        },
        pageTemplateLoadFailed: function (pageHolder, error) {
            if (true /* in development */) {
                console.log("Failed to load template for page " + pageHolder.id + ", injecting error message");
                console.log(error);
                var message = error.toString();
                var wrapped = '<div class="container"><div class="alert alert-danger"><strong>Error loading template for page ' + pageHolder.id + ':</strong> ' + message + '</div></div>';
                if (error.xhr) {
                    this.pageTemplateLoaded(pageHolder, wrapped + error.xhr.responseText);
                } else {
                    this.pageTemplateLoaded(pageHolder, wrapped);
                }
            } else {
                console.log("Failed to load template for page " + pageHolder.id + ", using an empty one");
                console.log(error);
                this.pageTemplateLoaded(pageHolder, '');
            }
        }
    };

    (function () {
        var previousPage, nextPage, nextBindingContext, transitioning;
        var pageFadeDataKey = ko.utils.domData.nextKey();

        var fade = function (element) {
            if (!transitioning) {
                var data = ko.utils.domData.get(element, pageFadeDataKey);
                transitioning = true;
                data.isDisplayed = false;
                // This only works because of the defer below.
                $(element).fadeOut(nextPage ? 'fast' : 'slow', onFaded);
            }
        };

        var show = function (element, bindingContext) {
            if (!transitioning) {
                transitioning = true;
                var data = ko.utils.domData.get(element, pageFadeDataKey);
                if (!data.isBound) {
                    if (data.savedNodes) {
                        ko.virtualElements.setDomNodeChildren(element, ko.utils.cloneNodes(data.savedNodes));
                    }
                    ko.applyBindingsToDescendants(bindingContext, element);
                    data.isBound = true;
                }
                data.isDisplayed = true;
                // Give the page more time to load on first show.
                $(element).fadeIn(data.beenShown ? 'fast' : 'slow', onShown);
                data.beenShown = true;
            }
        };

        var onFaded = function () {
            var data = ko.utils.domData.get(this, pageFadeDataKey);
            transitioning = false;
            if (!data.savedNodes) {
                data.savedNodes = ko.utils.cloneNodes(ko.virtualElements.childNodes(this), true);
            }
            ko.virtualElements.emptyNode(this);
            data.isBound = false;
            if (nextPage) {
                show(nextPage, nextBindingContext);
            }
        };

        var onShown = function () {
            transitioning = false;
            previousPage = this;
            if (this === nextPage) {
                nextPage = null;
            } else {
                fade(this);
            }
        };

        ko.bindingHandlers.pageFade = {
            init: function(element, valueAccessor) {
                var shouldDisplay = ko.utils.unwrapObservable(valueAccessor());
                $(element).toggle(shouldDisplay);
                ko.utils.domData.set(element, pageFadeDataKey, {});
                return { 'controlsDescendantBindings': true };
            },
            update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
                var data = ko.utils.domData.get(element, pageFadeDataKey);
                var shouldDisplay = ko.utils.unwrapObservable(valueAccessor());

                if (shouldDisplay !== data.isDisplayed) {
                    if (shouldDisplay) {
                        nextPage = element;
                        nextBindingContext = bindingContext;
                        if (data.savedNodes) {
                            ko.virtualElements.setDomNodeChildren(element, ko.utils.cloneNodes(data.savedNodes));
                        }
                        ko.applyBindingsToDescendants(bindingContext, element);
                        data.isBound = true;
                        if (previousPage) {
                            fade(previousPage);
                        } else {
                            show(element, bindingContext);
                        }
                    } else {
                        // Ensures the new page being shown will have higher
                        // priority so we can adjust the fade speed depending
                        // on whether there is a new page or not.
                        _.defer(function() { fade(element); });
                    }
                }
            }
        };
    })();

    if ($.cookie('session_id')) {
        var session_id = $.cookie('session_id');
        UserSessions.get().refresh().done(function (sessions) {
            var session = _.find(sessions.items(), function (session) {
                return session.client_id() === session_id;
            });
            if (session) {
                app.session(session);
                var user = User.create({ uri: session.user.uri });
                user.refresh().done(app.user);
            }
        });
    }

    app.session.subscribe(function (session) {
        if (session && session.client_id()) {
            $.cookie('session_id', session.client_id());
        } else {
            $.removeCookie('session_id');
        }
    });

    router.setApp(app);
    router.run();

    ko.applyBindings(app);
    $('body').removeClass('loading');

    return app;
});
