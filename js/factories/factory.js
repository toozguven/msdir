ngapp.factory( "factory", ['$http', '$rootScope', '$location', '$route', '$window', '$timeout', function ( $http, $rootScope, $location, $route, $window, $timeout )
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
      AppVersion: "0.9 (Build 7)",
      hasValueFunc: function ( val )
      {
        return ( val && val.length > 2 && val != "0" && val != "666" );
      },
      getContactLocation: function ( contact, countryName )
      {
        var rtnVal = contact.f + ', ' + contact.l.replace( ', ' + countryName, '' )
        if ( rtnVal.length < 5 )
          return "";

        return rtnVal;
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
      getFirmStatus: function ( f ) {
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
      /*NAV METHODS*/
      f: function ( fid ) { 
        if ( $rootScope.menuVisible )
          $rootScope.doMenuClick();

        $rootScope.slide = 'slide-left';
        //$rootScope.apply();

        this.g( "/f/" + fid, 1 );
      },
      reo: function ( fid )
      {
        if ( $rootScope.menuVisible )
          $rootScope.doMenuClick();

        $rootScope.slide = 'slide-left';

        this.g( "/reo/" + fid, 1 );
      },
      c: function ( cid ) { 
        if ( $rootScope.menuVisible )
          $rootScope.doMenuClick(); 

        $rootScope.slide = 'slide-left';

        this.g( "/c/" + cid, 1 );
      },
      g: function ( path, step )
      { 
        //if (step && step == -1)
        //  ngRootScope.slide = 'slide-right';
        //else
        //  ngRootScope.slide = 'slide-left';
        if ( step && step == -1 )
          $rootScope.slide = 'slide-right';
        else
          $rootScope.slide = 'slide-left';

        if ( $rootScope.menuVisible )
          $rootScope.doMenuClick();
        
        //this.showLoading = true; 
        $location.path( path );

      },
      goBack: function (step) {
        $rootScope.slide = 'slide-right';
        //$rootScope.apply();

        if ( $rootScope.menuVisible )
          $rootScope.doMenuClick();

        javascript: history.go( step );

        //$rootScope.slide = 'slide-left';
      },
      goBack: function () {
        if ( $rootScope.menuVisible )
          $rootScope.doMenuClick();

        $rootScope.slide = 'slide-right';
        //$rootScope.apply();

        history.back( -1 );
      },
      gotoByIdXXXXX: function(id) {
        $location.hash( id );
      },
      /*END NAV*/
      getNavSelectedCss: function(path) {
        if ( path == "#" && $location.path() == "/" )
          return "bottomNavSelected";       

        if ( $location.path().indexOf( path ) > -1 )
          return "bottomNavSelected";

        if ( ( $location.path().indexOf( "/c/" ) > -1 || $location.path().indexOf( "/countryContacts/" ) > -1 || $location.path().indexOf( "/countryWithStateContacts/" ) > -1 || $location.path().indexOf( "/findContacts/" ) > -1 ) && path == "/contacts" )
          return "bottomNavSelected";

        if ( ( $location.path().indexOf( "/f/" ) > -1 || $location.path().indexOf( "/country/" ) > -1 || $location.path().indexOf( "/countryWithState/" ) > -1 || $location.path().indexOf( "/findFirms/" ) > -1 || $location.path().indexOf( "/fc/" ) > -1 || $location.path().indexOf( "/fa/" ) > -1 ) && path == "/firms" )
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
      renderDelay: 555,
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
        //window.open( url, isNewWindow ? '_blank' : '_self', isShowLocation ? 'location=yes' : 'location=no' );
        this.gotoWeb( url );

      },
      openWebPage2: function ( url, isNewWindow, isShowLocation )
      {
        if ( $rootScope.menuVisible )
          $rootScope.doMenuClick();

        //window.open( url, isNewWindow ? '_blank' : '_self', isShowLocation ? 'location=yes' : 'location=no' );
        this.gotoWeb( url );
      },
      gotoWeb: function(url) {
        if ( this.isOnline() == false )
          alert( "Your device seems to be offline. Please try again when you have an internet connection." );
        else
        {
          var response = confirm( "You are about to exit this app and go to a web page. Please confirm or cancel.", function ( btnIndex ) { if ( btnIndex == 1 ) window.open( url, '_system' ); }, ['Confirm', 'Cancel'] );
          if ( response == true )
            window.open( url, '_blank', 'location=yes' );
        }
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
      },
      blockSearchBlur: false,
      doSearchBlur: function() {
        if ( this.blockSearchBlur == false )
          setTimeout( function () { jQuery( 'html, body' ).animate( { scrollTop: 0 }, 500 ); }, 11 );
        else
        {
          if ( this.blockSearchBlur == false )
            setTimeout( function () { jQuery( 'html, body' ).animate( { scrollTop: 0 }, 500 ); }, 111 );
        }
      },
      doSearchFocus: function (elem)
      {
        if ( jQuery( window ).height() < 700 )
        {
          jQuery( 'html, body' ).animate( { scrollTop: ( jQuery( '.mstphSearchbox' ).offset().top - 50 ) }, 500 );
          this.blockSearchBlur = true;
        }
      }
    };
    return rtnVal;
  }

  return factory;
} ] );

