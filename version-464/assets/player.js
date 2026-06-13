import { H as Hls } from './hls-dru42stk.js';

var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

players.forEach(function (player) {
  var video = player.querySelector('video');
  var cover = player.querySelector('.player-cover');
  var source = player.getAttribute('data-source');
  var hls = null;
  var prepared = false;

  function prepare() {
    if (prepared || !video || !source) {
      return;
    }

    prepared = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }
  }

  function play() {
    prepare();

    if (cover) {
      cover.classList.add('is-hidden');
    }

    var attempt = video.play();

    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(function () {
        if (cover) {
          cover.classList.remove('is-hidden');
        }
      });
    }
  }

  if (cover) {
    cover.addEventListener('click', play);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (!prepared) {
        play();
      }
    });
  }

  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
});
