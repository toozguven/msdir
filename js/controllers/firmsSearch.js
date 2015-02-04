ngapp.controller( 'FindFirmsCtrl', function ( $scope, $filter, factory, dataMgr, $routeParams, $anchorScroll, $location, $timeout )
{
  $scope.helpers = factory.getHelpers();
  $scope.firms = [];
  
  $scope.searchDelayed = $routeParams.phrase;
  $scope.search = $routeParams.phrase;
  
  $scope.helpers.delayModelSetting( $scope, $timeout, "search", function ( val ) { $scope.searchDelayed = val; } );

  $scope.searchDelayedFunc = function ( item )
  {
    if ( $scope.searchDelayed )
      return  item.n.toLowerCase().indexOf(  $scope.searchDelayed.toLowerCase() ) > -1
              ||  item.l.toLowerCase().indexOf(  $scope.searchDelayed.toLowerCase() ) > -1;

    return true;
  }

  $scope.relevanceFunc = function ( firm )
  {
    if ( firm.n.toLowerCase().indexOf( $scope.searchDelayed.toLowerCase() ) > -1 )
      return 1;

    if ( firm.l.toLowerCase().indexOf( $scope.searchDelayed.toLowerCase() ) > -1 )
      return 2;

    return 999;
  }

  dataMgr.setScopeFirms( function ( data )
  {
    $timeout( function ()
    {
      $scope.firms = data;
      $scope.helpers.showLoading = false;

      /*if ( ($filter( "filter" )( $scope.firms, $scope.search )).length <= 0)
      {
        $location.path( "findContacts/" + $scope.search );
      }*/

    }, $scope.helpers.renderDelay );
  } );

  $anchorScroll();
} );