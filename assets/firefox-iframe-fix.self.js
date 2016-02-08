// See: https://bugzilla.mozilla.org/show_bug.cgi?id=356558
$(function() {
  $('iframe.rs-iframe-fix').each(function(_, iframe) {
    iframe.contentWindow.location.href = iframe.src;
  });
});

