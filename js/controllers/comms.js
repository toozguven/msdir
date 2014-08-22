ngapp.controller( 'CommsCtrl', function ( $scope, factory, dataMgr, $anchorScroll, $location, $timeout )
{
  $scope.helpers = factory.getHelpers();

  $scope.comms = []; //set as empty array

  dataMgr.setScopeComms( function ( data ) { 
    $timeout( function ()
    {
      $scope.comms = data;
      $scope.helpers.showLoading = false;

    }, $scope.helpers.renderDelay );
    
  } );



  $scope.currentlyOpenComms = "{0}";

  $scope.toggleComm = function ( cid )
  {
    if ( $scope.currentlyOpenComms.indexOf( "{" + cid + "}" ) > -1 )
      $scope.currentlyOpenComms = $scope.currentlyOpenComms.replace( "{" + cid + "}", "" );
    else
      $scope.currentlyOpenComms = $scope.currentlyOpenComms + "{" + cid + "}";
  }

  $scope.isVisible = function ( cid )
  {
    return $scope.currentlyOpenComms.indexOf( "{" + cid + "}" ) > -1;
  }

  $anchorScroll();
} );