﻿ngapp.controller( 'ReosCtrl', function ( $scope, $rootScope, factory, dataMgr, $anchorScroll, $location, $timeout )
{
  $scope.helpers = factory.getHelpers();
  
  $scope.reos = []; //set as empty array
  
  
  dataMgr.setScopeREOs( function ( data ) { 
    $timeout( function ()
    {
      $scope.reos = data;
      $scope.helpers.showLoading = false;
      
      setTimeout( dealWithHistory, 1 );

    }, $scope.helpers.renderDelay );
    
  } );
  
  $scope.currentlyOpenFirms = "{0}";

  $scope.toggleFirm = function (fid)
  {
    if ( $scope.currentlyOpenFirms.indexOf( "{" + fid + "}" ) > -1 )
    {
      $scope.currentlyOpenFirms = $scope.currentlyOpenFirms.replace( "{" + fid + "}", "" );
      jQuery( ".reoDetailsDiv" + fid ).hide( 'slow' );
    }
    else
    {
      $scope.currentlyOpenFirms = "{" + fid + "}";

      jQuery( ".reoDetailsDiv" ).hide();

      jQuery( 'html, body' ).animate( {
          scrollTop: $( "#" + fid ).offset().top - 100
        }, 1000 );

      history.pushState( "fid__" + fid, "reoSelected" );
      
      jQuery( ".reoDetailsDiv" + fid ).show( 'slow' );
    }
  }

  $scope.isVisible = function ( fid )
  {
    return $scope.currentlyOpenFirms.indexOf( "{" + fid + "}" ) > -1;
  }

  $anchorScroll();

  function dealWithHistory()
  {
    if ( history.state )
    {
      if ( history.state.toString().indexOf( "fid__" ) > -1 )
      {
        var sFId = history.state.toString().replace( "fid__", "" );
        
        console_log( "sFId: " + sFId );
        
        var fId = parseInt( sFId );
        console_log( "fId: " + fId );

        if ( fId > 0 )
        {
          $scope.toggleFirm(fId);
//          history.replaceState( "fid__0", "reoSelected" );
        }
      }
    }
  }
} );