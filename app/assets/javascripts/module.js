angular.module('t-minus', ['angular-svg-round-progress'])
        .controller('demoCtrl', ['$scope', '$timeout', 'roundProgressService', function($scope, $timeout, roundProgressService){

            $scope.current =        27;
            $scope.maxDate = "";
            $scope.max =            0;
            $scope.label =          "";
            $scope.remaining =       0;
            $scope.currentColor = '05009f';
            $scope.bgColor =        '#eaeaea';
            $scope.daysR =              0;
            $scope.workHoursR =         0;
            $scope.pctR =               0.00;
            $scope.radius = 100;
            $scope.stroke = 15;



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

            $scope.$watch("maxDate", function(v){
                if(v){
                    $scope.max = Date.parse($scope.maxDate);
                }
            })

            $scope.start = function(){
                $scope.stop();
                timeout = $timeout(function(){
                    $scope.remaining = $scope.max - new Date().getTime();
                    $scope.daysR = Math.ceil( $scope.remaining / (1000 * 3600 * 24));
                    $scope.workHoursR = $scope.daysR * 8;
                    $scope.pctR = Math.floor((($scope.max - $scope.remaining) / $scope.max) * 10000) / 100;


                    if($scope.remaining < $scope.max && $scope.remaining >0){
                        $scope.start();
                    }
                }, 1000);
            };

            $scope.stop = function(){
                $timeout.cancel(timeout);
            };

            $scope.reset = function(){
                $scope.stop();
                $scope.remaining = 0;
            };

            $scope.animations = [];

            angular.forEach(roundProgressService.animations, function(value, key){
                $scope.animations.push(key);
            });
        }]);