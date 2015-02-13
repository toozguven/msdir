var ngRootScope;
var globalDataMgr;


var ngapp = angular.module( 'dir', ['ngRoute', 'ngAnimate', 'ngSanitize', 'once'] )
.config( function ( $routeProvider )
{
  $routeProvider
  .when( '/firms', {
    controller: 'FirmsCtrl',
    templateUrl: 'views/firms.html'
  } )
  .when( '/contacts', {
    controller: 'ContactsCtrl',
    templateUrl: 'views/contacts.html'
  } )
  .when( '/favContacts', {
    controller: 'FavContactsCtrl',
    templateUrl: 'views/favContacts.html'
  } )
  .when( '/favFirms', {
    controller: 'FavFirmsCtrl',
    templateUrl: 'views/favFirms.html'
  } )
  .when( '/splash', {
    controller: 'SplashCtrl',
    templateUrl: 'views/splash.html'
  } )
  .when( '/firstTime', {
    controller: 'FirstTimeCtrl',
    templateUrl: 'views/firstTime.html'
  } )
  .when( '/disclaimer', {
    controller: 'FirstTimeCtrl',
    templateUrl: 'views/disclaimer.html'
  } )
  .when( '/aboutUs', {
    controller: 'AboutUsCtrl',
    templateUrl: 'views/aboutUs.html'
  } )
  .when( '/appInfo', {
    controller: 'AppInfoCtrl',
    templateUrl: 'views/appInfo.html'
  } )
  .when( '/contactUs', {
    controller: 'ContactUsCtrl',
    templateUrl: 'views/contactUs.html'
  } )
  .when( '/cFirms', {
    controller: 'CorrespondentFirmsCtrl',
    templateUrl: 'views/correspondentFirms.html'
  } )
  .when( '/cFirmsInfo', {
    controller: 'CorrespondentFirmsInfoCtrl',
    templateUrl: 'views/correspondentFirmsInfo.html'
  } )
  .when( '/aFirms', {
    controller: 'AssociatedFirmsCtrl',
    templateUrl: 'views/associatedFirms.html'
  } )
  .when( '/comms', {
    controller: 'CommsCtrl',
    templateUrl: 'views/comms.html'
  } )
  .when( '/reos', {
    controller: 'ReosCtrl',
    templateUrl: 'views/reos.html'
  } )
  .when( '/findFirms/:phrase?', {
    controller: 'FindFirmsCtrl',
    templateUrl: 'views/firmsSearch.html'
  } )
  .when( '/findContacts/:phrase?', {
    controller: 'FindContactsCtrl',
    templateUrl: 'views/contactsSearch.html'
  } )
  .when( '/country/:id', {
    controller: 'CountryCtrl',
    templateUrl: 'views/country.html'
  } )
  .when( '/countryContacts/:id', {
    controller: 'CountryContactsCtrl',
    templateUrl: 'views/countryContacts.html'
  } )
  .when( '/china/:id', {
    controller: 'CountryCtrl',
    templateUrl: 'views/china.html'
  } )
  .when( '/chinaContacts/:id', {
    controller: 'CountryContactsCtrl',
    templateUrl: 'views/chinaContacts.html'
  } )
  .when( '/countryWithState/:id/:sid', {
    controller: 'CountryCtrl',
    templateUrl: 'views/countryWithState.html'
  } )
  .when( '/countryWithStateContacts/:id/:sid', {
    controller: 'CountryContactsCtrl',
    templateUrl: 'views/countryWithStateContacts.html'
  } )
  .when( '/c/:id', {
    controller: 'ContactCtrl',
    templateUrl: 'views/contact.html'
  } )
  .when( '/f/:id', {
    controller: 'FirmCtrl',
    templateUrl: 'views/firm.html'
  } )
  .when( '/fa/:id', {
    controller: 'FirmCtrl',
    templateUrl: 'views/firmAddress.html'
  } )
  .when( '/fc/:id', {
    controller: 'FirmContactsCtrl',
    templateUrl: 'views/firmContacts.html'
  } )
  .when( '/menu', {
    controller: 'MenuCtrl',
    templateUrl: 'menu.html'
  } )
  .when( '/tz/:id', {
    controller: 'TimeZoneCtrl',
    templateUrl: 'views/tz.html'
  } )
  .otherwise( {
    redirectTo: '/splash'
  } );
} )
.config( ['$compileProvider', function ( $compileProvider )
{
  $compileProvider.aHrefSanitizationWhitelist( /^\s*(https?|file|tel|sms|mailto):/ );
}] );

