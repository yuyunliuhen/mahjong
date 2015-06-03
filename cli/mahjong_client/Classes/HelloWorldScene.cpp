#include "HelloWorldScene.h"
#include "msg_handler.h"

USING_NS_CC;

Scene* HelloWorld::createScene()
{
    // 'scene' is an autorelease object
    auto scene = Scene::create();
    
    // 'layer' is an autorelease object
    auto layer = HelloWorld::create();
	layer->setName("hello_world");

    // add layer as a child to scene
    scene->addChild(layer);

    // return the scene
    return scene;
}

// on "init" you need to initialize your instance
bool HelloWorld::init()
{
    //////////////////////////////
    // 1. super init first
    if ( !Layer::init() )
    {
        return false;
    }
    
    Size visibleSize = Director::getInstance()->getVisibleSize();
    Vec2 origin = Director::getInstance()->getVisibleOrigin();
	auto visibleOrigin = Director::getInstance()->getVisibleOrigin();

    /////////////////////////////
    // 2. add a menu item with "X" image, which is clicked to quit the program
    //    you may modify it.

    // add a "close" icon to exit the progress. it's an autorelease object
    auto closeItem = MenuItemImage::create(
                                           "CloseNormal.png",
                                           "CloseSelected.png",
                                           CC_CALLBACK_1(HelloWorld::menuCloseCallback, this));
    
	closeItem->setPosition(Vec2(origin.x + visibleSize.width - closeItem->getContentSize().width/2 ,
                                origin.y + closeItem->getContentSize().height/2));

    // create menu, it's an autorelease object
    auto menu = Menu::create(closeItem, NULL);
    menu->setPosition(Vec2::ZERO);
    this->addChild(menu, 1);

    /////////////////////////////
    // 3. add your codes below...

    // add a label shows "Hello World"
    // create and initialize a label
    
    auto label = Label::createWithTTF("Hello World", "fonts/Marker Felt.ttf", 24);
    
    // position the label on the center of the screen
    label->setPosition(Vec2(origin.x + visibleSize.width/2,
                            origin.y + visibleSize.height - label->getContentSize().height));

    // add the label as a child to this layer
    this->addChild(label, 1);

    // add "HelloWorld" splash screen"
    //auto sprite = Sprite::create("HelloWorld.png");

    // position the sprite on the center of the screen
   // sprite->setPosition(Vec2(visibleSize.width/2 + origin.x, visibleSize.height/2 + origin.y));

    // add the sprite as a child to this layer
    //this->addChild(sprite, 0);

	//	for test
	//	add input text
	auto editBoxSize = Size(visibleSize.width - 600, 60);
	std::string pNormalSprite = "green_edit.png";
	_editName = ui::EditBox::create(editBoxSize, ui::Scale9Sprite::create(pNormalSprite));
	_editName->setPosition(Vec2(visibleOrigin.x+visibleSize.width/2, visibleOrigin.y+visibleSize.height*3/4));
	_editName->setFontName("Paint Boy");
	_editName->setFontSize(25);
	_editName->setFontColor(Color3B::RED);
	_editName->setText("lee");
	_editName->setPlaceHolder("Name:");
	_editName->setPlaceholderFontColor(Color3B::WHITE);
	_editName->setMaxLength(8);
	_editName->setReturnType(ui::EditBox::KeyboardReturnType::DONE);
	addChild(_editName);

	MenuItemFont *__login_item = MenuItemFont::create(  
		"login",  
		this,  
		menu_selector(HelloWorld::loginCallback)); 

	MenuItemFont *__enter_lobby = MenuItemFont::create(  
		"enter lobby",  
		this,  
		menu_selector(HelloWorld::enterLobbyCallback)); 

	MenuItemFont *__leave_lobby = MenuItemFont::create(  
		"leave lobby",  
		this,  
		menu_selector(HelloWorld::leaveLobbyCallback)); 

	MenuItemFont *__enter_room = MenuItemFont::create(  
		"enter room",  
		this,  
		menu_selector(HelloWorld::enterRoomCallback));

	MenuItemFont *__enter_game = MenuItemFont::create(  
		"enter game",  
		this,  
		menu_selector(HelloWorld::enterGameCallback));

	MenuItemFont *__discard = MenuItemFont::create(  
		"discard",  
		this,  
		menu_selector(HelloWorld::discardCallback));

	float __border_width = 0;  
	float __current_y_border = origin.y + visibleSize.height; 
	float __offset = __border_width + __login_item->getContentSize().height/2; 

	__current_y_border -= 2 * __offset;  
	__login_item->setPosition(ccp(origin.x + __login_item->getContentSize().width/2 + __border_width,  
		__current_y_border - __offset));  

	__current_y_border -= 2 * __offset;  
	__enter_lobby->setPosition(ccp(origin.x + __enter_lobby->getContentSize().width/2 + __border_width,  
		__current_y_border - __offset)); 

	__current_y_border -= 2 * __offset;  
	__leave_lobby->setPosition(ccp(origin.x + __leave_lobby->getContentSize().width/2 + __border_width,  
		__current_y_border - __offset)); 

	__current_y_border -= 2 * __offset;  
	__enter_room->setPosition(ccp(origin.x + __enter_room->getContentSize().width/2 + __border_width,  
		__current_y_border - __offset));

	__current_y_border -= 2 * __offset;  
	__enter_game->setPosition(ccp(origin.x + __enter_game->getContentSize().width/2 + __border_width,  
		__current_y_border - __offset));

	__current_y_border -= 2 * __offset;  
	__discard->setPosition(ccp(origin.x + __discard->getContentSize().width/2 + __border_width,  
	__current_y_border - __offset));

	Menu* __menu = Menu::create(__login_item,__enter_game,__discard,NULL);  
	__menu->setPosition(20,-100);  
	this->addChild(__menu,1,2); 

	_listView = cocos2d::ui::ListView::create();
	// set list view ex direction
	_listView->setDirection(ui::ScrollView::Direction::VERTICAL);
	_listView->setBounceEnabled(true);
	_listView->setBackGroundImageScale9Enabled(true);
	_listView->setContentSize(Size(240, 260));
	_listView->setPosition(cocos2d::Vec2(360,20));

	cocos2d::ui::Text* alert = cocos2d::ui::Text::create("ListView vertical", "fonts/Marker Felt.ttf", 20);
	alert->setColor(Color3B(159, 168, 176));
	alert->setTag(100);
	alert->setString("test88888888");
	cocos2d::ui::Layout* default_item = cocos2d::ui::Layout::create();
	default_item->setTouchEnabled(true);
	default_item->setContentSize(alert->getContentSize());
	alert->setPosition(Vec2(default_item->getContentSize().width / 2.0f,
		default_item->getContentSize().height / 2.0f));
	default_item->addChild(alert);

	// set model
	_listView->setItemModel(default_item);

	this->addChild(_listView);
	addLog("8888888888888888888888888888888888888888888888888888888888");

#if 0
	mahjong::MsgHandler::instance()->do_request_test();
	mahjong::MsgHandler::instance()->do_notice_test();
	const char* __username = "lee";
	mahjong::MsgHandler::instance()->do_request_login(__username);
	mahjong::MsgHandler::instance()->do_request_enter_lobby(__username,1);
	mahjong::MsgHandler::instance()->do_request_enter_room(__username,1,1);
	mahjong::MsgHandler::instance()->do_request_enter_game(__username,1,1,1);
#endif


    return true;
}

