ytPlayer
========

Simple cross-platform Alloy Widget for Titanium Mobile, plays streaming YouTube video with native Ti.Media.VideoPlayer.

Based on [prior art by Dawson Toth](http://is.gd/RGNGGI).

Usage:

Copy `widgets/ytPlayer` to your local Ti project `widgets/` folder.

Be sure to update your project's `config.json` file, add `"ytPlayer": "1.0"` to `"dependencies"`.

In your controller: 

    // call method .play(), pass YouTube ID of video to play
    Alloy.createWidget('ytPlayer').play('BXb5zeaaZss');

See [sample app](https://github.com/bob-sims/ytPlayer/tree/master/app).

That's it!
 
[@2wheelsburing](http://www.twitter.com/2wheelsburing)