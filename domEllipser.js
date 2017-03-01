/*! domEllipser - v1.0.0
 *
 * Copyright (c) 2014 Jérôme HENAFF <jerome.henaff@gmail.com>;
 * Licensed under the ? license */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DomEllipser = (function () {
        function DomEllipser() {
        }
        DomEllipser.prototype.isEllipsed = function (domE) {
            return !!this._getOriginalElement(domE);
        };
        DomEllipser.prototype.ellipse = function (domE, options) {
            if (options === void 0) { options = {}; }
            if (domE) {
                var config = this._getExistingConfig(domE, options);
                var previousResults = void 0;
                if (!config) {
                    //Force word break
                    domE.style.wordBreak = "break-word";
                    domE.style.whiteSpace = "normal";
                    domE.style.overflow = "hidden";
                }
                else {
                    previousResults = this._getPreviousResults(config);
                }
                var maxHeight = options.maxHeight || domE.clientHeight;
                var isTextOverflow = this._isTextOverflow(domE, maxHeight);
                var isNowEllipsed = false;
                if (previousResults) {
                    if (isTextOverflow) {
                        config.maxHeight = maxHeight;
                        this._processEllipsis(config, 0, previousResults.cropIndex);
                    }
                    else {
                        config.croppedE.textContent = config.originalText;
                        config.maxHeight = options.maxHeight || domE.clientHeight;
                        this._processEllipsis(config, previousResults.cropIndex, config.originalText.length);
                    }
                    isNowEllipsed = true;
                }
                else if (isTextOverflow) {
                    config = this._generateConfig(domE, options);
                    config.maxHeight = maxHeight;
                    this._processEllipsis(config, 0, config.originalText.length);
                    isNowEllipsed = true;
                }
                return isNowEllipsed;
            }
        };
        DomEllipser.prototype._processEllipsis = function (config, startIndex, endIndex) {
            var cropIndex = this._getOverflowPosition(config, startIndex, endIndex);
            var croppedText = config.originalText.substring(0, cropIndex);
            config.croppedE.textContent = croppedText;
            this._storeCurrentResults(config, {
                cropIndex: cropIndex
            });
        };
        DomEllipser.prototype._getOriginalElement = function (domE) {
            return domE.querySelector("[" + DomEllipser.DATA_ATTRIBUTES.original + "]");
        };
        DomEllipser.prototype._getExistingConfig = function (domE, options) {
            var originalE = this._getOriginalElement(domE);
            if (originalE) {
                var croppedE = domE.querySelector("[" + DomEllipser.DATA_ATTRIBUTES.cropped + "]");
                var ellipsisE = domE.querySelector("[" + DomEllipser.DATA_ATTRIBUTES.ellipsis + "]");
                return {
                    options: options,
                    originalText: originalE.textContent,
                    domE: domE,
                    originalE: originalE,
                    croppedE: croppedE,
                    ellipsisE: ellipsisE
                };
            }
            else {
                return null;
            }
        };
        DomEllipser.prototype._generateConfig = function (domE, options) {
            var originalText = domE.textContent;
            domE.textContent = "";
            var originalE = document.createElement("span");
            originalE.setAttribute(DomEllipser.DATA_ATTRIBUTES.original, "true");
            originalE.style.display = "none";
            originalE.textContent = originalText;
            domE.appendChild(originalE);
            var croppedE = document.createElement("span");
            croppedE.setAttribute(DomEllipser.DATA_ATTRIBUTES.cropped, "true");
            croppedE.textContent = originalText;
            domE.appendChild(croppedE);
            var ellipsisE = document.createElement("span");
            ellipsisE.setAttribute(DomEllipser.DATA_ATTRIBUTES.ellipsis, "true");
            if (options.ellipsisHTML) {
                ellipsisE.innerHTML = options.ellipsisHTML;
            }
            else {
                ellipsisE.textContent = options.ellipsis || '...';
            }
            domE.appendChild(ellipsisE);
            return {
                options: options,
                originalText: originalText,
                domE: domE,
                originalE: originalE,
                croppedE: croppedE,
                ellipsisE: ellipsisE
            };
        };
        DomEllipser.prototype._storeCurrentResults = function (config, results) {
            config.originalE.setAttribute(DomEllipser.DATA_ATTRIBUTES.cache, JSON.stringify(results));
        };
        DomEllipser.prototype._getPreviousResults = function (config) {
            var textResults = config.originalE.getAttribute(DomEllipser.DATA_ATTRIBUTES.cache);
            return (textResults) ? JSON.parse(textResults) : null;
        };
        DomEllipser.prototype._getOverflowPosition = function (config, startIndex, endIndex) {
            var startPosition = startIndex;
            var endPosition = endIndex;
            var middlePosition = -1;
            while (startPosition < endPosition) {
                var m = Math.floor((startPosition + endPosition) / 2);
                if (m == middlePosition) {
                    break;
                }
                middlePosition = m;
                if (!this._testTextOverflow(config, config.originalText.substring(0, middlePosition))) {
                    endPosition = middlePosition;
                }
                else {
                    startPosition = middlePosition;
                }
            }
            return middlePosition;
        };
        DomEllipser.prototype._isTextOverflow = function (domE, maxHeight) {
            return (domE.scrollHeight > maxHeight);
        };
        DomEllipser.prototype._testTextOverflow = function (config, textContent) {
            config.croppedE.textContent = textContent;
            return !this._isTextOverflow(config.domE, config.maxHeight);
        };
        return DomEllipser;
    }());
    DomEllipser.DATA_ATTRIBUTES = {
        original: "data-original",
        cropped: "data-cropped",
        ellipsis: "data-ellipsis",
        cache: "data-cache"
    };
    var ellipserInstance = new DomEllipser();
    exports.DomEllipser = ellipserInstance;
});
//# sourceMappingURL=domEllipser.js.map