﻿ngapp.controller( 'CorrespondentFirmsInfoCtrl', ['$scope', 'factory', 'dataMgr', '$anchorScroll', '$location', '$timeout', function ( $scope, factory, dataMgr, $anchorScroll, $location, $timeout )
{
  $scope.helpers = factory.getHelpers();
  $scope.helpers.showLoading = false;

} ] );