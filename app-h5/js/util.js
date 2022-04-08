


 
 function randomFrom(lowerValue, upperValue) {
	return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
}
Date.prototype.toString = function() {
  return this.getFullYear()
        + "年" + (this.getMonth()>8?(this.getMonth()+1):"0"+(this.getMonth()+1))
        + "月" + (this.getDate()>9?this.getDate():"0"+this.getDate())
        + "日" + (this.getHours()>9?this.getHours():"0"+this.getHours())
        + "点" + (this.getMinutes()>9?this.getMinutes():"0"+this.getMinutes())
        + "分" ;
}

var mask=mui.createMask();//遮罩层
function postJSON(ajax_url,post_data,loadingTitle,successFun,nomark){
    if(post_data==null){
    	post_data={};
    }
	let device_code = mui.getImei();
	let x_access_token = localStorage.getItem("x_access_token");
    console.log("nomark:"+nomark+",token:"+x_access_token+",send post:"+ajax_url+",data:"+JSON.stringify(post_data));
    mui.ajax(ajax_url,{
		headers:{'Content-Type':'application/json'}	 ,
	    data:post_data,
	    dataType: 'json', //服务器返回json格式数据
        type: 'post', //HTTP请求类型
        timeout: 22000, //超时时间设置为10秒；
	    beforeSend: function(request) {
			if(x_access_token){
				//console.log(x_access_token)
				request.setRequestHeader("x-access-token",x_access_token);
			}
			let versionCode = localStorage.getItem("versionCode");
			if(versionCode){
				request.setRequestHeader("versionCode", versionCode)
			}
	    	if(getCurrentChannel())request.setRequestHeader("m-channel", getCurrentChannel() );
	    	if(mask._show){
	    		return;
	    	}
	        if(typeof nomark =="undefined"){
	        	nomark = true;
	        }
			if(nomark===false){
				return;
			}
			if(typeof plus!="undefined"){
				plus.nativeUI.showWaiting(loadingTitle, {});
			}else {
				mask.show();//显示遮罩层
			}
	        	
	        
        	
	        
	    },
	    complete: function() {
	        if(typeof plus !="undefined"){
	        	plus.nativeUI.closeWaiting();
	        }
			mask.close();//关闭遮罩层
	    },
	    success: function(res){
			//console.log(ajax_url,JSON.stringify(res));
			if(res==null){
				successFun(res);
				return;
			}
			if(res.status==10007){//免费会员限制
				//mui.alert('赞助VIP即可解锁该功能，观看更多精彩视频');
				//redirectPage("left_content.html?code=user_center");
				var btnArrayVip = ['不用了','马上去赞助'];
				mui.confirm('免费次数用完了，赞助VIP即可继续观看更多精彩视频', '', btnArrayVip, function(e) {
					if (e.index == 1) {
						redirectPage('left_content.html?code=user_center');
					}
					return  true;
				})
				
				
				return;
			}
			if(res.status==10006){//未登录
				//mui.toast("该内容仅限VIP观看");
				var btnArray = ['不用了','马上去'];
				mui.confirm('登录后可继续', '', btnArray, function(e) {
					if (e.index == 1) {
						redirectPage('left_content.html?code=login');
					}
					return  true;
				})
				return;
			}
			try{
				successFun(res);
			}catch(e){
				console.error(e);
				mui.toast('网络超时，请稍后再试'+e);
			}
	    	
	    },
	    error: function(xhr, type, errorThrown) {
	        mui.toast('网络有点问题，请稍后再试');
	        loadingNextPage=false;
	    }
	});
}
function getCurrentChannel(){
	//return "mh_javbus_pipi";
	return sessionStorage.getItem("channelName");
}

function redirectPage(htmlPage){
	if(typeof plus=="undefined"){
		console.log("redirectPage plus=='undefined'");
		//window.location.href = htmlPage;
		window.open(htmlPage)
		return true;
	}
	let newPage = plus.webview.create(htmlPage);
	newPage.show();
	return true;
}
function changePage(htmlPage){
	if(typeof plus=="undefined"){
		console.log("changePage plus=='undefined'");
		window.location.href = htmlPage;
		return true;
	}
	let currentPage = plus.webview.currentWebview();
	currentPage.loadURL(htmlPage);
	return true;
}
function setCurrentHost(channelName){
	return sessionStorage.setItem("channelName",channelName);
}


