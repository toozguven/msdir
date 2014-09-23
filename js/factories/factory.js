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
        return ( val && val.length > 2 && val != "0" && val != "666" );
      },
      getGmtString: function(gmtoffset) {
        try {
          if ( gmtoffset.toString().indexOf( "666" ) > -1 )
            return "";
          if ( gmtoffset > 0 )
            return "+" + gmtoffset;
          if ( gmtoffset == 0 )
            return "";

          return "-" + gmtoffset;
        }
        catch ( e ) { }
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

      f: function ( fid ) { 
        if ( $rootScope.menuVisible )
          $rootScope.doMenuClick();

        $location.path( "/f/" + fid );        
      },

      c: function ( cid ) { 
        if ( $rootScope.menuVisible )
          $rootScope.doMenuClick(); 
        $location.path( "/c/" + cid );
      },
      
      g: function ( path )
      {        
        if ( $rootScope.menuVisible )
          $rootScope.doMenuClick();
        
        this.showLoading = true; 
        $location.path( path ); 

      },

      goBack: function (step) {
        if ( $rootScope.menuVisible )
          $rootScope.doMenuClick();

        javascript:history.go(step);
      },

      goBack: function () {
        if ( $rootScope.menuVisible )
          $rootScope.doMenuClick();

        history.back( -1 );
      },
      getNavSelectedCss: function(path) {
        if ( path == "#" && $location.path() == "/" )
          return "bottomNavSelected";
        

        if ( $location.path().indexOf( path ) > -1 )
          return "bottomNavSelected";
        return "";
      },
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
      renderDelay: 999,
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
        if ( $rootScope.menuVisible )
          $rootScope.doMenuClick();

        var url = document.getElementById( hiddenFieldId ).value;
        window.open( url, isNewWindow ? '_blank' : '_self', isShowLocation ? 'location=yes' : 'location=no' );

      },
      openWebPage2: function ( url, isNewWindow, isShowLocation )
      {
        if ( $rootScope.menuVisible )
          $rootScope.doMenuClick();

        window.open( url, isNewWindow ? '_blank' : '_self', isShowLocation ? 'location=yes' : 'location=no' );
      },
      closeMenu: function() {
        if ( $rootScope.menuVisible )
          $rootScope.doMenuClick();
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

