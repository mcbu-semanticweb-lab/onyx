import {Meteor} from "meteor/meteor";
import {HTTP} from "meteor/http";

Meteor.methods({
    rdf_translator : function (uri) {
        let sync = Meteor.wrapAsync(HTTP.post);
        let result = sync('http://rdf-translator.appspot.com/convert/detect/nt/'+uri);
        return(result.content);
    },
});