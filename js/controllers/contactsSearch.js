ngapp.controller( 'FindContactsCtrl', function ( $scope, factory, dataMgr, $routeParams, $anchorScroll, $location, $timeout )
{
  $scope.helpers = factory.getHelpers();

  $scope.contacts = [];

  //$scope.$apply();
  //return;

  $scope.search = $routeParams.phrase;
  $scope.searchDelayed = $routeParams.phrase;
  $scope.helpers.delayModelSetting( $scope, $timeout, "search", function ( val ) { 
    $scope.searchDelayed = val; 
  } );

  $scope.removeSearch = function ()
  {
    $scope.search = '';
    $scope.searchDelayed = '';
    jQuery( '.mstphSearchbox' ).focus();
  }

  $scope.searchDelayedFunc = function ( item )
  {
    if ( $scope.searchDelayed )
    {
      if ( $scope.searchDelayed.length < 3 )
        return false;

      if ( $scope.searchDelayed.indexOf(" ") > -1 )
      {
        var arr = $scope.searchDelayed.split( " " );
        var rtnVal = false;
        var atLeastOneMatch = false;
        for (i=0; i<arr.length; i++)
        {
          rtnVal = item.n.toLowerCase().indexOf( arr[i].toLowerCase() ) > -1
              || ( item.nfs && item.nfs.toLowerCase().indexOf( arr[i].toLowerCase() ) > -1 )
              || item.l.toLowerCase().indexOf( arr[i].toLowerCase() ) > -1;
          if ( rtnVal == false )
            return false;
          else
            atLeastOneMatch = true;
        }

        return atLeastOneMatch;
      }
      return item.n.toLowerCase().indexOf( $scope.searchDelayed.toLowerCase() ) > -1
              || (item.nfs && item.nfs.toLowerCase().indexOf( $scope.searchDelayed.toLowerCase() ) > -1)
              || item.l.toLowerCase().indexOf( $scope.searchDelayed.toLowerCase() ) > -1;
    }

    if ( !( $scope.searchDelayed ) || $scope.searchDelayed == "" )
    {
      $scope.searchDelayed = "";
      return false;
    }

    return true;
  }

  $scope.relevanceFunc = function ( contact )
  {
    if ( contact.n.toLowerCase().indexOf( $scope.searchDelayed.toLowerCase() ) > -1 || ( contact.nfs && contact.nfs.toLowerCase().indexOf( $scope.searchDelayed.toLowerCase() ) > -1 ) )
      return 1;

    if ( contact.l.toLowerCase().indexOf( $scope.searchDelayed.toLowerCase() ) > -1 )
      return 2;

    return 999;
  }

  dataMgr.setScopeContacts( function ( data )
  {
    $timeout( function ()
    {
      $scope.contacts = data;
      $scope.helpers.showLoading = false;

    }, $scope.helpers.renderDelay );
    
  } );
  
  $anchorScroll();
} );