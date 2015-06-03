/**
 * Created by Administrator on 2015/5/26.
 */
var object = require('./object');
var util = require('util');

var object_card_chow = function(){
    object.call(this);
    this.set_type('object_card_chow');
};

util.inherits(object_card_chow, object);

module.exports = object_card_chow;

object_card_chow.prototype.init = function(type,val){
    this.set_attr('type',type);
    this.set_attr('val1',val1);
    this.set_attr('val2',val2);
    this.set_attr('val3',val3);
};
