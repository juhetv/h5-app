function favorExist(favor_exist_api, id,channelName) {
	postJSON(favor_exist_api + id+"&channelName="+channelName, {

	}, "", function(res) {
		let clasName = "fa fa-star-o";
		console.log(JSON.stringify(res));
		if (res.content) {
			clasName = "fa fa-star"
			$("#favor-icon").attr("class", clasName);
		}

	}, true);
}

function favorUpdate(url) {
	postJSON(url, {

		}, "",
		function(res) {
			let clasName = "fa fa-star";
			if (res.content == 0) {
				clasName = clasName + "-o";
			}
			$("#favor-icon").attr("class", clasName);
			mui.toast(res.message);
		});
}
