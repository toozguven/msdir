ngapp.factory( "factory", function ( $http, $rootScope, $location )
{
  ngRootScope = $rootScope;
  ngRootScope.isOnline = -1;
  ngRootScope.isPhone = false;
  ngRootScope.utc_offset = 0;
  ngRootScope.dst_offset = 0;
  ngRootScope.lat = 0;
  ngRootScope.lon = 0;

  var factory = {};
  

  //generic helpers
  factory.getHelpers = function ()
  {
    var rtnVal = {
      hasValueFunc: function ( val )
      {
        return ( val && val.length > 2 && val != "0");
      },
      getContactImageUrl: function ( cid )
      {
        return "https://api.moorestephens.org/i/msimage2.ashx?cid=" + cid;
      },
      getContactProfileUrl: function ( cid )
      {
        return "https://onlineforms.moorestephens.org/Contact2/IntDirProfile?id=" + cid;
      },
      getFirmProfileUrl: function ( cid )
      {
        return "https://onlineforms.moorestephens.org/Firm2/IntDirProfile?id=" + cid;
      },
      getMapUrl: function ( firm )
      {
        return "https://onlineforms.moorestephens.org/Firm2/IntDirMap" + "?q=" + firm.lat + "," + firm.lon;
      },
      getDirectionsUrl: function ( firm )
      {
        return "https://onlineforms.moorestephens.org/Firm2/IntDirDirections?daddr=" + firm.lat + "," + firm.lon + "&saddr=" + ngRootScope.lat + "," + ngRootScope.lon;
      },
      f: function ( fid ) { $location.path( "/f/" + fid ); },
      c: function ( cid ) { $location.path( "/c/" + cid ); },
      g: function ( path ) { this.showLoading = true; $location.path( path ); },
      rootScope: ngRootScope,
      isOnline: function ()
      {
        return ngRootScope.isOnline != 0;
      },
      isPhone: function ()
      {
        return ngRootScope.isPhone;
      },
      showLoading: true,
      renderDelay: 111,
      paging: { 
        pageSize: 10, 
        currentPage: 0, 
        startFrom: ( this.currentPage * this.pageSize )
      },
      getCountryName: function ( cname )
      {
        if ( cname == "Former Yugoslav Republic of Macedonia" )
          return "F.Y.R. Macedonia";
        return cname;
      },
      getUrl: function ( url )
      {
        if (url && url != "")
        {
          if ( url.indexOf( "http" ) > -1 )
            return url;
          return "http://" + url;
        }

        return "";
      },
      openWebPage: function (hiddenFieldId, isNewWindow, isShowLocation)
      {
        var url = document.getElementById( hiddenFieldId ).value;
        window.open( url, isNewWindow ? '_blank' : '_self', isShowLocation ? 'location=yes' : 'location=no' );

      },
      openWebPage2: function ( url, isNewWindow, isShowLocation )
      {
        window.open( url, isNewWindow ? '_blank' : '_self', isShowLocation ? 'location=yes' : 'location=no' );
      },
      delayModelSetting: function ( scope, timeout, modelToWatch, callback )
      {
        var tempDelayed = "", searchTimeoutFunc;
        scope.$watch( modelToWatch, function ( val )
        {
          if ( searchTimeoutFunc )
            timeout.cancel( searchTimeoutFunc );

          tempDelayed = val;

          searchTimeoutFunc = timeout( function () //delay run this func
          {
            callback(tempDelayed);

            try {
              //reset and redraw paging if any
              scope.helpers.paging.startFrom = 0;
              scope.helpers.paging.currentPage = 0;
              scope.mstphPaginate.draw();
              scope.$apply();
            } catch ( ex ) { }

          }, 555 );
        } );
      }
    };
    return rtnVal;
  }

  return factory;
} );

