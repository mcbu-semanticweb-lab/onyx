import {Meteor} from "meteor/meteor";
import {HTTP} from "meteor/http";

var N3 = require('n3');
var parser = N3.Parser();

Meteor.methods({
        pitfall_scanner : function (uri) {
            let sync = Meteor.wrapAsync(HTTP.post);
            let result = sync('http://oops-ws.oeg-upm.net/rest',
                {
                    content : '<?xml version="1.0" encoding="UTF-8"?>\n' +
                    '<OOPSRequest>\n' +
                    '\t<OntologyURI>'+uri+'</OntologyURI>\n' +
                    '\t<OntologyContent></OntologyContent>\n' +
                    '\t<Pitfalls></Pitfalls>\n' +
                    '\t<OutputFormat></OutputFormat>\n' +
                    '</OOPSRequest>'
                });
            return(result.content);
        },
});