var shareData = new Vue({
	el: '#video-div',
	data: {
		detailInfo: {
			playUrl: document.getElementById("video-te").getAttribute("video-src")||"",
			cover: '',
			id: document.getElementById("header").getAttribute("data-id"),
			movieDomain:document.getElementById("video-te").getAttribute("video-domain")||"",
			channelName:document.getElementById("header").getAttribute("channelName")
			
		},
		member: {}
	},
	updated: function() {}
});
var dplayer = null;

plusInitReady();
// H5 plus事件处理
function plusInitReady() {
	let videoSrc = shareData.detailInfo.playUrl;
	if (videoSrc) {
		dplayer = new DPlayer({
			container: document.getElementById('video'),
			video: {
				url: videoSrc,
				type: 'customHls',
				loop: true,
				hotkey: false,
				autoplay: true,
				//screenshot:true,
				//pic: './img/lazy2.gif',
				customType: {
					'customHls': function(video, player) {
						const hls = new Hls();
						hls.loadSource(video.src);
						hls.attachMedia(video);
					},
				}
			}
		});
		dplayer.play();
		dplayer.on('durationchange', function() {
			if (dplayer.video.duration <= 0) {
				return;
			}
			let timeKey = "time:" + shareData.detailInfo.id
			let time = sessionStorage.getItem(timeKey);
			if (time > 0) {
				time = parseInt(time);
				if (time < 3) {
					return;
				}
				if (time > dplayer.video.duration - 10) {
					sessionStorage.removeItem(timeKey);
					return;
				}
				let currentTime = parseInt(dplayer.video.currentTime);
				if (time > currentTime) {
					dplayer.seek(time);
				}

			}
			if (dplayer.video.paused) {
				dplayer.play();
			}
			setTimeout(function() {
				if (dplayer.video.paused) {
					dplayer.play();
				}
				if (dplayer.container.getAttribute("class").indexOf("dplayer-hide-controller") < 0) {
					dplayer.container.classList.add("dplayer-hide-controller");
				}
			}, 30000);

		}, false);

		dplayer.on('timeupdate', function(obj) {
			let currentTime = parseInt(dplayer.video.currentTime);
			if (currentTime < 0) {
				return;
			}
			let forceTime = sessionStorage.getItem("force-seek-time")
			forceTime = forceTime ? parseInt(forceTime) : 0;
			if (forceTime > 0 && currentTime < forceTime) {
				dplayer.seek(forceTime);
				return;
			}
			 let timeKey = "time:" + shareData.detailInfo.id;
			//结束
			if (dplayer.video.duration - currentTime < 4 && dplayer.video.duration -
				currentTime > 0) {
				
				Cookies.remove(timeKey);
				//sessionStorage.setItem(timeKey, null);
				return;
			}
			if (currentTime > 15) {
				//console.log(currentTime)
				//sessionStorage.setItem(timeKey, currentTime);
				Cookies.set(timeKey, currentTime, { expires: 7, path: '' });  
			} 

		}, false);
		dplayer.on('error', function() {
			dplayer.notice("20S后没反应尝试刷新更换线路或者观看其他", 5000)
		}, false);
		dplayer.on('ended', function() {
			let timeKey = "time:" + shareData.detailInfo.id
			//sessionStorage.removeItem(timeKey);
			Cookies.remove(timeKey);
		}, false);
	} else {
		dplayer = null;
	}
	//$("#video-te").show();
	//console.log(favor_exist_api);
	favorExist(shareData.detailInfo.id, shareData.detailInfo.channelName);
	//$("#video-div").show();
	/* mui('body').on("tap", ".dplayer-bezel-icon", function() {
		if (dplayer.video.duration <= 0) {
			return;
		}
		dplayer.toggle();
	}); */
	selectMovieDomainOrUrl(0);
	selectMovieDomainOrUrl(1);
}

