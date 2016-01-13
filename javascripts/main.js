/**
 * Не совсем дописал позиционирование попапов и табы.
 * Переключение табов можно сделать так:
 * На странице разместить шаблоны видов всех трех вариантов в тегах template.
 * При клике на вкладку отправлять аякс запрос, потом его распарсенный вариант
 * сохранять в новый виртуальный фрагмент DOM дерева и собирать его, основываясь на шаблоне template.
 * После этого чистить контейнер таблицы и вставлять туда собранный элемент.
 */

'use strict';

(function() {
  /**
   * Убирает класс или добавляет его.
   * @param {Element} element
   * @param {string} className
   * @param {boolean=} action
   */
  function toggleClass(element, className, action) {
    if (action && element.className.indexOf(className) === -1) {
      element.className = !element.className.length ? className :
      element.className + ' ' + className;

    } else if (!action && element.className.indexOf(className) !== -1) {
      var classList = element.className.split(' ');
      classList.splice(classList.indexOf(className), 1);
      element.className = classList.join(' ');
    }
  }

  /**
   * Конструктор урока.
   * @param {Element} lesson
   * @param {Object=} popup
   * @constructor
   */
  function Lesson(lesson, popup) {
    this.lesson = lesson;
    if (popup) {
      this.popup = {
        popup: popup,
        closeBtn: popup.querySelector('.lesson-popup__close-btn'),
        open: true
      };
      this.closePopup = this.closePopup.bind(this);
      this.openPopup = this.openPopup.bind(this);
      this.generatePopupPosition = this.generatePopupPosition.bind(this);
      this.checkPopupState();
    }
  }

  Lesson.prototype = {
    checkPopupState: function() {
      this.popup.open = !this.popup.open;
      toggleClass(this.popup.popup, 'lesson-popup--active', this.popup.open);
      if (this.popup.open) {
        this.lesson.removeEventListener('click', this.openPopup);
        this.popup.closeBtn.addEventListener('click', this.closePopup);
      } else {
        this.lesson.addEventListener('click', this.openPopup);
        this.popup.closeBtn.addEventListener('click', this.closePopup);
      }
    },

    closePopup: function() {
      this.lesson.setAttribute('style', 'z-index: 3 !important');
      toggleClass(this.popup.popup, 'lesson-popup--active', false);
    },

    openPopup: function(e) {
      if (e.target.className.indexOf('lesson-popup') == -1) {
        this.generatePopupPosition();
        this.lesson.setAttribute('style', 'z-index: 20 !important');
        Array.prototype.forEach.call(document.querySelectorAll('.lesson-popup'), function(lesson) {
          toggleClass(lesson, 'lesson-popup--active', false);
        });
        toggleClass(this.popup.popup, 'lesson-popup--active', true);
      }
    },

    generatePopupPosition: function() {
      // Если попап в последней или предпоследней строке,
      // то показываем его слева.
      var width = this.popup.popup.width;

      if (!this.lesson.nextSibling) {
        this.popup.popup.setAttribute('style', 'right: auto; left: -' + width + 'px');
        console.log('last');
      } else if (!this.lesson.nextSibling.nextSibling) {
        console.log('prelast');
        this.popup.popup.setAttribute('style', 'right: auto; left: -15px');
      } else {
        this.popup.popup.setAttribute('style', 'left: auto; right: -' + width + 'px');
      }
    }
  };

  var lessons = Array.prototype.filter.call(document.querySelectorAll('.schedule-lesson'), function(lesson) {
    return lesson.querySelector('.lesson-popup');
  });

  console.log(lessons);

  Array.prototype.forEach.call(lessons, function(lesson) {
    var popup = lesson.querySelector('.lesson-popup');
    var lessonObject = new Lesson(lesson, popup);
    console.log(lessonObject);
  });

})();
