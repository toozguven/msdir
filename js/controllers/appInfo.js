ngapp.controller( 'AppInfoCtrl', function ( $scope, factory, dataMgr, $anchorScroll, $location, $timeout )
{
  $scope.helpers = factory.getHelpers();
  $scope.dataMgr = dataMgr;
  $scope.helpers.showLoading = false;

  $scope.LastUpdatedOn = dataMgr.getLastUpdatedDateAsString();
  $scope.AppVersion = $scope.helpers.AppVersion;

  $scope.updateData = function ()
  {
    $scope.helpers.showLoading = true;

    dataMgr.updateDataNow( function ( isSuccess )
    {
      alert("Data has been updated");
      $scope.LastUpdatedOn = dataMgr.getLastUpdatedDateAsString();
      $scope.helpers.showLoading = false;
    });
    
  }
} );