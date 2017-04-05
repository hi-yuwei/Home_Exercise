/**
 * Created by Administrator on 2016/1/7.
 */
/*
 * Slides, A Slideshow Plugin for jQuery
 * Intructions: http://slidesjs.com
 * By: Nathan Searles, http://nathansearles.com
 * Version: 1.0.9
 * Updated: January 4th, 2011
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function ($) {
    $.fn.slides = function (option) {
        option = $.extend({}, $.fn.slides.option, option);
        return this.each(function () {
            //$(".slides_container,div.slides_control");
            $('.' + option.container, $(this)).children().wrapAll('<div class="slides_control"/>');
            var elem = $(this),
                control = $('.slides_control', elem),
                total = control.children().size(),
                width = control.children().outerWidth(),
                height = control.children().outerHeight(),
                start = option.start - 1,
                effect = option.effect.indexOf(',') < 0 ? option.effect : option.effect.replace(' ', '').split(',')[0],
                paginationEffect = option.effect.indexOf(',') < 0 ? effect : option.effect.replace(' ', '').split(',')[1],
                next = 0, prev = 0, number = 0, current = 0, loaded, active, clicked, position, direction;
            if (total < 2) {
                return;
            }
            if (start < 0) {
                start = 0;
            }
            ;
            if (start > total) {
                start = total - 1;
            }
            ;
            if (option.start) {
                //0
                current = start;
            }
            ;
            if (option.randomize) {
                control.randomize();
            }
            $('.' + option.container, elem).css({overflow: 'hidden', position: 'relative'});
            control.css({position: 'relative', width: (width * 3), height: height, left: -width});
            control.children().css({position: 'absolute', top: 0, left: width, zIndex: 0, display: 'none'});
            if (option.autoHeight) {
                control.animate({height: control.children(':eq(' + start + ')').outerHeight()}, option.autoHeightSpeed);
            }
            if (option.preload && control.children()[0].tagName == 'IMG') {
                elem.css({background: 'url(' + option.preloadImage + ') no-repeat 50% 50%'});
                var img = $('img:eq(' + start + ')', elem).attr('src') + '?' + (new Date()).getTime();
                $('img:eq(' + start + ')', elem).attr('src', img).load(function () {
                    $(this).fadeIn(option.fadeSpeed, function () {
                        $(this).css({zIndex: 5});
                        elem.css({background: ''});
                        loaded = true;
                    });
                });
            } else {
                control.children(':eq(' + start + ')').fadeIn(option.fadeSpeed, function () {
                    loaded = true;
                });
            }
            if (option.bigTarget) {
                control.children().css({cursor: 'pointer'});
                control.children().click(function () {
                    animate('next', effect);
                    return false;
                });
            }
            if (option.hoverPause && option.play) {
                control.children().bind('mouseover', function () {
                    stop();
                });
                control.children().bind('mouseleave', function () {
                    pause();
                });
            }
            if (option.generateNextPrev) {
                $('.' + option.container, elem).after('<a href="#" class="' + option.prev + '">Prev</a>');
                $('.' + option.prev, elem).after('<a href="#" class="' + option.next + '">Next</a>');
            }
            $('.' + option.next, elem).click(function (e) {
                e.preventDefault();
                if (option.play) {
                    pause();
                }
                ;
                animate('next', effect);
            });
            $('.' + option.prev, elem).click(function (e) {
                e.preventDefault();
                if (option.play) {
                    pause();
                }
                ;
                animate('prev', effect);
            });
            if (option.generatePagination) {
                elem.append('<ul class=' + option.paginationClass + '></ul>');
                control.children().each(function () {
                    $('.' + option.paginationClass, elem).append('<li><a href="#' + number + '">' + (number + 1) + '</a></li>');
                    number++;
                });
            } else {
                $('.' + option.paginationClass + ' li a', elem).each(function () {
                    $(this).attr('href', '#' + number);
                    number++;
                });
            }
            $('.' + option.paginationClass + ' li:eq(' + start + ')', elem).addClass('current');
            $('.' + option.paginationClass + ' li a', elem).mouseover(function () {
                if (option.play) {
                    pause();
                }
                ;
                clicked = $(this).attr('href').match('[^#/]+$');
                if (current != clicked) {
                    animate('pagination', paginationEffect, clicked);
                }
                return false;
            });
            $('a.link', elem).click(function () {
                if (option.play) {
                    pause();
                }
                ;
                clicked = $(this).attr('href').match('[^#/]+$') - 1;
                if (current != clicked) {
                    animate('pagination', paginationEffect, clicked);
                }
                return false;
            });
            if (option.play) {
                playInterval = setInterval(function () {
                    animate('next', effect);
                }, option.play);
                elem.data('interval', playInterval);
            }
            ;
            function stop() {
                clearInterval(elem.data('interval'));
            };
            function pause() {
                if (option.pause) {
                    clearTimeout(elem.data('pause'));
                    clearInterval(elem.data('interval'));
                    pauseTimeout = setTimeout(function () {
                        clearTimeout(elem.data('pause'));
                        playInterval = setInterval(function () {
                            animate("next", effect);
                        }, option.play);
                        elem.data('interval', playInterval);
                    }, option.pause);
                    elem.data('pause', pauseTimeout);
                } else {
                    stop();
                }
            };
            function animate(direction, effect, clicked) {
                if (!active && loaded) {
                    active = true;
                    switch (direction) {
                        case'next':
                            prev = current;
                            next = current + 1;
                            next = total === next ? 0 : next;
                            position = width * 2;
                            direction = -width * 2;
                            current = next;
                            break;
                        case'prev':
                            prev = current;
                            next = current - 1;
                            next = next === -1 ? total - 1 : next;
                            position = 0;
                            direction = 0;
                            current = next;
                            break;
                        case'pagination':
                            next = parseInt(clicked, 10);
                            prev = $('.' + option.paginationClass + ' li.current a', elem).attr('href').match('[^#/]+$');
                            if (next > prev) {
                                position = width * 2;
                                direction = -width * 2;
                            } else {
                                position = 0;
                                direction = 0;
                            }
                            current = next;
                            break;
                    }
                    if (effect === 'fade') {
                        option.animationStart();
                        if (option.crossfade) {
                            control.children(':eq(' + next + ')', elem).css({zIndex: 10}).fadeIn(option.fadeSpeed, function () {
                                if (option.autoHeight) {
                                    control.animate({height: control.children(':eq(' + next + ')', elem).outerHeight()}, option.autoHeightSpeed, function () {
                                        control.children(':eq(' + prev + ')', elem).css({display: 'none', zIndex: 0});
                                        control.children(':eq(' + next + ')', elem).css({zIndex: 0});
                                        option.animationComplete(next + 1);
                                        active = false;
                                    });
                                } else {
                                    control.children(':eq(' + prev + ')', elem).css({display: 'none', zIndex: 0});
                                    control.children(':eq(' + next + ')', elem).css({zIndex: 0});
                                    option.animationComplete(next + 1);
                                    active = false;
                                }
                            });
                        } else {
                            option.animationStart();
                            control.children(':eq(' + prev + ')', elem).fadeOut(option.fadeSpeed, function () {
                                if (option.autoHeight) {
                                    control.animate({height: control.children(':eq(' + next + ')', elem).outerHeight()}, option.autoHeightSpeed, function () {
                                        control.children(':eq(' + next + ')', elem).fadeIn(option.fadeSpeed);
                                    });
                                } else {
                                    control.children(':eq(' + next + ')', elem).fadeIn(option.fadeSpeed, function () {
                                        if ($.browser.msie) {
                                            $(this).get(0).style.removeAttribute('filter');
                                        }
                                    });
                                }
                                option.animationComplete(next + 1);
                                active = false;
                            });
                        }
                    } else {
                        control.children(':eq(' + next + ')').css({left: position, display: 'block'});
                        if (option.autoHeight) {
                            option.animationStart();
                            control.animate({
                                left: direction,
                                height: control.children(':eq(' + next + ')').outerHeight()
                            }, option.slideSpeed, function () {
                                control.css({left: -width});
                                control.children(':eq(' + next + ')').css({left: width, zIndex: 5});
                                control.children(':eq(' + prev + ')').css({left: width, display: 'none', zIndex: 0});
                                option.animationComplete(next + 1);
                                active = false;
                            });
                        } else {
                            option.animationStart();
                            control.animate({left: direction}, option.slideSpeed, function () {
                                control.css({left: -width});
                                control.children(':eq(' + next + ')').css({left: width, zIndex: 5});
                                control.children(':eq(' + prev + ')').css({left: width, display: 'none', zIndex: 0});
                                option.animationComplete(next + 1);
                                active = false;
                            });
                        }
                    }
                    if (option.pagination) {
                        $('.' + option.paginationClass + ' li.current', elem).removeClass('current');
                        $('.' + option.paginationClass + ' li:eq(' + next + ')', elem).addClass('current');
                    }
                }
            };
        });
    };
    $.fn.slides.option = {
        preload: false,
        preloadImage: '/img/loading.gif',
        container: 'slides_container',
        generateNextPrev: false,
        next: 'next',
        prev: 'prev',
        pagination: true,
        generatePagination: true,
        paginationClass: 'pagination',
        fadeSpeed: 350,
        slideSpeed: 350,
        start: 1,
        effect: 'slide',
        crossfade: false,
        randomize: false,
        play: 0,
        pause: 0,
        hoverPause: false,
        autoHeight: false,
        autoHeightSpeed: 350,
        bigTarget: false,
        animationStart: function () {
        },
        animationComplete: function () {
        }
    };
    $.fn.randomize = function (callback) {
        function randomizeOrder() {
            return (Math.round(Math.random()) - 0.5);
        }

        return ($(this).each(function () {
            var $this = $(this);
            var $children = $this.children();
            var childCount = $children.length;
            if (childCount > 1) {
                $children.hide();
                var indices = [];
                for (i = 0; i < childCount; i++) {
                    indices[indices.length] = i;
                }
                indices = indices.sort(randomizeOrder);
                $.each(indices, function (j, k) {
                    var $child = $children.eq(k);
                    var $clone = $child.clone(true);
                    $clone.show().appendTo($this);
                    if (callback !== undefined) {
                        callback($child, $clone);
                    }
                    $child.remove();
                });
            }
        }));
    };
})(jQuery);/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 *
 * Open source under the BSD License.
 *
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
    {
        def: 'easeOutQuad',
        swing: function (x, t, b, c, d) {
            //alert(jQuery.easing.default);
            return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
        },
        easeInQuad: function (x, t, b, c, d) {
            return c*(t/=d)*t + b;
        },
        easeOutQuad: function (x, t, b, c, d) {
            return -c *(t/=d)*(t-2) + b;
        },
        easeInOutQuad: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t + b;
            return -c/2 * ((--t)*(t-2) - 1) + b;
        },
        easeInCubic: function (x, t, b, c, d) {
            return c*(t/=d)*t*t + b;
        },
        easeOutCubic: function (x, t, b, c, d) {
            return c*((t=t/d-1)*t*t + 1) + b;
        },
        easeInOutCubic: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t + b;
            return c/2*((t-=2)*t*t + 2) + b;
        },
        easeInQuart: function (x, t, b, c, d) {
            return c*(t/=d)*t*t*t + b;
        },
        easeOutQuart: function (x, t, b, c, d) {
            return -c * ((t=t/d-1)*t*t*t - 1) + b;
        },
        easeInOutQuart: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
            return -c/2 * ((t-=2)*t*t*t - 2) + b;
        },
        easeInQuint: function (x, t, b, c, d) {
            return c*(t/=d)*t*t*t*t + b;
        },
        easeOutQuint: function (x, t, b, c, d) {
            return c*((t=t/d-1)*t*t*t*t + 1) + b;
        },
        easeInOutQuint: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
            return c/2*((t-=2)*t*t*t*t + 2) + b;
        },
        easeInSine: function (x, t, b, c, d) {
            return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
        },
        easeOutSine: function (x, t, b, c, d) {
            return c * Math.sin(t/d * (Math.PI/2)) + b;
        },
        easeInOutSine: function (x, t, b, c, d) {
            return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
        },
        easeInExpo: function (x, t, b, c, d) {
            return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
        },
        easeOutExpo: function (x, t, b, c, d) {
            return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
        },
        easeInOutExpo: function (x, t, b, c, d) {
            if (t==0) return b;
            if (t==d) return b+c;
            if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
            return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
        },
        easeInCirc: function (x, t, b, c, d) {
            return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
        },
        easeOutCirc: function (x, t, b, c, d) {
            return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
        },
        easeInOutCirc: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
            return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
        },
        easeInElastic: function (x, t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        },
        easeOutElastic: function (x, t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
        },
        easeInOutElastic: function (x, t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
            return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
        },
        easeInBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c*(t/=d)*t*((s+1)*t - s) + b;
        },
        easeOutBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        },
        easeInOutBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
            return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
        },
        easeInBounce: function (x, t, b, c, d) {
            return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
        },
        easeOutBounce: function (x, t, b, c, d) {
            if ((t/=d) < (1/2.75)) {
                return c*(7.5625*t*t) + b;
            } else if (t < (2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
            } else if (t < (2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
            } else {
                return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
            }
        },
        easeInOutBounce: function (x, t, b, c, d) {
            if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
            return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
        }
    });

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 *
 * Open source under the BSD License.
 *
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 *//*! Lazy Load 1.9.3 - MIT license - Copyright 2010-2013 Mika Tuupola */
!function(a,b,c,d){var e=a(b);a.fn.lazyload=function(f){function g(){var b=0;i.each(function(){var c=a(this);if(!j.skip_invisible||c.is(":visible"))if(a.abovethetop(this,j)||a.leftofbegin(this,j));else if(a.belowthefold(this,j)||a.rightoffold(this,j)){if(++b>j.failure_limit)return!1}else c.trigger("appear"),b=0})}var h,i=this,j={threshold:0,failure_limit:0,event:"scroll",effect:"show",container:b,data_attribute:"original",skip_invisible:!0,appear:null,load:null,placeholder:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"};return f&&(d!==f.failurelimit&&(f.failure_limit=f.failurelimit,delete f.failurelimit),d!==f.effectspeed&&(f.effect_speed=f.effectspeed,delete f.effectspeed),a.extend(j,f)),h=j.container===d||j.container===b?e:a(j.container),0===j.event.indexOf("scroll")&&h.bind(j.event,function(){return g()}),this.each(function(){var b=this,c=a(b);b.loaded=!1,(c.attr("src")===d||c.attr("src")===!1)&&c.is("img")&&c.attr("src",j.placeholder),c.one("appear",function(){if(!this.loaded){if(j.appear){var d=i.length;j.appear.call(b,d,j)}a("<img />").bind("load",function(){var d=c.attr("data-"+j.data_attribute);c.hide(),c.is("img")?c.attr("src",d):c.css("background-image","url('"+d+"')"),c[j.effect](j.effect_speed),b.loaded=!0;var e=a.grep(i,function(a){return!a.loaded});if(i=a(e),j.load){var f=i.length;j.load.call(b,f,j)}}).attr("src",c.attr("data-"+j.data_attribute))}}),0!==j.event.indexOf("scroll")&&c.bind(j.event,function(){b.loaded||c.trigger("appear")})}),e.bind("resize",function(){g()}),/(?:iphone|ipod|ipad).*os 5/gi.test(navigator.appVersion)&&e.bind("pageshow",function(b){b.originalEvent&&b.originalEvent.persisted&&i.each(function(){a(this).trigger("appear")})}),a(c).ready(function(){g()}),this},a.belowthefold=function(c,f){var g;return g=f.container===d||f.container===b?(b.innerHeight?b.innerHeight:e.height())+e.scrollTop():a(f.container).offset().top+a(f.container).height(),g<=a(c).offset().top-f.threshold},a.rightoffold=function(c,f){var g;return g=f.container===d||f.container===b?e.width()+e.scrollLeft():a(f.container).offset().left+a(f.container).width(),g<=a(c).offset().left-f.threshold},a.abovethetop=function(c,f){var g;return g=f.container===d||f.container===b?e.scrollTop():a(f.container).offset().top,g>=a(c).offset().top+f.threshold+a(c).height()},a.leftofbegin=function(c,f){var g;return g=f.container===d||f.container===b?e.scrollLeft():a(f.container).offset().left,g>=a(c).offset().left+f.threshold+a(c).width()},a.inviewport=function(b,c){return!(a.rightoffold(b,c)||a.leftofbegin(b,c)||a.belowthefold(b,c)||a.abovethetop(b,c))},a.extend(a.expr[":"],{"below-the-fold":function(b){return a.belowthefold(b,{threshold:0})},"above-the-top":function(b){return!a.belowthefold(b,{threshold:0})},"right-of-screen":function(b){return a.rightoffold(b,{threshold:0})},"left-of-screen":function(b){return!a.rightoffold(b,{threshold:0})},"in-viewport":function(b){return a.inviewport(b,{threshold:0})},"above-the-fold":function(b){return!a.belowthefold(b,{threshold:0})},"right-of-fold":function(b){return a.rightoffold(b,{threshold:0})},"left-of-fold":function(b){return!a.rightoffold(b,{threshold:0})}})}(jQuery,window,document);/**
 * @author 愚人码头& T'ing Hsi
 参数名	参数值(默认值可以省略)
 effect : {
    scroolY（默认）：垂直滚动
    scroolX：水平滚动
    scroolTxt：文本垂直滚动
    fade：淡出
    scroolLoop：水平左右点击滚动
}
 autoPlay	true（默认）： or false
 speed	动画速度时间，默认"normal"，可以使用毫秒或者JQ中的fast，slow，normal
 timer	滚动间隔时间，默认"1000，可以使用毫秒或者JQ中的fast，slow，normal
 claNav	JQ-slide-nav（默认）：触点对象数组父级
 claCon	JQ-slide-content（默认）：滚动对象或滚动对象父级
 steps	1（默认）：滚动几个
 childSize : 1（默认）： 一行几个
 mul : 滚动li高度的倍数
 */
(function($){
    $.fn.Slide=function(options){
        var opts = $.extend({},$.fn.Slide.deflunt,options);
        var index=1;
        var ContentBox = $("." + opts.claCon , $(this));//滚动的对象
        var ContentBoxNum = Math.ceil(ContentBox.children().size()/opts.childSize);//滚动对象的子元素个数
        var slideH=ContentBox.children().first().outerHeight(true);//滚动对象的子元素个数高度，相当于滚动的高度
        var slideW=ContentBox.children().first().outerWidth(true);//滚动对象的子元素宽度，相当于滚动的宽度
        var targetBox = $("." + opts.claNav, $(this));//目标对象
        if(targetBox.html() == ''){
            targetBox.html((function(){
                var temp = [];
                for(var i = 0,len=Math.ceil(ContentBox.children().size()/opts.childSize);i<len;i++){
                    temp.push(i==0 ? '<li class="on">1</li>' : '<li>'+(i+1)+'</li>');
                }
                return temp;
            })());
        }
        var targetLi = $("." + opts.claNav + " li", $(this));//目标对象
        var clickNext = $("." + opts.claNav + " .next", $(this));//点击下一个按钮
        var clickPrev = $("." + opts.claNav + " .prev", $(this));//点击上一个按钮

        var autoPlay;
        var slideWH;
        if(opts.effect=="scroolY"||opts.effect=="scroolTxt"){
            slideWH=slideH;
        }else if(opts.effect=="scroolX"||opts.effect=="scroolLoop"){
            ContentBox.css("width",ContentBoxNum*slideW);
            slideWH=slideW;
        }else if(opts.effect=="fade"){
            ContentBox.children().first().css("z-index","1");
        }

        return this.each(function() {
            var $this=$(this);
            //滚动函数
            var doPlay=function(){
                $.fn.Slide.effect[opts.effect](ContentBox, targetLi, index, slideWH, opts);
                index ++;

                if (index * opts.steps >= ContentBoxNum) {
                    index = 0;
                }
            };
            clickNext.click(function(event){
                $.fn.Slide.effectLoop.scroolLeft(ContentBox, targetLi, index, slideWH, opts,function(){
                    for(var i=0;i<opts.steps;i++){
                        ContentBox.find("li:first",$this).appendTo(ContentBox);
                    }
                    ContentBox.css({"left":"0"});
                });
                event.preventDefault();
            });
            clickPrev.click(function(event){
                for(var i=0;i<opts.steps;i++){
                    ContentBox.find("li:last").prependTo(ContentBox);
                }
                ContentBox.css({"left":-index*opts.steps*slideW});
                $.fn.Slide.effectLoop.scroolRight(ContentBox, targetLi, index, slideWH, opts);
                event.preventDefault();
            });
            //自动播放
            if (opts.autoPlay) {
                autoPlay = setInterval(doPlay, opts.timer);
                ContentBox.hover(function(){
                    if(autoPlay){
                        clearInterval(autoPlay);
                    }
                },function(){
                    if(autoPlay){
                        clearInterval(autoPlay);
                    }
                    autoPlay=setInterval(doPlay, opts.timer);
                });
            }

            //目标事件
            targetLi.hover(function(){
                if(autoPlay){
                    clearInterval(autoPlay);
                }
                index=targetLi.index(this);
                window.setTimeout(function(){$.fn.Slide.effect[opts.effect](ContentBox, targetLi, index, slideWH, opts);},200);

            },function(){
                if(autoPlay){
                    clearInterval(autoPlay);
                }
                autoPlay = setInterval(doPlay, opts.timer);
            });
        });
    };
    $.fn.Slide.deflunt={
        effect : "scroolY",
        autoPlay:true,
        speed : "normal",
        timer : 1000,
        defIndex : 0,
        claNav:"JQ-slide-nav",
        claCon:"JQ-slide-content",
        steps:1,
        childSize:1,
        mul:1
    };
    $.fn.Slide.effectLoop={
        scroolLeft:function(contentObj,navObj,i,slideW,opts,callback){
            contentObj.animate({"left":-i*opts.steps*slideW},opts.speed,callback);
            if (navObj) {
                navObj.eq(i).addClass("on").siblings().removeClass("on");
            }
        },

        scroolRight:function(contentObj,navObj,i,slideW,opts,callback){
            contentObj.stop().animate({"left":0},opts.speed,callback);

        }
    }
    $.fn.Slide.effect={
        fade:function(contentObj,navObj,i,slideW,opts){
            contentObj.children().eq(i).stop().animate({opacity:1},opts.speed).css({"z-index": "1"}).siblings().animate({opacity: 0},opts.speed).css({"z-index":"0"});
            navObj.eq(i).addClass("on").siblings().removeClass("on");
        },
        scroolTxt:function(contentObj,undefined,i,slideH,opts){
            //alert(i*opts.steps*slideH);
            contentObj.animate({"margin-top":-opts.steps*slideH},opts.speed,function(){
                for( var j=0;j<opts.steps;j++){
                    contentObj.find("li:first").appendTo(contentObj);
                }
                contentObj.css({"margin-top":"0"});
            });
        },
        scroolX:function(contentObj,navObj,i,slideW,opts,callback){
            contentObj.stop().animate({"left":-i*opts.steps*slideW},opts.speed,callback);
            if (navObj) {
                navObj.eq(i).addClass("on").siblings().removeClass("on");
            }
        },
        scroolY:function(contentObj,navObj,i,slideH,opts){
            contentObj.stop().animate({"top":-i*opts.steps*slideH*opts.mul},opts.speed);
            if (navObj) {
                navObj.eq(i).addClass("on").siblings().removeClass("on");
            }
        }
    };
})(jQuery);jQuery(function(){
    var JPlaceHolder = {
        //检测
        _check : function(){
            return 'placeholder' in document.createElement('input');
        },
        //初始化
        init : function(){
            if(!this._check()){
                this.fix();
            }
        },
        //修复
        fix : function(){
            jQuery('input[placeholder]').each(function(index, element) {
                var self = $(this), txt = self.attr('placeholder');

                var elementId = self.attr('id');
                if (!elementId) {
                    var now = new Date();
                    elementId = 'lbl_placeholder' + now.getSeconds() + now.getMilliseconds();
                    self.attr('id', elementId);
                }


                self.wrap($('<div></div>').addClass('labelWrap').css({position:'relative', zoom:'1', border:'none', background:'none', padding:'none', margin:'none',display:'inline-block'}));
                var pos = self.position(), h = self.outerHeight(true), paddingleft = self.css('padding-left');
                var holder = $('<label for="'+elementId+'"></label>').text(txt).css({position:'absolute', left:pos.left+10, top:pos.top, height:h, 'line-height':h+'px', paddingLeft:paddingleft, color:'#aaa',whiteSpace:'nowrap',cursor:'text'}).appendTo(self.parent());
                self.focusin(function(e) {
                    holder.hide();
                }).focusout(function(e) {
                    if(!self.val()){
                        holder.show();
                    }
                });
                //如果input本身value有值
                if(self.val()!=""){ holder.hide(); }
            });
        }
    };
    //执行
    var ua = navigator.userAgent.toLowerCase();
    if (window.ActiveXObject) {
        var ieVersion = ua.match(/msie ([\d.]+)/)[1];
        if (ieVersion < 10) {
            JPlaceHolder.init();
        }
    }
});/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            // If we can't parse the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
            return config.json ? JSON.parse(s) : s;
        } catch(e) {}
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }

    var config = $.cookie = function (key, value, options) {

        // Write

        if (value !== undefined && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setTime(+t + days * 864e+5);
            }

            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {};

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling $.cookie().
        var cookies = document.cookie ? document.cookie.split('; ') : [];

        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');

            if (key && key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) === undefined) {
            return false;
        }

        // Must not alter options, thus extending a fresh object...
        $.cookie(key, '', $.extend({}, options, { expires: -1 }));
        return !$.cookie(key);
    };

}));
/*! Sea.js 2.3.0 | seajs.org/LICENSE.md */
!function(a,b){function c(a){return function(b){return{}.toString.call(b)=="[object "+a+"]"}}function d(){return z++}function e(a){return a.match(C)[0]}function f(a){for(a=a.replace(D,"/"),a=a.replace(F,"$1/");a.match(E);)a=a.replace(E,"/");return a}function g(a){var b=a.length-1,c=a.charAt(b);return"#"===c?a.substring(0,b):".js"===a.substring(b-2)||a.indexOf("?")>0||"/"===c?a:a+".js"}function h(a){var b=u.alias;return b&&w(b[a])?b[a]:a}function i(a){var b=u.paths,c;return b&&(c=a.match(G))&&w(b[c[1]])&&(a=b[c[1]]+c[2]),a}function j(a){var b=u.vars;return b&&a.indexOf("{")>-1&&(a=a.replace(H,function(a,c){return w(b[c])?b[c]:a})),a}function k(a){var b=u.map,c=a;if(b)for(var d=0,e=b.length;e>d;d++){var f=b[d];if(c=y(f)?f(a)||a:a.replace(f[0],f[1]),c!==a)break}return c}function l(a,b){var c,d=a.charAt(0);if(I.test(a))c=a;else if("."===d)c=f((b?e(b):u.cwd)+a);else if("/"===d){var g=u.cwd.match(J);c=g?g[0]+a.substring(1):a}else c=u.base+a;return 0===c.indexOf("//")&&(c=location.protocol+c),c}function m(a,b){if(!a)return"";a=h(a),a=i(a),a=j(a),a=g(a);var c=l(a,b);return c=k(c)}function n(a){return a.hasAttribute?a.src:a.getAttribute("src",4)}function o(a,b,c){var d=K.createElement("script");if(c){var e=y(c)?c(a):c;e&&(d.charset=e)}p(d,b,a),d.async=!0,d.src=a,R=d,Q?P.insertBefore(d,Q):P.appendChild(d),R=null}function p(a,b,c){function d(){a.onload=a.onerror=a.onreadystatechange=null,u.debug||P.removeChild(a),a=null,b()}var e="onload"in a;e?(a.onload=d,a.onerror=function(){B("error",{uri:c,node:a}),d()}):a.onreadystatechange=function(){/loaded|complete/.test(a.readyState)&&d()}}function q(){if(R)return R;if(S&&"interactive"===S.readyState)return S;for(var a=P.getElementsByTagName("script"),b=a.length-1;b>=0;b--){var c=a[b];if("interactive"===c.readyState)return S=c}}function r(a){var b=[];return a.replace(U,"").replace(T,function(a,c,d){d&&b.push(d)}),b}function s(a,b){this.uri=a,this.dependencies=b||[],this.exports=null,this.status=0,this._waitings={},this._remain=0}if(!a.seajs){var t=a.seajs={version:"2.3.0"},u=t.data={},v=c("Object"),w=c("String"),x=Array.isArray||c("Array"),y=c("Function"),z=0,A=u.events={};t.on=function(a,b){var c=A[a]||(A[a]=[]);return c.push(b),t},t.off=function(a,b){if(!a&&!b)return A=u.events={},t;var c=A[a];if(c)if(b)for(var d=c.length-1;d>=0;d--)c[d]===b&&c.splice(d,1);else delete A[a];return t};var B=t.emit=function(a,b){var c=A[a],d;if(c){c=c.slice();for(var e=0,f=c.length;f>e;e++)c[e](b)}return t},C=/[^?#]*\//,D=/\/\.\//g,E=/\/[^/]+\/\.\.\//,F=/([^:/])\/+\//g,G=/^([^/:]+)(\/.+)$/,H=/{([^{]+)}/g,I=/^\/\/.|:\//,J=/^.*?\/\/.*?\//,K=document,L=location.href&&0!==location.href.indexOf("about:")?e(location.href):"",M=K.scripts,N=K.getElementById("seajsnode")||M[M.length-1],O=e(n(N)||L);t.resolve=m;var P=K.head||K.getElementsByTagName("head")[0]||K.documentElement,Q=P.getElementsByTagName("base")[0],R,S;t.request=o;var T=/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g,U=/\\\\/g,V=t.cache={},W,X={},Y={},Z={},$=s.STATUS={FETCHING:1,SAVED:2,LOADING:3,LOADED:4,EXECUTING:5,EXECUTED:6};s.prototype.resolve=function(){for(var a=this,b=a.dependencies,c=[],d=0,e=b.length;e>d;d++)c[d]=s.resolve(b[d],a.uri);return c},s.prototype.load=function(){var a=this;if(!(a.status>=$.LOADING)){a.status=$.LOADING;var c=a.resolve();B("load",c);for(var d=a._remain=c.length,e,f=0;d>f;f++)e=s.get(c[f]),e.status<$.LOADED?e._waitings[a.uri]=(e._waitings[a.uri]||0)+1:a._remain--;if(0===a._remain)return a.onload(),b;var g={};for(f=0;d>f;f++)e=V[c[f]],e.status<$.FETCHING?e.fetch(g):e.status===$.SAVED&&e.load();for(var h in g)g.hasOwnProperty(h)&&g[h]()}},s.prototype.onload=function(){var a=this;a.status=$.LOADED,a.callback&&a.callback();var b=a._waitings,c,d;for(c in b)b.hasOwnProperty(c)&&(d=V[c],d._remain-=b[c],0===d._remain&&d.onload());delete a._waitings,delete a._remain},s.prototype.fetch=function(a){function c(){t.request(g.requestUri,g.onRequest,g.charset)}function d(){delete X[h],Y[h]=!0,W&&(s.save(f,W),W=null);var a,b=Z[h];for(delete Z[h];a=b.shift();)a.load()}var e=this,f=e.uri;e.status=$.FETCHING;var g={uri:f};B("fetch",g);var h=g.requestUri||f;return!h||Y[h]?(e.load(),b):X[h]?(Z[h].push(e),b):(X[h]=!0,Z[h]=[e],B("request",g={uri:f,requestUri:h,onRequest:d,charset:u.charset}),g.requested||(a?a[g.requestUri]=c:c()),b)},s.prototype.exec=function(){function a(b){return s.get(a.resolve(b)).exec()}var c=this;if(c.status>=$.EXECUTING)return c.exports;c.status=$.EXECUTING;var e=c.uri;a.resolve=function(a){return s.resolve(a,e)},a.async=function(b,c){return s.use(b,c,e+"_async_"+d()),a};var f=c.factory,g=y(f)?f(a,c.exports={},c):f;return g===b&&(g=c.exports),delete c.factory,c.exports=g,c.status=$.EXECUTED,B("exec",c),g},s.resolve=function(a,b){var c={id:a,refUri:b};return B("resolve",c),c.uri||t.resolve(c.id,b)},s.define=function(a,c,d){var e=arguments.length;1===e?(d=a,a=b):2===e&&(d=c,x(a)?(c=a,a=b):c=b),!x(c)&&y(d)&&(c=r(""+d));var f={id:a,uri:s.resolve(a),deps:c,factory:d};if(!f.uri&&K.attachEvent){var g=q();g&&(f.uri=g.src)}B("define",f),f.uri?s.save(f.uri,f):W=f},s.save=function(a,b){var c=s.get(a);c.status<$.SAVED&&(c.id=b.id||a,c.dependencies=b.deps||[],c.factory=b.factory,c.status=$.SAVED,B("save",c))},s.get=function(a,b){return V[a]||(V[a]=new s(a,b))},s.use=function(b,c,d){var e=s.get(d,x(b)?b:[b]);e.callback=function(){for(var b=[],d=e.resolve(),f=0,g=d.length;g>f;f++)b[f]=V[d[f]].exec();c&&c.apply(a,b),delete e.callback},e.load()},t.use=function(a,b){return s.use(a,b,u.cwd+"_use_"+d()),t},s.define.cmd={},a.define=s.define,t.Module=s,u.fetchedList=Y,u.cid=d,t.require=function(a){var b=s.get(s.resolve(a));return b.status<$.EXECUTING&&(b.onload(),b.exec()),b.exports},u.base=O,u.dir=O,u.cwd=L,u.charset="utf-8",t.config=function(a){for(var b in a){var c=a[b],d=u[b];if(d&&v(d))for(var e in c)d[e]=c[e];else x(d)?c=d.concat(c):"base"===b&&("/"!==c.slice(-1)&&(c+="/"),c=l(c)),u[b]=c}return B("config",a),t}}}(this);
!function(){function a(a){return function(b){return{}.toString.call(b)=="[object "+a+"]"}}function b(a){return"[object Function]"=={}.toString.call(a)}function c(a,c,e){var f=u.test(a),g=r.createElement(f?"link":"script");if(e){var h=b(e)?e(a):e;h&&(g.charset=h)}d(g,c,f,a),f?(g.rel="stylesheet",g.href=a):(g.async=!0,g.src=a),p=g,t?s.insertBefore(g,t):s.appendChild(g),p=null}function d(a,b,c,d){function f(){a.onload=a.onerror=a.onreadystatechange=null,c||seajs.data.debug||s.removeChild(a),a=null,b()}var g="onload"in a;return!c||!v&&g?(g?(a.onload=f,a.onerror=function(){seajs.emit("error",{uri:d,node:a}),f()}):a.onreadystatechange=function(){/loaded|complete/.test(a.readyState)&&f()},void 0):(setTimeout(function(){e(a,b)},1),void 0)}function e(a,b){var c,d=a.sheet;if(v)d&&(c=!0);else if(d)try{d.cssRules&&(c=!0)}catch(f){"NS_ERROR_DOM_SECURITY_ERR"===f.name&&(c=!0)}setTimeout(function(){c?b():e(a,b)},20)}function f(a){return a.match(x)[0]}function g(a){for(a=a.replace(y,"/"),a=a.replace(A,"$1/");a.match(z);)a=a.replace(z,"/");return a}function h(a){var b=a.length-1,c=a.charAt(b);return"#"===c?a.substring(0,b):".js"===a.substring(b-2)||a.indexOf("?")>0||".css"===a.substring(b-3)||"/"===c?a:a+".js"}function i(a){var b=w.alias;return b&&q(b[a])?b[a]:a}function j(a){var b,c=w.paths;return c&&(b=a.match(B))&&q(c[b[1]])&&(a=c[b[1]]+b[2]),a}function k(a){var b=w.vars;return b&&a.indexOf("{")>-1&&(a=a.replace(C,function(a,c){return q(b[c])?b[c]:a})),a}function l(a){var c=w.map,d=a;if(c)for(var e=0,f=c.length;f>e;e++){var g=c[e];if(d=b(g)?g(a)||a:a.replace(g[0],g[1]),d!==a)break}return d}function m(a,b){var c,d=a.charAt(0);if(D.test(a))c=a;else if("."===d)c=g((b?f(b):w.cwd)+a);else if("/"===d){var e=w.cwd.match(E);c=e?e[0]+a.substring(1):a}else c=w.base+a;return 0===c.indexOf("//")&&(c=location.protocol+c),c}function n(a,b){if(!a)return"";a=i(a),a=j(a),a=k(a),a=h(a);var c=m(a,b);return c=l(c)}function o(a){return a.hasAttribute?a.src:a.getAttribute("src",4)}var p,q=a("String"),r=document,s=r.head||r.getElementsByTagName("head")[0]||r.documentElement,t=s.getElementsByTagName("base")[0],u=/\.css(?:\?|$)/i,v=+navigator.userAgent.replace(/.*(?:AppleWebKit|AndroidWebKit)\/(\d+).*/,"$1")<536;seajs.request=c;var w=seajs.data,x=/[^?#]*\//,y=/\/\.\//g,z=/\/[^/]+\/\.\.\//,A=/([^:/])\/+\//g,B=/^([^/:]+)(\/.+)$/,C=/{([^{]+)}/g,D=/^\/\/.|:\//,E=/^.*?\/\/.*?\//,r=document,F=location.href&&0!==location.href.indexOf("about:")?f(location.href):"",G=r.scripts,H=r.getElementById("seajsnode")||G[G.length-1];f(o(H)||F),seajs.resolve=n,define("seajs/seajs-css/1.0.3/seajs-css",[],{})}();/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-fontface-backgroundsize-borderimage-borderradius-boxshadow-flexbox-hsla-multiplebgs-opacity-rgba-textshadow-cssanimations-csscolumns-generatedcontent-cssgradients-cssreflections-csstransforms-csstransforms3d-csstransitions-applicationcache-canvas-canvastext-draganddrop-hashchange-history-audio-video-indexeddb-input-inputtypes-localstorage-postmessage-sessionstorage-websockets-websqldatabase-webworkers-geolocation-inlinesvg-smil-svg-svgclippaths-touch-webgl-shiv-mq-cssclasses-addtest-prefixed-teststyles-testprop-testallprops-hasevent-prefixes-domprefixes-load
 */
;
window.Modernizr = function (a, b, c) {
    function D(a) {
        j.cssText = a
    }

    function E(a, b) {
        return D(n.join(a + ";") + (b || ""))
    }

    function F(a, b) {
        return typeof a === b
    }

    function G(a, b) {
        return !!~("" + a).indexOf(b)
    }

    function H(a, b) {
        for (var d in a) {
            var e = a[d];
            if (!G(e, "-") && j[e] !== c)return b == "pfx" ? e : !0
        }
        return !1
    }

    function I(a, b, d) {
        for (var e in a) {
            var f = b[a[e]];
            if (f !== c)return d === !1 ? a[e] : F(f, "function") ? f.bind(d || b) : f
        }
        return !1
    }

    function J(a, b, c) {
        var d = a.charAt(0).toUpperCase() + a.slice(1), e = (a + " " + p.join(d + " ") + d).split(" ");
        return F(b, "string") || F(b, "undefined") ? H(e, b) : (e = (a + " " + q.join(d + " ") + d).split(" "), I(e, b, c))
    }

    function K() {
        e.input = function (c) {
            for (var d = 0, e = c.length; d < e; d++)u[c[d]] = c[d]in k;
            return u.list && (u.list = !!b.createElement("datalist") && !!a.HTMLDataListElement), u
        }("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")), e.inputtypes = function (a) {
            for (var d = 0, e, f, h, i = a.length; d < i; d++)k.setAttribute("type", f = a[d]), e = k.type !== "text", e && (k.value = l, k.style.cssText = "position:absolute;visibility:hidden;", /^range$/.test(f) && k.style.WebkitAppearance !== c ? (g.appendChild(k), h = b.defaultView, e = h.getComputedStyle && h.getComputedStyle(k, null).WebkitAppearance !== "textfield" && k.offsetHeight !== 0, g.removeChild(k)) : /^(search|tel)$/.test(f) || (/^(url|email)$/.test(f) ? e = k.checkValidity && k.checkValidity() === !1 : e = k.value != l)), t[a[d]] = !!e;
            return t
        }("search tel url email datetime date month week time datetime-local number range color".split(" "))
    }

    var d = "2.6.2", e = {}, f = !0, g = b.documentElement, h = "modernizr", i = b.createElement(h), j = i.style, k = b.createElement("input"), l = ":)", m = {}.toString, n = " -webkit- -moz- -o- -ms- ".split(" "), o = "Webkit Moz O ms", p = o.split(" "), q = o.toLowerCase().split(" "), r = {svg: "http://www.w3.org/2000/svg"}, s = {}, t = {}, u = {}, v = [], w = v.slice, x, y = function (a, c, d, e) {
        var f, i, j, k, l = b.createElement("div"), m = b.body, n = m || b.createElement("body");
        if (parseInt(d, 10))while (d--)j = b.createElement("div"), j.id = e ? e[d] : h + (d + 1), l.appendChild(j);
        return f = ["&#173;", '<style id="s', h, '">', a, "</style>"].join(""), l.id = h, (m ? l : n).innerHTML += f, n.appendChild(l), m || (n.style.background = "", n.style.overflow = "hidden", k = g.style.overflow, g.style.overflow = "hidden", g.appendChild(n)), i = c(l, a), m ? l.parentNode.removeChild(l) : (n.parentNode.removeChild(n), g.style.overflow = k), !!i
    }, z = function (b) {
        var c = a.matchMedia || a.msMatchMedia;
        if (c)return c(b).matches;
        var d;
        return y("@media " + b + " { #" + h + " { position: absolute; } }", function (b) {
            d = (a.getComputedStyle ? getComputedStyle(b, null) : b.currentStyle)["position"] == "absolute"
        }), d
    }, A = function () {
        function d(d, e) {
            e = e || b.createElement(a[d] || "div"), d = "on" + d;
            var f = d in e;
            return f || (e.setAttribute || (e = b.createElement("div")), e.setAttribute && e.removeAttribute && (e.setAttribute(d, ""), f = F(e[d], "function"), F(e[d], "undefined") || (e[d] = c), e.removeAttribute(d))), e = null, f
        }

        var a = {
            select: "input",
            change: "input",
            submit: "form",
            reset: "form",
            error: "img",
            load: "img",
            abort: "img"
        };
        return d
    }(), B = {}.hasOwnProperty, C;
    !F(B, "undefined") && !F(B.call, "undefined") ? C = function (a, b) {
        return B.call(a, b)
    } : C = function (a, b) {
        return b in a && F(a.constructor.prototype[b], "undefined")
    }, Function.prototype.bind || (Function.prototype.bind = function (b) {
        var c = this;
        if (typeof c != "function")throw new TypeError;
        var d = w.call(arguments, 1), e = function () {
            if (this instanceof e) {
                var a = function () {
                };
                a.prototype = c.prototype;
                var f = new a, g = c.apply(f, d.concat(w.call(arguments)));
                return Object(g) === g ? g : f
            }
            return c.apply(b, d.concat(w.call(arguments)))
        };
        return e
    }), s.flexbox = function () {
        return J("flexWrap")
    }, s.canvas = function () {
        var a = b.createElement("canvas");
        return !!a.getContext && !!a.getContext("2d")
    }, s.canvastext = function () {
        return !!e.canvas && !!F(b.createElement("canvas").getContext("2d").fillText, "function")
    }, s.webgl = function () {
        return !!a.WebGLRenderingContext
    }, s.touch = function () {
        var c;
        return "ontouchstart"in a || a.DocumentTouch && b instanceof DocumentTouch ? c = !0 : y(["@media (", n.join("touch-enabled),("), h, ")", "{#modernizr{top:9px;position:absolute}}"].join(""), function (a) {
            c = a.offsetTop === 9
        }), c
    }, s.geolocation = function () {
        return "geolocation"in navigator
    }, s.postmessage = function () {
        return !!a.postMessage
    }, s.websqldatabase = function () {
        return !!a.openDatabase
    }, s.indexedDB = function () {
        return !!J("indexedDB", a)
    }, s.hashchange = function () {
        return A("hashchange", a) && (b.documentMode === c || b.documentMode > 7)
    }, s.history = function () {
        return !!a.history && !!history.pushState
    }, s.draganddrop = function () {
        var a = b.createElement("div");
        return "draggable"in a || "ondragstart"in a && "ondrop"in a
    }, s.websockets = function () {
        return "WebSocket"in a || "MozWebSocket"in a
    }, s.rgba = function () {
        return D("background-color:rgba(150,255,150,.5)"), G(j.backgroundColor, "rgba")
    }, s.hsla = function () {
        return D("background-color:hsla(120,40%,100%,.5)"), G(j.backgroundColor, "rgba") || G(j.backgroundColor, "hsla")
    }, s.multiplebgs = function () {
        return D("background:url(https://),url(https://),red url(https://)"), /(url\s*\(.*?){3}/.test(j.background)
    }, s.backgroundsize = function () {
        return J("backgroundSize")
    }, s.borderimage = function () {
        return J("borderImage")
    }, s.borderradius = function () {
        return J("borderRadius")
    }, s.boxshadow = function () {
        return J("boxShadow")
    }, s.textshadow = function () {
        return b.createElement("div").style.textShadow === ""
    }, s.opacity = function () {
        return E("opacity:.55"), /^0.55$/.test(j.opacity)
    }, s.cssanimations = function () {
        return J("animationName")
    }, s.csscolumns = function () {
        return J("columnCount")
    }, s.cssgradients = function () {
        var a = "background-image:", b = "gradient(linear,left top,right bottom,from(#9f9),to(white));", c = "linear-gradient(left top,#9f9, white);";
        return D((a + "-webkit- ".split(" ").join(b + a) + n.join(c + a)).slice(0, -a.length)), G(j.backgroundImage, "gradient")
    }, s.cssreflections = function () {
        return J("boxReflect")
    }, s.csstransforms = function () {
        return !!J("transform")
    }, s.csstransforms3d = function () {
        var a = !!J("perspective");
        return a && "webkitPerspective"in g.style && y("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}", function (b, c) {
            a = b.offsetLeft === 9 && b.offsetHeight === 3
        }), a
    }, s.csstransitions = function () {
        return J("transition")
    }, s.fontface = function () {
        var a;
        return y('@font-face {font-family:"font";src:url("https://")}', function (c, d) {
            var e = b.getElementById("smodernizr"), f = e.sheet || e.styleSheet, g = f ? f.cssRules && f.cssRules[0] ? f.cssRules[0].cssText : f.cssText || "" : "";
            a = /src/i.test(g) && g.indexOf(d.split(" ")[0]) === 0
        }), a
    }, s.generatedcontent = function () {
        var a;
        return y(["#", h, "{font:0/0 a}#", h, ':after{content:"', l, '";visibility:hidden;font:3px/1 a}'].join(""), function (b) {
            a = b.offsetHeight >= 3
        }), a
    }, s.video = function () {
        var a = b.createElement("video"), c = !1;
        try {
            if (c = !!a.canPlayType)c = new Boolean(c), c.ogg = a.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, ""), c.h264 = a.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, ""), c.webm = a.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, "")
        } catch (d) {
        }
        return c
    }, s.audio = function () {
        var a = b.createElement("audio"), c = !1;
        try {
            if (c = !!a.canPlayType)c = new Boolean(c), c.ogg = a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""), c.mp3 = a.canPlayType("audio/mpeg;").replace(/^no$/, ""), c.wav = a.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ""), c.m4a = (a.canPlayType("audio/x-m4a;") || a.canPlayType("audio/aac;")).replace(/^no$/, "")
        } catch (d) {
        }
        return c
    }, s.localstorage = function () {
        try {
            return localStorage.setItem(h, h), localStorage.removeItem(h), !0
        } catch (a) {
            return !1
        }
    }, s.sessionstorage = function () {
        try {
            return sessionStorage.setItem(h, h), sessionStorage.removeItem(h), !0
        } catch (a) {
            return !1
        }
    }, s.webworkers = function () {
        return !!a.Worker
    }, s.applicationcache = function () {
        return !!a.applicationCache
    }, s.svg = function () {
        return !!b.createElementNS && !!b.createElementNS(r.svg, "svg").createSVGRect
    }, s.inlinesvg = function () {
        var a = b.createElement("div");
        return a.innerHTML = "<svg/>", (a.firstChild && a.firstChild.namespaceURI) == r.svg
    }, s.smil = function () {
        return !!b.createElementNS && /SVGAnimate/.test(m.call(b.createElementNS(r.svg, "animate")))
    }, s.svgclippaths = function () {
        return !!b.createElementNS && /SVGClipPath/.test(m.call(b.createElementNS(r.svg, "clipPath")))
    };
    for (var L in s)C(s, L) && (x = L.toLowerCase(), e[x] = s[L](), v.push((e[x] ? "" : "no-") + x));
    return e.input || K(), e.addTest = function (a, b) {
        if (typeof a == "object")for (var d in a)C(a, d) && e.addTest(d, a[d]); else {
            a = a.toLowerCase();
            if (e[a] !== c)return e;
            b = typeof b == "function" ? b() : b, typeof f != "undefined" && f && (g.className += " " + (b ? "" : "no-") + a), e[a] = b
        }
        return e
    }, D(""), i = k = null, function (a, b) {
        function k(a, b) {
            var c = a.createElement("p"), d = a.getElementsByTagName("head")[0] || a.documentElement;
            return c.innerHTML = "x<style>" + b + "</style>", d.insertBefore(c.lastChild, d.firstChild)
        }

        function l() {
            var a = r.elements;
            return typeof a == "string" ? a.split(" ") : a
        }

        function m(a) {
            var b = i[a[g]];
            return b || (b = {}, h++, a[g] = h, i[h] = b), b
        }

        function n(a, c, f) {
            c || (c = b);
            if (j)return c.createElement(a);
            f || (f = m(c));
            var g;
            return f.cache[a] ? g = f.cache[a].cloneNode() : e.test(a) ? g = (f.cache[a] = f.createElem(a)).cloneNode() : g = f.createElem(a), g.canHaveChildren && !d.test(a) ? f.frag.appendChild(g) : g
        }

        function o(a, c) {
            a || (a = b);
            if (j)return a.createDocumentFragment();
            c = c || m(a);
            var d = c.frag.cloneNode(), e = 0, f = l(), g = f.length;
            for (; e < g; e++)d.createElement(f[e]);
            return d
        }

        function p(a, b) {
            b.cache || (b.cache = {}, b.createElem = a.createElement, b.createFrag = a.createDocumentFragment, b.frag = b.createFrag()), a.createElement = function (c) {
                return r.shivMethods ? n(c, a, b) : b.createElem(c)
            }, a.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + l().join().replace(/\w+/g, function (a) {
                    return b.createElem(a), b.frag.createElement(a), 'c("' + a + '")'
                }) + ");return n}")(r, b.frag)
        }

        function q(a) {
            a || (a = b);
            var c = m(a);
            return r.shivCSS && !f && !c.hasCSS && (c.hasCSS = !!k(a, "article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")), j || p(a, c), a
        }

        var c = a.html5 || {}, d = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i, e = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i, f, g = "_html5shiv", h = 0, i = {}, j;
        (function () {
            try {
                var a = b.createElement("a");
                a.innerHTML = "<xyz></xyz>", f = "hidden"in a, j = a.childNodes.length == 1 || function () {
                        b.createElement("a");
                        var a = b.createDocumentFragment();
                        return typeof a.cloneNode == "undefined" || typeof a.createDocumentFragment == "undefined" || typeof a.createElement == "undefined"
                    }()
            } catch (c) {
                f = !0, j = !0
            }
        })();
        var r = {
            elements: c.elements || "abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",
            shivCSS: c.shivCSS !== !1,
            supportsUnknownElements: j,
            shivMethods: c.shivMethods !== !1,
            type: "default",
            shivDocument: q,
            createElement: n,
            createDocumentFragment: o
        };
        a.html5 = r, q(b)
    }(this, b), e._version = d, e._prefixes = n, e._domPrefixes = q, e._cssomPrefixes = p, e.mq = z, e.hasEvent = A, e.testProp = function (a) {
        return H([a])
    }, e.testAllProps = J, e.testStyles = y, e.prefixed = function (a, b, c) {
        return b ? J(a, b, c) : J(a, "pfx")
    }, g.className = g.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (f ? " js " + v.join(" ") : ""), e
}(this, this.document), function (a, b, c) {
    function d(a) {
        return "[object Function]" == o.call(a)
    }

    function e(a) {
        return "string" == typeof a
    }

    function f() {
    }

    function g(a) {
        return !a || "loaded" == a || "complete" == a || "uninitialized" == a
    }

    function h() {
        var a = p.shift();
        q = 1, a ? a.t ? m(function () {
            ("c" == a.t ? B.injectCss : B.injectJs)(a.s, 0, a.a, a.x, a.e, 1)
        }, 0) : (a(), h()) : q = 0
    }

    function i(a, c, d, e, f, i, j) {
        function k(b) {
            if (!o && g(l.readyState) && (u.r = o = 1, !q && h(), l.onload = l.onreadystatechange = null, b)) {
                "img" != a && m(function () {
                    t.removeChild(l)
                }, 50);
                for (var d in y[c])y[c].hasOwnProperty(d) && y[c][d].onload()
            }
        }

        var j = j || B.errorTimeout, l = b.createElement(a), o = 0, r = 0, u = {t: d, s: c, e: f, a: i, x: j};
        1 === y[c] && (r = 1, y[c] = []), "object" == a ? l.data = c : (l.src = c, l.type = a), l.width = l.height = "0", l.onerror = l.onload = l.onreadystatechange = function () {
            k.call(this, r)
        }, p.splice(e, 0, u), "img" != a && (r || 2 === y[c] ? (t.insertBefore(l, s ? null : n), m(k, j)) : y[c].push(l))
    }

    function j(a, b, c, d, f) {
        return q = 0, b = b || "j", e(a) ? i("c" == b ? v : u, a, b, this.i++, c, d, f) : (p.splice(this.i++, 0, a), 1 == p.length && h()), this
    }

    function k() {
        var a = B;
        return a.loader = {load: j, i: 0}, a
    }

    var l = b.documentElement, m = a.setTimeout, n = b.getElementsByTagName("script")[0], o = {}.toString, p = [], q = 0, r = "MozAppearance"in l.style, s = r && !!b.createRange().compareNode, t = s ? l : n.parentNode, l = a.opera && "[object Opera]" == o.call(a.opera), l = !!b.attachEvent && !l, u = r ? "object" : l ? "script" : "img", v = l ? "script" : u, w = Array.isArray || function (a) {
            return "[object Array]" == o.call(a)
        }, x = [], y = {}, z = {
        timeout: function (a, b) {
            return b.length && (a.timeout = b[0]), a
        }
    }, A, B;
    B = function (a) {
        function b(a) {
            var a = a.split("!"), b = x.length, c = a.pop(), d = a.length, c = {
                url: c,
                origUrl: c,
                prefixes: a
            }, e, f, g;
            for (f = 0; f < d; f++)g = a[f].split("="), (e = z[g.shift()]) && (c = e(c, g));
            for (f = 0; f < b; f++)c = x[f](c);
            return c
        }

        function g(a, e, f, g, h) {
            var i = b(a), j = i.autoCallback;
            i.url.split(".").pop().split("?").shift(), i.bypass || (e && (e = d(e) ? e : e[a] || e[g] || e[a.split("/").pop().split("?")[0]]), i.instead ? i.instead(a, e, f, g, h) : (y[i.url] ? i.noexec = !0 : y[i.url] = 1, f.load(i.url, i.forceCSS || !i.forceJS && "css" == i.url.split(".").pop().split("?").shift() ? "c" : c, i.noexec, i.attrs, i.timeout), (d(e) || d(j)) && f.load(function () {
                k(), e && e(i.origUrl, h, g), j && j(i.origUrl, h, g), y[i.url] = 2
            })))
        }

        function h(a, b) {
            function c(a, c) {
                if (a) {
                    if (e(a))c || (j = function () {
                        var a = [].slice.call(arguments);
                        k.apply(this, a), l()
                    }), g(a, j, b, 0, h); else if (Object(a) === a)for (n in m = function () {
                        var b = 0, c;
                        for (c in a)a.hasOwnProperty(c) && b++;
                        return b
                    }(), a)a.hasOwnProperty(n) && (!c && !--m && (d(j) ? j = function () {
                        var a = [].slice.call(arguments);
                        k.apply(this, a), l()
                    } : j[n] = function (a) {
                        return function () {
                            var b = [].slice.call(arguments);
                            a && a.apply(this, b), l()
                        }
                    }(k[n])), g(a[n], j, b, n, h))
                } else!c && l()
            }

            var h = !!a.test, i = a.load || a.both, j = a.callback || f, k = j, l = a.complete || f, m, n;
            c(h ? a.yep : a.nope, !!i), i && c(i)
        }

        var i, j, l = this.yepnope.loader;
        if (e(a))g(a, 0, l, 0); else if (w(a))for (i = 0; i < a.length; i++)j = a[i], e(j) ? g(j, 0, l, 0) : w(j) ? B(j) : Object(j) === j && h(j, l); else Object(a) === a && h(a, l)
    }, B.addPrefix = function (a, b) {
        z[a] = b
    }, B.addFilter = function (a) {
        x.push(a)
    }, B.errorTimeout = 1e4, null == b.readyState && b.addEventListener && (b.readyState = "loading", b.addEventListener("DOMContentLoaded", A = function () {
        b.removeEventListener("DOMContentLoaded", A, 0), b.readyState = "complete"
    }, 0)), a.yepnope = k(), a.yepnope.executeStack = h, a.yepnope.injectJs = function (a, c, d, e, i, j) {
        var k = b.createElement("script"), l, o, e = e || B.errorTimeout;
        k.src = a;
        for (o in d)k.setAttribute(o, d[o]);
        c = j ? h : c || f, k.onreadystatechange = k.onload = function () {
            !l && g(k.readyState) && (l = 1, c(), k.onload = k.onreadystatechange = null)
        }, m(function () {
            l || (l = 1, c(1))
        }, e), i ? k.onload() : n.parentNode.insertBefore(k, n)
    }, a.yepnope.injectCss = function (a, c, d, e, g, i) {
        var e = b.createElement("link"), j, c = i ? h : c || f;
        e.href = a, e.rel = "stylesheet", e.type = "text/css";
        for (j in d)e.setAttribute(j, d[j]);
        g || (n.parentNode.insertBefore(e, n), m(c, 0))
    }
}(this, document), Modernizr.load = function () {
    yepnope.apply(window, [].slice.call(arguments, 0))
};
var imgAnimate = (function(data){

    var timer;

    var className = "img-a";

    var statusClass = "img-status";

    var max;

    function init(){
        var div = $("<div class='img-status'></div>");
        if(data){
            for(var a = 0; a < data.length; a++){
                $(".img-main").append($('<a href="' + data[a].link + '" target="_blank"><img title="' + data[a].title + '" src="' + data[a].imgUrl + '" /></a>'));
            }
        }
        max = $(".img-main a").each(function(index, value){

                $(this).addClass(className + index)
                    .data("index", index)
                    .css({"left": ($(".img-main").width() - 1920) / 2, "c-index": 0});

                var span = $("<span class='status-noselect'></span>")
                span.data("index", index)
                    .addClass("img-status" + index)
                    .addClass(index == 0 ? "status-select" : "status-noselect");

                div.append(span);
                span.hover(function(){
                    toImg(getImg($(this).data("index")));
                }, function(){});
            }).size() - 1;

        div.css("left", ($(".img-main").width() - (22 * (max + 1))) / 2) - 22;
        $(".img-main").append(div);

    }
    $(".img-main a").eq(0).css("z-index", 3);

    function initOffset(){
        $(".img-status").css("left", ($(".img-main").width() - (22 * (max + 1))) / 2) - 22;
    }
    function getImg(index){
        if(max < index){
            return getImg(0);
        }
        return $("." + className + index);
    }

    function getImgStatus(index){
        return $("." + statusClass + index);
    }

    function start(){
        clearTimeout(timer);
        timer = setTimeout(function(){
            toImg();
        }, 4000);
    }

    var toTimer;

    function toImg(node){
        clearTimeout(toTimer);
        clearTimeout(timer);

        toTimer = setTimeout(function(){
            var oldNode = $(".select-img");

            oldNode = oldNode.size() == 0 ? getImg(0) : oldNode;

            node = node || getImg(oldNode.data("index") + 1);
            if(oldNode.data("index") == node.data("index")){
                start();
                return;
            }
            selectStatus(node.data("index"));
            node.css("z-index", 2);
            $(".img-main a").not(node).not(oldNode).css("z-index", 1);
            $(".img-main a").stop();
            oldNode.fadeTo(500, 0.00, function(){
                $(".select-img").removeClass("select-img");
                node.addClass("select-img").css("z-index", 3);
                oldNode.css({"z-index": 1, "opacity": 1});
                start();
            });
        }, 150)


    }


    function selectStatus(index){
        $(".status-select").addClass("status-noselect").removeClass("status-select");
        getImgStatus(index).addClass("status-select").removeClass("status-noselect");
    }

    $(window).resize(function(){
        initOffset();
        $(".img-main a").each(function(){
            $(this).css({"left": ($(".img-main").width() - 1920) / 2});
        });
    });

    init();
    $(start);



});





