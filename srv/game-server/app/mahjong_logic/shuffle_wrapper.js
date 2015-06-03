/**
 * Created by Administrator on 2015/5/26.
 */
var consts = require('../util/consts');
var object_card = require('../object/object_card');
var object_template = require('../object/object_template');
var log4js = require('log4js');
log4js.configure(require('../../config/log.json'));
var mahjong_logger = log4js.getLogger('mahjong-logger');

var shuffle_wrapper = function(){
    this.card_data = [];
    this.card_draw_num = 0;
    this.card_used_num = 0;
};

module.exports = shuffle_wrapper;

shuffle_wrapper.prototype.shuffle = function(){
    this.card_used_num = 0;
    this.card_data = [];
    var i = 0;
    var j = 0;
    //  dragon
    for(i = 1; i <= consts.CARD_DRAGON_MAX_NUM; ++i){
        for(j = 0; j < consts.CARD_NUM_PER_TYPE; j++){
            var object_card = object_template.create_object('object_card');
            object_card.init(consts.CARD_TYPE.CARD_TYPE_DRAGON,i);
            this.card_data.push(object_card);
        }
    }
    //  wind
    for(i = 1; i <= consts.CARD_WIND_MAX_NUM; ++i){
        for(j = 0; j < consts.CARD_NUM_PER_TYPE; j++){
            var object_card = object_template.create_object('object_card');
            object_card.init(consts.CARD_TYPE.CARD_TYPE_WIND,i);
            this.card_data.push(object_card);
        }
    }
    //  character
    for(i = 1; i <= consts.CARD_CHARACTER_MAX_NUM; ++i){
        for(j = 0; j < consts.CARD_NUM_PER_TYPE; j++){
            var object_card = object_template.create_object('object_card');
            object_card.init(consts.CARD_TYPE.CARD_TYPE_CHARACTER,i);
            this.card_data.push(object_card);
        }
    }
    //  bamboo
    for(i = 1; i <= consts.CARD_BAMBOO_MAX_NUM; ++i) {
        for (j = 0; j < consts.CARD_NUM_PER_TYPE; j++) {
            var object_card = object_template.create_object('object_card');
            object_card.init(consts.CARD_TYPE.CARD_TYPE_BAMBOO, i);
            this.card_data.push(object_card);
        }
    }
    //  dot
    for(i = 1; i <= consts.CARD_DOT_MAX_NUM; ++i){
        var object_card = object_template.create_object('object_card');
        object_card.init(consts.CARD_TYPE.CARD_TYPE_DOT,i);
        this.card_data.push(object_card);
        this.card_data.push(object_card);
        this.card_data.push(object_card);
        this.card_data.push(object_card);
    }
    //  random shuffle
    for (i = 0; i < this.card_data.length; i++) {
        var rand = parseInt(this.card_data.length * Math.random());
        var temp = this.card_data[i];
        this.card_data[i] = this.card_data[rand];
        this.card_data[rand] = temp;
    }
};

shuffle_wrapper.prototype.get_new_card = function(){
    var tmp_object_card = null;
    if( this.card_used_num < (consts.CARD_TOTAL - this.card_draw_num)){
        tmp_object_card = this.card_data[this.card_used_num++];
    }
    return tmp_object_card;
};

shuffle_wrapper.prototype.set_card_draw_num = function(num){
    this.card_draw_num = num;
};
