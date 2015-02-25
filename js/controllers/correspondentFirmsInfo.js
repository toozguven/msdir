ngapp.controller( 'CorrespondentFirmsInfoCtrl', function ( $scope, factory, dataMgr, $anchorScroll, $location, $timeout )
{
  $scope.helpers = factory.getHelpers();
  $scope.helpers.showLoading = false;

} );