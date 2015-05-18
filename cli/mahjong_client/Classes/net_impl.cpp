#include "net_impl.h"
#include <stdio.h>
#include <winsock.h>

namespace mahjong {
	NetImpl* NetImpl::inst_ = NULL;

	NetImpl::NetImpl()
	{
		// create a client instance.
		client_ = pc_client_new();
		// add some event callback.
		pc_add_listener(client_, "on_msg", on_msg);
		pc_add_listener(client_, PC_EVENT_DISCONNECT, on_close);
	}

	NetImpl::~NetImpl()
	{
		// stop client
		pc_client_stop(client_);
	}

	void NetImpl::on_close( pc_client_t* __client, const char* __events, void* __data )
	{
		printf("client closed: %d.\n", __client->state);
	}

	NetImpl* NetImpl::instance()
	{
		if(!inst_)
		{
			inst_ = new NetImpl();
		}
		return inst_;
	}

	bool NetImpl::connect( const char* __host, unsigned short __port )
	{
		struct sockaddr_in __address;

		memset(&__address, 0, sizeof(struct sockaddr_in));
		__address.sin_family = AF_INET;
		__address.sin_port = htons(__port);
		__address.sin_addr.s_addr = inet_addr(__host);

		// try to connect to server.
		if(pc_client_connect(client_, &__address)) {
			printf("fail to connect server.\n");
			pc_client_destroy(client_);
			return false;
		}
		return true;
	}

	void NetImpl::destroy()
	{
		if(inst_)
		{
			delete inst_;
			inst_ = NULL;	
		}
	}

	void NetImpl::on_msg( pc_client_t* __client, const char* __events, void* __data )
	{
		printf("on_msg: %d.\n", __client->state);
		json_t* __resp = (json_t*)(__data);
		if(__resp)
		{
			on_msg_cb(__resp);
			char* __json_str = json_dumps(__resp, 0);
			if(__json_str != NULL) 
			{
				printf("server response: %s\n", __json_str);
				free(__json_str);
			}
		}
	}

	void NetImpl::do_request(const char* __route,json_t* __msg)
	{
		pc_request_t* __request = pc_request_new();
		pc_request(client_, __request, __route, __msg, on_request);
	}

	void NetImpl::on_request( pc_request_t* __req, int __status, json_t* __resp )
	{
		if(__status == -1) 
		{
			printf("Fail to send request to server.\n");
		} 
		else if(__status == 0) 
		{
			char* __json_str = json_dumps(__resp, 0);
			if(__json_str != NULL) 
			{
				printf("server response: %s\n", __json_str);
				free(__json_str);
			}
		}
		on_request_cb(__status,__resp);
		// release relative resource with pc_request_t
		json_t*__msg = __req->msg;
		pc_client_t* __client = __req->client;
		json_decref(__msg);
		pc_request_destroy(__req);
	}

	void NetImpl::do_notify( const char* __route,json_t* __msg )
	{
		pc_notify_t* __notify = pc_notify_new();
		pc_notify(client_, __notify, __route, __msg, on_notified);
	}

	void NetImpl::on_notified( pc_notify_t* __req, int __status )
	{
		if(__status == -1) 
		{
			printf("Fail to send notify to server.\n");
		} else 
		{
			json_t* __msg = __req->msg;
			if(__msg)
			{
				char* __json_str = json_dumps(__msg, 0);
				if(__json_str != NULL) 
				{
					on_notice_cb(__msg);
					printf("server notice response: %s\n", __json_str);
				}
			}
			printf("Notify finished.\n");
		}
		pc_notify_destroy(__req);
	}
}
