var initialOutterHeight = 0;

ngapp.controller( 'FirstTimeCtrl', function ( $scope, factory, dataMgr, $anchorScroll, $location, $timeout, $window )
{
  $scope.helpers = factory.getHelpers();
  $scope.dataMgr = dataMgr;
  $scope.dataMgr.showLoading = false;
  $scope.currentYear = new Date().getFullYear();

  $scope.doInit = function ()
  {
    dataMgr.recordAgreement();
    $scope.helpers.gotoApp();
  }

  $anchorScroll();
} );