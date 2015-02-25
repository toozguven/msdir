ngapp.controller( 'AboutUsCtrl', function ( $scope, factory, dataMgr, $anchorScroll, $location, $timeout )
{
  $scope.helpers = factory.getHelpers();
  $scope.helpers.showLoading = false;

  //dataMgr.setScopePageContents( function ( data )
  //{
  //  $timeout( function ()
  //  {
  //    $scope.pageContent = dataMgr.filterByField( data, "id", "AboutUs" )[0];
  //    $scope.helpers.showLoading = false;

  //  }, $scope.helpers.renderDelay );

  //} );


  $anchorScroll();
} );