var ngRootScope;
var globalDataMgr;

var ngapp = angular.module( 'dir', ['ngRoute', 'ngAnimate', 'ngSanitize', 'once'] )
.config( function ( $routeProvider )
{
  $routeProvider
  .when( '/', {
    controller: 'HomeCtrl',
    templateUrl: 'views/home.html'
  } )
  .when( '/comms', {
    controller: 'CommsCtrl',
    templateUrl: 'views/comms.html'
  } )
  .when( '/reos', {
    controller: 'ReosCtrl',
    templateUrl: 'views/reos.html'
  } )
  .when( '/findFirms/:phrase', {
    controller: 'FindFirmsCtrl',
    templateUrl: 'views/firmsSearch.html'
  } )
  .when( '/findContacts/:phrase', {
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
  .otherwise( {
    redirectTo: '/'
  } );
} );

ngapp.config( ['$compileProvider', function ( $compileProvider )
{
  $compileProvider.aHrefSanitizationWhitelist( /^\s*(https?|file|tel|sms|mailto):/ );
}] );

function addMoreItems()
{
  alert( 9 );
}

ngapp.filter( 'startFrom', function ()
{
  return function ( input, start )
  {
    start = parseInt( start, 10 );
    return input.slice( start );
  };
} );

ngapp.directive( 'mstphPaginate', function ()
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

        var prevBtn = $( '<input class="topcoat-button--cta" type="button" value="Previous" >' );
        prevBtn.bind( 'click', function () { $scope.mstphPaginate.doPrevClick() } );
        if ( $scope.mstphPaginate.isPrevEnabled() == false )
          prevBtn.attr( "disabled", "disabled" );

        var nextBtn = $( '<input class="topcoat-button--cta" type="button" value="Next" >' );
        nextBtn.bind( 'click', function () { $scope.mstphPaginate.doNextClick() } );
        if ( $scope.mstphPaginate.isNextEnabled() == false )
          nextBtn.attr( "disabled", "disabled" );

        var pagingLabel = $( '<span> Page ' + ( $scope.helpers.paging.currentPage + 1 ) + ' of ' + ( $scope.mstphPaginate.numberOfPages ) + ' </span>' );

        $element.append( prevBtn );
        $element.append( pagingLabel );
        $element.append( nextBtn );
      }

      $scope.mstphPaginate.doPrevClick = function () { 
        $scope.helpers.paging.currentPage--;
        $scope.helpers.paging.startFrom = ( $scope.helpers.paging.currentPage * $scope.mstphPaginate.pageSize );
        $scope.$apply();
        $scope.mstphPaginate.draw();
      };

      $scope.mstphPaginate.doNextClick = function () { 
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
} );


ngapp.directive("rawAjaxBusyIndicator", function () {
  return {
  link: function (scope, element) {
    scope.$on( "ajax-start", function ()
    {
      ngRootScope.showLoading = true;
      //element.attr( "style", "display: block" );
    } );

    scope.$on("ajax-stop", function () {
      ngRootScope.showLoading = false;
      //element.attr( "style", "display: none" );
      });
    }
  };
});


ngapp.directive( 'slideable', function ()
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
} );


ngapp.directive( 'slideToggle', function ()
{
  return {
    restrict: 'A',
    link: function ( scope, element, attrs )
    {
      var target = document.querySelector( attrs.slideToggle );
      attrs.expanded = false;
      element.bind( 'click', function ()
      {
        var content = target.querySelector( '.slideable_content' );
        if ( !attrs.expanded )
        {
          //target.style.bottom = '45px';
          content.style.border = '1px solid rgba(0,0,0,0)';
          var y = content.clientHeight;
          content.style.border = 0;
          target.style.height = y + 'px';
        } else
        {
          target.style.height = '0px';
          //target.style.bottom = '-20px';
        }
        attrs.expanded = !attrs.expanded;
      } );
    }
  }
} );