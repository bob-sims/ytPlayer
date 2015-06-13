//var ytPlayer = require (WPATH('ytPlayer'));

//var lib = Alloy.Globals;
 
var win = null
 
exports.isPlaying = false;
 
exports.play = function(id) {
	console.info('id: ' + id);
    exports.isPlaying = true;
    getVideo(id);
};

function getArgs(string){
	var args = {};
	var pairs = string.split("&");
	for(var i = 0; i < pairs.length; i++) {
		var pos = pairs[i].indexOf('=');
		if (pos == -1) continue;
		var argname = pairs[i].substring(0,pos);
		var value = pairs[i].substring(pos+1);
		args[argname] = unescape(value);
	}
	return args;

};
 
function getVideo(id) {
	var youtubeInfoUrl = 'http://www.youtube.com/get_video_info?video_id=' + id;
	var request = Titanium.Network.createHTTPClient({ timeout : 10000  /* in milliseconds */});
	request.open("GET", youtubeInfoUrl);
	request.onerror = function(event){
	};
	request.onload = function(event){
		var qualities = {};
		var response = this.responseText;
		var args = getArgs(response);

		if (!args.hasOwnProperty('url_encoded_fmt_stream_map')){
		}
		else{
			var fmtstring = args['url_encoded_fmt_stream_map'];
			var fmtarray = fmtstring.split(',');
			for(var i=0,j=fmtarray.length; i<j; i++){
				var args2 = getArgs(fmtarray[i]);
				var type = decodeURIComponent(args2['type']);
				// Ti.API.error("args ==== "+JSON.stringify(args2));
				if (type.indexOf('mp4') >= 0){
						var url = decodeURIComponent(args2['url']);
						var quality = decodeURIComponent(args2['quality']);
						qualities[quality] = url;
				}
			}
			playVideo(qualities.medium);
		}
	};

	request.send();

}
 
function playVideo(url) {
   if(OS_IOS) {
		win = Widget.createController('window').getView();
   } 
    $.videoPlayer.setUrl(url);
    $.videoPlayer.addEventListener('complete', function(e) { 
        Ti.API.info('video player complete');
        exports.close();
    });
    $.videoPlayer.addEventListener('fullscreen', function(e) {
        if (!e.entering) {
            Ti.API.info('video player fullscreen exit');
            exports.close();
        }
    });
    if(OS_IOS) {
        win.add($.videoPlayer);
        win.open();
    }
}
 
exports.close = function() {
    Ti.API.info('closing video player');
    if(OS_IOS) {
        $.videoPlayer.fullscreen = false;
        win.close();
    }
    else {
        $.videoPlayer.hide();
        $.videoPlayer.release();
        $.videoPlayer = null;
    }
    exports.isPlaying = false;
};
