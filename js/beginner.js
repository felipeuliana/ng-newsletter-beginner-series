var app = angular.module('myApp', []);

app.controller('PlayerController', ['$scope', function($scope) {

  var audio = document.createElement('audio');

  $scope.playing = false;
  $scope.audio = audio;
  $scope.audio.src = 'http://pd.npr.org/npr-mp4/npr/sf/2013/07/20130726_sf_05.mp4?orgId=1&topicId=1032&ft=3&f=61';

  $scope.play = function() {
    $scope.audio.play();
    $scope.playing = true;
  };

  $scope.stop = function() {
    $scope.audio.pause();
    $scope.playing = false;
  };

  $scope.audio.addEventListener('ended', function() {
    $scope.apply(function() {
      $scope.stop();
    });
  });

}]);

app.controller('RelatedController', ['$scope', function($scope) {
}]);