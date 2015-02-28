var months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var localCache = {};


ngapp.factory( "dataMgr", function ( $http, $route, $rootScope )
{
  /*constants*/

  var ALWAYS_USE_WEB = false;

  var REO_API_URL = "https://s3-eu-west-1.amazonaws.com/msil-international-directory/reos.json";
  var REO_LOCAL_STORAGE_KEY = "mstphDirREOs3";

  var COMMS_API_URL = "https://s3-eu-west-1.amazonaws.com/msil-international-directory/committees.json";
  var COMMS_LOCAL_STORAGE_KEY = "mstphDirComms3";

  var COUNTRIES_API_URL = "https://s3-eu-west-1.amazonaws.com/msil-international-directory/countries.json";
  var COUNTRIES_LOCAL_STORAGE_KEY = "mstphDirCountries3";

  var MENU_ITEMS_API_URL = "https://s3-eu-west-1.amazonaws.com/msil-international-directory/menuItems.json";
  var MENU_ITEMS_LOCAL_STORAGE_KEY = "mstphDirMenuItems3";

  var PAGE_CONTENTS_API_URL = "https://s3-eu-west-1.amazonaws.com/msil-international-directory/pageContents.json";
  var PAGE_CONTENTS_LOCAL_STORAGE_KEY = "mstphDirPageContents3";

  var FIRMS_API_URL = "https://s3-eu-west-1.amazonaws.com/msil-international-directory/firms.json";
  var FIRMS_LOCAL_STORAGE_KEY = "mstphDirFirms3";

  var CORRESPONDENT_FIRMS_API_URL = "https://s3-eu-west-1.amazonaws.com/msil-international-directory/correspondentFirms.json";
  var CORRESPONDENT_FIRMS_LOCAL_STORAGE_KEY = "mstphDirCorrespondentFirms3";

  var ASSOCIATED_FIRMS_API_URL = "https://s3-eu-west-1.amazonaws.com/msil-international-directory/AssociatedFirms.json";
  var ASSOCIATED_FIRMS_LOCAL_STORAGE_KEY = "mstphDirAssociatedFirms3";

  var CONTACTS_API_URL = "https://s3-eu-west-1.amazonaws.com/msil-international-directory/contacts.json";
  var CONTACTS_LOCAL_STORAGE_KEY = "mstphDirContacts3";

  var SIMILAR_PHRASES_FOR_CONTACTS_API_URL = "https://cdn.moorestephens.org/InternationalDirectory/api/contacts/GetSimilarPhrases?txt=";
  var SIMILAR_PHRASES_FOR_FIRMS_API_URL = "https://cdn.moorestephens.org/InternationalDirectory/api/firms/GetSimilarPhrases?txt=";

  if ( true || document.location.href.indexOf( "cdn.moorestephens.org" ) > -1 )
  {
    REO_API_URL = "https://cdn.moorestephens.org/InternationalDirectory/json/reos.json";
    COMMS_API_URL = "https://cdn.moorestephens.org/InternationalDirectory/json/committees.json";
    COUNTRIES_API_URL = "https://cdn.moorestephens.org/InternationalDirectory/json/countries.json";
    MENU_ITEMS_API_URL = "https://cdn.moorestephens.org/InternationalDirectory/json/menuItems.json";
    PAGE_CONTENTS_API_URL = "https://cdn.moorestephens.org/InternationalDirectory/json/pageContents.json";
    FIRMS_API_URL = "https://cdn.moorestephens.org/InternationalDirectory/json/firms.json";
    CORRESPONDENT_FIRMS_API_URL = "https://cdn.moorestephens.org/InternationalDirectory/json/correspondentFirms.json";
    ASSOCIATED_FIRMS_API_URL = "https://cdn.moorestephens.org/InternationalDirectory/json/associatedFirms.json";
    CONTACTS_API_URL = "https://cdn.moorestephens.org/InternationalDirectory/json/contacts.json";
  }

  var resetLocalData = function ()
  {
    localStorage.removeItem( REO_LOCAL_STORAGE_KEY );
    localStorage.removeItem( COMMS_LOCAL_STORAGE_KEY );
    localStorage.removeItem( COUNTRIES_LOCAL_STORAGE_KEY );
    localStorage.removeItem( MENU_ITEMS_LOCAL_STORAGE_KEY );
    localStorage.removeItem( PAGE_CONTENTS_LOCAL_STORAGE_KEY );
    localStorage.removeItem( FIRMS_LOCAL_STORAGE_KEY );
    localStorage.removeItem( CORRESPONDENT_FIRMS_LOCAL_STORAGE_KEY );
    localStorage.removeItem( ASSOCIATED_FIRMS_LOCAL_STORAGE_KEY );
    localStorage.removeItem( CONTACTS_LOCAL_STORAGE_KEY );

    localCache = {};

    //localStorage.removeItem( "MStphLastUpdated");
    //localStorage.removeItem( "MStphFav_contact" );
    //localStorage.removeItem( "MStphFav_firm" );
  };

  //resetLocalData();
  
  var factory = {};

  /*helpers*/
  factory.isFirstUse = function ()
  {
    var sIsFirstUse = localStorage.getItem( "MStphIsFirstUse" );
    if ( sIsFirstUse && sIsFirstUse == "false" )
    {
      return false;
    }

    return true;
  }

  factory.recordAgreement = function ()
  {
    localStorage.setItem( "MStphIsFirstUse", "false" );
    var now = new Date();
    var nowString = "You agreed on " + now.getFullYear() + "-" + months[now.getMonth() + 1] + "-" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes();
    localStorage.setItem( "MStphTermsAgreedOn", nowString );
  }

  factory.getAgreedDate = function() {
    return localStorage.getItem( "MStphTermsAgreedOn");
  }

  factory.getLastUpdatedDateAsString = function ()
  {
    try {
      var d = localStorage.getItem( "MStphLastUpdated" );
      if (d) {
        var s = d.toString();
        var sYear = s.charAt( 0 ) + s.charAt( 1 ) + s.charAt( 2 ) + s.charAt( 3 );
        var sMonthNo = s.charAt( 4 ) + s.charAt( 5 );
        var sDay = s.charAt( 6 ) + s.charAt( 7 );

        var iYear = parseInt( sYear );
        var iMonthNo = parseInt( sMonthNo );
        var iDay = parseInt( sDay );


        var rtnVal = iYear + " " + months[iMonthNo] + " " + iDay;

        try {
          var sHour = s.charAt( 8 ) + s.charAt( 9 );
          var sMinute = s.charAt( 10 ) + s.charAt( 11 );

          var iHour = parseInt( sHour );
          var iMinute = parseInt( sMinute );

          if (iHour > 0 || iMinute > 0)
            return rtnVal + ( " " + sHour + ":" + sMinute );
          else
            return rtnVal;
        }
        catch ( e ) {
          return rtnVal;
        }
        
        
      }
    }
    catch ( e )
    {

    }
  }

  factory.getFavLabel = function ( id, type )
  {
    var key = "MStphFav_" + type;
    var existingFavs = localStorage.getItem( key );
    var existingFavArray = new Array();

    console_log( "existingFavs: " + existingFavs );

    if ( existingFavs && existingFavs != "null" )
      existingFavArray = existingFavs.split( "," );
    else
      return "ADD BOOKMARK";

    var previouslyExisting = false;

    for ( var i = 0; i < existingFavArray.length; i++ )
    {
      if ( existingFavArray[i] == id )
        return "REMOVE BOOKMARK";
    }

    return "ADD BOOKMARK";
  }

  factory.toggleFavourite = function ( id, type )
  {
    var key = "MStphFav_" + type;
    var existingFavs = localStorage.getItem( key );
    var existingFavArray = new Array();
    
    if ( existingFavs && existingFavs != "null" )
      existingFavArray = existingFavs.split(",");
    else
      existingFavArray = new Array();

    console_log( "existingFavArray: " + existingFavArray );

    var previouslyExisting = false;

    for ( var i = 0; i < existingFavArray.length; i++ )
    {
      if ( existingFavArray[i] == id )
      {
        existingFavArray.splice( existingFavArray.indexOf( id ), 1 );
        previouslyExisting = true;
      }
    }

    if ( !previouslyExisting )
    {
      existingFavArray.push( id );
      alert("Bookmark has been added.");
    }
    else
    {
      alert( "Bookmark has been removed." );
    }

    localStorage.setItem( key, existingFavArray.join(",") );

    existingFavs = localStorage.getItem( key );
    console_log( "existingFavs: " + existingFavs );

    //$route.reload();
  }

  factory.getFavIdArray = function ( type )
  {
    var key = "MStphFav_" + type;
    var existingFavs = localStorage.getItem( key );
    var existingFavArray = new Array();

    if ( existingFavs && existingFavs != "null" )
      existingFavArray = existingFavs.split( "," );
    else
      existingFavArray = new Array();

    return existingFavArray;
  }

  factory.persistJsonToLocalStorage = function ( key, value )
  {
    //console_log( "saving to localStorage: " + key );
    localStorage.setItem( key, JSON.stringify( value ) );
    localStorage.setItem( "MStphLastUpdated", value.lastUpdated );

    //also memmory:localCache
    localCache[key] = JSON.stringify( value );
  }

  factory.readDataFromLocalStorage = function ( key ) //this function expects the data (to be read) to have a property called lastUpdated
  {
    var localData = "";
    //before localstorage, check memory:localCache
    try {
      localData = localCache[key];
    } catch ( e ) { }

    if (!localData && localData != "")
      localData = localStorage.getItem( key );

    if ( ALWAYS_USE_WEB == false && localData != null )
    {
      //console_log( "reading from localStorage: " + key );

      var jsonData = JSON.parse( localData );
      if ( jsonData.lastUpdated > getDateOfWeekAgoAsInt() )
        return jsonData;
      else
      {
        if ( jsonData.d.length > 0 && !( $rootScope.isOnline > 0 ) )
        {
          return jsonData;
        }

        return { "lastUpdated": 0, "d": [] }; //deliberately return empty as cached data is old
      }
    }
    else
      return { "lastUpdated": 0, "d": [] };
  }

  factory.getApiPromise = function ( url )
  {
    if ( url.indexOf( "?" ) > -1 )
      return $http.get( url + "&ck=" + factory.getCacheBuster() );
    return $http.get( url + "?ck=" + factory.getCacheBuster() );
  };

  factory.getCacheBuster = function ()
  {
    var dt = new Date();
    return dt.getYear() + dt.getMonth() + dt.getDay() + "sdfsdfsdfsdf";
  }

  factory.filterByField = function ( arr, fieldName, fieldValue )
  {
    var rtnVal = [];

    for ( var i = 0; i < arr.length; i++)
    {
      if ( arr[i][fieldName] == fieldValue )
        rtnVal.push( arr[i] );
    }

    return rtnVal;
  }
   

  /*#region REOs*/
  factory.setScopeREOs = function ( callback, mustGoOnline )
  {
    if ( !mustGoOnline ) mustGoOnline = false;
    var localREOs = factory.readDataFromLocalStorage( REO_LOCAL_STORAGE_KEY ); //read from localStorage
    if ( mustGoOnline == true || localREOs.d.length == 0 )
    { //if localStorage empty, go to web
      factory.getApiPromise( REO_API_URL ).success( function ( data )
      {
        //console_log( "got some reos from web" );
        factory.persistJsonToLocalStorage( REO_LOCAL_STORAGE_KEY, data );  //persist locally
        callback( data.d );
      } ).error( function ( data, status, headers, config ) { alert( "error" ); } );
    }
    else //great there is cached data
    {
      callback( localREOs.d );
    }
  }
  /*#endregion*/




  /*#region Comms
  factory.setScopeComms = function ( callback, mustGoOnline )
  {
    if ( !mustGoOnline ) mustGoOnline = false;
    var localComms = factory.readDataFromLocalStorage( COMMS_LOCAL_STORAGE_KEY ); //read from localStorage
    if ( mustGoOnline == true || localComms.d.length == 0 )
    { //if localStorage empty, go to web
      factory.getApiPromise( COMMS_API_URL ).success( function ( data )
      {
        //console_log( "got some comms from web" );
        factory.persistJsonToLocalStorage( COMMS_LOCAL_STORAGE_KEY, data );  //persist locally
        callback( data.d );
      } );
    }
    else //great there is cached data
    {
      callback( localComms.d );
    }
  }
  */





  /*#region Countries*/
  factory.setScopeCountries = function ( callback, mustGoOnline )
  {
    if ( !mustGoOnline ) mustGoOnline = false;
    var localData = factory.readDataFromLocalStorage( COUNTRIES_LOCAL_STORAGE_KEY ); //read from localStorage
    if ( mustGoOnline == true || localData.d.length == 0 )
    { //if localStorage empty, go to web
      factory.getApiPromise( COUNTRIES_API_URL ).success( function ( data )
      {
        //console_log( "got some countries from web" );
        factory.persistJsonToLocalStorage( COUNTRIES_LOCAL_STORAGE_KEY, data );  //persist locally
        callback(data.d);
      } ).error( function ( data, status, headers, config ) { alert( "error" ); } );
    }
    else //great there is cached data
    {
      callback(localData.d);
    }
  }

  factory.getCountry = function ( countries, id )
  {
    for ( var i = 0; i < countries.length; i++ )
    {
      if ( countries[i].id == id )
        return countries[i];
    }
    return null;
  }

  factory.getState = function ( states, id )
  {
    if ( id && id > 0 )
    {
      for ( var i = 0; i < states.length; i++ )
      {
        if ( states[i].id == id )
          return states[i];
      }
      return null;
    }
    else
    {
      return states[0];
    }
  }
  /*#endregion*/



  /*#region MenuItems*/
  factory.setScopeMenuItems = function ( callback, mustGoOnline )
  {
    if ( !mustGoOnline ) mustGoOnline = false;
    var localData = factory.readDataFromLocalStorage( MENU_ITEMS_LOCAL_STORAGE_KEY ); //read from localStorage
    if ( mustGoOnline == true || localData.d.length == 0 )
    { //if localStorage empty, go to web
      factory.getApiPromise( MENU_ITEMS_API_URL ).success( function ( data )
      {
        //console_log( "got some menu items from web" );
        factory.persistJsonToLocalStorage( MENU_ITEMS_LOCAL_STORAGE_KEY, data );  //persist locally
        callback( data.d );
      } ).error( function ( data, status, headers, config ) { alert( "error" ); } );
    }
    else //great there is cached data
    {
      callback( localData.d );
    }
  }



  /*#region PageContent*/
  factory.setScopePageContents = function ( callback, mustGoOnline )
  {
    if ( !mustGoOnline ) mustGoOnline = false;
    var localData = factory.readDataFromLocalStorage( PAGE_CONTENTS_LOCAL_STORAGE_KEY ); //read from localStorage
    if ( mustGoOnline == true || localData.d.length == 0 )
    { //if localStorage empty, go to web
      factory.getApiPromise( PAGE_CONTENTS_API_URL ).success( function ( data )
      {
        //console_log( "got some menu items from web" );
        factory.persistJsonToLocalStorage( PAGE_CONTENTS_LOCAL_STORAGE_KEY, data );  //persist locally
        callback( data.d );
      } ).error( function ( data, status, headers, config ) { alert( "error" ); } );
    }
    else //great there is cached data
    {
      callback( localData.d );
    }
  }



  /*#region CorrespondentFirms */
  factory.setScopeCorrespondentFirms = function ( callback, mustGoOnline )
  {
    if ( !mustGoOnline ) mustGoOnline = false;
    var localData = factory.readDataFromLocalStorage( CORRESPONDENT_FIRMS_LOCAL_STORAGE_KEY ); //read from localStorage
    if ( mustGoOnline == true || localData.d.length == 0 )
    { //if localStorage empty, go to web
      factory.getApiPromise( CORRESPONDENT_FIRMS_API_URL ).success( function ( data )
      {
        //console_log( "got some cfirms from web" );
        factory.persistJsonToLocalStorage( CORRESPONDENT_FIRMS_LOCAL_STORAGE_KEY, data );  //persist locally
        callback( data.d );
      } ).error( function ( data, status, headers, config ) { alert( "error" ); } );
    }
    else //great there is cached data
    {
      callback( localData.d );
    }
  }

  /*#region AssociatedFirms */
  factory.setScopeAssociatedFirms = function ( callback, mustGoOnline )
  {
    if ( !mustGoOnline ) mustGoOnline = false;
    var localData = factory.readDataFromLocalStorage( ASSOCIATED_FIRMS_LOCAL_STORAGE_KEY ); //read from localStorage
    if ( mustGoOnline == true || localData.d.length == 0 )
    { //if localStorage empty, go to web
      factory.getApiPromise( ASSOCIATED_FIRMS_API_URL )
        .success( function ( data )
                  {
                    //console_log( "got some afirms from web" );
                    factory.persistJsonToLocalStorage( ASSOCIATED_FIRMS_LOCAL_STORAGE_KEY, data );  //persist locally
                    callback( data.d );
                  } 
        ).error( function () { callback(null) } );
    }
    else //great there is cached data
    {
      callback( localData.d );
    }
  }

  /*#region Firms*/
  factory.setScopeFirms = function ( callback, mustGoOnline )
  {
    if ( !mustGoOnline ) mustGoOnline = false;
    var localData = factory.readDataFromLocalStorage( FIRMS_LOCAL_STORAGE_KEY ); //read from localStorage
    if ( mustGoOnline == true || localData.d.length == 0 )
    { //if localStorage empty, go to web
      factory.getApiPromise( FIRMS_API_URL ).success( function ( data )
      {
        //console_log( "got some Firms from web" );        
        factory.persistJsonToLocalStorage( FIRMS_LOCAL_STORAGE_KEY, data );  //persist locally
        callback(data.d);
      } ).error( function ( data, status, headers, config ) { alert( "error" ); } );
    }
    else //great there is cached data
    {
      callback(localData.d);
    }
  }
  
  factory.setScopeFavFirms = function ( callback )
  {
    var firmsFound = [];

    var favIds = factory.getFavIdArray( "firm" );

    factory.setScopeFirms( function ( firms )
    { //first check the main list of firms
      firmsFound = firmsFound.concat( factory.getFirms( firms, favIds ) );
      if ( false && firmsFound )
        callback( firmsFound );
      else
      {
        factory.setScopeCorrespondentFirms( function ( correspondentFirms ) //then try correspondent firms
        {
          firmsFound = firmsFound.concat( factory.getFirms( correspondentFirms, favIds ) );
          if ( false && firmsFound )
            callback( firmsFound );
          else
          {
            factory.setScopeAssociatedFirms( function ( associatedFirms ) //then try associated firms
            {
              try
              {
                firmsFound = firmsFound.concat( factory.getFirms( associatedFirms, favIds ) );
              }
              catch ( e )
              {
                //firmsFound = null;
              }
              if ( false && firmsFound )
                callback( firmsFound );
              else
              {
                factory.setScopeREOs( function ( reos ) //then try associated firms
                {
                  firmsFound = firmsFound.concat( factory.getFirms( reos, favIds ) );
                  if ( firmsFound )
                    callback( firmsFound );
                } );
              }
            } );
          }
        } );
      }
    } );
  }

  factory.setScopeSingleFirm = function ( fid, callback )
  {
    var firmFound = null;

    factory.setScopeFirms( function ( firms ) { //first check the main list of firms
      firmFound = factory.getFirm( firms, fid );
      if ( firmFound )
        callback( firmFound );
      else
      {
        factory.setScopeCorrespondentFirms( function ( correspondentFirms ) //then try correspondent firms
        {
          firmFound = factory.getFirm( correspondentFirms, fid );
          if ( firmFound )
            callback( firmFound );
          else
          {
            factory.setScopeAssociatedFirms( function ( associatedFirms ) //then try associated firms
            {
              try {
                firmFound = factory.getFirm( associatedFirms, fid );
              }
              catch ( e )
              {
                firmFound = null;
              }
              if ( firmFound )
                callback( firmFound );
              else
              {
                factory.setScopeREOs( function ( reos ) //then try associated firms
                {
                  firmFound = factory.getFirm( reos, fid );
                  if ( firmFound )
                    callback( firmFound );
                } );
              }
            } );
          }
        } );
      }
    } );
  }

  factory.getFirm = function ( firms, id )
  {
    for ( var i = 0; i < firms.length; i++ )
    {
      if ( firms[i].id == id )
        return firms[i];
    }
    return null;
  }

  factory.getFirms = function ( firms, idArray )
  {
    var rtnVal = [];

    for ( var i = 0; i < firms.length; i++ )
    {
      for ( var j = 0; j < idArray.length; j++ )
      {
        if ( firms[i].id == idArray[j] )
          rtnVal.push( firms[i] );
      }
    }
    return rtnVal;
  }
  /*#endregion*/

  /*factory.filterFirmsByCountryId = function ( data, countryId )
  {
    return data;
    var rtnVal = [];

    for ( var firm in data )
    {
      if ( firm.countryId == countryId )
        rtnVal.push( firm );
    }
    return rtnVal;
  }*/


  


  /*#region Contacts*/
  factory.setScopeContacts = function ( callback, mustGoOnline )
  {
    if ( !mustGoOnline ) mustGoOnline = false;
    var localData = factory.readDataFromLocalStorage( CONTACTS_LOCAL_STORAGE_KEY ); //read from localStorage
    if ( mustGoOnline == true || localData.d.length == 0 )
    { //if localStorage empty, go to web
      factory.getApiPromise( CONTACTS_API_URL ).success( function ( data )
      {
        //console_log( "got some Contacts from web" );
        factory.persistJsonToLocalStorage( CONTACTS_LOCAL_STORAGE_KEY, data );  //persist locally
        callback(data.d);
      } ).error( function ( data, status, headers, config ) { alert( "error" ); } );
    }
    else //great there is cached data
    {
      callback(localData.d);
    }
  }
  
  factory.setScopeFavContacts = function ( callback )
  {
    var contactsFound = [];

    var favIds = factory.getFavIdArray( "contact" );

    factory.setScopeContacts( function ( contacts )
    {
      contactsFound = contactsFound.concat( factory.getContacts( contacts, favIds ) );
      callback( contactsFound );
    } );
  };

  factory.getContact = function ( contacts, id )
  {
    for ( var i = 0; i < contacts.length; i++ )
    {
      if ( contacts[i].id == id )
        return contacts[i];
    }
    return null;
  }

  factory.getContacts = function ( contacts, idArray )
  {
    var rtnVal = [];

    for ( var i = 0; i < contacts.length; i++ )
    {
      for ( var j = 0; j < idArray.length; j++ )
      {
        if ( contacts[i].id == idArray[j] )
          rtnVal.push( contacts[i] );
      }
    }
    return rtnVal;
  }

  factory.getMainContactsForFirm = function ( allContacts, firm, contactsToExclude )
  {
    var rtnVal = [];
    
    for ( var i = 0; i < firm.cs.length; i++ )
    {
      var existingItemInArr = factory.filterByField( rtnVal, "id", firm.cs[i].id );
      if ( existingItemInArr.length == 0 )
      {

        var contact = factory.getContact( allContacts, firm.cs[i].id );
        if ( contact )
        {
          var toBeExcluded = false;
          for ( var j = 0; j < contactsToExclude.length; j++ )
            if ( contactsToExclude[j].id == contact.id )
              toBeExcluded = true;

          if ( toBeExcluded == false )
          {
            //overwrite role
            contact.r = firm.cs[i].r;
            //overwrite location
            contact.l = firm.cs[i].l;
            rtnVal.push( contact );
          }
        }
      }
    }
    return rtnVal;
  }

  factory.getInternationalContactsForFirm = function ( allContacts, firm )
  {
    var rtnVal = [];

    for ( var i = 0; i < firm.ics.length; i++ )
    {
      var existingItemInArr = factory.filterByField( rtnVal, "id", firm.ics[i].id );
      if ( existingItemInArr.length == 0 )
      {
        var contact = factory.getContact( allContacts, firm.ics[i].id );

        if ( firm.ics[i].r && firm.ics[i].r != "" )
        {
          //overwrite role
          contact.r = firm.ics[i].r;
        }
        //overwrite location
        contact.l = firm.ics[i].l;
        rtnVal.push( contact );
      }
    }
    return rtnVal;
  }
  /*#endregion*/


  factory.updateDataNow = function (callback)
  {
    //resetLocalData();

    factory.setScopeMenuItems( function ()  {
      factory.setScopeCountries( function () {
        factory.setScopeFirms( function () {
          factory.setScopeContacts( function () {
            factory.setScopeREOs( function () {
              factory.setScopeCorrespondentFirms( function () {
                factory.setScopeAssociatedFirms( function () {
                  callback( true );
                }, true );
              }, true );
            }, true );
          }, true );
        }, true );
      }, true );
    }, true);

  }

  factory.getSimilarPhrasesForContacts = function (searchPhrase, callback)
  {
    factory.getApiPromise( SIMILAR_PHRASES_FOR_CONTACTS_API_URL + searchPhrase ).success( function ( data )
    {
      callback( data.d );
    } );
  }

  factory.getSimilarPhrasesForFirms = function ( searchPhrase, callback )
  {
    factory.getApiPromise( SIMILAR_PHRASES_FOR_FIRMS_API_URL + searchPhrase ).success( function ( data )
    {
      callback( data.d );
    } );
  }

  return factory;
} );