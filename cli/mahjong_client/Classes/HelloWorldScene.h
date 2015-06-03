#ifndef __HELLOWORLD_SCENE_H__
#define __HELLOWORLD_SCENE_H__

#include <vector>
#include "cocos2d.h"
#include "ui/CocosGUI.h"

class HelloWorld : public cocos2d::Layer
{
public:
    // there's no 'id' in cpp, so we recommend returning the class instance pointer
    static cocos2d::Scene* createScene();

    // Here's a difference. Method 'init' in cocos2d-x returns bool, instead of returning 'id' in cocos2d-iphone
    virtual bool init();
    
    // a selector callback
    void menuCloseCallback(cocos2d::Ref* pSender);
    
    // implement the "static create()" method manually
    CREATE_FUNC(HelloWorld);

	void loginCallback( cocos2d::Ref* __sender );

	void enterLobbyCallback( cocos2d::Ref* __sender );

	void leaveLobbyCallback( cocos2d::Ref* __sender );

	void enterRoomCallback( cocos2d::Ref* __sender );

	void enterGameCallback( cocos2d::Ref* __sender );

	void discardCallback( cocos2d::Ref* __sender );

	void addLog(std::string __context);

private:
	cocos2d::ui::EditBox* _editName;

	cocos2d::ui::ListView* _listView;
};

#endif // __HELLOWORLD_SCENE_H__
