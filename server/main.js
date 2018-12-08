import { Meteor } from 'meteor/meteor';
import '../imports/api/http';
import '../imports/api/metric-calculator';
import '../imports/api/data';
import '../imports/api/pitfall-scanner';
import '../imports/api/rdf-translator';

export const CAYLEY_URL = "http://localhost:64210/";

Meteor.startup(() => {

});
