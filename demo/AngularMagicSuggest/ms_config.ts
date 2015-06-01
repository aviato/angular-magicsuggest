/**
* Demo module for configurations. You can define all configs here, 
* and then just inject this whole module in your app.js
*/
angular.module("msConfiguration", ['magicSuggest'])
    .run(function (msSetupService: IMSSetupService, $timeout: angular.ITimeoutService) {

    //This configuration object is added to every other object.
    msSetupService.pushDefaultConfig({
        loadingImageRenderer: () => {
            return '<div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>';
        },
        loadingImageSize: 60,
    });

    msSetupService.pushConfig("testConfig", {
        data: [
            { id: 1, name: "Johnny Depp" },
            { id: 2, name: "Will Smith" },
            { id: 3, name: "Al Pacino" },
            { id: 4, name: "Morgan Freeman" },
            { id: 5, name: "Christian Bale" },
            { id: 6, name: "Robert Downey Jr." },
            { id: 7, name: "Leonardo DiCaprio" },
        ],
        placeholder: 'Famous actors',
    });

    msSetupService.pushConfig("testExternalConfig", {
        data: 'http://maps.googleapis.com/maps/api/geocode/json',
        method: 'GET',
        queryParam: 'address',
        renderer: (val) => {
            return val.formatted_address;
        },
        selectionRenderer: (val) => {
            return val.formatted_address;
        },
        valueField: 'place_id',
        mode: 'remote',
        useCommaKey: false,
        resultsField: 'results',
        placeholder: 'Type a street, like First Avenue',
    });

    msSetupService.pushConfig("testSingleSelection", {
        data: [
            { id: 1, name: "Ford" },
            { id: 2, name: "Fiat" },
            { id: 3, name: "Peugeot" },
        ],
        maxSelection: 1,
        placeholder: 'Car Brands',
    });
});