var app = angular.module('myApp', []),
    apiKey = 'MDExODQ2OTg4MDEzNzQ5OTM4Nzg5MzFiZA001',
    nprUrl = 'http://api.npr.org/query?id=61&fields=relatedLink,title,byline,text,audio,image,pullQuote,all&output=JSON';

app.factory('audio', ['$document', function($document) {
  var audio = $document[0].createElement('audio');
  return audio;
}])

app.factory('player', ['audio', '$rootScope', function(audio, $rootScope) {
  var player = {
    playing: false,
    current: null,
    ready: flase,
    play: function(program) {
      if (player.playing) { player.stop() };
      var url = program.audio[0].format.mp4.$text;
      player.current = program;
      audio.src = url;
      audio.play();
      player.playing = true;
    },
    stop: function(program) {
      if (player.playing) {
        audio.pause();
        player.ready = player.playing = false;
        player.current = null;
      }
    },
    currentTime: function() {
      return audio.currentTime;
    },
    currentDuration: function() {
      return parseInt(audio.currentDuration);
    }
  };
  audio.addEventListener('ended', function() {
    $rootScope.$apply(player.stop());
  });
  audio.addEventListener('timeupdate', function(evt) {
    $rootScope.$apply(function() {
      player.progress = player.currentTime();
      player.progress_percent = player.progress / player.currentDuration();
    });
  });
  audio.addEventListener('canplay', function(evt) {
    $rootScope.$apply(function() {
      player.ready = true;
    });
  });
  return player;
}])

app.factory('nprService', ['$http', function($http) {
  var doRequest = function(apiKey) {
    return $http({
      method: 'JSONP',
      url: nprUrl + '&apiKey=' + apiKey + '&callback=JSONP_CALLBACK'
    }).success();
  };
  return {
    programs: function(apiKey) { return doRequest(apiKey); }
  };
}]);

app.directive('nprLink', function() {
  // Runs during compile
  return {
    restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
    require: ['^ngModel'], // Array = multiple requires, ? = optional, ^ = check parent elements
    replace: true,
    scope: {
      ngModel: '=',
      player: '='
    }, // {} = isolate, true = child, false/undefined = no change
    template: '/views/nprListItem.html',
    link: function(scope, ele, attr) {
      scope.duration = scope.ngModel.audio[0].duration.$text;
    }
  };
});

// app.directive('playerView', [function(){

//   return {
//     restrict: 'EA',
//     require: ['^ngModel'],
//     scope: {
//       ngModel: '='
//     },
//     templateUrl: 'views/playerView.html',
//     link: function(scope, iElm, iAttrs, controller) {
//       scope.$watch('ngModel.current', function(newVal) {
//         if (newVal) {
//           scope.playing = true;
//           scope.title = scope.ngModel.current.title.$text;
//           scope.$watch('ngModel.ready', function(newVal) {
//             if (newVal) {
//               scope.duration = scope.ngModel.currentDuration();
//             }
//           });

//           scope.$watch('ngModel.progress', function(newVal) {
//             scope.secondsProgress = scope.ngModel.progress;
//             scope.percentComplete = scope.ngModel.progress_percent;
//           });
//         }
//       });
//       scope.stop = function() {
//         scope.ngModel.stop();
//         scope.playing = false;
//       }
//     }
//   };
// }]);

app.controller('PlayerController', ['$scope', 'nprService', 'player', function($scope, nprService, player) {
  $scope.player = player;
  nprService.programs(apiKey).success(function(data, status) {
    $scope.programs = data.list.story;
  });
}]);

app.controller('RelatedController', ['$scope', 'player', function($scope, player) {
  $scope.player = player;
  $scope.$watch('player.currentDuration', function(program) {
    if (program) {
      $scope.related = [];
      angular.forEach(program.relatedLink, function(link) {
        $scope.related.push({
          link: link.link[0].$text,
          caption: link.caption.$text
        });
      });
    }
  });
}])

// Parent scope
app.controller('FrameController', function($scope) {
});