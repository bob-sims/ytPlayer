var win = null;

exports.isPlaying = false;

exports.play = function(id) {
    exports.isPlaying = true;

    getVideo(id);
};

function getVideo(id) {
    var client = Ti.Network.createHTTPClient();

    client.onload = function() {
        var json = (this.responseText.substring(4, this.responseText.length));
        var response = JSON.parse(json);

        if (response.result === 'error') {
            exports.isPlaying = false;

            if (OS_ANDROID) {
                $.videoPlayer = null;
            }

            alert(L('ytPlayer_videoNotFound', 'Video not found'));

            return;
        }

        var isHighQuality = response.content['player_data']['fmt_stream_map'] !== null;
        var streamUrl = isHighQuality ? response.content['player_data']['fmt_stream_map'][0].url : '';

        if (!isHighQuality) {
            Ti.API.debug('using low quality video because fmt_stream_map does not exist in json response, User-Agent probably is not being sent correctly');
        }

        playVideo(streamUrl);
    };

    if (OS_IOS) {
        client.setRequestHeader('Referer', 'http://www.youtube.com/watch?v=' + id);
        client.setRequestHeader('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/536.26.14 (KHTML, like Gecko) Version/6.0.1 Safari/536.26.14');
    }

    client.open('GET', 'http://m.youtube.com/watch?ajax=1&layout=mobile&tsp=1&utcoffset=330&v=' + id);

    if (OS_ANDROID) {
        client.setRequestHeader('Referer', 'http://www.youtube.com/watch?v=' + id);
        client.setRequestHeader('User-Agent', 'Mozilla/5.0 (Linux; U; Android 2.2.1; en-gb; GT-I9003 Build/FROYO) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1');
    }

    client.send();
}

function playVideo(url) {

    if (OS_IOS) {
        win = Widget.createController('window').getView();
    }

    $.videoPlayer.setUrl(url);

    $.videoPlayer.addEventListener('complete', function(e) {
        exports.close();
    });

    $.videoPlayer.addEventListener('fullscreen', function(e) {
        if (!e.entering) {
            exports.close();
        }
    });

    if (OS_IOS) {
        win.add($.videoPlayer);
        win.open({
            animated: false
        });
    }
}

exports.close = function() {

    if (OS_IOS) {
        $.videoPlayer.fullscreen = false;
        win.close();

    } else {
        $.videoPlayer.hide();
        $.videoPlayer.release();
        $.videoPlayer = null;
    }

    exports.isPlaying = false;
};
