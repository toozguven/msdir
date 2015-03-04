ngapp.controller( 'CountryContactsCtrl', ['$scope', 'factory', 'dataMgr', '$routeParams', '$anchorScroll', '$location', '$timeout', function ( $scope, factory, dataMgr, $routeParams, $anchorScroll, $location, $timeout )
{
  $scope.helpers = factory.getHelpers();
  $scope.helpers.showLoading = true;
  $scope.countryId = parseInt( $routeParams.id );
  $scope.country = {};
  $scope.towns = [];
  $scope.contacts = [];

  $scope.notes = "";

  $scope.searchDelayed = "";
  $scope.helpers.delayModelSetting( $scope, $timeout, "search", function ( val ) { $scope.searchDelayed = val; } );

  $scope.searchDelayedFunc = function ( item )
  {
    if ( $scope.searchDelayed )
      return item.n.toLowerCase().indexOf( $scope.searchDelayed.toLowerCase() ) > -1
              || ( item.nfs && item.nfs.toLowerCase().indexOf( $scope.searchDelayed.toLowerCase() ) > -1 )
              || item.l.toLowerCase().indexOf( $scope.searchDelayed.toLowerCase() ) > -1;

    return true;
  }

  $scope.removeSearch = function ()
  {
    $scope.search = '';
    $scope.searchDelayed = '';
    jQuery( '.mstphSearchbox' ).focus();
  }

  $scope.relevanceFunc = function ( contact )
  {
    if ( $scope.searchDelayed )
    {
      if ( contact.n.toLowerCase().indexOf( $scope.searchDelayed.toLowerCase() ) > -1 || ( contact.nfs && contact.nfs.toLowerCase().indexOf( $scope.searchDelayed.toLowerCase() ) > -1 ) )
        return 1;

      if ( contact.l.toLowerCase().indexOf( $scope.searchDelayed.toLowerCase() ) > -1 )
        return 2;
    }
    return 999;
  }

  $scope.customStateFilterFunc = function ( item )
  {
    return $scope.selectedStateId == item.sid;

    return true;
  }

  $scope.positiveIdsOnly = function ( item ) { return item.id > 0 };

  
  $timeout( function ()
  {
    dataMgr.setScopeCountries( function ( data )
    {
      $scope.country = dataMgr.getCountry( data, $routeParams.id );
      $scope.towns = $scope.country.towns;

      try
      {
        $scope.state = dataMgr.getState( $scope.country.states, $routeParams.sid == 0 ? 1 : $routeParams.sid );
      } catch ( e ) { }

      if ( $scope.state )
      {
        $scope.selectedStateId = $scope.state.id;
      }

      dataMgr.setScopeContacts( function ( data )
      {
        $scope.contacts = dataMgr.filterByField( data, "cid", $scope.countryId );
        if ( $scope.contacts.length == 0 )
        {
          dataMgr.setScopeFirms( function ( firmsData )
          {
            var firms = dataMgr.filterByField( firmsData, "cid", $scope.countryId );
            var countryContacts = [];
            for ( var i = 0; i < firms.length; i++ )
            {
              if ( firms[i].cm && firms[i].cm.length > 5 )
                $scope.notes = firms[i].cm;

              countryContacts.push( { "firm": firms[i], "cs": firms[i].cs } );
            }

            for ( var i = 0; i < countryContacts.length; i++ )
            {
              for ( var j = 0; j < countryContacts[i].cs.length; j++ )
              {
                var tempContact = dataMgr.getContact( data, countryContacts[i].cs[j].id );
                tempContact.cid = $scope.countryId;
                tempContact.l = "";
                tempContact.f = "";
                $scope.contacts.push( tempContact );
              }

            }
            $scope.helpers.showLoading = false;
          } );
        }
        else
        {
          $scope.helpers.showLoading = false;
        }
      } );

    } );
  }, $scope.helpers.renderDelay );

  
  $scope.redirectToState = function ()
  {
    //$scope.helpers.showLoading = true;
    $scope.helpers.g("/countryWithStateContacts/" + $scope.countryId + "/" + $scope.selectedStateId );
  }

  $anchorScroll();
} ] );