/**
 * Created by Administrator on 2015/5/12.
 */
module.exports = {
    //  the message type communicated with server,client must define something similar.
    TYPE_MSG:{
        TYPE_MSG_TEST :1,
        TYPE_MSG_LOGIN:2,
        TYPE_MSG_ENTER_ROOM:3,
        TYPE_MSG_ENTER_LOBBY:4,
        TYPE_MSG_GET_CHARGE_LIST:5,
        TYPE_MSG_ENTER_GAME:6,
        TYPE_MSG_LEAVE_LOBBY:7,
        TYPE_MSG_LEAVE_ROOM:8
    },

    TYPE_REMOTE_LOBBY:{
        TYPE_REMOTE_LOBBY_TEST :101
    },

    //  lobby status
    TYPE_LOBBY:{
        TYPE_LOBBY_NORMAL:0,
        TYPE_LOBBY_PERSONAL:1
    },
    //  game status
    MAHJONG_GAME_STATUS:{
        MAHJONG_GAME_STATUS_ZERO:0,
        MAHJONG_GAME_STATUS_READY:1,
        MAHJONG_GAME_STATUS_START:2,
        MAHJONG_GAME_STATUS_SHUFFLE:3,
        MAHJONG_GAME_STATUS_FIND_BANKER:4,
        MAHJONG_GAME_STATUS_PLAYING:5,
        MAHJONG_GAME_STATUS_QUESTION:6,
        MAHJONG_GAME_STATUS_WIN:7,
        MAHJONG_GAME_STATUS_OVER:8,
        MAHJONG_GAME_STATUS_EXIT:9
    },
    GAME_ACTION:{
        GAME_ACTION_CHOW:0,
        GAME_ACTION_PONG:1,
        GAME_ACTION_KONG:2,
        GAME_ACTION_WIN:3,
    },
    MAX_NUM_PLAYER_PER_TABLE:4
};