ngapp.controller( 'FirmCtrl', function ( $scope, factory, dataMgr, $routeParams, $anchorScroll, $timeout )
{
  $scope.helpers = factory.getHelpers();
  $scope.firm = {};

  dataMgr.setScopeFirms( function ( data )
  {
    $timeout( function ()
    {
      $scope.firm = dataMgr.getFirm( data, $routeParams.id );
      $scope.helpers.showLoading = false;

    }, $scope.helpers.renderDelay );
    
  } );

  $anchorScroll();
} );