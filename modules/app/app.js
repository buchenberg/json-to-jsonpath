var app = angular.module('App', ['ngSanitize'])

app.filter('fieldLimit', function () {
    return function (text, maxlength) {
        if (isNaN(maxlength))
            maxlength = 10;
        return text;
    };
})

app.controller('JsonToJPathCtrl', function ($scope) {

    $scope.jsonCollection = '';
    $scope.formattedCollection = '';
    $scope.jsonData;
    $scope.truncFields = true;
    $scope.showHash = true;
    $scope.showValue = true;

    $scope.parseCollection = function () {


        if ($scope.jsonCollection.length > 0) {
            try {
                $scope.jsonData = JSON.parse($scope.jsonCollection);
                $scope.formattedCollection = '';
                $scope.formattedCollection = printChildren('$', $scope.jsonData, $scope.truncFields, $scope.showHash, $scope.showValue);
            } catch (err) {
                $scope.formattedCollection = 'Invalid JSON ';
            }
        }

    }
});



function printChildren(par, coll, trunc, showHash, showVal) {
    var pref = par;
    var str = '';
    var hashStr = showHash ? '{}' : '';
    if (_.isArray(coll)) {
        if (coll.length == 0) {
            str = str + printChildren(pref + '[]', '', trunc, showHash, showVal);
        } else {
            $.each(coll, function (idx, val) {
                if (idx == 0 || !trunc) {
                    var index = (trunc && coll.length > 1) ? '*' : idx;
                    str = str + printChildren(pref + '[' + index + ']', val, trunc, showHash, showVal);
                }
            });
        }
    } else if (_.isObject(coll)) {
        var i = 0;
        if (coll.length == 0) {
            str = str + printChildren(pref + (pref == '$' ? '.' : hashStr), '', trunc, showHash, showVal);
        } else {
            $.each(coll, function (key, val) {
                str = str + printChildren(pref + (pref == '$' ? '.' : hashStr + '.') + key, val, trunc, showHash, showVal);
            });
        }
    } else {
        if ('string' === typeof (coll)) coll = '"' + coll + '"';
        str = str + pref + (showVal ? "\t::\t" + coll : '') + "<br />";
    }
    return str;
}