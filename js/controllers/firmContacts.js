ngapp.controller( 'FirmContactsCtrl', ['$scope', 'factory', 'dataMgr', '$routeParams', '$anchorScroll', '$location', '$timeout', function ( $scope, factory, dataMgr, $routeParams, $anchorScroll, $location, $timeout )
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
      $scope.isReo = false;

      if ( $scope.contacts.length == 0 )
      {
        dataMgr.setScopeREOs( function ( reos )
        {
          var reo = dataMgr.filterByField( reos, "id", $routeParams.id );
          $scope.contacts = [];
          try
          {
            $scope.contacts = reo[0].members;
            $scope.isReo = true;
          }
          catch ( e ) { $scope.contacts = []; }
          $scope.helpers.showLoading = false;
        } );
      }

      $scope.helpers.showLoading = false;
    } );

  } );

  


  $scope.redirectToState = function ()
  {
    $scope.helpers.g("/countryWithStateContacts/" + $scope.countryId + "/" + $scope.selectedStateId );
  }

  $anchorScroll();
} ] );