ngapp.controller( 'AppInfoCtrl', function ( $scope, factory, dataMgr, $anchorScroll, $location, $timeout )
{
  $scope.helpers = factory.getHelpers();
  $scope.dataMgr = dataMgr;

  $scope.LastUpdatedOn = dataMgr.getLastUpdatedDateAsString();
  $scope.AppVersion = $scope.helpers.AppVersion;
  $scope.helpers.showLoading = false;

  $scope.updateData = function ()
  {
    if ( $scope.helpers.isOnline() == false )
    {
      alert( "Your device seems to be offline. Please try again when you have an internet connection." );
      return;
    }

    $scope.helpers.showLoading = true;

    var prevUpdatedDate = $scope.LastUpdatedOn;

    dataMgr.updateDataNow( function ( isSuccess )
    {
      $scope.LastUpdatedOn = dataMgr.getLastUpdatedDateAsString();

      if ( prevUpdatedDate == $scope.LastUpdatedOn )
        alert("No new data found.");
      else
        alert("Application data has been updated");
      
      $scope.helpers.showLoading = false;
    });
    
  }

  $anchorScroll();
} );