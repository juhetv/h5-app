Vue.use(VueLazyload, {
	preLoad: 1.3,
	error: 'http://futuretown.oss-cn-hangzhou.aliyuncs.com/static-libs/img/thumb.png',
	loading: 'http://futuretown.oss-cn-hangzhou.aliyuncs.com/static-libs/img/lazy.gif',
	attempt: 1
}); 
const jsonPages = {
	"imgDomain": "",
	"data": new Array()
};

const vueappUL = new Vue({
	el: '#v_page',
	data: jsonPages,
	updated: function() {
		mui('#offCanvasContentScroll').scroll().reLayout();
		mui('#offCanvasContentScroll').scroll().refresh();

	},
	/* created(){
		this.$axios.get(url).then(function (response){
	          console.log(url);
			  this.cover="data:image/jpg;base64,"+(response.data.replace(/^kuaimaoshipin/, ""));
	      }).then(data=>{
           _this.cover=data; // data即为图片地址
		   console.log(_this);
          })
	}, */
	methods: {
		httpRequest: function(url, vd) {
			if (url.indexOf("bs64") < 0) {
				return;
			}
			if(vd.loading){
				return;
			}
			vd.loading=true;
			axios.get(url).then(function(response) {
				let aa = "data:image/jpg;base64," + (response.data.replace(/^kuaimaoshipin/, ""));
				vd.cover = aa;
				//vd.loading=true;
			}).catch(function(error) {
				vd.cover = './img/thumb.png';
			});
		}

	}
});

//自动登录
function loadMenuLeft() {
	return;
	let menu_left_url_this = menu_left_url;
	console.log("menu_left_url================"+menu_left_url_this);
	$("#offCanvasSide").load(menu_left_url_this, {}, function() {
		var channelName = getCurrentChannel();
		$('li[host_id="' + channelName + '"]').addClass("acitity");
		try {
			mui('#offCanvasSideScroll').scroll().refresh();
		} catch (e) {}

	});
}

function loadVideoDetail(ele) {
	ele = $(ele);
	let parms = ele.attr("data-id");
	if (parms) {} else {
		return;
	}
	let url = page_detail_api + parms;
	postJSON(url, {}, "拼命加载中", function(res) {
		if (res.content == "") {
			mui.toast("资源暂时无法访问,请稍候再试");
			return;
		}
		
		if(typeof res.content.iframeUrl!="undefined"){
			if(res.content.iframeUrl){
				mui.toast("请使用APP观看");
				//window.location.href=res.content.iframeUrl;
				return;
			}
		}
		let resstr = JSON.stringify(res.content);
		//console.log(resstr);
		let icover = ele.attr("data-cover");
		localStorage.setItem("video_item", resstr);
		var page = null;
		window.location.href=("video_info_app.html");
		
	});

}
//搜索
mui("body").on("tap", ".mui-icon-search", function(e) {
	e.detail.gesture.preventDefault(); //修复iOS 8.x平台存在的bug，使用plus.nativeUI.prompt会造成输入法闪一下又没了
	var btnArray = ['确定', '重置', '取消'];
	mui.prompt('请输入关键字', '片名、番号、演员、类别等关键字', '准备起飞', btnArray, function(e) {
		if (e.index == 2) {
			return;
		}
		if (e.index == 1) {
			sessionStorage.removeItem("keyword")
		} else if (e.index == 0) {
			sessionStorage.setItem("keyword", e.value);
		}
		$("#category_ul").find("li").removeClass("current_a");
		jsonPages.data.splice(0, jsonPages.data.length);
		loadPage(1);
	});
	return true;
});

function loadPage(pageno) {
	var mes = "正在加载第" + pageno + "页，请稍后";
	var channelName = getCurrentChannel();
	var api_url = page_list_url;
	//api_url = "http://192.168.0.106:8090/v/list?id=";
	postData = buildSearchData(pageno);
	postData["pageNum"] = pageno;

	postJSON(
		api_url,
		postData, mes,
		function(res) {

			if (res == null) {
				return;
			}
			if (res.status != 0) {
				mui.toast("加载失败，请稍后再试");
				return;
			}
			if (res.content == null || res.content.length == 0) {
				if (postData.memberId != null && pageno == 1) {
					mui.toast("没有收藏任何影片");
				} else {
					mui.toast("没有更多数据了");
				}
				return;
			}
			loadingNextPage = false;
			var pageTip = pageno + "";
			var coverFeild = "cover";
			if (postData.keyword) {
				pageTip = '"' + postData.keyword + '"搜索结果,第' + pageno + "页";
			}
			const jsonObject = {
				"items": new Array(),
				"javbusItems": new Array(),
				"pageTip": pageTip,
				"channelName": getCurrentChannel()
			};
			jsonObject.verticalVar = res.message;
			sessionStorage.setItem("pageno", pageno);
			for (var i = 0; i < res.content.length; i++) {
				try {
					res.content[i].cover = JSON.parse(res.content[i][coverFeild])[0];
				} catch (e) {
					res.content[i].cover = res.content[i][coverFeild];
				}
				if (channelName.indexOf('seed') >= 0) {
					jsonObject.javbusItems.push(res.content[i]);
					jsonObject.items.splice(0, jsonObject.items.length);
				} else {
					jsonObject.items.push(res.content[i]);
					jsonObject.javbusItems.splice(0, jsonObject.javbusItems.length);
				}

			}
			jsonPages.data.push(jsonObject);

		});
}

function buildSearchData() {
	var channelName = getCurrentChannel();
	var keyword = sessionStorage.getItem("keyword") || "";
	var postData = {
		"cate": "",
		"tag": "",
		"keyword": keyword,
		"favorite": 0
	};
	var currentCate = $(".current_a");
	if (currentCate.length > 0) {
		var cateType = currentCate.attr("cate-type");
		var cname = currentCate.attr("cate-name");
		if (channelName == "mh_javbus_pipi") {
			postData.keyword = (cateType === "3") ? cname : "";
			postData.cid = cateType;
			return postData;
		}

		if (cateType === "3") { //按搜索
			postData.keyword = cname;
		} else if (cateType === "2") { //tag like
			postData.tag = cname;
		} else if (cateType === "1") { //名称 like 分类md5
			postData.cate = cname;
		} else if (cateType === "0") { //全部

		} else if (cateType === "-1") { //收藏
			postData.favorite = 1;
		}
	}
	return postData;
}
