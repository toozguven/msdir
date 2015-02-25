ngapp.controller( 'ContactCtrl', function ( $scope, factory, dataMgr, $routeParams, $anchorScroll, $timeout )
{
  $scope.helpers = factory.getHelpers();
  $scope.dataMgr = dataMgr;
  
  dataMgr.setScopeContacts( function ( data )
  {
    $scope.contact = dataMgr.getContact( data, $routeParams.id );
    $scope.helpers.showLoading = false;
  } );
  
  $anchorScroll();
} );