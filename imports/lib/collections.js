import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const triples = new Mongo.Collection('triples');

Meteor.methods({
    'ranges'() {
        return triples.find({predicate:"range"}).fetch();
    },
    'domains'() {
        return triples.find({predicate:"domain"}).fetch();
    },
    'attributes'(id) {
        return triples.find({subject:id}).fetch();
    },
});