ngapp.filter( 'startFrom', function ()
{
  return function ( input, start )
  {
    start = parseInt( start, 10 );
    return input.slice( start );
  };
} );

ngapp.filter( 'filterByState', function ()
{
  return function ( input, stateId )
  {
    var rtnVal = [];
    for ( var i = 0; i < input.length; i++ )
    {
      if ( input[i].sid == stateId || input[i].sid == -1 * stateId )
        rtnVal.push( input[i] );
    }
    return rtnVal;
  }
} );

ngapp.directive( 'mstphPaginate', mstphPaginateFunc );
function mstphPaginateFunc()
{
  return {
    restrict: 'A',
    require: '?mstphPaginateTotalItemCount,?mstphPaginatePageSize',
    template: '<div class="pagination-holder dark-theme"></div>',
    scope: false,//{ mstphPaginateTotalItemCount: '@', mstphPaginatePageSize: '@' },
    controller: ['$scope', '$element', function ( $scope, $element )
    {
      $scope.mstphPaginate = {};

      $scope.mstphPaginate.init = function ( totalNoOfItems, pageSize )
      {
        $scope.mstphPaginate.totalNoOfItems = totalNoOfItems;
        $scope.mstphPaginate.pageSize = pageSize;

        $scope.helpers.paging.currentPage = 0;
        $scope.mstphPaginate.numberOfPages = getNoOfPages( $scope.mstphPaginate.totalNoOfItems, $scope.mstphPaginate.pageSize ); 
      }

      var getNoOfPages = function ( total, pageSize )
      {
        var rtnVal = parseInt(( $scope.mstphPaginate.totalNoOfItems / $scope.mstphPaginate.pageSize ).toString() );
        var newTotal = pageSize * rtnVal;

        if ( total > newTotal )
          rtnVal++;
        
        return rtnVal;
      }
      
      $scope.mstphPaginate.draw = function ()
      { 
        $element.empty();

        if ( $scope.mstphPaginate.totalNoOfItems < $scope.mstphPaginate.pageSize )
          return;


        var $ = $ || angular.element;

        var prevBtn = $( '<span class="mstphBtnArrow"><span>Previous</span></span>' );
        prevBtn.bind( 'click', function () { $scope.mstphPaginate.doPrevClick(this) } );
        if ( $scope.mstphPaginate.isPrevEnabled() == false )
          prevBtn.addClass( "disabled" );

        var nextBtn = $( '<span class="mstphBtnArrow"><span>Next</span></span>' );
        nextBtn.bind( 'click', function () { $scope.mstphPaginate.doNextClick( this ) } );
        if ( $scope.mstphPaginate.isNextEnabled() == false )
          nextBtn.addClass( "disabled" );

        var pagingLabel = $( '<span> Page ' + ( $scope.helpers.paging.currentPage + 1 ) + ' of ' + ( $scope.mstphPaginate.numberOfPages ) + ' </span>' );

        $element.append( prevBtn );
        $element.append( pagingLabel );
        $element.append( nextBtn );
      }

      $scope.mstphPaginate.doPrevClick = function (btn) { 
        if ( angular.element(btn).hasClass( "disabled" ) )
          return;
        $scope.helpers.paging.currentPage--;
        $scope.helpers.paging.startFrom = ( $scope.helpers.paging.currentPage * $scope.mstphPaginate.pageSize );
        $scope.$apply();
        $scope.mstphPaginate.draw();
      };

      $scope.mstphPaginate.doNextClick = function (btn) { 
        if ( angular.element( btn ).hasClass( "disabled" ) )
          return;
        $scope.helpers.paging.currentPage++;
        $scope.helpers.paging.startFrom = ( $scope.helpers.paging.currentPage * $scope.mstphPaginate.pageSize );
        $scope.$apply();
        $scope.mstphPaginate.draw();
      };

      $scope.mstphPaginate.isPrevEnabled = function () { 
        return $scope.helpers.paging.currentPage > 0;
      };

      $scope.mstphPaginate.isNextEnabled = function () { 
        return $scope.helpers.paging.currentPage < $scope.mstphPaginate.numberOfPages - 1;
      };
      
    }],
    link: function ( scope, iElement, iAttrs )
    {
      var initAndDrawFunc = function ()
      {
        scope.mstphPaginate.init( iAttrs.mstphPaginateTotalItemCount, iAttrs.mstphPaginatePageSize );
        scope.mstphPaginate.draw();
      };

      //watch for changes on mstph-paginate-total-item-count (includes the change during initial bind)
      scope.$watch( 
        function () { return iElement.attr( 'mstph-paginate-total-item-count' ); }, //dynamic value (function) being watched for changes
        function ( newValue ) { //when a change occurs above, this function will execute
          scope.mstphPaginate.totalNoOfItems = newValue; 
          initAndDrawFunc();
        } 
      );       
    }
  };
}


