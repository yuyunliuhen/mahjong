
#ifndef msg_handler_h__
#define msg_handler_h__

#include <string>
namespace mahjong {

	//	encapsulation the message route from client to server
	class MsgHandler
	{
	public:
		MsgHandler();

		~MsgHandler();

		static MsgHandler* instance();

		static void	destroy();

		//	do a request test
		void	do_request_test();

		//	do a notice test
		void	do_notice_test();

		//	client login
		void	do_request_login(const char* __username);

		//	enter room
		void	do_request_enter_room(const char* __username,int __rid,int __lid);

		//	enter lobby
		void	do_request_enter_lobby(const char* __username,int __lid);

		//	leave lobby
		void	do_request_leave_lobby(const char* __username,int __lid);

		//	enter game
		void	do_request_enter_game(const char* __username,int __rid,int __lid);

		//	send a message to somebody
		void	do_request_chat(const char* __target_name,const char* __context);

	private:
		//	init server host and port
		void	_init();

	private:
		static MsgHandler*	inst_;

		std::string			host_;

		unsigned int		port_;
	};
}

#endif // msg_handler_h__
