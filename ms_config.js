angular.module("msConfiguration", ['magicSuggest']).run(function (msSetupService) {
    msSetupService.pushDefaultConfig({
        loadingImageRenderer: function () {
            return '<div class="text-center">Loading..</div>';
        },
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
    });
    msSetupService.pushConfig("testExternalConfig", {
        data: 'http://maps.googleapis.com/maps/api/geocode/json',
        method: 'GET',
        queryParam: 'address',
        renderer: function (val) {
            return val.formatted_address;
        },
        selectionRenderer: function (val) {
            return val.formatted_address;
        },
        valueField: 'place_id',
        mode: 'remote',
        useCommaKey: false,
        resultsField: 'results',
    });
});
