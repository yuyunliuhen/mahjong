#include "msg_handler.h"
#include "net_impl.h"
#include "consts.h"

namespace mahjong{

	static const char*  __route_request_connector_enter = "connector.entry_handler.entry";

	//	for test
	static const char*  __route_request_lobby_enter = "lobby.lobby_handler.send";

	static const char*  __route_notice_connector_enter = "connector.entry_handler.hello";

	MsgHandler* MsgHandler::inst_ = 0;

	MsgHandler::MsgHandler() : host_("192.168.1.40"), port_(3010)
	{
		_init();
	}

	MsgHandler::~MsgHandler()
	{

	}

	MsgHandler* MsgHandler::instance()
	{
		if (!inst_)
		{
			inst_ = new MsgHandler();
		}
		return inst_;
	}

	void MsgHandler::destroy()
	{
		if (inst_)
		{
			delete inst_;
			inst_ = NULL;
		}
	}

	void MsgHandler::_init()
	{
		mahjong::NetImpl::instance()->connect(host_.c_str(),port_);
	}

	void MsgHandler::do_request_test()
	{
		// compose request
		const char* __route = __route_request_connector_enter;
		json_t* __msg = json_object();
		json_t* __msg_id = json_integer(MSG_ID_TEST);
		json_object_set(__msg, "msg_id", __msg_id);
		// decref for json object
		json_decref(__msg_id);
		mahjong::NetImpl::instance()->do_request(__route,__msg);
	}

	void MsgHandler::do_notice_test()
	{
		// compose notify.
		const char* __route = __route_notice_connector_enter;
		json_t* __msg = json_object();
		json_t* __json_str = json_string("hello");
		json_object_set(__msg, "msg", __json_str);
		// decref json string
		json_decref(__json_str);
		mahjong::NetImpl::instance()->do_notify(__route,__msg);
	}

	void MsgHandler::do_request_login()
	{
		// compose request
		const char* __route = __route_request_connector_enter;
		json_t* __msg = json_object();
		json_t* __msg_id = json_integer(MSG_ID_LOGIN);
		json_t* __msg_username = json_string("aaa");
		json_t* __msg_pwd = json_string("111");
		json_object_set(__msg, "msg_id", __msg_id);
		json_object_set(__msg, "username", __msg_username);
		json_object_set(__msg, "pwd", __msg_pwd);
		// decref for json object
		json_decref(__msg_id);
		json_decref(__msg_username);
		json_decref(__msg_pwd);
		mahjong::NetImpl::instance()->do_request(__route,__msg);
	}

	void MsgHandler::do_request_enter_room( const char* __username,int __rid )
	{
		// compose request
		const char* __route = __route_request_connector_enter;
		json_t* __msg = json_object();
		json_t* __msg_id = json_integer(MSG_ID_ENTER_ROOM);
		json_t* __msg_username = json_string(__username);
		json_t* __msg_rid = json_integer(__rid);
		json_object_set(__msg, "msg_id", __msg_id);
		json_object_set(__msg, "username", __msg_username);
		json_object_set(__msg, "rid", __msg_rid);
		// decref for json object
		json_decref(__msg_id);
		json_decref(__msg_username);
		json_decref(__msg_rid);
		mahjong::NetImpl::instance()->do_request(__route,__msg);
	}

	void MsgHandler::do_request_chat( const char* __target_name,const char* __context )
	{
		// compose request
		const char* __route = __route_request_lobby_enter;
		json_t* __msg = json_object();
		json_t* __msg_id = json_integer(MSG_ID_CHAT);
		json_t* __msg_target_name = json_string(__target_name);
		json_t* __msg_content = json_string(__context);
		json_t* __msg_route = json_string(__route);
		json_object_set(__msg, "msg_id", __msg_id);
		json_object_set(__msg, "target_name", __msg_target_name);
		json_object_set(__msg, "content", __msg_content);
		json_object_set(__msg, "route", __msg_route);
		// decref for json object
		json_decref(__msg_id);
		json_decref(__msg_target_name);
		json_decref(__msg_content);
		json_decref(__msg_route);
		mahjong::NetImpl::instance()->do_request(__route,__msg);
	}

}

