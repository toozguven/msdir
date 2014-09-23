ngapp.factory( "dataMgr", function ($http)
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

  var FIRMS_API_URL = "https://s3-eu-west-1.amazonaws.com/msil-international-directory/firms.json";
  var FIRMS_LOCAL_STORAGE_KEY = "mstphDirFirms3";

  var CORRESPONDENT_FIRMS_API_URL = "https://s3-eu-west-1.amazonaws.com/msil-international-directory/correspondentFirms.json";
  var CORRESPONDENT_FIRMS_LOCAL_STORAGE_KEY = "mstphDirCorrespondentFirms3";

  var ASSOCIATED_FIRMS_API_URL = "https://s3-eu-west-1.amazonaws.com/msil-international-directory/AssociatedFirms.json";
  var ASSOCIATED_FIRMS_LOCAL_STORAGE_KEY = "mstphDirAssociatedFirms3";

  var CONTACTS_API_URL = "https://s3-eu-west-1.amazonaws.com/msil-international-directory/contacts.json";
  var CONTACTS_LOCAL_STORAGE_KEY = "mstphDirContacts3";

  if ( true || document.location.href.indexOf( "cdn.moorestephens.org" ) > -1 )
  {
    REO_API_URL = "https://cdn.moorestephens.org/InternationalDirectory/json/reos.json";
    COMMS_API_URL = "https://cdn.moorestephens.org/InternationalDirectory/json/committees.json";
    COUNTRIES_API_URL = "https://cdn.moorestephens.org/InternationalDirectory/json/countries.json";
    MENU_ITEMS_API_URL = "https://cdn.moorestephens.org/InternationalDirectory/json/menuItems.json";
    FIRMS_API_URL = "https://cdn.moorestephens.org/InternationalDirectory/json/firms.json";
    CORRESPONDENT_FIRMS_API_URL = "https://cdn.moorestephens.org/InternationalDirectory/json/correspondentFirms.json";
    ASSOCIATED_FIRMS_API_URL = "https://cdn.moorestephens.org/InternationalDirectory/json/associatedFirms.json";
    CONTACTS_API_URL = "https://cdn.moorestephens.org/InternationalDirectory/json/contacts.json";

    //REO_API_URL = "https://cdn.moorestephens.org/InternationalDirectory/api/reos";
    //COMMS_API_URL = "https://cdn.moorestephens.org/InternationalDirectory/api/committees";
    //COUNTRIES_API_URL = "https://cdn.moorestephens.org/InternationalDirectory/api/countries";
    //MENU_ITEMS_API_URL = "https://cdn.moorestephens.org/InternationalDirectory/api/menuItems";
    //FIRMS_API_URL = "https://cdn.moorestephens.org/InternationalDirectory/api/firms";
    //CORRESPONDENT_FIRMS_API_URL = "https://cdn.moorestephens.org/InternationalDirectory/api/correspondentFirms";
    //ASSOCIATED_FIRMS_API_URL = "https://cdn.moorestephens.org/InternationalDirectory/api/associatedFirms";
    //CONTACTS_API_URL = "https://cdn.moorestephens.org/InternationalDirectory/api/contacts";
  }

  localStorage.removeItem( REO_LOCAL_STORAGE_KEY );
  localStorage.removeItem( COMMS_LOCAL_STORAGE_KEY );
  localStorage.removeItem( COUNTRIES_LOCAL_STORAGE_KEY );
  localStorage.removeItem( MENU_ITEMS_LOCAL_STORAGE_KEY );
  localStorage.removeItem( FIRMS_LOCAL_STORAGE_KEY );
  localStorage.removeItem( CORRESPONDENT_FIRMS_LOCAL_STORAGE_KEY );
  localStorage.removeItem( ASSOCIATED_FIRMS_LOCAL_STORAGE_KEY );
  localStorage.removeItem( CONTACTS_LOCAL_STORAGE_KEY );

  var factory = {};

  /*helpers*/
  factory.persistJsonToLocalStorage = function ( key, value )
  {
    //console_log( "saving to localStorage: " + key );
    localStorage.setItem( key, JSON.stringify( value ) );
  }

  factory.readDataFromLocalStorage = function ( key ) //this function expects the data (to be read) to have a property called lastUpdated
  {
    var localData = localStorage.getItem( key );

    if ( ALWAYS_USE_WEB == false && localData != null )
    {
      //console_log( "reading from localStorage: " + key );

      var jsonData = JSON.parse( localData );
      if ( jsonData.lastUpdated > getDateOfWeekAgoAsInt() )
        return jsonData;
      else  //deliberately return empty as cached data is old
        return { "lastUpdated": 0, "d": [] };
    }
    else
    {
      return { "lastUpdated": 0, "d": [] };
    }
  }

  factory.getApiPromise = function ( url )
  {
    //console_log( "about to go to " + url );
    return $http.get( url );
  };

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
  factory.setScopeREOs = function ( callback )
  {
    var localREOs = factory.readDataFromLocalStorage( REO_LOCAL_STORAGE_KEY ); //read from localStorage
    
    if ( localREOs.d.length == 0 )
    { //if localStorage empty, go to web
      factory.getApiPromise( REO_API_URL ).success( function ( data )
      {
        //console_log( "got some reos from web" );
        factory.persistJsonToLocalStorage( REO_LOCAL_STORAGE_KEY, data );  //persist locally
        callback( data.d );
      } );
    }
    else //great there is cached data
    {
      callback( localREOs.d );
    }
  }





  /*#region Comms*/
  factory.setScopeComms = function ( callback )
  {
    var localComms = factory.readDataFromLocalStorage( COMMS_LOCAL_STORAGE_KEY ); //read from localStorage

    if ( localComms.d.length == 0 )
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






  /*#region Countries*/
  factory.setScopeCountries = function ( callback )
  {
    var localData = factory.readDataFromLocalStorage( COUNTRIES_LOCAL_STORAGE_KEY ); //read from localStorage
    if ( localData.d.length == 0 )
    { //if localStorage empty, go to web
      factory.getApiPromise( COUNTRIES_API_URL ).success( function ( data )
      {
        //console_log( "got some countries from web" );
        factory.persistJsonToLocalStorage( COUNTRIES_LOCAL_STORAGE_KEY, data );  //persist locally
        callback(data.d);
      } );
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


  /*#region MenuItems*/
  factory.setScopeMenuItems = function ( callback )
  {
    var localData = factory.readDataFromLocalStorage( MENU_ITEMS_LOCAL_STORAGE_KEY ); //read from localStorage
    if ( localData.d.length == 0 )
    { //if localStorage empty, go to web
      factory.getApiPromise( MENU_ITEMS_API_URL ).success( function ( data )
      {
        //console_log( "got some menu items from web" );
        factory.persistJsonToLocalStorage( MENU_ITEMS_LOCAL_STORAGE_KEY, data );  //persist locally
        callback( data.d );
      } );
    }
    else //great there is cached data
    {
      callback( localData.d );
    }
  }

  /*#region CorrespondentFirms */
  factory.setScopeCorrespondentFirms = function ( callback )
  {
    var localData = factory.readDataFromLocalStorage( CORRESPONDENT_FIRMS_LOCAL_STORAGE_KEY ); //read from localStorage
    if ( localData.d.length == 0 )
    { //if localStorage empty, go to web
      factory.getApiPromise( CORRESPONDENT_FIRMS_API_URL ).success( function ( data )
      {
        //console_log( "got some cfirms from web" );
        factory.persistJsonToLocalStorage( CORRESPONDENT_FIRMS_LOCAL_STORAGE_KEY, data );  //persist locally
        callback( data.d );
      } );
    }
    else //great there is cached data
    {
      callback( localData.d );
    }
  }

  /*#region AssociatedFirms */
  factory.setScopeAssociatedFirms = function ( callback )
  {
    var localData = factory.readDataFromLocalStorage( ASSOCIATED_FIRMS_LOCAL_STORAGE_KEY ); //read from localStorage
    if ( localData.d.length == 0 )
    { //if localStorage empty, go to web
      factory.getApiPromise( ASSOCIATED_FIRMS_API_URL ).success( function ( data )
      {
        //console_log( "got some afirms from web" );
        factory.persistJsonToLocalStorage( ASSOCIATED_FIRMS_LOCAL_STORAGE_KEY, data );  //persist locally
        callback( data.d );
      } );
    }
    else //great there is cached data
    {
      callback( localData.d );
    }
  }

  /*#region Firms*/
  factory.setScopeFirms = function ( callback )
  {
    var localData = factory.readDataFromLocalStorage( FIRMS_LOCAL_STORAGE_KEY ); //read from localStorage
    if ( localData.d.length == 0 )
    { //if localStorage empty, go to web
      factory.getApiPromise( FIRMS_API_URL ).success( function ( data )
      {
        //console_log( "got some Firms from web" );        
        factory.persistJsonToLocalStorage( FIRMS_LOCAL_STORAGE_KEY, data );  //persist locally
        callback(data.d);
      } );
    }
    else //great there is cached data
    {
      callback(localData.d);
    }
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
              firmFound = factory.getFirm( associatedFirms, fid );
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
  factory.setScopeContacts = function ( callback )
  {
    var localData = factory.readDataFromLocalStorage( CONTACTS_LOCAL_STORAGE_KEY ); //read from localStorage
    if ( localData.d.length == 0 )
    { //if localStorage empty, go to web
      factory.getApiPromise( CONTACTS_API_URL ).success( function ( data )
      {
        //console_log( "got some Contacts from web" );
        factory.persistJsonToLocalStorage( CONTACTS_LOCAL_STORAGE_KEY, data );  //persist locally
        callback(data.d);
      } );
    }
    else //great there is cached data
    {
      callback(localData.d);
    }
  }
  
  factory.getContact = function ( contacts, id )
  {
    for ( var i = 0; i < contacts.length; i++ )
    {
      if ( contacts[i].id == id )
        return contacts[i];
    }
    return null;
  }

  factory.getMainContactsForFirm = function ( allContacts, firm )
  {
    var rtnVal = [];
    
    for ( var i = 0; i < firm.cs.length; i++ )
    {
      var contact = factory.getContact( allContacts, firm.cs[i].id );
      
      //overwrite role
      contact.r = firm.cs[i].r;
      //overwrite location
      contact.l = firm.cs[i].l;
      rtnVal.push( contact );
    }
    return rtnVal;
  }

  factory.getInternationalContactsForFirm = function ( allContacts, firm )
  {
    var rtnVal = [];

    for ( var i = 0; i < firm.ics.length; i++ )
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
    return rtnVal;
  }





  return factory;
} );