mui('body').on("tap",".login-vip-btn",function(){
	window.location.href=("http://meitue.shop/left_content.html?code=user_center");
});
mui('body').on("tap", "#reflush", function() {
	//dplayer.notice("刷新中，长时间无法加载请更换视频或者切换线路", 5000)
	let newurl = shareData.detailInfo.playUrl;
	if (!newurl.startsWith("http")) {
		newurl = shareData.detailInfo.movieDomain + shareData.detailInfo.playUrl;
	}
	console.log("reflush:" + newurl);
	dplayer.switchVideo({
		url: newurl,
		pic: 'http://futuretown.oss-cn-hangzhou.aliyuncs.com/static-lib/aper-h5-202203/img/lazy2.gif'
	});


});
function selectMovieDomainOrUrl(type){
	if(type===0){
		$(".video-domain").each(function(o){
			if(shareData.detailInfo.movieDomain.indexOf(this.getAttribute("current-value"))>=0){
				$(this).removeClass('mui-btn-outlined');
			}else if(!$(this).hasClass('mui-btn-outlined')){
				$(this).addClass('mui-btn-outlined');
			}
		})
	}else{
		$(".video-url").each(function(o){
			if(shareData.detailInfo.playUrl.indexOf(this.getAttribute("current-value"))>=0){
				$(this).removeClass('mui-btn-outlined');
			}else if(!$(this).hasClass('mui-btn-outlined')){
				$(this).addClass('mui-btn-outlined');
			}
		})
	}
	
}
mui('body').on("tap", ".video-domain", function() {
	shareData.detailInfo.movieDomain = this.getAttribute("current-value");
	let parser = document.createElement('a');
	parser.href = shareData.detailInfo.playUrl;
	dplayer.notice("切换中请稍等", 6000)
	let newurl = shareData.detailInfo.movieDomain + parser.pathname + parser.search;
	console.log(newurl);
	dplayer.switchVideo({
		url: newurl
	});
	dplayer.play();
	selectMovieDomainOrUrl(0);
})
mui('body').on("tap", ".video-url", function() {
	let newurl = $(this).attr("current-value");
	dplayer.notice("切换中请稍等", 6000)
	shareData.detailInfo.playUrl = newurl;
	if(!shareData.detailInfo.playUrl.startsWith("http")){
		newurl = shareData.detailInfo.movieDomain + shareData.detailInfo.playUrl;
	}
	console.log(newurl);
	dplayer.switchVideo({
		url: newurl
		//,pic: './img/no-pic.gif'
	});
	dplayer.play();
	$(".video-url").each(function(o){
		let newurlBtn = $(o).attr("current-value");
		if(newurlBtn==newurl){
			$(o).removeClass('mui-btn-outlined');
		}else if(! $(o).hasClass('mui-btn-outlined')){
			$(o).addClass('mui-btn-outlined');
		}
		
		
	})
	selectMovieDomainOrUrl(1);
	
})


mui('body').on('tap', '.video-seek', function() {
	let currentTime = parseInt(dplayer.video.currentTime);
	//console.log("currentTime:"+currentTime);
	let seconds = $(this).attr("seconds");
	seconds = parseInt(seconds);
	let time = 0;
	if ($(this).attr("seek-type") == 0) {
		time = currentTime - seconds;
	} else {
		time = currentTime + seconds;
	}
	if (time <= 0) {
		time = 0;
	}
	dplayer.seek(time);
});

mui('body').on('tap', '.mui-icon-pengyouquan', function() {
	if (shareData.member.identityCode == null) {
		alert("请先登录");
		return;
	}
	copy_fun(shareData.detailInfo.title.substring(0, 60) + " " + share_video_url.replace(
			"thisVid", shareData.detailInfo.id)
		.replace("thisShareFrom", shareData.member.identityCode), "专属分享地址复制成功");
});
//
mui('body').on('tap', '.favorite-icon', function() {
	favorUpdate(shareData.detailInfo.id, shareData.detailInfo.channelName)
});
