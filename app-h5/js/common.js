(function($m) {
	mui.init({
		beforeback: function() {
			console.log("cleanData");
			cleanData();
			return true;
		},
		gestureConfig: {
			doubletap: true, //默认为false
			longtap: true //默认为false
		}
	});
	mui("body").on('longtap', "img", function() {
		var target = this;

		var bts = [{
			title: "保存到手机"
		}];

		/**
		 * actionSheet：弹出系统选择按钮框
		 */
		plus.nativeUI.actionSheet({
			cancel: "取消",
			buttons: bts
		}, function(e) {
			if(e.index > 0) {
				saveImage(target)
			}
		});
	})
	//刷新
	mui("body").on("tap", ".mui-icon-reload", function(e) {
		console.log("reload");
		location.reload();
	});
	
	//返回
	mui("body").on("tap", ".fa-arrow-left", function(e) {
		cleanData();
		mui.backPage();
		return false;
	});
	
	var numberReg = /^\+?[1-9][0-9]*$/;
	//起飞
	mui("body").on("tap", ".mui-icon-navigate", function(e) {
		const totlePage = "未知，随便吧";
		e.detail.gesture.preventDefault(); //修复iOS 8.x平台存在的bug，使用plus.nativeUI.prompt会造成输入法闪一下又没了
		var btnArray = [ '取消','确定'];
		mui.prompt('跳转到多少页：', '总页数' + totlePage, '准备起飞', btnArray, function(e) {
			if(e.index == 1) {
				if(numberReg.test(e.value)) {
					var pageno = parseInt(e.value);
					if(pageno > totlePage) {
						pageno = totlePage
					};
					loadPage(pageno);
					jsonPages.data=[];
					return false;
				}
			} else {
				console.log("取消");
			}
		});
		return false;
	});
	
	
	
	function cleanData() {
		if(typeof intervalRun!="undefined"){
			console.log("clearInterval");
			window.clearInterval();
		}
		if(window.location.href.indexOf("_info.html") >= 0) {
			localStorage.removeItem("video_item");
			console.log("clean video_item");
			return;
		}
	}
	function saveImage(target) {
		var imgUrl = target.src;
		var itd = imgUrl.lastIndexOf(".");
		var hou = imgUrl.substring(itd,imgUrl.length);
		console.log(hou);
		var timestamp = (new Date()).valueOf();
		var downLoader = plus.downloader.createDownload(imgUrl, {
			method: 'GET',
			filename: '_downloads/image/' + timestamp + hou
		}, function(download, status) {
			var fileName = download.filename;
			/**
			 * 保存至本地相册
			 */
			plus.gallery.save(fileName, function() {
				mui.toast("保存成功");
			});
		});

		/**
		 * 开始下载任务
		 */
		try {
			downLoader.start();
		} catch(e) {
			mui.toast("请长按图片保存");
		}
	}
	
	
	mui.getImei=function getImei(){
		if(mui.os.ios){
			return null;
		}
		let imei = localStorage.getItem("imei");
		if(imei){
			return imei;
		}
		if(typeof plus!="undefined"){
			imei = plus.device.imei;
			if(imei){
				localStorage.setItem("imei",imei);
				return imei;
			}else {
				//mui.alert("权限错误,请允许本应用获取设备信息,或者将本应用设置为信任,然后重新打开应用");
				//plus.runtime.quit();
			}
		}
		return null;
	}
	mui.backPage=function backPage(){
		if(typeof plus!="undefined"){
			var previewImage = $m.isFunction($m.getPreviewImage) && $m.getPreviewImage();
			if (previewImage && previewImage.isShown()) {
				console.log("previewImage-backPage.close");
				previewImage.close();
				return false;
			}
			console.log("cleanData-backPage");
			cleanData();
			console.log("plus.currentPage.close");
			var currentPage = plus.webview.currentWebview();
			currentPage.close();
		}else{
			window.close();
			console.log("window.close");
			//window.history.back(-1);
		}
	}
})(mui);
//获取地址栏参数，name:参数名称
function getUrlParms(name){
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if(r!=null)
  return unescape(r[2]);
}
function setToken(token){
	localStorage.setItem("x_access_token", token);
}
function loginSuccessLocaCache(member){
	if(member.x_access_token){
		localStorage.setItem("member.x_access_token", member.x_access_token);
	}else{
		localStorage.removeItem("member.x_access_token");
	}
	localStorage.setItem("member.identityCode",member.identityCode);
	localStorage.setItem("member.point",member.point);
	localStorage.setItem("member.mobile",member.mobile);

}


function getLoginSuccessLocaCache(){
	let member = {};
	member.x_access_token=localStorage.getItem("member.x_access_token");
	member.identityCode=localStorage.getItem("member.identityCode");
	member.point=localStorage.getItem("member.point");
	member.mobile=localStorage.getItem("member.mobile");
	//member.checkIn=localStorage.getItem("member.checkIn");
	return member;
}
function clearMemberStorage(){
	localStorage.removeItem("member.x_access_token");
	localStorage.removeItem("member.identityCode");
	localStorage.removeItem("member.point");
	localStorage.removeItem("member.mobile");
	localStorage.removeItem("member.checkIn");
}