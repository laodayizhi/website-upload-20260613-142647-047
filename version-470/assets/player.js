(function () {
  function mount(videoId, buttonId, streamUrl) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    var hlsInstance = null;
    var initialized = false;

    if (!video || !button || !streamUrl) {
      return;
    }

    var hideButton = function () {
      button.classList.add('is-hidden');
      video.setAttribute('controls', 'controls');
    };

    var requestPlay = function () {
      hideButton();
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          button.classList.remove('is-hidden');
        });
      }
    };

    var initialize = function () {
      if (initialized) {
        requestPlay();
        return;
      }

      initialized = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        video.addEventListener('loadedmetadata', requestPlay, { once: true });
        video.load();
        requestPlay();
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: false });
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, requestPlay);
        return;
      }

      video.src = streamUrl;
      video.load();
      requestPlay();
    };

    button.addEventListener('click', initialize);
    video.addEventListener('click', function () {
      if (!initialized || video.paused) {
        initialize();
      }
    });

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  window.MoviePlayer = {
    mount: mount
  };
}());
