import { Mongo } from 'meteor/mongo';

export const ontology_data = new Mongo.Collection('data');

Meteor.methods({
   class_instance : function () {
       if(ontology_data.findOne({})===undefined) {
           Meteor.call('class_name', function (err, res) {
               if(res){
                   res.forEach(function (class_name) {
                       Meteor.call('instance_number', class_name.id, function (err, res) {
                           ontology_data.insert({
                               class_name: class_name.id,
                               instance_number: res
                           })
                       });
                   });
               }
           });
       }
       else
        return 0;
   }
});