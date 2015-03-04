﻿ngapp.controller( 'FavFirmsCtrl', ['$scope', '$filter', 'factory', 'dataMgr', '$routeParams', '$anchorScroll', '$location', '$timeout', function ( $scope, $filter, factory, dataMgr, $routeParams, $anchorScroll, $location, $timeout )
{
  $scope.helpers = factory.getHelpers();
  $scope.firms = [];
  
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

  dataMgr.setScopeFavFirms( function ( data )
  {
    $scope.firms = data;
    $scope.helpers.showLoading = false;
  } );

  $anchorScroll();
} ] );