void HelloWorld::menuCloseCallback(Ref* pSender)
{
#if (CC_TARGET_PLATFORM == CC_PLATFORM_WP8) || (CC_TARGET_PLATFORM == CC_PLATFORM_WINRT)
	MessageBox("You pressed the close button. Windows Store Apps do not implement a close button.","Alert");
    return;		
#endif

	Director::getInstance()->end();


#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    exit(0);
#endif
}

void HelloWorld::loginCallback( cocos2d::Ref* __sender )
{
	const char* __username = _editName->getText();
	if (__username)
	{
		mahjong::MsgHandler::instance()->do_request_login(__username);
	}
}

void HelloWorld::enterLobbyCallback( cocos2d::Ref* __sender )
{
	const char* __username = _editName->getText();
	if (__username)
	{
		mahjong::MsgHandler::instance()->do_request_enter_lobby(__username,1);
	}
}

void HelloWorld::enterRoomCallback( cocos2d::Ref* __sender )
{
	const char* __username = _editName->getText();
	if (__username)	
	{
		mahjong::MsgHandler::instance()->do_request_enter_room(__username,1,1);
	}
}

void HelloWorld::enterGameCallback( cocos2d::Ref* __sender )
{
	const char* __username = _editName->getText();
	if (__username)
	{
		mahjong::MsgHandler::instance()->do_request_enter_game(__username,1,1,1);
	}
}

void HelloWorld::discardCallback( cocos2d::Ref* __sender )
{
	const char* __username = _editName->getText();
	if (__username)
	{
		mahjong::MsgHandler::instance()->do_request_discard(__username,1,1);
	}
}

void HelloWorld::leaveLobbyCallback( cocos2d::Ref* __sender )
{
	const char* __username = _editName->getText();
	if (__username)
	{
		mahjong::MsgHandler::instance()->do_request_leave_lobby(__username,1);
	}
}

void HelloWorld::addLog(std::string __context)
{
	_listView->pushBackDefaultItem();
	cocos2d::ui::Widget*  item = _listView->getItem(_listView->getItems().size() -1);
	if(item)
	{ 
		cocos2d::ui::Text* alert = (cocos2d::ui::Text*)item->getChildByTag(100);
		if(alert)
		{
			alert->setString(__context);
		}
	}
}
