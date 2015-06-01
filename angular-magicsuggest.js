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
    //Watch the value. If it changes, apply it to MS.
    var startWatchingValue = function (scope, ms) {
        return scope.$watch(function () {
            return scope.value;
        }, function () {
            if (scope.value != ms.getSelection()) {
                if (scope.value || (scope.value && scope.value.length > 0))
                    ms.setSelection(scope.value, true);
                else
                    ms.clear(true);
            }
        });
    };
    return {
        restrict: 'E',
        replace: true,
        scope: {
            value: '=ngModel',
            // mark the field as disabled
            disabled: '=?',
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
            //Placeholder, overrides the setup config parameter.
            placeholder: '@',
            //HideTrigger, overrides the setup config parameter
            hideTrigger: '=?',
            //expandOnFocus, overrides the setup config parameter
            expandOnFocus: '=?',
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
                //scope.disabled = scope.disabled || false;
                config.editable = !scope.disabled;
                config.disabled = scope.disabled;
                config.value = scope.value;
                config.dataUrlParams = $.extend(config.dataUrlParams, scope.extraParams);
                config.placeholder = scope.placeholder || config.placeholder;
                config.maxSelection = config.maxSelection || 10;

                //Handinlg the disabled parameter
                if (attrs.disabled === 'false' || attrs.disabled === 'true') {
                    config.disabled = attrs.disabled === 'true';
                } else if (scope.disabled && typeof scope.disabled === 'boolean') {
                    config.disabled = scope.disabled;
                }

                //Handinlg the hideTrigger parameter
                if (attrs.hideTrigger === 'false' || attrs.hideTrigger === 'true') {
                    config.hideTrigger = attrs.hideTrigger === 'true';
                } else if (scope.hideTrigger && typeof scope.hideTrigger === 'boolean') {
                    config.hideTrigger = scope.hideTrigger;
                }

                //Handinlg the expandOnFocus parameter
                if (attrs.expandOnFocus === 'false' || attrs.expandOnFocus === 'true') {
                    config.expandOnFocus = attrs.expandOnFocus === 'true';
                } else if (scope.expandOnFocus && typeof scope.expandOnFocus === 'boolean') {
                    config.expandOnFocus = scope.expandOnFocus;
                }

                //Create the MagicSuggest Instance
                var ms = $(element).magicSuggest(config);
                scope.msInstance = ms;
                //Set the default selection, if any
                if (scope.value)
                    ms.setSelection(scope.value);

                //Start watching the value, and save the deregister method.
                var stopWatchingValue = startWatchingValue(scope, ms);

                //Also watch extraParams.
                scope.$watch(function () {
                    return scope.extraParams;
                }, function () {
                    ms.setDataUrlParams(scope.extraParams);
                });

                if (attrs.disabled != null & attrs.disabled != undefined) {
                    scope.$watch(function () {
                        return scope.disabled;
                    }, function (newValue) {
                        if (newValue === 'true' || newValue === 'false' || typeof newValue === 'boolean')
                            if (newValue)
                                ms.enable();
                            else
                                ms.disable();
                    });
                }
                var expressionHandler = $parse(attrs.selectionChange);
                //MagicSuggest Selection Change
                $(ms).on('selectionchange', function (e, _ms, records) {
                    stopWatchingValue();
                    safeApply(scope, function () {
                        if (config.maxSelection > 1)
                            controller.$setViewValue(ms.getSelection());
                        else if (ms.getSelection() && ms.getSelection().length != 0)
                            controller.$setViewValue(ms.getSelection()[0]);
                        else
                            controller.$setViewValue(undefined);

                        if (attrs.required)
                            if (controller.$viewValue.length > 0)
                                controller.$setValidity("required", true);
                            else
                                controller.$setValidity("required", false);
                        //Manually set the controller dirty
                        controller.$setDirty();
                        if (expressionHandler) {
                            //If there's an event binded fire it up!
                            expressionHandler(records);
                        }
                        //else
                        //    console.error(typeof scope.selectionChange);
                    });
                    //Update the value deregister method.
                    stopWatchingValue = startWatchingValue(scope, ms);
                });
            };
        }
    };
});

