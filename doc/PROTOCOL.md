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
{
	"msg_id":1008，
	"action":1111
}
action定义:
GAME_ACTION_PONG:1,
GAME_ACTION_KONG:10,
GAME_ACTION_WIN:100,
GAME_ACTION_CANCEL:1000
