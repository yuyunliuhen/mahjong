/**
 * Created by Administrator on 2015/5/12.
 */
module.exports = {
    //  the message type communicated with server,client must define something similar.
    TYPE_MSG:{
        TYPE_MSG_TEST :1,
        TYPE_MSG_LOGIN:2,
        TYPE_MSG_GET_CHARGE_LIST:5,
        TYPE_MSG_ENTER_GAME:6,
        TYPE_MSG_START_GAME:7,
        TYPE_MSG_DISCARD:8,
        TYPE_MSG_ACTION_ANSWER:9
    },
    TYPE_NOTICE:{
        TYPE_NOTICE_ENTER_GAME :1001,
        TYPE_NOTICE_START_GAME :1002,
        TYPE_NOTICE_FIND_BANKER:1003,
        TYPE_NOTICE_DISCARD:1004,
        TYPE_NOTICE_REMAIN_TIME:1005,
        TYPE_NOTICE_DRAW_CARD:1006,
        TYPE_NOTICE_FLOW_BUREAU:1007,
        TYPE_NOTICE_ACTION_QUESTION:1008,
        TYPE_NOTICE_CARD_KONG:1009,
        TYPE_NOTICE_CARD_PONG:1010,
        TYPE_NOTICE_CARD_READY_HAND:1011,
        TYPE_NOTICE_CARD_WIN:1012
    },

    TYPE_REMOTE_LOBBY:{
        TYPE_REMOTE_LOBBY_TEST :2001
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
    MAX_NUM_PLAYER_PER_TABLE:4,
    MAX_NUM_CARD_KONG:4,
    MAX_NUM_CARD_PONG:4,
    GLOBAL_SESSION:"global_session",
    CARD_TYPE:{
        //  中发白
        CARD_TYPE_DRAGON:0,
        //  东西南北
        CARD_TYPE_WIND:1,
        //  万
        CARD_TYPE_CHARACTER:2,
        //  条
        CARD_TYPE_BAMBOO:3,
        //  筒
        CARD_TYPE_DOT:4,

        CARD_TYPE_MAX:5
    },
    CARD_TOTAL:136,
    CARD_TOTAL_FIRST_PER_PEOPLE:13,
    CARD_NUM_PER_TYPE:4,
    CARD_TYPE_MAX:6,
    CARD_DRAGON_MAX_NUM:3,
    CARD_WIND_MAX_NUM:4,
    CARD_CHARACTER_MAX_NUM:9,
    CARD_BAMBOO_MAX_NUM:9,
    CARD_DOT_MAX_NUM:9,
    GAME_STATUS:{
        GAME_STATUS_FIND_BANKER:1,
        GAME_STATUS_RUNNING:2,
        GAME_STATUS_QUESTION:3,
        GAME_STATUS_OVER:4
    },
    GAME_QUESTION:{
        GAME_QUESTION_NONE:0,
        GAME_QUESTION_KONG:1,
        GAME_QUESTION_PONG:2,
        GAME_QUESTION_READ_HAND:3
    },
    MAX_WAITING_TIME:5,
    GAME_ACTION: {
        GAME_ACTION_PONG:1,
        GAME_ACTION_KONG:10,
        GAME_ACTION_WIN:100,
        GAME_ACTION_CANCEL:1000,
        GAME_ACTION_READY_HAND:10000
    }
}
;