function getVideo(id) {
    var client = Ti.Network.createHTTPClient();
    client.onload = function() {
        var json = decodeURIComponent(decodeURIComponent(decodeURIComponent(decodeURIComponent(this.responseText.substring(4, this.responseText.length)))));
        var response = JSON.parse(json);
        var video = response.content.video;
        var isHighQuality = null != video["fmt_stream_map"];
        var streamUrl = isHighQuality ? video["fmt_stream_map"][0].url : video.stream_url;
        isHighQuality || Ti.API.info("using low quality video because fmt_stream_map does not exist in json response, User-Agent probably is not being sent correctly");
        Ti.API.info("stream url: " + streamUrl);
        playVideo(streamUrl);
    };
    client.setRequestHeader("Referer", "http://www.youtube.com/watch?v=" + id);
    client.setRequestHeader("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/536.26.14 (KHTML, like Gecko) Version/6.0.1 Safari/536.26.14");
    client.open("GET", "http://m.youtube.com/watch?ajax=1&layout=mobile&tsp=1&utcoffset=330&v=" + id);
    client.send();
}

function playVideo(url) {
    win = Ti.UI.createWindow({
        title: "View Training Video",
        backgroundColor: "#000"
    });
    videoPlayer = Ti.Media.createVideoPlayer({
        backgroundColor: "#000",
        url: url,
        fullscreen: true,
        autoplay: true,
        scalingMode: Ti.Media.VIDEO_SCALING_ASPECT_FIT,
        mediaControlMode: Ti.Media.VIDEO_CONTROL_DEFAULT
    });
    videoPlayer.addEventListener("complete", function() {
        Ti.API.info("video player complete");
        exports.close();
    });
    videoPlayer.addEventListener("fullscreen", function(e) {
        if (!e.entering) {
            Ti.API.info("video player fullscreen exit");
            exports.close();
        }
    });
    win.add(videoPlayer);
    win.open();
}

var win = null, videoPlayer = null;

exports.isPlaying = false;

exports.play = function(id) {
    console.info("id: " + id);
    exports.isPlaying = true;
    getVideo(id);
};

exports.close = function() {
    Ti.API.info("closing video player");
    videoPlayer.fullscreen = false;
    win.close();
    exports.isPlaying = false;
};