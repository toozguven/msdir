ngapp.controller( 'FirmContactsCtrl', function ( $scope, factory, dataMgr, $routeParams, $anchorScroll, $location, $timeout )
{
  $scope.helpers = factory.getHelpers();

  $scope.firmId = parseInt( $routeParams.id );
  $scope.firms = [];
  $scope.contacts = [];
  $scope.internationalContacts = [];

  dataMgr.setScopeFirms( function ( data )
  {
    $timeout( function ()
    {
      $scope.firms = data;
      $scope.firm = dataMgr.getFirm( data, $scope.firmId );

      dataMgr.setScopeContacts( function ( data )
      {
        $scope.contacts = dataMgr.getMainContactsForFirm( data, $scope.firm );
        $scope.internationalContacts = dataMgr.getInternationalContactsForFirm( data, $scope.firm );

        $scope.helpers.showLoading = false;
      } );

    }, $scope.helpers.renderDelay );

  } );

  


  $scope.redirectToState = function ()
  {
    $location.path( "/countryWithStateContacts/" + $scope.countryId + "/" + $scope.selectedStateId );
  }

  $anchorScroll();
} );