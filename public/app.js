/* global console */
define([
    'lodash',
    'jquery',
    'knockout',
    'sammy',
    'require',
    'bootstrap',
    'sammy.push_location_proxy'
], function (
    _,
    $,
    ko,
    sammy,
    require,
    bootstrap,
    PushLocationProxy
) {
    var app = {
        pages: ko.observableArray(),
        current_page: ko.observable(),
        current_user: {
            logged_in: ko.observable(false),
            can_edit: ko.observable(false)
        },
        goToPage: function (page) {
            var name = page.replace(/\//g, '-');
            var pageHolder = _.find(this.pages(), { name: name });
            if (pageHolder) {
                if (pageHolder.model() && pageHolder.model().refresh) {
                    pageHolder.model().refresh();
                }
            } else {
                this.loadPage(page, name);
            }
            this.current_page(name);
        },
        loadPage: function (page, name) {
            var pageHolder = {
                name: name,
                templateLoaded: ko.observable($('#' + name).length > 0),
                model: ko.observable()
            };
            pageHolder.loaded = ko.computed(function () {
                return pageHolder.templateLoaded() && !!pageHolder.model();
            });
            if (!pageHolder.templateLoaded()) {
                require(['text!templates/' + page + '.html'], _.bind(this.pageTemplateLoaded, this, pageHolder), _.bind(this.pageTemplateLoadFailed, this, pageHolder));
            }
            require(['pages/' + page], _.bind(this.pageModelLoaded, this, pageHolder), _.bind(this.pageModelLoadFailed, this, pageHolder));
            this.pages.push(pageHolder);
        },
        pageModelLoaded: function (pageHolder, pageModel) {
            if (pageModel && pageModel.refresh) {
                pageModel.refresh();
            }
            pageHolder.model(pageModel);
        },
        pageTemplateLoaded: function (pageHolder, pageTemplate) {
            if (_.isString(pageTemplate)) {
                $('body').append($('<script>').attr({ id: pageHolder.name, type: 'text/html' }).text(pageTemplate));
            }
            pageHolder.templateLoaded(true);
        },
        pageModelLoadFailed: function (pageHolder, error) {
            console.log("Failed to load model for page " + pageHolder.name + ", using an empty one");
            console.log(error);
            this.pageModelLoaded(pageHolder, {});
        },
        pageTemplateLoadFailed: function (pageHolder, error) {
            console.log("Failed to load template for page " + pageHolder.name + ", using an empty one");
            console.log(error);
            this.pageTemplateLoaded(pageHolder, '');
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

    var explicitRoutes = {
        '': 'index',
        'cocktails': {
            '': 'cocktails/index',
            ':id': 'cocktails/show'
        },
        'ingredients': {
            '': 'ingredients/index',
            ':id': 'ingredients/show'
        },
        'spirits': {
            '': 'spirits/index',
            ':id': 'spirits/show'
        },
        'mixers': {
            '': 'mixers/index',
            ':id': 'mixers/show'
        }
    };

    sammy(function() {
        this.setLocationProxy(new PushLocationProxy(this));

        var mapRoutes = _.bind(function (root, routes) {
            _.forEach(routes, function (map, route) {
                if (_.isString(map)) {
                    this.get(root + (route ? '/' + route : ''), function () {
                        app.goToPage(map);
                    });
                } else {
                    mapRoutes(root + route, map);
                }
            }, this);
        }, this);

        mapRoutes('/', explicitRoutes);

        this.get('/:page', function () {
            app.goToPage(this.params.page);
        });
    }).run();

    ko.applyBindings(app);
    $('body').removeClass('loading');

    return app;
});
