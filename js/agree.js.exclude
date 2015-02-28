var ngapp = angular.module( 'agree', ['ngRoute', 'ngAnimate', 'ngSanitize', 'once'] )
.config( function ( $routeProvider )
{
  $routeProvider
  .when( '/firstTime', {
    controller: 'FirstTimeCtrl',
    templateUrl: 'views/firstTime.html'
  } )
  .otherwise( {
    redirectTo: '/firstTime'
  } );
} );
