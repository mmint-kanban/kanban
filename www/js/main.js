/**
 * This is input of application loaded by require in the page
 * We define paths, dependencies ... here
 */

require.config({
    paths: {
        vendor            : '/vendor',
        js                : '/js',

        settings          : 'js/settings',
        router            : 'js/router',
        controllers       : 'js/controllers',
        services          : 'js/services',
        resources         : 'js/resources',
        directives        : 'js/directives',
        filters           : 'js/filters',

        angular           : 'vendor/angular/angular-1.2.0-rc.2',
        angular_cookies   : 'vendor/angular/angular-cookies-1.2.0-rc.2',
        angular_resource  : 'vendor/angular/angular-resource-1.2.0-rc.2',

        ui_router         : 'vendor/angular-ui/ui-router-0.2.0',
        ui_sortable       : 'vendor/angular-ui/ui-sortable',
        ui_date           : 'vendor/angular-ui/ui-date',

        jquery            : 'vendor/jquery/jquery-1.9.1',
        jquery_ui         : 'vendor/jquery-ui/jquery-ui-1.10.3.custom.min',
        bootstrap         : 'vendor/bootstrap/bootstrap.min',
    },

    shim: {
        ui_router: ['angular'],
        ui_date: ['angular', 'jquery', 'jquery_ui'],
        ui_sortable: ['angular', 'jquery', 'jquery_ui'],
        angular_resource: ['angular'],
        bootstrap: ['jquery'],
        jquery_ui: ['jquery']
    },

    baseUrl: '/',
    urlArgs: 'v=1.0'
});

var Utils = {
    removeFromArray: function(arrSrc, el) {
        for(var i = arrSrc.length - 1; i >= 0; i--) {
            if(arrSrc[i] === el) {
               arrSrc.splice(i, 1);
            }
        }
        return arrSrc;
    }
}

services(['js/app', 'jquery_ui', 'bootstrap'], function(App) {
    App.init();
});