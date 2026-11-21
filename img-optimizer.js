/* Serves resized WebP versions of remotely hosted product photos (much smaller than the originals).
   Falls back to the original URL, then to the placeholder, if anything fails. */
(function () {
  var PROXY = 'https://wsrv.nl/';
  window.optImg = function (url, w) {
    if (!url || typeof url !== 'string') return url;
    if (url.indexOf('data:') === 0 || url.indexOf('http') !== 0) return url;
    if (url.indexOf('wsrv.nl') !== -1) return url;
    return PROXY + '?url=' + encodeURIComponent(url) + '&w=' + (w || 500) + '&output=webp&q=75&we';
  };
  window.imgErr = function (el, orig) {
    if (!el.dataset.triedOrig && orig) { el.dataset.triedOrig = '1'; el.src = orig; return; }
    el.onerror = null;
    el.src = 'placeholder-product.svg';
  };
})();