ngapp.controller( 'MenuCtrl', ['$scope', '$rootScope', '$location', 'factory', 'dataMgr', function ( $scope, $rootScope, $location, factory, dataMgr )
{
  $scope.helpers = factory.getHelpers();

  $scope.menuItems = [];

  dataMgr.setScopeMenuItems( function ( data )
  {
    $scope.menuItems = data;
    $rootScope.menuItemsCount = data.length;
    
  } );

}] );


ngapp.directive( 'slideable', slideableFunc );

function slideableFunc()
{
  return {
    restrict: 'C',
    compile: function ( element, attr )
    {
      // wrap tag
      var contents = element.html();
      element.html( '<div class="slideable_content" style="margin:0 !important; padding:0 !important" >' + contents + '</div>' );
      
      return function postLink( scope, element, attrs )
      {
        // default properties
        attrs.duration = ( !attrs.duration ) ? '0.5s' : attrs.duration;
        attrs.easing = ( !attrs.easing ) ? 'ease-in-out' : attrs.easing;
        element.css( {
          'overflow': 'hidden',
          'height': '0px',
          'transitionProperty': 'height',
          'transitionDuration': attrs.duration,
          'transitionTimingFunction': attrs.easing
        } );
      };
    }
  };
}

ngapp.directive( 'slideToggle', function ( $rootScope )
{
  return {
    restrict: 'A',
    link: function ( scope, element, attrs )
    {
      attrs.expanded = false;

      $rootScope.menuVisible = attrs.expanded; //watch the visibility of the slide-up menu via the rootScope

      var target = document.querySelector( attrs.slideToggle );

      var doMenuClickFunc = function () //this is the actual click function definition
      {
        //fixed app height so click on anywhere on the .app div will close the sub-menu
        setTimeout( function () { jQuery( ".app" ).height( jQuery( window ).height() ); }, 1 );


        var y = $rootScope.menuItemsCount * 43;
        console_log( " height: " + y );

        if ( !$rootScope.menuVisible )
        {
          //target.style.bottom = '45px';
          //content.style.border = '1px solid rgba(0,0,0,0)';
          
          //content.css.border = 0;
          target.style.height = y + 'px';
        } else
        {
          target.style.height = '0px';
          //target.style.bottom = '-20px';
        }
        attrs.expanded = !$rootScope.menuVisible;
        $rootScope.menuVisible = attrs.expanded;
      } //END: doMenuClickFunc

      element.bind( 'click', doMenuClickFunc ); //bind to the click even of the menu toggle btn

      $rootScope.doMenuClick = function () //define a function on rootScope. This will be called to programmatically close the slide-up menu
      {        
        doMenuClickFunc();
      }
    }
  }
} );