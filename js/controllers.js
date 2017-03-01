/***
 * 这里是登陆模块
 * ***/
app.controller('validateCtrl',function($scope){
    $scope.user={
        email:'',
        password:''
    };
    $scope.arrs={
        email:'/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/',
        password:'^\d{6,}$'
    };
    $scope.compare = function(user){
        $scope.user= user;
        $scope.same = angular.equals($scope.user.email,$scope.arrs.email)//对比
        $scope.same1 = angular.equals($scope.user.password,$scope.arrs.password)//对比
        console.log($scope.same);
        console.log($scope.same1);
        console.log($scope.user.email);
        // if($scope.same == false){
        //     $scope.user.email='用户名不正确';
        //     console.log(user.email);
        // };
        // if($scope.same1 == false){
        //     $scope.user.password='';
        //     console.log(user.password);
        // }
    }
});
/**
*后台界面
**/
app.controller('booklist',function($scope,$http){
    $scope.booklist ={};
    $http.get('data/bookslist.json')
        .success(function (item){
            $scope.booklist = item;
            console.log($scope.booklist)
        });
});
/**
 * 这里是书籍列表模块
 **/
var bookListModule = angular.module("BookListModule", []);
bookListModule.controller('BookListCtrl', function($scope, $http, $state, $stateParams) {
    //以下是分页内容
    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    };
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [5, 10, 20],
        pageSize: 5,
        currentPage: 1
    };
    $scope.setPagingData = function(data, page, pageSize) {
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.books = pagedData;
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    //这里可以根据路由上传递过来的bookType参数加载不同的数据
    console.log($stateParams);
    $scope.getPagedDataAsync = function(pageSize, page, searchText) {
        setTimeout(function() {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                $http.get('./data/books' + $stateParams.bookType + '.json')//通过传值调用不同json
                    .success(function(largeLoad) {
                        data = largeLoad.filter(function(item) {
                            return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                        });
                        $scope.setPagingData(data, page, pageSize);
                    });
            } else {
                $http.get('./data/books' + $stateParams.bookType + '.json')
                    .success(function(largeLoad) {
                        $scope.setPagingData(largeLoad, page, pageSize);
                    });
            }
        }, 100);
    };

    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    $scope.$watch('pagingOptions', function(newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('filterOptions', function(newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);

    $scope.gridOptions = {
        data: 'books',//表格中显示的数据来源
        rowTemplate: '<div style="height: 100%"><div ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell ">' +
            '<div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }"> </div>' +
            '<div ng-cell></div>' +
            '</div></div>',
        multiSelect: false,//是否能多选
        enableCellSelection: true, //是否能选择单元格
        enableRowSelection: false,//是否能选择行
        enableCellEdit: true,//是否能修改内容
        enablePinning: true,  //是否被锁住了
        i18n: 'zh-cn',
        columnDefs: [{
            field: 'index',//这里是数据中的属性名
            displayName: '序号', //这里是表格的每一列的名称
            width: 60,//表格的宽度
            pinnable: false,
            sortable: true//是否能排序
        }, {
            field: 'name',
            displayName: '书名',
            enableCellEdit: true
        }, {
            field: 'author',
            displayName: '作者',
            enableCellEdit: true,
            width: 220,
            pinnable: true,
            sortable: true
        }, {
            field: 'pubTime',
            displayName: '出版日期',
            enableCellEdit: true,
            width: 120
        }, {
            field: 'price',
            displayName: '定价',
            enableCellEdit: true,
            width: 120,
            cellFilter: 'currency:"￥"'
        }, {
            field: 'bookId',
            displayName: '操作',
            enableCellEdit: false,
            sortable: false,
            pinnable: false,
            cellTemplate: '<div><a ui-sref="bookdetail({bookId:row.getProperty(col.field)})" id="{{row.getProperty(col.field)}}">详情</a></div>'
        }],
        enablePaging: true,//是否能翻页
        showFooter: true,//是否显示表尾
        totalServerItems: 'totalServerItems',//数据的总条数 
        pagingOptions: $scope.pagingOptions,//分页部分
        filterOptions: $scope.filterOptions,//数据过滤部分
    };
});


/**
 * 这里是书籍详情模块
 * @type {[type]}
 */
var bookDetailModule = angular.module("BookDetailModule", []);
bookDetailModule.controller('BookDetailCtrl', function($scope, $http, $state, $stateParams) {
    console.log($stateParams);
});
var bookadd = angular.module('Bookadd',['ngAnimate', 'ngSanitize','ui.bootstrap']);
bookadd.controller('Bookaddctrl',function($scope,$http,$state, $stateParams){
    function abf(){
        $scope.userInfo={};//空
        $scope.userInfo.dt = new Date();//日历
        $scope.popup2 = {
            opened: false
        };
        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };    
        $scope.sites=[ //下拉列表
            {id:0,site:'计算机'},
            {id:1,site:'金融'},
            {id:2,site:'哲学'},
            {id:3,site:'历史'}
        ];
         $scope.userInfo.zw = '1';//默认选中一个 
    };
    abf();//执行
    $scope.geto =function(user){        
        $scope.userInfo = user
        console.log($scope.userInfo.dt.toISOString().slice(0,10))//日期格式化
        $http({
            url:'data/books5.json',
            method:'POST',
            data:$scope.userInfo,
            data:JSON.stringify($scope.userInfo)
        }).success(function(da){
            console.log(da);
            // console.log($stateParams);
             window.history.back();
        });
    };
    $scope.setFormData = function(){//清空
        abf();
    }
   
})

