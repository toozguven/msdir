ngapp.controller( 'TimeZoneCtrl', function ( $scope, factory, dataMgr, $routeParams, $anchorScroll, $location, $timeout )
{
  $scope.helpers = factory.getHelpers();
  
  $scope.firm = {};

  Date.prototype.addHours = function ( h )
  {
    var hAsInt = parseInt( h );
    this.setHours( this.getHours() + h );
    if ( h > hAsInt )
    {
      var minutes = this.getMinutes();
      var newMinutes = minutes + ( 60 * ( h - hAsInt ) );
      if (newMinutes >= 60)
      {
        this.setHours( this.getHours() + 1 );
      }
      this.setMinutes(newMinutes % 60);
    }
    return this;
  }

  Date.prototype.getHourAndMinute = function ( h )
  {
    var hours = this.getHours();
    var mins = this.getMinutes();

    if ( hours < 10 )
      hours = "0" + hours;

    if ( mins < 10 )
      mins = "0" + mins;

    var rtnVal = hours + ":" + mins;
    return rtnVal;
  }

  Date.prototype.stdTimezoneOffset = function ()
  {
    var jan = new Date( this.getFullYear(), 0, 1 );
    var jul = new Date( this.getFullYear(), 6, 1 );
    return Math.max( jan.getTimezoneOffset(), jul.getTimezoneOffset() );
  }

  dataMgr.setScopeSingleFirm( $routeParams.id, function ( data )
  {
    $timeout( function ()
    {
      $scope.firm = data;

      processTimeZone( data.tz );

      $scope.helpers.showLoading = false;

    }, $scope.helpers.renderDelay );

  } );

  function processTimeZone( tz )
  {
    var now = new Date();
        
    $scope.deviceTime = now.getHourAndMinute();

    var deviceGmtOffset = ( parseFloat( now.stdTimezoneOffset() * -1 ) / 60 );

    if ( deviceGmtOffset > 0 )
      $scope.deviceGmtOffsetAsString = " +" + deviceGmtOffset.toString();
    else if ( deviceGmtOffset == 0 )
      $scope.deviceGmtOffsetAsString = "";
    else
      $scope.deviceGmtOffsetAsString = " " + deviceGmtOffset;

    var gmtTime = now.addHours( -1 * deviceGmtOffset );
    //var gmtTime = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
    var firmsTimeZoneTime = gmtTime.addHours( parseFloat( tz == "" ? 0 : tz ) );
    $scope.localTime = firmsTimeZoneTime.getHourAndMinute();

    $scope.$apply();

    setTimeout( function () { processTimeZone( tz ) }, 1000 * 60 );
  }


  $anchorScroll();
} );