ngapp.controller( 'ContactCtrl', function ( $scope, factory, dataMgr, $routeParams, $anchorScroll, $timeout )
{
  $scope.helpers = factory.getHelpers();

  dataMgr.setScopeContacts( function ( data )
  {
    $timeout( function ()
    {
      $scope.contact = dataMgr.getContact( data, $routeParams.id );
      $scope.helpers.showLoading = false;

    }, $scope.helpers.renderDelay );

  } );
  
  $anchorScroll();
} );