

var app = {

  connType: -1,
  // Application Constructor
  initialize: function ()
  {
    console_log( 'initialize' );
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function ()
  {
    console_log( 'bindEvents' );
    document.addEventListener( 'deviceready', this.onDeviceReady, false );
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicity call 'app.receivedEvent(...);'
  onDeviceReady: function ()
  {
    console_log( 'onDeviceReady' );
    if ( parseFloat( window.device.version ) === 7.0 )
    {
      document.body.style.marginTop = "20px";
    }

    //ngRootScope.isPhone = device.name.indexOf("iPad") == -1;

    //override alert method
    if ( navigator.notification )
    {
      window.alert = function ( message )
      {
        navigator.notification.alert(
                                     message,    // message
                                     null,       // callback
                                     "MSIL Directory", // title
                                     'OK'        // buttonName
                                     );
      };
    }
    //app.receivedEvent( 'deviceready' );

    //init fastclick (avoids )
    try
    {
      FastClick.attach( document.body );
    }
    catch ( e ) { }

    //setTimeout( "checkLocation();", 1 );
    setTimeout( "checkConnection();", 1 );
    //setTimeout( "checkDatePattern();", 1 );
  },
  // Update DOM on a Received Event
  receivedEvent: function ( id )
  {
    var parentElement = document.getElementById( id );
    var listeningElement = parentElement.querySelector( '.listening' );
    var receivedElement = parentElement.querySelector( '.received' );

    listeningElement.setAttribute( 'style', 'display:none;' );
    receivedElement.setAttribute( 'style', 'display:block;' );

    console_log( 'Received Event: ' + id );
  }
};

app.initialize();

function console_log( msg )
{
  var element = document.getElementById( 'con' );
  element.innerHTML = element.innerHTML + " | " + msg;
}

function doIt()
{
  try
  {
    //alert( app.connType );
  }
  catch ( e )
  {
    alert( e );
  }

  try
  {
    //checkLocation();
  }
  catch ( e )
  {
    alert( e );
  }
}

function checkDatePattern()
{
  navigator.globalization.getDatePattern(
                                         function ( date ) { /*alert( 'dst_offset: ' + date.dst_offset + '\n' );*/ },
                                         function () { alert( 'Error getting pattern\n' ); }
                                         );
}

function checkConnection()
{
  var networkState = navigator.connection.type;

  if ( networkState == Connection.NONE )
    ngRootScope.isOnline = 0;
  else if ( networkState != Connection.UNKNOWN )
    ngRootScope.isOnline = 1;

  /*var states = {};
   states[Connection.UNKNOWN] = 'Unknown connection';
   states[Connection.ETHERNET] = 'Ethernet connection';
   states[Connection.WIFI] = 'WiFi connection';
   states[Connection.CELL_2G] = 'Cell 2G connection';
   states[Connection.CELL_3G] = 'Cell 3G connection';
   states[Connection.CELL_4G] = 'Cell 4G connection';
   states[Connection.NONE] = 'No network connection';*/
}

function checkLocation()
{
  navigator.geolocation.getCurrentPosition( function ( position )
  {
    ngRootScope.lat = position.coords.latitude;
    ngRootScope.lon = position.coords.longitude;

    /*
     alert( 'Latitude: ' + position.coords.latitude + '\n' +
     'Longitude: ' + position.coords.longitude + '\n' +
     'Altitude: ' + position.coords.altitude + '\n' +
     'Accuracy: ' + position.coords.accuracy + '\n' +
     'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
     'Heading: ' + position.coords.heading + '\n' +
     'Speed: ' + position.coords.speed + '\n' +
     'Timestamp: ' + position.timestamp + '\n' );*/

  }, function ( error )
  {
    alert( "Ooops! We couldn't figure out your current locations. (" + error + ")" );
  } );

}




function getDateOfWeekAgoAsInt()
{
  var theDate = new Date();
  theDate.setDate( theDate.getDate() - 5 );
  var dd = theDate.getDate();
  var mm = theDate.getMonth() + 1; //January is 0!
  var yyyy = theDate.getFullYear();

  if ( dd < 10 ) dd = '0' + dd;

  if ( mm < 10 ) mm = '0' + mm;

  return parseInt( yyyy + '' + mm + '' + dd );
}
