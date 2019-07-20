/**
 * @package leniwiec - A lightweight library for lazy loading of images based on the IntersectionObserver API.
 * @version v1.1.0
 * @link https://github.com/tyczynski/leniwiec.js
 * @author Przemysław Tyczyński | https://tyczynski.pl
 * @license MIT
 */
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.Leniwiec = factory();
})(this, function () {
  'use strict';
  /**  @const {Object} defaultConfig default class configuration */

  var defaultConfig = {
    root: null,
    rootMargin: '0px',
    threshold: 0,
    errorClassName: 'is-error',
    loadedClassName: 'is-loaded',
    onLoad: function onLoad() {},
    onError: function onError() {}
  };
  /**
   * Check if the user is a robot
   *
   * @return {bool}
   */

  function isRobot() {
    var isBrowser = typeof window !== 'undefined';
    return isBrowser && !('onscroll' in window) || typeof navigator !== 'undefined' && /(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent);
  }
  /**
   * Leniwiec class
   *
   * @class
   */


  var Leniwiec =
  /*#__PURE__*/
  function () {
    /**
     * Class for lazy loading of images based on the IntersectionObserver API.
     *
     * @param {String} selector
     * @param {Object} config
     */
    function Leniwiec() {
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '.leniwiec';
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Leniwiec);

      this.elements = document.querySelectorAll(selector);
      this.config = _extends({}, defaultConfig, config);
      this.observer = null;
    }

    _createClass(Leniwiec, [{
      key: "mount",
      value: function mount() {
        this.observer = new IntersectionObserver(this.callback.bind(this), {
          root: this.config.root,
          rootMargin: this.config.rootMargin,
          threshold: this.config.threshold
        });

        for (var i = 0; i < this.elements.length; i += 1) {
          this.observer.observe(this.elements[i]);
        } // Improving SEO - Load all images if the user is a robot


        if (isRobot()) {
          this.loadAll();
        }
      }
      /**
       * Immediately unobserve all elements
       */

    }, {
      key: "unmount",
      value: function unmount() {
        for (var i = 0; i < this.elements.length; i += 1) {
          this.observer.unobserve(this.elements[i]);
        }
      }
      /**
       * Callback for the IntersectionObserver instance
       *
       * @param {Array} entries
       */

    }, {
      key: "callback",
      value: function callback(entries) {
        var _this = this;

        entries.forEach(function (entry) {
          var target = entry.target;

          if (entry.isIntersecting) {
            _this.loadAndUnobserve(target);
          }
        });
      }
      /**
       * The method that chooses how to add an image
       *
       * @param {Element} target
       */

    }, {
      key: "load",
      value: function load(target) {
        if (target.dataset.loadImage) {
          this.onlyLoad(target);
        } else {
          switch (target.tagName) {
            case 'IMG':
              this.setSrc(target);
              break;

            case 'PICTURE':
              this.setPicture(target);
              break;

            default:
              this.setBackground(target);
          }
        }
      }
    }, {
      key: "onlyLoad",
      value: function onlyLoad(target) {
        var _Leniwiec$getTargetAt = Leniwiec.getTargetAttributes(target),
            src = _Leniwiec$getTargetAt.src;

        var image = new Image();
        this.bindImageEvents(image, target, [src]);
        image.setAttribute('src', src);
      }
      /**
       * The method that adds a image for the <img> tag
       *
       * @param {Element} target
       */

    }, {
      key: "setSrc",
      value: function setSrc(target) {
        var _Leniwiec$getTargetAt2 = Leniwiec.getTargetAttributes(target),
            src = _Leniwiec$getTargetAt2.src;

        this.bindImageEvents(target, target);
        target.setAttribute('src', src);
      }
      /**
       * The method that adds a background-image to any tag except the <img> and <picture> tags
       *
       * @param {Element} target
       */

    }, {
      key: "setBackground",
      value: function setBackground(target) {
        var _Leniwiec$getTargetAt3 = Leniwiec.getTargetAttributes(target),
            src = _Leniwiec$getTargetAt3.src;

        var image = new Image();
        this.bindImageEvents(image, target);
        image.setAttribute('src', src); // eslint-disable-next-line no-param-reassign

        target.style.backgroundImage = "url(".concat(src, ")");
      }
      /**
       * The method that adds a image for the <picture> tag
       *
       * @param {Element} target
       */

    }, {
      key: "setPicture",
      value: function setPicture(target) {
        var _Leniwiec$getTargetAt4 = Leniwiec.getTargetAttributes(target),
            src = _Leniwiec$getTargetAt4.src,
            alt = _Leniwiec$getTargetAt4.alt;

        var image = new Image();
        this.bindImageEvents(image, target);
        image.setAttribute('src', src);
        image.setAttribute('alt', alt);
        target.appendChild(image);
      }
      /**
       * Method that binds the "loading" and "error" events to the images
       *
       * @param {Image|Element} eventElement
       * @param {Element} target
       */

    }, {
      key: "bindImageEvents",
      value: function bindImageEvents(eventElement, target) {
        var _this2 = this;

        var payload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        var _this$config = this.config,
            loadedClassName = _this$config.loadedClassName,
            errorClassName = _this$config.errorClassName;

        var load = function load() {
          var _this2$config;

          target.classList.add(loadedClassName);

          (_this2$config = _this2.config).onLoad.apply(_this2$config, [target].concat(_toConsumableArray(payload)));
        };

        var error = function error() {
          var _this2$config2;

          target.classList.add(errorClassName);

          (_this2$config2 = _this2.config).onError.apply(_this2$config2, [target].concat(_toConsumableArray(payload)));
        };

        eventElement.addEventListener('load', load);
        eventElement.addEventListener('error', error);
      }
      /**
       * Load all elements immediately
       */

    }, {
      key: "loadAllAndUnmount",
      value: function loadAllAndUnmount() {
        for (var i = 0; i < this.elements.length; i += 1) {
          this.loadAndUnobserve(this.elements[i]);
        }
      }
      /**
       * Load an element and unobserve it from the IntersectionObserver instance
       *
       * @param {Element} target
       */

    }, {
      key: "loadAndUnobserve",
      value: function loadAndUnobserve(target) {
        this.load(target);
        this.observer.unobserve(target);
      }
      /**
       * Public method for adding items to observe
       *
       * @param {Element} element
       */

    }, {
      key: "observe",
      value: function observe(element) {
        this.observer.observe(element);
      }
      /**
       * Gets and returns the "alt" and "src" of the target element
       *
       * @param {Element} target
       * @return {Object}
       */

    }], [{
      key: "getTargetAttributes",
      value: function getTargetAttributes(target) {
        var src = target.dataset.src || target.dataset.backgroundImage || target.dataset.loadImage || '';
        var alt = target.dataset.alt || '';
        return {
          src: src,
          alt: alt
        };
      }
    }]);

    return Leniwiec;
  }();

  return Leniwiec;
});
