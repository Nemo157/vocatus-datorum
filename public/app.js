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
            var pageHolder = _.find(this.pages(), { name: page });
            if (pageHolder) {
                if (pageHolder.loaded() && pageHolder.model().refresh) {
                    pageHolder.model().refresh();
                }
            } else {
                this.loadPage(page);
            }
            this.current_page(page);
        },
        loadPage: function (page) {
            this.pages.push({
                name: page,
                loaded: ko.observable(),
                model: ko.observable()
            });
            var scripts = ['pages/' + page];
            if ($('#' + page).length === 0) {
                scripts.push('text!templates/' + page + '.html');
            }
            require(scripts, _.bind(this.pageLoaded, this, page), _.bind(this.pageLoadFailed, this, page));
        },
        pageLoaded: function (page, pageModel, pageTemplate) {
            if (pageModel && pageModel.refresh) {
                pageModel.refresh();
            }
            if (_.isString(pageTemplate)) {
                $('body').append($('<script>').attr({ id: page, type: 'text/html' }).text(pageTemplate));
            }
            var pageHolder = _.find(this.pages(), { name: page });
            pageHolder.model(pageModel);
            pageHolder.loaded(true);
        },
        pageLoadFailed: function (page, error) {
            console.log("Failed to load page " + page);
            console.log(error);
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

    sammy(function() {
        this.setLocationProxy(new PushLocationProxy(this));

        this.get('/', function () {
            app.goToPage('index');
        });

        this.get('/:page/:id', function () {
            app.goToPage(this.params.page);
        });

        this.get('/:page', function () {
            app.goToPage(this.params.page);
        });
    }).run();

    ko.applyBindings(app);
    $('body').removeClass('loading');

    return app;
});
