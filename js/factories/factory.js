ngapp.factory( "factory", function ( $http, $rootScope, $location, $route, $window )
{
  ngRootScope = $rootScope;
  ngRootScope.isOnline = -1;
  ngRootScope.isPhone = false;
  ngRootScope.utc_offset = 0;
  ngRootScope.dst_offset = 0;
  ngRootScope.lat = 0;
  ngRootScope.lon = 0;

  $rootScope.reLoadCurrentPage = function ()
  {
    $route.reload();
  };

  var factory = {};
  

  //generic helpers
  factory.getHelpers = function ()
  {
    var rtnVal = {
      AppVersion: "1.0",
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
        return "https://api.moorestephens.org/i/msdirImg.ashx?cid=" + cid;
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

      getTel: function(telNo) {
        try {
          return telNo.replace(/\s/g, '').replace('(0)', '');
        }
        catch ( e ) { return telNo; }
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

      getFirmStatus: function ( f )
      {
        if ( f && f.st )
        {
          return f.st;
          if ( f.st.indexOf( "Umbrella" ) > -1 || f.st.indexOf( "umbrella" ) > -1 || f.st.indexOf( "UMBRELLA" ) > -1 )
            return "";

          return f.st;
        }

        return "";
    
        //if ( f.st == "Member" || f.st == "Member Firm" || f.st == "MEMBER" || f.st == "MEMBER FIRM" || f.st == "member firm" || f.st == "member firm" )
        //  return "";

        return f.st;
      },

      gotoTerms: function() {
        $window.location.href = "init.html";
      },

      gotoApp: function ()
      {
        $window.location.href = "index.html";
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

      gotoById: function(id) {
        $location.hash( id );
      },

      getNavSelectedCss: function(path) {
        if ( path == "#" && $location.path() == "/" )
          return "bottomNavSelected";       

        if ( $location.path().indexOf( path ) > -1 )
          return "bottomNavSelected";

        if ( ( $location.path().indexOf( "/c/" ) > -1 || $location.path().indexOf( "/countryContacts/" ) > -1 || $location.path().indexOf( "/countryWithStateContacts/" ) > -1 || $location.path().indexOf( "/findContacts/" ) > -1 || $location.path().indexOf( "/fc/" ) > -1 ) && path == "/contacts" )
          return "bottomNavSelected";

        if ( ( $location.path().indexOf( "/f/" ) > -1 || $location.path().indexOf( "/country/" ) > -1 || $location.path().indexOf( "/countryWithState/" ) > -1 || $location.path().indexOf( "/findFirms/" ) > -1 || $location.path().indexOf( "/fa/" ) > -1 ) && path == "/firms" )
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
        if ( cname == "United States of America" )
          return "USA";
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

