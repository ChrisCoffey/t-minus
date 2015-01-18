angular.module('t-minus', ['angular-svg-round-progress'])
        .controller('demoCtrl', ['$scope', '$timeout', 'roundProgressService', function($scope, $timeout, roundProgressService){

            $scope.current =        27;
            $scope.max =            100;
            $scope.uploadCurrent =  0;
            $scope.stroke =         30;
            $scope.radius =         300;
            $scope.isSemi =         false;
            $scope.currentColor = '05009f';
            $scope.colors = ['#e9f0ff', '#8fdaff', '#1f67ff', '#05009f', '#000131', '#ff0000']
            $scope.bgColor =        '#eaeaea';
            $scope.iterations =     50;
            $scope.currentAnimation = 'easeOutCubic';


            var random = function(min, max){
                return Math.round(Math.floor(Math.random()*(max-min+1)+min));
            },
            timeout;

            $scope.increment = function(amount){
                $scope.current+=(amount || 1);
            };

            $scope.decrement = function(amount){
                $scope.current-=(amount || 1);
            };

            $scope.start = function(){
                $scope.stop();
                timeout = $timeout(function(){
                    $scope.uploadCurrent+=1;
                    //$scope.currentColor = $scope.colors[$scope.uploadCurrent/20];

                    if($scope.uploadCurrent < 100){
                        $scope.start();
                    }
                }, 1000);
            };

            $scope.stop = function(){
                $timeout.cancel(timeout);
            };

            $scope.reset = function(){
                $scope.stop();
                $scope.uploadCurrent = 0;
            };

            $scope.animations = [];

            angular.forEach(roundProgressService.animations, function(value, key){
                $scope.animations.push(key);
            });
        }]);