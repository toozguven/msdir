ngapp.controller( 'AppInfoCtrl', function ( $scope, factory, dataMgr, $anchorScroll, $location, $timeout )
{
  $scope.helpers = factory.getHelpers();
} );