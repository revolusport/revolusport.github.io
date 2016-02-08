(function() {
  var $, Step, Steps;

  window.FormWizard = {};

  $ = jQuery;

  Step = (function() {
    function Step(element, index, numberOfSteps) {
      this.element = $(element);
      this.index = index;
      this.numberOfSteps = numberOfSteps;
    }

    Step.prototype.isLastStep = function() {
      return this.index === this.numberOfSteps - 1;
    };

    Step.prototype.isFirstStep = function() {
      return this.index === 0;
    };

    Step.prototype.title = function() {
      return this.element.find('.title').html();
    };

    Step.prototype.slug = function() {
      return "step-" + (this.index + 1);
    };

    Step.prototype.hasSlug = function(slug) {
      return this.slug() === slug;
    };

    Step.prototype.hide = function() {
      this.element.hide();
      return this;
    };

    Step.prototype.show = function() {
      this.element.fadeIn('slow');
      return this;
    };

    Step.prototype.navigateTo = function() {
      window.location.hash = this.slug();
      return this;
    };

    Step.prototype.updateProgressbar = function() {
      var i, j, ref;
      $(".breadcrumbs ul li").removeClass('active');
      for (i = j = 0, ref = this.index + 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        $(".breadcrumbs ul li:nth-child(" + i + ")").addClass('active');
      }
      return this;
    };

    return Step;

  })();

  window.FormWizard.Step = Step;

  Steps = (function() {
    function Steps(steps) {
      this.steps = steps.map(function(index, element) {
        return new Step(element, index, steps.length);
      });
      this.currentStep = this.steps[0];
    }

    Steps.prototype.size = function() {
      return this.steps.length;
    };

    Steps.prototype.hideAll = function() {
      $.each(this.steps, function(index, step) {
        return step.hide();
      });
      return this;
    };

    Steps.prototype.titles = function() {
      return this.steps.map(function(index, element) {
        return element.title();
      });
    };

    Steps.prototype.display = function() {
      var selectedStep, slug;
      slug = window.location.hash.substr(1);
      selectedStep = this.stepWithSlug(slug);
      if (selectedStep) {
        this.displayStep(selectedStep);
      } else {
        this.displayFirst();
      }
      return this;
    };

    Steps.prototype.stepWithSlug = function(slug) {
      var foundStep, j, len, ref, step;
      foundStep = false;
      ref = this.steps;
      for (j = 0, len = ref.length; j < len; j++) {
        step = ref[j];
        if (step.hasSlug(slug)) {
          foundStep = step;
        }
      }
      return foundStep;
    };

    Steps.prototype.displayFirst = function() {
      this.displayStep(this.steps[0]);
      return this;
    };

    Steps.prototype.displayNext = function() {
      if (!this.currentStep.isLastStep()) {
        this.displayStep(this.steps[this.currentStep.index + 1]);
      }
      return this;
    };

    Steps.prototype.displayPrev = function() {
      if (!this.currentStep.isFirstStep()) {
        this.displayStep(this.steps[this.currentStep.index - 1]);
      }
      return this;
    };

    Steps.prototype.displayStep = function(nextStep) {
      this.currentStep.hide();
      this.currentStep = nextStep.navigateTo().updateProgressbar().show();
      return this;
    };

    Steps.prototype.firstStep = function() {
      return this.steps[0];
    };

    Steps.prototype.map = function(callback) {
      return this.steps.map(callback);
    };

    Steps.prototype.isCurrentStep = function(step) {
      return step === this.currentStep;
    };

    return Steps;

  })();

  window.FormWizard.Steps = Steps;

  $.fn.extend({
    wizard: function(options) {
      var $element, log, settings, steps;
      settings = {
        debug: false
      };
      settings = $.extend(settings, options);
      log = function(message) {
        if (settings.debug) {
          return console.log(message);
        }
      };
      $element = $(this);
      if (!$element.get(0)) {
        return;
      }
      steps = new FormWizard.Steps($element.find('.step'));
      steps.hideAll().display();
      $('.breadcrumbs li').each(function(index, li) {
        var slug;
        li = $(li);
        slug = 'step-' + (index + 1);
        return li.html($('<a href=#"' + slug + '">' + li.html() + '</a>').on('click', function() {
          steps.displayStep(steps.stepWithSlug(slug));
          return false;
        }));
      });
      $element.find('.next').on('click', function() {
        steps.displayNext();
        return false;
      });
      return $element.find('.prev').on('click', function() {
        steps.displayPrev();
        return false;
      });
    }
  });

}).call(this);
