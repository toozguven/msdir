ngapp.controller( 'FirmCtrl', function ( $scope, factory, dataMgr, $routeParams, $anchorScroll, $timeout )
{
  $scope.helpers = factory.getHelpers();
  $scope.dataMgr = dataMgr;

  $scope.firm = {};

  dataMgr.setScopeSingleFirm( $routeParams.id, function ( data )
  {
    $scope.firm = data;
    $scope.helpers.showLoading = false;    
  } );

  $anchorScroll();
} );