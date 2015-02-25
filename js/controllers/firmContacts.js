ngapp.controller( 'FirmContactsCtrl', function ( $scope, factory, dataMgr, $routeParams, $anchorScroll, $location, $timeout )
{
  $scope.helpers = factory.getHelpers();

  $scope.firmId = parseInt( $routeParams.id );
  $scope.firms = [];
  $scope.contacts = [];
  $scope.internationalContacts = [];

  dataMgr.setScopeSingleFirm( $scope.firmId, function ( firm )
  {
    $scope.firm = firm;

    dataMgr.setScopeContacts( function ( data )
    {
      $scope.internationalContacts = dataMgr.getInternationalContactsForFirm( data, $scope.firm );
      $scope.contacts = dataMgr.getMainContactsForFirm( data, $scope.firm, $scope.internationalContacts );
        

      $scope.helpers.showLoading = false;

  } );

  


  $scope.redirectToState = function ()
  {
    $scope.helpers.g("/countryWithStateContacts/" + $scope.countryId + "/" + $scope.selectedStateId );
  }

  $anchorScroll();
} );