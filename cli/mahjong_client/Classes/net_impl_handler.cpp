#include "helloworldscene.h"
#include "net_impl.h"

namespace mahjong
{
	void NetImpl::add_log(json_t* __resp)
	{
		return;
		cocos2d::Scene* __running_scene = cocos2d::Director::getInstance()->getRunningScene();
		if(__running_scene)
		{
			HelloWorld* __hello_world = dynamic_cast<HelloWorld*>(__running_scene->getChildByName("hello_world"));
			if(__hello_world)
			{
				char* __json_str = json_dumps(__resp, 0);
				if(__json_str)
				{
					__hello_world->addLog(__json_str);
				}
			}
		}
	}

	void NetImpl::on_msg_cb( json_t* __resp )
	{
		add_log(__resp);
	}

	void NetImpl::on_request_cb( int __status,json_t* __resp )
	{
		add_log(__resp);
	}

	void NetImpl::on_notice_cb(json_t* __resp )
	{
		add_log(__resp);
	}
}