ngapp.controller( 'FavContactsCtrl', ['$scope', '$filter', 'factory', 'dataMgr', '$routeParams', '$anchorScroll', '$location', '$timeout', function ( $scope, $filter, factory, dataMgr, $routeParams, $anchorScroll, $location, $timeout )
{
  $scope.helpers = factory.getHelpers();
  $scope.contacts = [];
  
  $scope.searchDelayed = $routeParams.phrase;
  $scope.search = $routeParams.phrase;
  
  $scope.helpers.delayModelSetting( $scope, $timeout, "search", function ( val ) { $scope.searchDelayed = val; } );

  $scope.searchDelayedFunc = function ( item )
  {
    if ( $scope.searchDelayed )
      return item.n.toLowerCase().indexOf( $scope.searchDelayed.toLowerCase() ) > -1
              || item.l.toLowerCase().indexOf( $scope.searchDelayed.toLowerCase() ) > -1;

    return true;
  }

  dataMgr.setScopeFavContacts( function ( data )
  {
    $scope.contacts = data;
    $scope.helpers.showLoading = false;
  } );

  $anchorScroll();
} ] );