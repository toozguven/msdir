ngapp.controller( 'CorrespondentFirmsCtrl', function ( $scope, factory, dataMgr, $anchorScroll, $location, $timeout )
{
  $scope.helpers = factory.getHelpers();

  $scope.cFirms = []; //set as empty array
  $scope.countries = []; //set as empty array

  $scope.searchDelayed = "";
  $scope.helpers.delayModelSetting( $scope, $timeout, "search", function ( val ) { $scope.searchDelayed = val; } );

  dataMgr.setScopeCorrespondentFirms( function ( data )
  {
    $timeout( function ()
    {
      //console_log( JSON.stringify( data ) )

      $scope.cFirms = data;

      dataMgr.setScopeCountries( function ( listOfCountries )
      {
        var tempCountry = 0;
        for ( var i = 0; i < data.length; i++ )
        {
          if ( tempCountry != parseInt(data[i].cid) )
          {
            $scope.countries.push( { n: data[i].c, id: data[i].cid } );
            tempCountry = parseInt( data[i].cid );
            //console_log( "Found new country: " + data[i].c + " - " + data[i].cid )
          }
        }
        //console_log( JSON.stringify( $scope.countries ) )
        $scope.helpers.showLoading = false;

      } )
    }, $scope.helpers.renderDelay );;

  } );

  $anchorScroll();
} );