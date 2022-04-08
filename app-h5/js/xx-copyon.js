if (typeof ClipboardJS == 'function') {

	let clipboard = new ClipboardJS('.copy-on');
	clipboard.on('success', function(e) {
		mui.toast('复制成功');
		e.clearSelection();
	});
	clipboard.on('error', function(e) {
		alert(e);
		console.error('Action:', e.action);
		console.error('Trigger:', e.trigger);
	});
}

function copy_fun(copy, mess) { //参数copy是要复制的文本内容
	//安卓
	var context = plus.android.importClass("android.content.Context");
	var main = plus.android.runtimeMainActivity();
	var clip = main.getSystemService(context.CLIPBOARD_SERVICE);
	plus.android.invoke(clip, "setText", copy);
	if (mess) {} else {
		mess = "已成功复制到剪贴板"
	}
	mui.toast(mess);
}
