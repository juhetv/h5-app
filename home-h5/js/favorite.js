function favorExist(id, channelName) {
	$.post(favor_exist_api + id + "&channelName=" + channelName, {

	}, function(res) {
		//console.log(JSON.stringify(res));
		if (res.content) {
			$("#favorite-icon").attr("class", "mui-icon mui-icon-star-filled");
		} else {
			//$(".favorite-icon").attr("class", clasName);
		}

	});
}

function favorUpdate(id, channelName) {
	$.post(favor_update_api + id +
		"&channelName=" + channelName, {

		},
		function(res) {
			let clasName = "mui-icon mui-icon-star-filled"
			if (res.content==0) {
				clasName = "mui-icon mui-icon-star";
			}
			$("#favorite-icon").attr("class", clasName);
			mui.toast(res.message);
		});
}
$(function() {
	let id = document.getElementById("header").getAttribute("data-id")
	let channelName = document.getElementById("header")
		.getAttribute("channelName");
	favorExist(id, channelName);
	mui('body').on('tap', '#favorite-icon', function() {
		favorUpdate(id, channelName);
	});
	mui('body').on('tap', '.mui-icon-contact', function() {
		window.open(this.href);
	});
});
