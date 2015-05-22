#include "HelloWorldScene.h"
#include "msg_handler.h"

USING_NS_CC;

Scene* HelloWorld::createScene()
{
    // 'scene' is an autorelease object
    auto scene = Scene::create();
    
    // 'layer' is an autorelease object
    auto layer = HelloWorld::create();

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
    auto sprite = Sprite::create("HelloWorld.png");

    // position the sprite on the center of the screen
    sprite->setPosition(Vec2(visibleSize.width/2 + origin.x, visibleSize.height/2 + origin.y));

    // add the sprite as a child to this layer
    this->addChild(sprite, 0);

	//	for test
	//	add input text
	auto editBoxSize = Size(visibleSize.width - 600, 60);
	std::string pNormalSprite = "green_edit.png";
	_editName = ui::EditBox::create(editBoxSize, ui::Scale9Sprite::create(pNormalSprite));
	_editName->setPosition(Vec2(visibleOrigin.x+visibleSize.width/2, visibleOrigin.y+visibleSize.height*3/4));
	_editName->setFontName("Paint Boy");
	_editName->setFontSize(25);
	_editName->setFontColor(Color3B::RED);
	_editName->setPlaceHolder("Name:");
	_editName->setPlaceholderFontColor(Color3B::WHITE);
	_editName->setMaxLength(8);
	_editName->setReturnType(ui::EditBox::KeyboardReturnType::DONE);
	addChild(_editName);

	const char* __username = "lee";
	//mahjong::MsgHandler::instance()->do_request_test();
	//mahjong::MsgHandler::instance()->do_notice_test();
	mahjong::MsgHandler::instance()->do_request_login(__username);
	mahjong::MsgHandler::instance()->do_request_enter_lobby(__username,1);
	mahjong::MsgHandler::instance()->do_request_enter_room(__username,1,1);
	mahjong::MsgHandler::instance()->do_request_enter_game(__username,1,1);

    return true;
}

void HelloWorld::menuCloseCallback(Ref* pSender)
{
#if (CC_TARGET_PLATFORM == CC_PLATFORM_WP8) || (CC_TARGET_PLATFORM == CC_PLATFORM_WINRT)
	MessageBox("You pressed the close button. Windows Store Apps do not implement a close button.","Alert");
    return;
#endif
	if(0)
	{
		Director::getInstance()->end();
	}
	else
	{
		const char* __text = _editName->getText();
		if (__text)
		{
			//mahjong::MsgHandler::instance()->do_request_chat("lee","hi,everyone!");
		}
	}

#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    exit(0);
#endif
}
