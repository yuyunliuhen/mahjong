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
        TYPE_MSG_START_GAME:7
    },
    TYPE_NOTICE:{
        TYPE_NOTICE_ENTER_GAME :1001,
        TYPE_NOTICE_START_GAME :1002
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
    GAME_ACTION:{
        GAME_ACTION_CHOW:0,
        GAME_ACTION_PONG:1,
        GAME_ACTION_KONG:2,
        GAME_ACTION_WIN:3
    },
    MAX_NUM_PLAYER_PER_TABLE:4,
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
        CARD_TYPE_DOT:4
    },
    CARD_TOTAL:136,
    CARD_TYPE_MAX:6,
    CARD_DRAGON_MAX_NUM:3,
    CARD_WIND_MAX_NUM:4,
    CARD_CHARACTER_MAX_NUM:9,
    CARD_BAMBOO_MAX_NUM:9,
    CARD_DOT_MAX_NUM:9
}
;