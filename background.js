//	@name		多说新评论提醒扩展for Chrome
//	@version	1.1
//	@author		Holger
//	@blog		http:/ursb.org/
//	@gitHub		https://github.com/h01/duoshuoComment
//	@update		2014/11/17

// 多说帐号
var user  = "h01ger";

// 更新时间间隔
var sleep = 1000 * 60 * 30;

function getNewPosts(){
	var url = "http://" + user + ".duoshuo.com/api/posts/list.json?order=desc&source=duoshuo%2Crepost&max_depth=1&limit=30&related%5B%5D=thread&related%5B%5D=iplocation&nonce=543bd3f72f4ab&status=all";
	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function(){
		if (ajax.readyState == 4 && ajax.status == 200) {
			try{
				// 转换成JSON对象
				var json    = JSON.parse(ajax.responseText);
				// 最新评论时间(用作判断是否有更新依据)
				var last    = json['response'][0]['created_at'];
				// 最新评论作者昵称
				var author  = json['response'][0]['author']['name'];
				// 最新评论作者头像
				var avatar  = json['response'][0]['author']['avatar_url'] || 'icon.png';
				// 最新评论内容
				var message = json['response'][0]['message'];
				// 评论来源地址
				var msglink = json['response'][0]['thread']['url'];
				// 和本地进行判断是否为更新并确定是否提醒
				if (localStorage['last'] == undefined || localStorage['last'] != last) {
					var n = new Notification("您有新的评论by:" + author, {body: message, icon: avatar});n.onclick = function(){window.open(msglink, "_blank");n.close()};
					var a = document.createElement("audio");a.src = "alert.mp3";a.play();a.remove();
					localStorage['last'] = last;
				};
			}catch(e){}
		};
	}
	ajax.open("GET", url, false);
	ajax.send();
	setTimeout(getNewPosts, sleep);
}

// localStorage.clear();
getNewPosts();