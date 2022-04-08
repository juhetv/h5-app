let api_host = "http://api.meitue.shop";
let static_page = "http://137.175.30.230:8091/static-res-pages/";
let html_host = static_page + "prod_remote_";
let menu_left_url = html_host + "menu_left.html";
//menu_left_url = "http://137.175.30.230:8091/static-res-pages/ssalis_remote_menu_left.html";
if (sessionStorage.getItem("channelName") == null) {
    sessionStorage.setItem("channelName", "norm");
}

let login_php_url = html_host + "login.html";


let member_info_api = api_host + "/member/info";
let exchange_api = api_host + "/member/exchange/";

let page_list_url = api_host + "/movie-net/page";
let page_detail_api = api_host + "/movie-net/detail/";
let back_play_api = api_host + "/movie-net/playError/";
let down_play_api = api_host + "/movie-net/downInfo?movieKey=";

let favor_exist_api = api_host + "/favor/exist?movieKey=";
let favor_update_api = api_host + "/favor/addOrCancel?movieKey=";

let downapk_url = "http://meitue.shop/down.html";

let send_sms_api = api_host + "/login/sendSms";
let login_register_reset_api = api_host + "/login/lrr";


let rech_create_api = api_host + "/member/recharge/create";
let rech_check_api = api_host + "/member/recharge/check";
let rech_pay_api = api_host + "/pay/recharge/pay/";

let share_video_url = "http://meitue.com/new/info.html#vid=thisVid&shareFrom=thisShareFrom";


mui.plusReady(function () {
    //let time_now = new Date(); time_now.getSeconds()%3
    sessionStorage.setItem("vip_exchange", "0");

    if (plus.webview.currentWebview().id.indexOf("video_info_app") >= 0) {
        let txt = localStorage.getItem("video_item");
        let videoItem = JSON.parse(txt);
        if (videoItem.hostId == 'sequan') {
            let timeKey = "time:" + videoItem.id;
            sessionStorage.setItem(timeKey, 15);
        }

    }
});
