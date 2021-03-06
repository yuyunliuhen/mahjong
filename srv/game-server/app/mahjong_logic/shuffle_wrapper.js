/**
 * Created by Administrator on 2015/5/26.
 */
var consts = require('../util/consts');
var object_card = require('../object/object_card');
var object_template = require('../object/object_template');

var shuffle_wrapper = function(){
    this.card_data = [];
    this.card_draw_num = 0;
    this.card_draw_num_index = 0;
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
        for (j = 0; j < consts.CARD_NUM_PER_TYPE; j++) {
            var object_card = object_template.create_object('object_card');
            object_card.init(consts.CARD_TYPE.CARD_TYPE_DOT, i);
            this.card_data.push(object_card);
        }
    }
    //  random shuffle
    for (i = 0; i < this.card_data.length; ++i) {
        var rand = parseInt(this.card_data.length * Math.random());
        var temp = this.card_data[i];
        this.card_data[i] = this.card_data[rand];
        this.card_data[rand] = temp;
    }
    this.card_draw_num_index = this.card_data.length - 1;
};

shuffle_wrapper.prototype.get_new_card = function(){
    var tmp_object_card = null;
    if( this.card_used_num < (consts.CARD_TOTAL - this.card_draw_num)){
        tmp_object_card = this.card_data[this.card_used_num++];
    }
    return tmp_object_card;
};

shuffle_wrapper.prototype.get_new_card_test = function(){
    var tmp_object_card = null;
    if( this.card_used_num < (consts.CARD_TOTAL - this.card_draw_num)){
        tmp_object_card = this.card_data[this.card_used_num++];
    }
    if(tmp_object_card){
        tmp_object_card.set_attr('type',2);
        tmp_object_card.set_attr('val',2);
    }
    return tmp_object_card;
};

shuffle_wrapper.prototype.set_card_draw_num = function(num){
    this.card_draw_num = num;
};

shuffle_wrapper.prototype.get_hole_card_4_kong = function(){
    return this.card_data[this.card_draw_num_index];
};

shuffle_wrapper.prototype.get_next_hole_card_4_kong = function(){
    return this.card_data[--this.card_draw_num_index];
};

//	get specialfied card from shuffle card
shuffle_wrapper.prototype.get_card_specified = function(card_type,card_val){
    for (i = this.card_used_num; i < this.card_data.length; ++i) {
		if( this.card_data[i].get_attr('type') == card_type && this.card_data[i].get_attr('val') == card_val){
			var temp = this.card_data[i];
			this.card_data[i] = this.card_data[this.card_used_num]; 
			this.card_data[this.card_used_num] = temp;
			return this.card_data[this.card_used_num++];
		}
	}
	return null;
};
