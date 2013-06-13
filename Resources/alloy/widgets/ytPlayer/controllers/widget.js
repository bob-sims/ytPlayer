function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "ytPlayer/" + s : s.substring(0, index) + "/ytPlayer/" + s.substring(index + 1);
    return true && 0 !== path.indexOf("/") ? "/" + path : path;
}

function Controller() {
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
        client.open("GET", "http://m.youtube.com/watch?ajax=1&layout=mobile&tsp=1&utcoffset=330&v=" + id);
        client.setRequestHeader("Referer", "http://www.youtube.com/watch?v=" + id);
        client.setRequestHeader("User-Agent", "Mozilla/5.0 (Linux; U; Android 2.2.1; en-gb; GT-I9003 Build/FROYO) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1");
        client.send();
    }
    function playVideo(url) {
        $.videoPlayer.setUrl(url);
        $.videoPlayer.addEventListener("complete", function() {
            Ti.API.info("video player complete");
            exports.close();
        });
        $.videoPlayer.addEventListener("fullscreen", function(e) {
            if (!e.entering) {
                Ti.API.info("video player fullscreen exit");
                exports.close();
            }
        });
    }
    new (require("alloy/widget"))("ytPlayer");
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.videoPlayer = Ti.Media.createVideoPlayer({
        backgroundColor: "#000",
        fullscreen: true,
        autoplay: true,
        scalingMode: Ti.Media.VIDEO_SCALING_ASPECT_FIT,
        mediaControlMode: Ti.Media.VIDEO_CONTROL_DEFAULT,
        id: "videoPlayer",
        ns: Ti.Media
    });
    $.__views.videoPlayer && $.addTopLevelView($.__views.videoPlayer);
    exports.destroy = function() {};
    _.extend($, $.__views);
    exports.isPlaying = false;
    exports.play = function(id) {
        console.info("id: " + id);
        exports.isPlaying = true;
        getVideo(id);
    };
    exports.close = function() {
        Ti.API.info("closing video player");
        $.videoPlayer.hide();
        $.videoPlayer.release();
        $.videoPlayer = null;
        exports.isPlaying = false;
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;