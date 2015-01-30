ngapp.controller( 'FirmCtrl', function ( $scope, factory, dataMgr, $routeParams, $anchorScroll, $timeout )
{
  $scope.helpers = factory.getHelpers();
  $scope.dataMgr = dataMgr;

  $scope.firm = {};

  dataMgr.setScopeSingleFirm( $routeParams.id, function ( data )
  {
    $timeout( function ()
    {
      $scope.firm = data;
      $scope.helpers.showLoading = false;

    }, $scope.helpers.renderDelay );
    
  } );

  $anchorScroll();
} );