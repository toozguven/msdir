ngapp.controller( 'FirmCtrl', function ( $scope, factory, dataMgr, $routeParams, $anchorScroll, $timeout )
{
  $scope.helpers = factory.getHelpers();
  $scope.dataMgr = dataMgr;

  $scope.firm = {};

  dataMgr.setScopeSingleFirm( $routeParams.id, function ( data )
  {
    $scope.firm = data;
    dataMgr.setScopeREOs( function ( reos ) { 
      var reo = dataMgr.filterByField( reos, "id", $routeParams.id );
      $scope.reoContacts = [];
      try {
        $scope.reoContacts = reo[0].members;
      }
      catch (e) {$scope.reoContacts = [];}
      $scope.helpers.showLoading = false;
    } );
     
  } );

  $anchorScroll();
} );