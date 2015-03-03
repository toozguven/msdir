ngapp.controller( 'FindContactsCtrl', function ( $scope, factory, dataMgr, $routeParams, $anchorScroll, $location, $timeout )
{
  $scope.helpers = factory.getHelpers();
  $scope.contacts = [];
  $scope.similarPhrases = [];
  $scope.similarPhrasesFound = false;

  $scope.search = $routeParams.phrase;
  $scope.searchDelayed = $routeParams.phrase;
  $scope.helpers.delayModelSetting( $scope, $timeout, "search", function ( val ) { 
    $scope.searchDelayed = val; 

    dataMgr.getSimilarPhrasesForContacts( val, function ( data )
    {
      if ( data.length > 0 )
      {
        $scope.similarPhrases = data;
        $scope.similarPhrasesFound = true;
      }
      else
      {
        $scope.similarPhrases = [];
        $scope.similarPhrasesFound = false;
      }
    } );

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
    if ( contact.fn.toLowerCase().indexOf( $scope.searchDelayed.toLowerCase() ) == 0 )
      return 1;

    if ( contact.ln.toLowerCase().indexOf( $scope.searchDelayed.toLowerCase() ) == 0 )
      return 1;

    if ( contact.n.toLowerCase().indexOf( $scope.searchDelayed.toLowerCase() ) > -1  )
      return 3;

    if (contact.nfs && contact.nfs.toLowerCase().indexOf( $scope.searchDelayed.toLowerCase() ) > -1 )
      return 4;

    if ( contact.l.toLowerCase().indexOf( $scope.searchDelayed.toLowerCase() ) > -1 )
      return 5;

    return 999;
  }

  $timeout(function () {dataMgr.setScopeContacts( function ( data )
  {
    $scope.contacts = data;
    $anchorScroll();
    $scope.helpers.showLoading = false;
    
  } );}, 444);
  
  
} );