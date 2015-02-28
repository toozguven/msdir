ngapp.controller( 'FindFirmsCtrl', function ( $scope, $filter, factory, dataMgr, $routeParams, $anchorScroll, $location, $timeout )
{
  $scope.helpers = factory.getHelpers();
  $scope.firms = [];
  $scope.similarPhrases = [];
  $scope.similarPhrasesFound = false;
  
  $scope.searchDelayed = $routeParams.phrase;
  $scope.search = $routeParams.phrase;
  
  $scope.helpers.delayModelSetting( $scope, $timeout, "search", function ( val ) { 
    $scope.searchDelayed = val; 

    dataMgr.getSimilarPhrasesForFirms( val, function ( data )
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

  $scope.searchDelayedFunc = function ( item )
  {
    if ( $scope.searchDelayed )
    {
      if ( $scope.searchDelayed.length < 3 )
        return false;

      if ( $scope.searchDelayed.indexOf( " " ) > -1 )
      {
        var arr = $scope.searchDelayed.split( " " );
        var rtnVal = false;
        var atLeastOneMatch = false;
        for ( i = 0; i < arr.length; i++ )
        {
          rtnVal = ( item.nfs && item.nfs.toLowerCase().indexOf( arr[i].toLowerCase() ) > -1 )
              || item.n.toLowerCase().indexOf( arr[i].toLowerCase() ) > -1
              || item.l.toLowerCase().indexOf( arr[i].toLowerCase() ) > -1;
          if ( rtnVal == false )
            return false;
          else
            atLeastOneMatch = true;
        }

        return atLeastOneMatch;
      }

      return ( item.nfs && item.nfs.toLowerCase().indexOf( $scope.searchDelayed.toLowerCase() ) > -1 )
              || item.n.toLowerCase().indexOf( $scope.searchDelayed.toLowerCase() ) > -1
              || item.l.toLowerCase().indexOf( $scope.searchDelayed.toLowerCase() ) > -1;
    }

    if ( !( $scope.searchDelayed ) || $scope.searchDelayed == "" )
    {
      $scope.searchDelayed = "";
      return false;
    }

    
    return true;
  }

  $scope.removeSearch = function ()
  {
    $scope.search = '';
    $scope.searchDelayed = '';
    jQuery( '.mstphSearchbox' ).focus();
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
    $scope.firms = data;
    $scope.fuzzyFirms = data;
    $scope.fuzzyResultsFound = true;
    $scope.helpers.showLoading = false;
  } );

  $anchorScroll();
} );