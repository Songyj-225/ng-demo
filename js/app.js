var app = angular.module('routerApp',['ui.router','ngGrid', 'BookListModule', 'BookDetailModule','Bookadd']);
/**
 * 由于整个应用都会和路由打交道，所以这里把$state和$stateParams这两个对象放到$rootScope上，
 * 方便其它地方引用和注入。
 * 这里的run方法只会在angular启动的时候运行一次。
 *  $rootScope
 *  $state
 *  $stateParams
 **/
app.run(function($rootScope,$state,$stateParams){
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});
/**
* 配置路由.config
* 这里采用的是ui-router这个路由，而不是原生的ng-router路由
* ng原生的路由不能支持嵌套视图，所以这里必须使用ui-router;
* $stateProvider
* $urlRouterProvider
**/
app.config(function($stateProvider,$urlRouterProvider){
    $urlRouterProvider.otherwise('/index');//没有任何值得情况下去到index
    $stateProvider.state('index',{//登陆页面
        url:'/index',
        templateUrl:'tpls/loginForm.html'
    }).state('booklist',{//后台界面
        url: '/{bookType:[0-9]{1,4}}',
        views: { //注意这里的写法，当一个页面上带有多个ui-view的时候如何进行命名和视图模板的加载动作
            '': {
                templateUrl: 'tpls/bookList.html'
            },
            'bookgrid@booklist': {
                templateUrl: 'tpls/bookGrid.html'
            }
            
        }
    }).state('addbook', {
            url: '/addbook',
            views: { //注意这里的写法，当一个页面上带有多个ui-view的时候如何进行命名和视图模板的加载动作
                '': {
                    templateUrl: 'tpls/bookList.html'
                },
                'addbook@addbook':{
                    templateUrl: 'tpls/addBookForm.html'
                }
            }
            // templateUrl: 'tpls/addBookForm.html'
        })
    .state('bookdetail', {
            url: '/bookdetail/:bookId',//注意这里在路由中传参数的方式
            views: { //注意这里的写法，当一个页面上带有多个ui-view的时候如何进行命名和视图模板的加载动作
                '': {
                    templateUrl: 'tpls/bookList.html'
                },
                'seebook@bookdetail':{
                    // url: '/bookdetail', 
                    templateUrl: 'tpls/bookDetail.html'
                }
            }
            // templateUrl: 'tpls/addBookForm.html'
        })
        // .state('bookdetail', {
        //     url: '/bookdetail/:bookId', //注意这里在路由中传参数的方式
        //     templateUrl: 'tpls/bookDetail.html'
        // })
})