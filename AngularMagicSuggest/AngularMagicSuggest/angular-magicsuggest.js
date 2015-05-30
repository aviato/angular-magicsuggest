/**
 * Copyright (C) 2015 Leonardo Chaia
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

angular.module("magicSuggest", [])
.service("msSetupService", function () {
    var _configList = [];
    var _defaultConfig = {};

    return {
        pushDefaultConfig: function (newDefaultConfig) {
            _defaultConfig = newDefaultConfig;
        },
        pushConfig: function (identifier, configurationObject) {
            _configList[identifier] = configurationObject;
        },
        getConfig: function (identifier) {
            var config = null;
            config = _configList[identifier];
            if (config)
                return $.extend({}, _defaultConfig, config);
            else
                return false;
        }
    }
})
.directive('magicSuggest', function (msSetupService, $parse) {
    var safeApply = function ($scope, fn) {
        var phase = $scope.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn) {
                $scope.$eval(fn);
            }
        }
        else {
            if (fn) {
                $scope.$apply(fn);
            }
            else {
                $scope.$apply();
            }
        }
    };
    return {
        restrict: 'E',
        replace: true,
        scope: {
            value: '=ngModel',
            // mark the field as disabled
            disabled: '=?ngDisabled',
            //The type of configuration to use from msSetupService service
            type: '=',
            //If it's a required file, it will be flagged with $invalid
            required: '=?',
            //Function to be called on selection change. Signature: (e, ms, records) => {}
            selectionChange: '=?',
            //Will get the current MagicSuggest instance for this directive
            msInstance: '=?',
            //An object that will be sent with the Ajax Request.
            extraParams: '=?',
            placeholder: '@',
        },
        require: 'ngModel',
        compile: function (element, attrs) {
            var newElem = $("<div />", {
                id: attrs.id || 'magicSuggest'
            });
            element.replaceWith(newElem);
            // Link function
            return function (scope, element, attrs, controller) {
                var config = msSetupService.getConfig(attrs.type);
                //If it doesn't exist by name, maybe the name represents a scope variable..
                if (!config) {
                    if (scope.type)
                        config = msSetupService.getConfig(scope.type);
                }
                if (!config) {
                    throw ("Couldnt find configuration settings for key " + attrs.type);
                }
                //Take into account attributes.
                scope.disabled = scope.disabled || false;
                config.editable = !scope.disabled;
                config.disabled = scope.disabled;
                config.value = scope.value;
                config.dataUrlParams = $.extend(config.dataUrlParams, scope.extraParams);
                config.placeholder = scope.placeholder || config.placeholder;

                //Create the MagicSuggest Instance
                var ms = $(element).magicSuggest(config);
                scope.msInstance = ms;
                //Set the default selection, if any
                if (scope.value)
                    ms.setSelection(scope.value);

                //Watch the value. If it changes, apply it to MS.
                scope.$watch(function () {
                    return scope.value;
                }, function () {
                    if (scope.value && scope.value != ms.getSelection()) {
                        ms.setSelection(scope.value, true);
                    }
                });

                //Also watch extraParams.
                scope.$watch(function () {
                    return scope.extraParams;
                }, function () {
                    ms.setDataUrlParams(scope.extraParams);
                });

                var expressionHandler = $parse(attrs.selectionChange);
                //Selection Change
                $(ms).on('selectionchange', function (e, ms, records) {
                    safeApply(scope, function () {
                        scope.value = ms.getSelection();
                        if (attrs.required)
                            if (scope.value.length > 0)
                                controller.$setValidity("required", true);
                            else
                                controller.$setValidity("required", false);
                        //Manually set the element dirty
                        controller.$setDirty();
                        if (expressionHandler) {
                            //If there's an event binded fire it up!
                            expressionHandler(records);
                        }
                        //else
                        //    console.error(typeof scope.selectionChange);
                    });
                });
            };
        }
    };
});

