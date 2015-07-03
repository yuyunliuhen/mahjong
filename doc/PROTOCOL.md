###进入游戏
发送
{
	"msg_id":6,
	"username":""
}
返回
{
	"msg_id":6,
	"joiner_data":[{"username1":"","pos":0},{"username2":"","pos":0}]
}

###打牌请求
发送
{
	"msg_id":8,
	"username":"",
	"card_type":0,
	"card_val":1,
}
返回
{
	"msg_id":8
}

###询问回答
发送
{
	"msg_id":9,
	"username":"",
	"action":1000
}
返回
{
	"msg_id":9,
	data:{
		"action":10,
		kong_draw_card_type:1
		kong_draw_card_val:1
	}
}

###获取任务奖励
发送
{
	"msg_id":12,
	"username":"",
	"mission_id":1,
}
返回
{
	"msg_id":12,
	"success":1
}

###获取任务数据
发送
{
	"msg_id":13,
	"username":""
}
返回
{
	"msg_id":13,	"mission_data\":[{\"id\":1,\"finished_num\":1,\"status\":1},{\"id\":2,\"finished_num\":0,\"status\":0},{\"id\":3,\"finished_num\":0,\"status\":0},{\"id\":4,\"finished_num\":0,\"status\":0},{\"id\":5,\"finished_num\":0,\"status\":0},{\"id\":6,\"finished_num\":0,\"status\":0}]
}
###离开游戏
发送
{
	"msg_id":14,
	"username":""
}
返回
{
	"msg_id":12,
	"success":1
}


### 找庄通知
{
	"msg_id":1003,
	"card_type":0,
	"card_val":1,
	"cur_banker_index":0
}


###打牌通知
{
	"msg_id":1004,
	"card_type":0,
	"card_val":1,
	cur_player_index:1
}

###剩余时间通知
{
	"msg_id":1005,
	"remain_time":5
}

###摸牌通知
{
	"msg_id":1006,
	"card_type":0,
	"card_val":1,
	cur_player_index:1
}

###流局通知
{
	"msg_id":1007
}

###询问(胡/杠/碰)
action定义:
GAME_ACTION_PONG:1,
GAME_ACTION_KONG:10,
GAME_ACTION_WIN:100,
GAME_ACTION_CANCEL:1000
{
	"msg_id":1008，
	"action":1111,
	"card_type":0,
	"card_val":1,
	"pong_or_kong_player_index":1,		
	"cur_player_index":1,				
}
pong_or_kong_player_index：碰或者杠玩家索引	
cur_player_index：当前出牌玩家索引


###杠牌通知
{
	"msg_id":1009，
	"card_type":0,
	"card_val":1,
	"player_index":1,	
}

###碰牌通知
{
	"msg_id":1010，
	"card_type":0,
	"card_val":1,
	"player_index":1,
}

###听牌通知
{
	"msg_id":1011，
	"player_index":1,
	"cards_win":[[3,2],[3,5],[3,8]]
}

###胡牌通知
{
	"msg_id":1012，
	"player_index":1,
}



