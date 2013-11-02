/**
 * Routes of applications used by $state (from angular-ui router )
 */

services(['angular', 'ui_router'],function() {
    var router = angular.module('curriculove.router', ['ui.router']);
    var routes = {
        home: {url: '/', templateUrl: '/partials/home.html' },
        login: {url: '/login', templateUrl: '/partials/login.html' },
        message: {url: '/message/{type}/{content}', templateUrl: '/partials/main/message.html' },
        signup: {url: '/signup', templateUrl: '/partials/signup.html'},
        dashboard: {url: '/dashboard', templateUrl: '/partials/dashboard/dashboard.html'},
        admin: {url: '/admin', templateUrl: '/partials/admin/admin.html'}

    }

    router.config(function($stateProvider, $urlRouterProvider) {
        angular.forEach(routes, function(urlRule, urlName) {
            $stateProvider.state(urlName, urlRule);
        });

        $urlRouterProvider.otherwise("/");
    });
});