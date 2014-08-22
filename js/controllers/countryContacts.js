ngapp.controller( 'CountryContactsCtrl', function ( $scope, factory, dataMgr, $routeParams, $anchorScroll, $location, $timeout )
{
  $scope.helpers = factory.getHelpers();

  $scope.countryId = parseInt( $routeParams.id );
  $scope.country = {};
  $scope.towns = [];
  $scope.contacts = [];

  $scope.searchDelayed = "";
  $scope.helpers.delayModelSetting( $scope, $timeout, "search", function ( val ) { $scope.searchDelayed = val; } );

  $scope.searchDelayedFunc = function ( item )
  {
    if ( $scope.searchDelayed )
      return item.n.toLowerCase().indexOf( $scope.searchDelayed ) > -1;

    return true;
  }

  dataMgr.setScopeCountries( function ( data )
  {
    $timeout( function ()
    {
      $scope.country = dataMgr.getCountry( data, $routeParams.id );
      $scope.towns = $scope.country.towns;

      try
      {
        $scope.state = dataMgr.getState( $scope.country.states, $routeParams.sid );
      } catch ( e ) { }

      if ( $scope.state )
        $scope.selectedStateId = $scope.state.id;

      dataMgr.setScopeContacts( function ( data )
      {
        $scope.contacts = dataMgr.filterByField( data, "cid", $scope.countryId );

        $scope.helpers.showLoading = false;
      } );

    }, $scope.helpers.renderDelay );

  } );

  
  $scope.redirectToState = function ()
  {
    $scope.helpers.showLoading = true;
    $location.path( "/countryWithStateContacts/" + $scope.countryId + "/" + $scope.selectedStateId );
  }

  $anchorScroll();
} );