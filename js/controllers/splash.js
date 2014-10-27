ngapp.controller( 'SplashCtrl', function ( $scope, factory, dataMgr, $anchorScroll, $location, $timeout, $window )
{
  $scope.helpers = factory.getHelpers();
  $scope.helpers.showLoading = false;
  $scope.currentYear = new Date().getFullYear();
  
  $scope.gotoFirmSearch = function ( phrase )
  {
    if ( phrase )
    {
      if ( phrase.length <= 2 )
        alert( "Search term must be at least 3 characters." );
      else
      {
        $location.path( "/findFirms/" + phrase );
      }
    }
    else
      alert( "Please enter a search phrase." );
  }


  var w = angular.element( $window );
  $scope.getHeight = function ()
  {
    return w[0].innerHeight;
  };
  $scope.$watch( $scope.getHeight, function ( newValue, oldValue )
  {
    $scope.style = function ()
    {
      return {
        height: ( w[0].outerHeight ) + 'px'
      };
    };
  } );

  w.bind( 'resize', function ()
  {
    $scope.$apply();
  } );

  $anchorScroll();

} );