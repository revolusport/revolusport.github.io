













function ready() {
  $("[data-behavior='multistep']").wizard();

  $('.gauge input').knob({
    min: 0,
    readOnly: true,
    format: function(value) {
      return value + '%';
    },
  });

  $("[data-behavior='toggle']").on('click', function (e) {
    e.preventDefault();
    $($(this).attr('data-target')).slideToggle(300);
  });

  INCITEO = {};
  INCITEO.fileInputs = function() {
    var $this = $(this),
        $val = $this.val(),
        valArray = $val.split('\\'),
        newVal = valArray[valArray.length-1],
        $button = $this.siblings('.file-upload-box'),
        $fakeFile = $this.siblings('.file-holder');

    if(newVal !== '') {
      $button.html('<a href="">Image sélectionnée</a>');
      if($fakeFile.length === 0) {
        $button.append('<span class="filename">' + newVal + '</span>');
      } else {
        $fakeFile.text(newVal);
      }
    }
  };

  $('.control-file input[type=file]').bind('change focus click', INCITEO.fileInputs);

  $("[data-behavior='rich-editor']").each(function(index, elt) {
    var editor = new wysihtml5.Editor(elt, {
      toolbar: 'rich-editor-toolbar-' + index,
      parserRules:  wysihtml5ParserRules,
      stylesheets: "/assets/application.css",
      composerClassName: 'expandable'
    });
  });

  $('.slides').slick({
    dots: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 6000,
  });

  $('#contribution_amount[data-matching-reward]').on('input propertychange focus', function(e) {
    var amount = $(e.target).val();
    var rewardContainer = $('#matching-reward');
    var rewardURL = rewardContainer.attr('data-project-rewards-path') + '/0' + amount;

    rewardContainer.load(rewardURL);
  });
  $('#contribution_amount[data-matching-reward]').focus();
}

function showSignInForm() {
  $('#sign-in').show();
}


$(document).ready(ready);
$(document).on('page:load', ready);
