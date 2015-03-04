

var app = {

  connType: -1,

  initialize: function ()
  {
    this.bindEvents();
  },
  bindEvents: function ()
  {
    document.addEventListener( 'deviceready', this.onDeviceReady, false );
    window.addEventListener( 'orientationchange', this.onOrientationChange );
  },

  onOrientationChange: function ()
  {
    //ngRootScope.reLoadCurrentPage();
  },

  onDeviceReady: function ()
  {
    try
    {
      FastClick.attach( document.body );
    }
    catch ( e ) { alert( e ) }

    //ngRootScope.isPhone = device.name.indexOf("iPad") == -1;

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

      window.confirm = function ( message, callback, btnLabels )
      {
        navigator.notification.confirm( message, callback, "MSIL Directory", btnLabels );
      };
    }
    //app.receivedEvent( 'deviceready' );

    setTimeout( "checkConnection();", 1 );
  },
  // Update DOM on a Received Event
  receivedEvent: function ( id )
  {
    var parentElement = document.getElementById( id );
    var listeningElement = parentElement.querySelector( '.listening' );
    var receivedElement = parentElement.querySelector( '.received' );

    listeningElement.setAttribute( 'style', 'display:none;' );
    receivedElement.setAttribute( 'style', 'display:block;' );
  }
};

app.initialize();

function console_log( msg )
{
  //var element = document.getElementById( 'con' );
  //element.innerHTML = element.innerHTML + " | " + msg;

  try {
    console.warn(msg);
  }
  catch ( e ) { }
}

function checkConnection()
{
  try {
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
  catch (e) {}
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
  var min = theDate.getMinutes();
  var hh = theDate.getHours();
  var dd = theDate.getDate();
  var mm = theDate.getMonth() + 1; //January is 0!
  var yyyy = theDate.getFullYear();


  if ( min < 10 ) min = '0' + min;

  if ( hh < 10 ) hh = '0' + hh;

  if ( dd < 10 ) dd = '0' + dd;

  if ( mm < 10 ) mm = '0' + mm;

  return parseInt( yyyy + '' + mm + '' + dd + '' + hh + '' + min );
}
