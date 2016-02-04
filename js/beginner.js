var app = angular.module('myApp', []);
var apiKey = 'MDIyNTg1Njc0MDE0NTQ1OTIzMDc4Mjk3Ng000';
var nprUrl = 'http://api.npr.org/query?id=61&fields=relatedLink,title,byline,text,audio,image,pullQuote,all&output=JSON';

app.controller('PlayerController', ['$scope', '$http', function($scope, $http){

  var audio = document.createElement('audio');

  audio.src = 'http://pd.npr.org/npr-mp4/npr/sf/2013/07/20130726_sf_05.mp4?orgId=1&topicId=1032&ft=3&f=61';
  audio.play();

  $scope.audio = audio;

  $http({
    method: 'JSONP',
    url: nprUrl + '&apiKey=' + apiKey + '&callback=JSON_CALLBACK'
  }).success(function(data, status) {
    $scope.programs = data.list.story;
  }).error(function(data, status) {});

}]);

app.controller('RelatedController', ['$scope', function($scope) {}]);

app.controller('FrameController', ['$scope', function($scope) {}]);
