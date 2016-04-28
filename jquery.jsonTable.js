/*!
 * jquery.jsonTable.js
 * https://github.com/samveloper/jquery.jsonTable.js
 * Copyright (c) Samiul Hoque
 * Licensed under the MIT license (https://github.com/samveloper/jquery.jsonTable.js/blob/master/LICENSE)
 */
(function ($) {

    function CreateTableView(objArray, theme, enableHeader) {
        if (theme === undefined) {
            theme = 'table'; //default theme
        }

        if (enableHeader === undefined) {
            enableHeader = true; //default enable headers
        }

        // If the returned data is an object do nothing, else try to parse
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : new Array(objArray);
        var keys = Object.keys(array[0]);

        var str = '<table class="' + theme + '">';

        // table head
        if (enableHeader) {
            str += '<thead><tr>';
            for (var index in keys) {
                str += '<th scope="col">' + keys[index] + '</th>';
            }
            str += '</tr></thead>';
        }

        // table body
        str += '<tbody>';
        for (var i = 0; i < array.length; i++) {
            str += (i % 2 == 0) ? '<tr class="alt">' : '<tr>';
            for (var index in keys) {
                var objValue = array[i][keys[index]];

                // Support for Nested Tables
                if (typeof objValue === 'object' && objValue !== null) {
                    if (Array.isArray(objValue)) {
                        str += '<td>';
                        for (var aindex in objValue) {
                            str += CreateTableView(objValue[aindex], theme, true);
                        }
                        str += '</td>';
                    } else {
                        str += '<td>' + CreateTableView(objValue, theme, true) + '</td>';
                    }
                } else {
                    str += '<td>' + objValue + '</td>';
                }

            }
            str += '</tr>';
        }
        str += '</tbody>'
        str += '</table>';

        return str;
    }

    function CreateDetailView(objArray, theme, enableHeader) {
        // set optional theme parameter
        if (theme === undefined) {
            theme = 'table';  //default theme
        }

        if (enableHeader === undefined) {
            enableHeader = true; //default enable headers
        }

        // If the returned data is an object do nothing, else try to parse
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : new Array(objArray);
        var keys = Object.keys(array[0]);

        var str = '<table class="' + theme + '">';
        str += '<tbody>';


        for (var i = 0; i < array.length; i++) {
            var row = 0;
            for (var index in keys) {
                var objValue = array[i][keys[index]]

                str += (row % 2 == 0) ? '<tr class="alt">' : '<tr>';

                if (enableHeader) {
                    str += '<th scope="row">' + keys[index] + '</th>';
                }

                // Support for Nested Tables
                if (typeof objValue === 'object' && objValue !== null) {
                    if (Array.isArray(objValue)) {
                        str += '<td>';
                        for (var aindex in objValue) {
                            str += CreateDetailView(objValue[aindex], theme, true);
                        }
                        str += '</td>';
                    } else {
                        str += '<td>' + CreateDetailView(objValue, theme, true) + '</td>';
                    }
                } else {
                    str += '<td>' + objValue + '</td>';
                }

                str += '</tr>';
                row++;
            }
        }
        str += '</tbody>'
        str += '</table>';
        return str;
    }

    $.fn.jsonTable = function (detail, options) {

        var settings = $.extend({
            theme: 'table',
            enableHeader: true,
        }, options);

        var el = this;
        var content = $.trim(el.html());
        var json;
        var tableView;

        if(content.length > 0) {
            if (json = JSON.parse(content)) {
                if (detail == 'detail') {
                    tableView = CreateDetailView(json, settings.theme, settings.enableHeader);
                } else {
                    tableView = CreateTableView(json, settings.theme, settings.enableHeader);
                }
                this.html(tableView);
            } else {
                console.log('Json Parsing Error!')
            }
        }
        return this;
    };
}(jQuery));
