var json_mission = require('../../config/task');
var consts = require('../util/consts');
var pomelo = require('pomelo');
var mission_wrapper = function(){

};

module.exports = mission_wrapper;

mission_wrapper.prototype.init = function(){
    //  init mission data
    var mission_data = [];
    for(var v in json_mission){
        mission_data.push({
            "id":json_mission[v].id,
            "finished_num":0,
            "status":consts.MISSION_STATUS.MISSION_STATUS_UNFINISHED
        });
    }
    return mission_data;
};

mission_wrapper.prototype.get_mission_config = function(mission_id){
    for(var v in json_mission){
        if(mission_id == json_mission[v].id){
            return json_mission[v];
        }
    }
    return null;
};

mission_wrapper.prototype.trigger = function (user_data, mission_id) {
    if (user_data) {
        var json_user_data = JSON.parse(user_data);
        var mission_data = json_user_data.mission_data;
        for (var i = 0; i < mission_data.length; ++i) {
            //  the mission have finished
            if (mission_data[i].id == mission_id) {
                if (mission_data[i].status == consts.MISSION_STATUS.MISSION_STATUS_FINISHED ||
                    mission_data[i].status == consts.MISSION_STATUS.MISSION_STATUS_OBTAINED) {
                    return user_data;
                }
                mission_data[i].finished_num++;
                var mission_config = this.get_mission_config(mission_id);
                if (mission_config) {
                    if (mission_data[i].finished_num >= mission_config.need) {
                        mission_data[i].status = consts.MISSION_STATUS.MISSION_STATUS_FINISHED;
                        //  notice client get award
                    }
                }
            }
        }
        return JSON.stringify(json_user_data);
    }
};

mission_wrapper.prototype.check_everyday_mission = function (user_data) {
    if (user_data) {
        var json_user_data = JSON.parse(user_data);
        var last_login_time = json_user_data.last_login_time;
        var last_login_date = new Date(last_login_time);
        var last_login_day = last_login_date.getDay();
        var cur_date = new Date();
        var today = cur_date.getDay();
        if (today != last_login_day) {
            var mission_data = json_user_data.mission_data;
            for (var i = 0; i < mission_data.length; ++i) {
                var mission_config = this.get_mission_config(mission_id);
                if (mission_config) {
                    mission_data.finished_num = 0;
                    mission_data.status = consts.MISSION_STATUS.MISSION_STATUS_UNFINISHED;
                }
            }
        }
        return JSON.stringify(json_user_data);
    }
};

mission_wrapper.prototype.get_award = function (user_data, mission_id) {
    var success = 0;
    if (user_data) {
        var json_user_data = JSON.parse(user_data);
        for (var i = 0; i < json_user_data.mission_data.length; ++i) {
            //  the mission have finished
            if (json_user_data.mission_data[i].id == mission_id && json_user_data.mission_data[i].status == consts.MISSION_STATUS.MISSION_STATUS_FINISHED) {
                //  set status
                json_user_data.mission_data[i].status = consts.MISSION_STATUS.MISSION_STATUS_OBTAINED;
                success = 1;
                //  add award
                var mission_config = this.get_mission_config(mission_id);
                if (mission_config) {
                    json_user_data.gold += parseInt(mission_config.gold);
                }
            }
        }
    }
    return [success,JSON.stringify(json_user_data)];
};