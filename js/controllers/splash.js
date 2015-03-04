var initialOutterHeight = 0;
ngapp.controller( 'SplashCtrl', ['$scope', 'factory', 'dataMgr', '$anchorScroll', '$location', '$timeout', '$window', function ( $scope, factory, dataMgr, $anchorScroll, $location, $timeout, $window )
{
  globalDataMgr = dataMgr;

  $scope.helpers = factory.getHelpers();
  $scope.helpers.showLoading = false;
  $scope.currentYear = new Date().getFullYear();

  $scope.favPath = '';

  dataMgr.setScopeFavContacts( function ( data )
  {
    if ( data.length > 0 )
      $scope.favPath = '/favContacts';

    else
    {
      dataMgr.setScopeFavFirms( function ( data )
      {
        if ( data.length > 0 )
          $scope.favPath = '/favFirms';
      } );
    }
  } );

  $timeout( function () { globalDataMgr.setScopeMenuItems( function ( data ) { } ); }, 1 );
  $timeout( function () { globalDataMgr.setScopeCorrespondentFirms( function ( data ) { } ); }, 33 );
  $timeout( function () { globalDataMgr.setScopeREOs( function ( data ) { } ); }, 44 );
  $timeout( function () { globalDataMgr.setScopeCountries( function ( data ) { } ); }, 1 );
  $timeout( function () { globalDataMgr.setScopeFirms( function ( data ) { } ); }, 11 );
  $timeout( function () { globalDataMgr.setScopeContacts( function ( data ) { } ); }, 22 );

  $scope.removeSearch = function ()
  {
    $scope.helpers.blockSearchBlur = true;
    $scope.search = '';
    $scope.searchDelayed = '';
    setTimeout( function () { jQuery( '.mstphSearchbox' )[0].focus(); }, 1 );
  }
  
  $scope.gotoSearch = function ( phrase )
  {
    $timeout( function () { document.getElementsByClassName( "mstphSearchbox" )[0].blur(); }, 111 );
    if ( phrase )
    {
      if ( phrase.length <= 2 )
        alert( "Search term must be at least 3 characters." );
      else
      {
        $scope.helpers.g( "/findContacts/" + phrase );
      }
    }
    else
      alert( "Please enter a search phrase." );
  }


  var w = angular.element( $window );
  $scope.getHeight = function ()
  {
    return w[0].innerHeight;
  };
  $scope.$watch( $scope.getHeight, function ( newValue, oldValue )
  {
    $scope.style = function ()
    {
      if ( initialOutterHeight == 0 )
        initialOutterHeight = w[0].outerHeight;

      if ( window && window.device && window.device.version && window.device.version === 7 )
      {
        return {
          height: ( initialOutterHeight ) + 'px',
          marginTop: '20px'
        };
      }
      else
      {
        return {
          height: ( initialOutterHeight ) + 'px'
        };
      }
    };
  } );

  w.bind( 'resize', function ()
  {
    $scope.$apply();
  } );

  $anchorScroll();

} ] );