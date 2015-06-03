/**
 * Created by Administrator on 2015/5/26.
 */
var object = require('./object');
var util = require('util');

var object_card = function(){
    object.call(this);
    this.set_type('object_card');
};

util.inherits(object_card, object);

module.exports = object_card;

object_card.prototype.init = function(type,val){
    this.set_attr('type',type);
    this.set_attr('val',val);
};
