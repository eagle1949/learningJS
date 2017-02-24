  1 /**
  2  * @fileoverview 百度地图的鼠标绘制工具，对外开放。
  3  * 允许用户在地图上点击完成鼠标绘制的功能。
  4  * 使用者可以自定义所绘制结果的相关样式，例如线宽、颜色、测线段距离、面积等等。
  5  * 主入口类是<a href="symbols/BMapLib.DrawingManager.html">DrawingManager</a>，
  6  * 基于Baidu Map API 1.4。
  7  *
  8  * @author Baidu Map Api Group 
  9  * @version 1.4
 10  */
 11 
 12 /** 
 13  * @namespace BMap的所有library类均放在BMapLib命名空间下
 14  */
 15 var BMapLib = window.BMapLib = BMapLib || {};
 16 
 17 /**
 18  * 定义常量, 绘制的模式
 19  * @final {Number} DrawingType
 20  */
 21 var BMAP_DRAWING_MARKER    = "marker",     // 鼠标画点模式
 22     BMAP_DRAWING_POLYLINE  = "polyline",   // 鼠标画线模式
 23     BMAP_DRAWING_CIRCLE    = "circle",     // 鼠标画圆模式
 24     BMAP_DRAWING_RECTANGLE = "rectangle",  // 鼠标画矩形模式
 25     BMAP_DRAWING_POLYGON   = "polygon";    // 鼠标画多边形模式
 26 
 27 (function() {
 28 
 29     /**
 30      * 声明baidu包
 31      */
 32     var baidu = baidu || {guid : "$BAIDU$"};
 33     (function() {
 34         // 一些页面级别唯一的属性，需要挂载在window[baidu.guid]上
 35         window[baidu.guid] = {};
 36 
 37         /**
 38          * 将源对象的所有属性拷贝到目标对象中
 39          * @name baidu.extend
 40          * @function
 41          * @grammar baidu.extend(target, source)
 42          * @param {Object} target 目标对象
 43          * @param {Object} source 源对象
 44          * @returns {Object} 目标对象
 45          */
 46         baidu.extend = function (target, source) {
 47             for (var p in source) {
 48                 if (source.hasOwnProperty(p)) {
 49                     target[p] = source[p];
 50                 }
 51             }    
 52             return target;
 53         };
 54 
 55         /**
 56          * @ignore
 57          * @namespace
 58          * @baidu.lang 对语言层面的封装，包括类型判断、模块扩展、继承基类以及对象自定义事件的支持。
 59          * @property guid 对象的唯一标识
 60          */
 61         baidu.lang = baidu.lang || {};
 62 
 63         /**
 64          * 返回一个当前页面的唯一标识字符串。
 65          * @function
 66          * @grammar baidu.lang.guid()
 67          * @returns {String} 当前页面的唯一标识字符串
 68          */
 69         baidu.lang.guid = function() {
 70             return "TANGRAM__" + (window[baidu.guid]._counter ++).toString(36);
 71         };
 72 
 73         window[baidu.guid]._counter = window[baidu.guid]._counter || 1;
 74 
 75         /**
 76          * 所有类的实例的容器
 77          * key为每个实例的guid
 78          */
 79         window[baidu.guid]._instances = window[baidu.guid]._instances || {};
 80 
 81         /**
 82          * Tangram继承机制提供的一个基类，用户可以通过继承baidu.lang.Class来获取它的属性及方法。
 83          * @function
 84          * @name baidu.lang.Class
 85          * @grammar baidu.lang.Class(guid)
 86          * @param {string} guid	对象的唯一标识
 87          * @meta standard
 88          * @remark baidu.lang.Class和它的子类的实例均包含一个全局唯一的标识guid。
 89          * guid是在构造函数中生成的，因此，继承自baidu.lang.Class的类应该直接或者间接调用它的构造函数。<br>
 90          * baidu.lang.Class的构造函数中产生guid的方式可以保证guid的唯一性，及每个实例都有一个全局唯一的guid。
 91          */
 92         baidu.lang.Class = function(guid) {
 93             this.guid = guid || baidu.lang.guid();
 94             window[baidu.guid]._instances[this.guid] = this;
 95         };
 96 
 97         window[baidu.guid]._instances = window[baidu.guid]._instances || {};
 98 
 99         /**
100          * 判断目标参数是否string类型或String对象
101          * @name baidu.lang.isString
102          * @function
103          * @grammar baidu.lang.isString(source)
104          * @param {Any} source 目标参数
105          * @shortcut isString
106          * @meta standard
107          *             
108          * @returns {boolean} 类型判断结果
109          */
110         baidu.lang.isString = function (source) {
111             return '[object String]' == Object.prototype.toString.call(source);
112         };
113 
114         /**
115          * 判断目标参数是否为function或Function实例
116          * @name baidu.lang.isFunction
117          * @function
118          * @grammar baidu.lang.isFunction(source)
119          * @param {Any} source 目标参数
120          * @returns {boolean} 类型判断结果
121          */
122         baidu.lang.isFunction = function (source) {
123             return '[object Function]' == Object.prototype.toString.call(source);
124         };
125 
126         /**
127          * 重载了默认的toString方法，使得返回信息更加准确一些。
128          * @return {string} 对象的String表示形式
129          */
130         baidu.lang.Class.prototype.toString = function(){
131             return "[object " + (this._className || "Object" ) + "]";
132         };
133 
134         /**
135          * 释放对象所持有的资源，主要是自定义事件。
136          * @name dispose
137          * @grammar obj.dispose()
138          */
139         baidu.lang.Class.prototype.dispose = function(){
140             delete window[baidu.guid]._instances[this.guid];
141             for(var property in this){
142                 if (!baidu.lang.isFunction(this[property])) {
143                     delete this[property];
144                 }
145             }
146             this.disposed = true;
147         };
148 
149         /**
150          * 自定义的事件对象。
151          * @function
152          * @name baidu.lang.Event
153          * @grammar baidu.lang.Event(type[, target])
154          * @param {string} type	 事件类型名称。为了方便区分事件和一个普通的方法，事件类型名称必须以"on"(小写)开头。
155          * @param {Object} [target]触发事件的对象
156          * @meta standard
157          * @remark 引入该模块，会自动为Class引入3个事件扩展方法：addEventListener、removeEventListener和dispatchEvent。
158          * @see baidu.lang.Class
159          */
160         baidu.lang.Event = function (type, target) {
161             this.type = type;
162             this.returnValue = true;
163             this.target = target || null;
164             this.currentTarget = null;
165         };
166 
167         /**
168          * 注册对象的事件监听器。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
169          * @grammar obj.addEventListener(type, handler[, key])
170          * @param 	{string}   type         自定义事件的名称
171          * @param 	{Function} handler      自定义事件被触发时应该调用的回调函数
172          * @param 	{string}   [key]		为事件监听函数指定的名称，可在移除时使用。如果不提供，方法会默认为它生成一个全局唯一的key。
173          * @remark 	事件类型区分大小写。如果自定义事件名称不是以小写"on"开头，该方法会给它加上"on"再进行判断，即"click"和"onclick"会被认为是同一种事件。 
174          */
175         baidu.lang.Class.prototype.addEventListener = function (type, handler, key) {
176             if (!baidu.lang.isFunction(handler)) {
177                 return;
178             }
179             !this.__listeners && (this.__listeners = {});
180             var t = this.__listeners, id;
181             if (typeof key == "string" && key) {
182                 if (/[^\w\-]/.test(key)) {
183                     throw("nonstandard key:" + key);
184                 } else {
185                     handler.hashCode = key; 
186                     id = key;
187                 }
188             }
189             type.indexOf("on") != 0 && (type = "on" + type);
190             typeof t[type] != "object" && (t[type] = {});
191             id = id || baidu.lang.guid();
192             handler.hashCode = id;
193             t[type][id] = handler;
194         };
195          
196         /**
197          * 移除对象的事件监听器。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
198          * @grammar obj.removeEventListener(type, handler)
199          * @param {string}   type     事件类型
200          * @param {Function|string} handler  要移除的事件监听函数或者监听函数的key
201          * @remark 	如果第二个参数handler没有被绑定到对应的自定义事件中，什么也不做。
202          */
203         baidu.lang.Class.prototype.removeEventListener = function (type, handler) {
204             if (baidu.lang.isFunction(handler)) {
205                 handler = handler.hashCode;
206             } else if (!baidu.lang.isString(handler)) {
207                 return;
208             }
209             !this.__listeners && (this.__listeners = {});
210             type.indexOf("on") != 0 && (type = "on" + type);
211             var t = this.__listeners;
212             if (!t[type]) {
213                 return;
214             }
215             t[type][handler] && delete t[type][handler];
216         };
217 
218         /**
219          * 派发自定义事件，使得绑定到自定义事件上面的函数都会被执行。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
220          * @grammar obj.dispatchEvent(event, options)
221          * @param {baidu.lang.Event|String} event 	Event对象，或事件名称(1.1.1起支持)
222          * @param {Object} options 扩展参数,所含属性键值会扩展到Event对象上(1.2起支持)
223          * @remark 处理会调用通过addEventListenr绑定的自定义事件回调函数之外，还会调用直接绑定到对象上面的自定义事件。
224          * 例如：<br>
225          * myobj.onMyEvent = function(){}<br>
226          * myobj.addEventListener("onMyEvent", function(){});
227          */
228         baidu.lang.Class.prototype.dispatchEvent = function (event, options) {
229             if (baidu.lang.isString(event)) {
230                 event = new baidu.lang.Event(event);
231             }
232             !this.__listeners && (this.__listeners = {});
233             options = options || {};
234             for (var i in options) {
235                 event[i] = options[i];
236             }
237             var i, t = this.__listeners, p = event.type;
238             event.target = event.target || this;
239             event.currentTarget = this;
240             p.indexOf("on") != 0 && (p = "on" + p);
241             baidu.lang.isFunction(this[p]) && this[p].apply(this, arguments);
242             if (typeof t[p] == "object") {
243                 for (i in t[p]) {
244                     t[p][i].apply(this, arguments);
245                 }
246             }
247             return event.returnValue;
248         };
249 
250         /**
251          * 为类型构造器建立继承关系
252          * @name baidu.lang.inherits
253          * @function
254          * @grammar baidu.lang.inherits(subClass, superClass[, className])
255          * @param {Function} subClass 子类构造器
256          * @param {Function} superClass 父类构造器
257          * @param {string} className 类名标识
258          * @remark 使subClass继承superClass的prototype，
259          * 因此subClass的实例能够使用superClass的prototype中定义的所有属性和方法。<br>
260          * 这个函数实际上是建立了subClass和superClass的原型链集成，并对subClass进行了constructor修正。<br>
261          * <strong>注意：如果要继承构造函数，需要在subClass里面call一下，具体见下面的demo例子</strong>
262          * @shortcut inherits
263          * @meta standard
264          * @see baidu.lang.Class
265          */
266         baidu.lang.inherits = function (subClass, superClass, className) {
267             var key, proto, 
268                 selfProps = subClass.prototype, 
269                 clazz = new Function();        
270             clazz.prototype = superClass.prototype;
271             proto = subClass.prototype = new clazz();
272             for (key in selfProps) {
273                 proto[key] = selfProps[key];
274             }
275             subClass.prototype.constructor = subClass;
276             subClass.superClass = superClass.prototype;
277 
278             if ("string" == typeof className) {
279                 proto._className = className;
280             }
281         };
282 
283         /**
284          * @ignore
285          * @namespace baidu.dom 操作dom的方法。
286          */
287         baidu.dom = baidu.dom || {};
288 
289         /**
290          * 从文档中获取指定的DOM元素
291          * 
292          * @param {string|HTMLElement} id 元素的id或DOM元素
293          * @meta standard
294          * @return {HTMLElement} DOM元素，如果不存在，返回null，如果参数不合法，直接返回参数
295          */
296         baidu._g = baidu.dom._g = function (id) {
297             if (baidu.lang.isString(id)) {
298                 return document.getElementById(id);
299             }
300             return id;
301         };
302 
303         /**
304          * 从文档中获取指定的DOM元素
305          * @name baidu.dom.g
306          * @function
307          * @grammar baidu.dom.g(id)
308          * @param {string|HTMLElement} id 元素的id或DOM元素
309          * @meta standard
310          *             
311          * @returns {HTMLElement|null} 获取的元素，查找不到时返回null,如果参数不合法，直接返回参数
312          */
313         baidu.g = baidu.dom.g = function (id) {
314             if ('string' == typeof id || id instanceof String) {
315                 return document.getElementById(id);
316             } else if (id && id.nodeName && (id.nodeType == 1 || id.nodeType == 9)) {
317                 return id;
318             }
319             return null;
320         };
321 
322         /**
323          * 在目标元素的指定位置插入HTML代码
324          * @name baidu.dom.insertHTML
325          * @function
326          * @grammar baidu.dom.insertHTML(element, position, html)
327          * @param {HTMLElement|string} element 目标元素或目标元素的id
328          * @param {string} position 插入html的位置信息，取值为beforeBegin,afterBegin,beforeEnd,afterEnd
329          * @param {string} html 要插入的html
330          * @remark
331          * 
332          * 对于position参数，大小写不敏感<br>
333          * 参数的意思：beforeBegin<span>afterBegin   this is span! beforeEnd</span> afterEnd <br />
334          * 此外，如果使用本函数插入带有script标签的HTML字符串，script标签对应的脚本将不会被执行。
335          * 
336          * @shortcut insertHTML
337          * @meta standard
338          *             
339          * @returns {HTMLElement} 目标元素
340          */
341         baidu.insertHTML = baidu.dom.insertHTML = function (element, position, html) {
342             element = baidu.dom.g(element);
343             var range,begin;
344 
345             if (element.insertAdjacentHTML) {
346                 element.insertAdjacentHTML(position, html);
347             } else {
348                 // 这里不做"undefined" != typeof(HTMLElement) && !window.opera判断，其它浏览器将出错？！
349                 // 但是其实做了判断，其它浏览器下等于这个函数就不能执行了
350                 range = element.ownerDocument.createRange();
351                 // FF下range的位置设置错误可能导致创建出来的fragment在插入dom树之后html结构乱掉
352                 // 改用range.insertNode来插入html, by wenyuxiang @ 2010-12-14.
353                 position = position.toUpperCase();
354                 if (position == 'AFTERBEGIN' || position == 'BEFOREEND') {
355                     range.selectNodeContents(element);
356                     range.collapse(position == 'AFTERBEGIN');
357                 } else {
358                     begin = position == 'BEFOREBEGIN';
359                     range[begin ? 'setStartBefore' : 'setEndAfter'](element);
360                     range.collapse(begin);
361                 }
362                 range.insertNode(range.createContextualFragment(html));
363             }
364             return element;
365         };
366 
367         /**
368          * 为目标元素添加className
369          * @name baidu.dom.addClass
370          * @function
371          * @grammar baidu.dom.addClass(element, className)
372          * @param {HTMLElement|string} element 目标元素或目标元素的id
373          * @param {string} className 要添加的className，允许同时添加多个class，中间使用空白符分隔
374          * @remark
375          * 使用者应保证提供的className合法性，不应包含不合法字符，className合法字符参考：http://www.w3.org/TR/CSS2/syndata.html。
376          * @shortcut addClass
377          * @meta standard
378          * 	            
379          * @returns {HTMLElement} 目标元素
380          */
381         baidu.ac = baidu.dom.addClass = function (element, className) {
382             element = baidu.dom.g(element);
383             var classArray = className.split(/\s+/),
384                 result = element.className,
385                 classMatch = " " + result + " ",
386                 i = 0,
387                 l = classArray.length;
388 
389             for (; i < l; i++){
390                  if ( classMatch.indexOf( " " + classArray[i] + " " ) < 0 ) {
391                      result += (result ? ' ' : '') + classArray[i];
392                  }
393             }
394 
395             element.className = result;
396             return element;
397         };
398 
399         /**
400          * @ignore
401          * @namespace baidu.event 屏蔽浏览器差异性的事件封装。
402          * @property target 	事件的触发元素
403          * @property pageX 		鼠标事件的鼠标x坐标
404          * @property pageY 		鼠标事件的鼠标y坐标
405          * @property keyCode 	键盘事件的键值
406          */
407         baidu.event = baidu.event || {};
408 
409         /**
410          * 事件监听器的存储表
411          * @private
412          * @meta standard
413          */
414         baidu.event._listeners = baidu.event._listeners || [];
415 
416         /**
417          * 为目标元素添加事件监听器
418          * @name baidu.event.on
419          * @function
420          * @grammar baidu.event.on(element, type, listener)
421          * @param {HTMLElement|string|window} element 目标元素或目标元素id
422          * @param {string} type 事件类型
423          * @param {Function} listener 需要添加的监听器
424          * @remark
425          *  1. 不支持跨浏览器的鼠标滚轮事件监听器添加<br>
426          *  2. 改方法不为监听器灌入事件对象，以防止跨iframe事件挂载的事件对象获取失败            
427          * @shortcut on
428          * @meta standard
429          * @see baidu.event.un
430          *             
431          * @returns {HTMLElement|window} 目标元素
432          */
433         baidu.on = baidu.event.on = function (element, type, listener) {
434             type = type.replace(/^on/i, '');
435             element = baidu._g(element);
436             var realListener = function (ev) {
437                 // 1. 这里不支持EventArgument,  原因是跨frame的事件挂载
438                 // 2. element是为了修正this
439                 listener.call(element, ev);
440             },
441             lis = baidu.event._listeners,
442             filter = baidu.event._eventFilter,
443             afterFilter,
444             realType = type;
445             type = type.toLowerCase();
446             // filter过滤
447             if(filter && filter[type]){
448                 afterFilter = filter[type](element, type, realListener);
449                 realType = afterFilter.type;
450                 realListener = afterFilter.listener;
451             }
452             // 事件监听器挂载
453             if (element.addEventListener) {
454                 element.addEventListener(realType, realListener, false);
455             } else if (element.attachEvent) {
456                 element.attachEvent('on' + realType, realListener);
457             }
458           
459             // 将监听器存储到数组中
460             lis[lis.length] = [element, type, listener, realListener, realType];
461             return element;
462         };
463 
464         /**
465          * 为目标元素移除事件监听器
466          * @name baidu.event.un
467          * @function
468          * @grammar baidu.event.un(element, type, listener)
469          * @param {HTMLElement|string|window} element 目标元素或目标元素id
470          * @param {string} type 事件类型
471          * @param {Function} listener 需要移除的监听器
472          * @shortcut un
473          * @meta standard
474          *             
475          * @returns {HTMLElement|window} 目标元素
476          */
477         baidu.un = baidu.event.un = function (element, type, listener) {
478             element = baidu._g(element);
479             type = type.replace(/^on/i, '').toLowerCase();
480             
481             var lis = baidu.event._listeners, 
482                 len = lis.length,
483                 isRemoveAll = !listener,
484                 item,
485                 realType, realListener;
486             
487             //如果将listener的结构改成json
488             //可以节省掉这个循环，优化性能
489             //但是由于un的使用频率并不高，同时在listener不多的时候
490             //遍历数组的性能消耗不会对代码产生影响
491             //暂不考虑此优化
492             while (len--) {
493                 item = lis[len];
494                 
495                 // listener存在时，移除element的所有以listener监听的type类型事件
496                 // listener不存在时，移除element的所有type类型事件
497                 if (item[1] === type
498                     && item[0] === element
499                     && (isRemoveAll || item[2] === listener)) {
500                     realType = item[4];
501                     realListener = item[3];
502                     if (element.removeEventListener) {
503                         element.removeEventListener(realType, realListener, false);
504                     } else if (element.detachEvent) {
505                         element.detachEvent('on' + realType, realListener);
506                     }
507                     lis.splice(len, 1);
508                 }
509             }            
510             return element;
511         };
512 
513         /**
514          * 获取event事件,解决不同浏览器兼容问题
515          * @param {Event}
516          * @return {Event}
517          */
518         baidu.getEvent = baidu.event.getEvent = function (event) {
519             return window.event || event;
520         }
521 
522         /**
523          * 获取event.target,解决不同浏览器兼容问题
524          * @param {Event}
525          * @return {Target}
526          */
527         baidu.getTarget = baidu.event.getTarget = function (event) {
528             var event = baidu.getEvent(event);
529             return event.target || event.srcElement;
530         }
531 
532         /**
533          * 阻止事件的默认行为
534          * @name baidu.event.preventDefault
535          * @function
536          * @grammar baidu.event.preventDefault(event)
537          * @param {Event} event 事件对象
538          * @meta standard
539          */
540         baidu.preventDefault = baidu.event.preventDefault = function (event) {
541            var event = baidu.getEvent(event);
542            if (event.preventDefault) {
543                event.preventDefault();
544            } else {
545                event.returnValue = false;
546            }
547         };
548 
549         /**
550          * 停止事件冒泡传播
551          * @param {Event}
552          */
553         baidu.stopBubble = baidu.event.stopBubble = function (event) {
554             event = baidu.getEvent(event);
555             event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
556         }
557 
558     })();
559 
560     /** 
561      * @exports DrawingManager as BMapLib.DrawingManager 
562      */
563     var DrawingManager =
564         /**
565          * DrawingManager类的构造函数
566          * @class 鼠标绘制管理类，实现鼠标绘制管理的<b>入口</b>。
567          * 实例化该类后，即可调用该类提供的open
568          * 方法开启绘制模式状态。
569          * 也可加入工具栏进行选择操作。
570          * 
571          * @constructor
572          * @param {Map} map Baidu map的实例对象
573          * @param {Json Object} opts 可选的输入参数，非必填项。可输入选项包括：<br />
574          * {"<b>isOpen</b>" : {Boolean} 是否开启绘制模式
575          * <br />"<b>enableDrawingTool</b>" : {Boolean} 是否添加绘制工具栏控件，默认不添加
576          * <br />"<b>drawingToolOptions</b>" : {Json Object} 可选的输入参数，非必填项。可输入选项包括
577          * <br />      "<b>anchor</b>" : {ControlAnchor} 停靠位置、默认左上角
578          * <br />      "<b>offset</b>" : {Size} 偏移值。
579          * <br />      "<b>scale</b>" : {Number} 工具栏的缩放比例,默认为1
580          * <br />      "<b>drawingModes</b>" : {DrawingType<Array>} 工具栏上可以选择出现的绘制模式,将需要显示的DrawingType以数组型形式传入，如[BMAP_DRAWING_MARKER, BMAP_DRAWING_CIRCLE] 将只显示画点和画圆的选项
581          * <br />"<b>enableCalculate</b>" : {Boolean} 绘制是否进行测距(画线时候)、测面(画圆、多边形、矩形)
582          * <br />"<b>markerOptions</b>" : {CircleOptions} 所画的点的可选参数，参考api中的<a href="http://developer.baidu.com/map/reference/index.php?title=Class:%E6%80%BB%E7%B1%BB/%E8%A6%86%E7%9B%96%E7%89%A9%E7%B1%BB">对应类</a>
583          * <br />"<b>circleOptions</b>" : {CircleOptions} 所画的圆的可选参数，参考api中的<a href="http://developer.baidu.com/map/reference/index.php?title=Class:%E6%80%BB%E7%B1%BB/%E8%A6%86%E7%9B%96%E7%89%A9%E7%B1%BB">对应类</a>
584          * <br />"<b>polylineOptions</b>" : {CircleOptions} 所画的线的可选参数，参考api中的<a href="http://developer.baidu.com/map/reference/index.php?title=Class:%E6%80%BB%E7%B1%BB/%E8%A6%86%E7%9B%96%E7%89%A9%E7%B1%BB">对应类</a>
585          * <br />"<b>polygonOptions</b>" : {PolygonOptions} 所画的多边形的可选参数，参考api中的<a href="http://developer.baidu.com/map/reference/index.php?title=Class:%E6%80%BB%E7%B1%BB/%E8%A6%86%E7%9B%96%E7%89%A9%E7%B1%BB">对应类</a>
586          * <br />"<b>rectangleOptions</b>" : {PolygonOptions} 所画的矩形的可选参数，参考api中的<a href="http://developer.baidu.com/map/reference/index.php?title=Class:%E6%80%BB%E7%B1%BB/%E8%A6%86%E7%9B%96%E7%89%A9%E7%B1%BB">对应类</a>
587          *
588          * @example <b>参考示例：</b><br />
589          * var map = new BMap.Map("container");<br />map.centerAndZoom(new BMap.Point(116.404, 39.915), 15);<br />
590          * var myDrawingManagerObject = new BMapLib.DrawingManager(map, {isOpen: true, 
591          *     drawingType: BMAP_DRAWING_MARKER, enableDrawingTool: true,
592          *     enableCalculate: false,
593          *     drawingToolOptions: {
594          *         anchor: BMAP_ANCHOR_TOP_LEFT,
595          *         offset: new BMap.Size(5, 5),
596          *         drawingTypes : [
597          *             BMAP_DRAWING_MARKER,
598          *             BMAP_DRAWING_CIRCLE,
599          *             BMAP_DRAWING_POLYLINE,
600          *             BMAP_DRAWING_POLYGON,
601          *             BMAP_DRAWING_RECTANGLE 
602          *          ]
603          *     },
604          *     polylineOptions: {
605          *         strokeColor: "#333"
606          *     });
607          */
608         BMapLib.DrawingManager = function(map, opts){
609             if (!map) {
610                 return;
611             }
612             instances.push(this);
613             
614             opts = opts || {};
615 
616             this._initialize(map, opts);
617         }
618 
619     // 通过baidu.lang下的inherits方法，让DrawingManager继承baidu.lang.Class
620     baidu.lang.inherits(DrawingManager, baidu.lang.Class, "DrawingManager");
621 
622     /**
623      * 开启地图的绘制模式
624      *
625      * @example <b>参考示例：</b><br />
626      * myDrawingManagerObject.open();
627      */
628     DrawingManager.prototype.open = function() {
629         // 判断绘制状态是否已经开启
630         if (this._isOpen == true){
631             return true;
632         }
633         closeInstanceExcept(this);
634 
635         this._open();
636     }
637 
638     /**
639      * 关闭地图的绘制状态
640      *
641      * @example <b>参考示例：</b><br />
642      * myDrawingManagerObject.close();
643      */
644     DrawingManager.prototype.close = function() {
645 
646         // 判断绘制状态是否已经开启
647         if (this._isOpen == false){
648             return true;
649         }
650 
651         this._close();
652     }
653 
654     /**
655      * 设置当前的绘制模式，参数DrawingType，为5个可选常量:
656      * <br/>BMAP_DRAWING_MARKER    画点
657      * <br/>BMAP_DRAWING_CIRCLE    画圆
658      * <br/>BMAP_DRAWING_POLYLINE  画线
659      * <br/>BMAP_DRAWING_POLYGON   画多边形
660      * <br/>BMAP_DRAWING_RECTANGLE 画矩形
661      * @param {DrawingType} DrawingType
662      * @return {Boolean} 
663      *
664      * @example <b>参考示例：</b><br />
665      * myDrawingManagerObject.setDrawingMode(BMAP_DRAWING_POLYLINE);
666      */
667     DrawingManager.prototype.setDrawingMode = function(drawingType) {
668         //与当前模式不一样时候才进行重新绑定事件
669         if (this._drawingType != drawingType) {
670             closeInstanceExcept(this);
671             this._setDrawingMode(drawingType);
672         }
673     }
674 
675     /**
676      * 获取当前的绘制模式
677      * @return {DrawingType} 绘制的模式
678      *
679      * @example <b>参考示例：</b><br />
680      * alert(myDrawingManagerObject.getDrawingMode());
681      */
682     DrawingManager.prototype.getDrawingMode = function() {
683         return this._drawingType;
684     }
685 
686     /**
687      * 打开距离或面积计算
688      *
689      * @example <b>参考示例：</b><br />
690      * myDrawingManagerObject.enableCalculate();
691      */
692     DrawingManager.prototype.enableCalculate = function() {
693         this._enableCalculate = true;
694         this._addGeoUtilsLibrary();
695     }
696 
697     /**
698      * 关闭距离或面积计算
699      *
700      * @example <b>参考示例：</b><br />
701      * myDrawingManagerObject.disableCalculate();
702      */
703     DrawingManager.prototype.disableCalculate = function() {
704         this._enableCalculate = false;
705     }
706 
707 	/**
708    	 * 鼠标绘制完成后，派发总事件的接口
709      * @name DrawingManager#overlaycomplete
710      * @event
711      * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
712      * <br />{"<b>drawingMode</b> : {DrawingType} 当前的绘制模式
713      * <br />"<b>overlay</b>：{Marker||Polyline||Polygon||Circle} 对应的绘制模式返回对应的覆盖物
714      * <br />"<b>calculate</b>：{Number} 需要开启计算模式才会返回这个值，当绘制线的时候返回距离、绘制多边形、圆、矩形时候返回面积，单位为米，
715      * <br />"<b>label</b>：{Label} 计算面积时候出现在Map上的Label对象
716      *
717      * @example <b>参考示例：</b>
718      * myDrawingManagerObject.addEventListener("overlaycomplete", function(e) {
719      *     alert(e.drawingMode);
720      *     alert(e.overlay);
721      *     alert(e.calculate);
722      *     alert(e.label);
723      * });
724      */
725 
726     /**
727    	 * 绘制点完成后，派发的事件接口
728      * @name DrawingManager#markercomplete
729      * @event
730      * @param {Marker} overlay 回调函数会返回相应的覆盖物，
731      * <br />{"<b>overlay</b> : {Marker} 
732      *
733      * @example <b>参考示例：</b>
734      * myDrawingManagerObject.addEventListener("circlecomplete", function(e, overlay) {
735      *     alert(overlay);
736      * });
737      */
738 
739     /**
740    	 * 绘制圆完成后，派发的事件接口
741      * @name DrawingManager#circlecomplete
742      * @event
743      * @param {Circle} overlay 回调函数会返回相应的覆盖物，
744      * <br />{"<b>overlay</b> : {Circle} 
745      */
746 
747     /**
748    	 * 绘制线完成后，派发的事件接口
749      * @name DrawingManager#polylinecomplete
750      * @event
751      * @param {Polyline} overlay 回调函数会返回相应的覆盖物，
752      * <br />{"<b>overlay</b> : {Polyline} 
753      */
754 
755     /**
756    	 * 绘制多边形完成后，派发的事件接口
757      * @name DrawingManager#polygoncomplete
758      * @event
759      * @param {Polygon} overlay 回调函数会返回相应的覆盖物，
760      * <br />{"<b>overlay</b> : {Polygon} 
761      */
762 
763     /**
764    	 * 绘制矩形完成后，派发的事件接口
765      * @name DrawingManager#rectanglecomplete
766      * @event
767      * @param {Polygon} overlay 回调函数会返回相应的覆盖物，
768      * <br />{"<b>overlay</b> : {Polygon} 
769      */
770 
771     /**
772      * 初始化状态
773      * @param {Map} 地图实例
774      * @param {Object} 参数
775      */
776     DrawingManager.prototype._initialize = function(map, opts) {
777 
778         /**
779          * map对象
780          * @private
781          * @type {Map}
782          */
783         this._map = map;
784 
785         /**
786          * 配置对象
787          * @private
788          * @type {Object}
789          */
790         this._opts = opts;
791 
792         /**
793          * 当前的绘制模式, 默认是绘制点
794          * @private
795          * @type {DrawingType}
796          */
797         this._drawingType = opts.drawingMode || BMAP_DRAWING_MARKER;
798 
799         /**
800          * 是否添加添加鼠标绘制工具栏面板
801          */
802         if (opts.enableDrawingTool) {
803             var drawingTool  = new DrawingTool(this, opts.drawingToolOptions);
804             this._drawingTool = drawingTool;
805             map.addControl(drawingTool);
806         }
807 
808         //是否计算绘制出的面积 
809         if (opts.enableCalculate === true) {
810             this.enableCalculate();
811         } else {
812             this.disableCalculate();
813         }
814 
815         /**
816          * 是否已经开启了绘制状态
817          * @private
818          * @type {Boolean}
819          */
820         this._isOpen = !!(opts.isOpen === true);
821         if (this._isOpen) {
822             this._open();
823         }
824 
825         this.markerOptions    = opts.markerOptions    || {};
826         this.circleOptions    = opts.circleOptions    || {};
827         this.polylineOptions  = opts.polylineOptions  || {};
828         this.polygonOptions   = opts.polygonOptions   || {};
829         this.rectangleOptions = opts.rectangleOptions || {};
830 
831     },
832 
833     /**
834      * 开启地图的绘制状态
835      * @return {Boolean}，开启绘制状态成功，返回true；否则返回false。
836      */
837     DrawingManager.prototype._open = function() {
838 
839         this._isOpen = true;
840 
841         //添加遮罩，所有鼠标操作都在这个遮罩上完成
842         if (!this._mask) {
843             this._mask = new Mask();
844         }
845         this._map.addOverlay(this._mask);
846         this._setDrawingMode(this._drawingType);
847 
848     }
849 
850     /**
851      * 设置当前的绘制模式
852      * @param {DrawingType}
853      */
854     DrawingManager.prototype._setDrawingMode = function(drawingType) {
855 
856         this._drawingType = drawingType;
857 
858         /**
859          * 开启编辑状态时候才重新进行事件绑定
860          */
861         if (this._isOpen) {
862             //清空之前的自定义事件
863             this._mask.__listeners = {};
864 
865             switch (drawingType) {
866                 case BMAP_DRAWING_MARKER:
867                     this._bindMarker();
868                     break;
869                 case BMAP_DRAWING_CIRCLE:
870                     this._bindCircle();
871                     break;
872                 case BMAP_DRAWING_POLYLINE:
873                 case BMAP_DRAWING_POLYGON:
874                     this._bindPolylineOrPolygon();
875                     break;
876                 case BMAP_DRAWING_RECTANGLE:
877                     this._bindRectangle();
878                     break;
879             }
880         }
881 
882         /** 
883          * 如果添加了工具栏，则也需要改变工具栏的样式
884          */
885         if (this._drawingTool && this._isOpen) {
886             this._drawingTool.setStyleByDrawingMode(drawingType);
887         }
888     }
889 
890     /**
891      * 关闭地图的绘制状态
892      * @return {Boolean}，关闭绘制状态成功，返回true；否则返回false。
893      */
894     DrawingManager.prototype._close = function() {
895 
896         this._isOpen = false;
897 
898         if (this._mask) {
899             this._map.removeOverlay(this._mask);
900         }
901 
902         /** 
903          * 如果添加了工具栏，则关闭时候将工具栏样式设置为拖拽地图
904          */
905         if (this._drawingTool) {
906             this._drawingTool.setStyleByDrawingMode("hander");
907         }
908     }
909 
910     /**
911      * 绑定鼠标画点的事件
912      */
913     DrawingManager.prototype._bindMarker = function() {
914 
915         var me   = this,
916             map  = this._map,
917             mask = this._mask;
918 
919         /**
920          * 鼠标点击的事件
921          */
922         var clickAction = function (e) {
923             // 往地图上添加marker
924             var marker = new BMap.Marker(e.point, me.markerOptions);
925             map.addOverlay(marker);
926             me._dispatchOverlayComplete(marker);
927         }
928 
929         mask.addEventListener('click', clickAction);
930     }
931 
932     /**
933      * 绑定鼠标画圆的事件
934      */
935     DrawingManager.prototype._bindCircle = function() {
936 
937         var me           = this,
938             map          = this._map,
939             mask         = this._mask,
940             circle       = null,
941             centerPoint  = null; //圆的中心点
942 
943         /**
944          * 开始绘制圆形
945          */
946         var startAction = function (e) {
947             centerPoint = e.point;
948             circle = new BMap.Circle(centerPoint, 0, me.circleOptions);
949             map.addOverlay(circle);
950             mask.enableEdgeMove();
951             mask.addEventListener('mousemove', moveAction);
952             baidu.on(document, 'mouseup', endAction);
953         }
954 
955         /**
956          * 绘制圆形过程中，鼠标移动过程的事件
957          */
958         var moveAction = function(e) {
959             circle.setRadius(me._map.getDistance(centerPoint, e.point));
960         }
961 
962         /**
963          * 绘制圆形结束
964          */
965         var endAction = function (e) {
966             var calculate = me._calculate(circle, e.point);
967             me._dispatchOverlayComplete(circle, calculate);
968             centerPoint = null;
969             mask.disableEdgeMove();
970             mask.removeEventListener('mousemove', moveAction);
971             baidu.un(document, 'mouseup', endAction);
972         }
973 
974         /**
975          * 鼠标点击起始点
976          */
977         var mousedownAction = function (e) {
978             baidu.preventDefault(e);
979             baidu.stopBubble(e);
980             if (centerPoint == null) {
981                 startAction(e);
982             } 
983         }
984 
985         mask.addEventListener('mousedown', mousedownAction);
986     }
987 
988     /**
989      * 画线和画多边形相似性比较大，公用一个方法
990      */
991     DrawingManager.prototype._bindPolylineOrPolygon = function() {
992 
993         var me           = this,
994             map          = this._map,
995             mask         = this._mask,
996             points       = [],   //用户绘制的点
997             drawPoint    = null; //实际需要画在地图上的点
998             overlay      = null,
999             isBinded     = false;
1000 
1001         /**
1002          * 鼠标点击的事件
1003          */
1004         var startAction = function (e) {
1005             points.push(e.point);
1006             drawPoint = points.concat(points[points.length - 1]);
1007             if (points.length == 1) {
1008                 if (me._drawingType == BMAP_DRAWING_POLYLINE) {
1009                     overlay = new BMap.Polyline(drawPoint, me.polylineOptions);
1010                 } else if (me._drawingType == BMAP_DRAWING_POLYGON) {
1011                     overlay = new BMap.Polygon(drawPoint, me.polygonOptions);
1012                 }
1013                 map.addOverlay(overlay);
1014             } else {
1015                 overlay.setPath(drawPoint);
1016             }
1017             if (!isBinded) {
1018                 isBinded = true;
1019                 mask.enableEdgeMove();
1020                 mask.addEventListener('mousemove', mousemoveAction);
1021                 mask.addEventListener('dblclick', dblclickAction);
1022             }
1023         }
1024 
1025         /**
1026          * 鼠标移动过程的事件
1027          */
1028         var mousemoveAction = function(e) {
1029             overlay.setPositionAt(drawPoint.length - 1, e.point);
1030         }
1031 
1032         /**
1033          * 鼠标双击的事件
1034          */
1035         var dblclickAction = function (e) {
1036             baidu.stopBubble(e);
1037             isBinded = false;
1038             mask.disableEdgeMove();
1039             mask.removeEventListener('mousemove', mousemoveAction);
1040             mask.removeEventListener('dblclick', dblclickAction);
1041             overlay.setPath(points);
1042             var calculate = me._calculate(overlay, points.pop());
1043             me._dispatchOverlayComplete(overlay, calculate);
1044             points.length = 0;
1045             drawPoint.length = 0;
1046         }
1047 
1048         mask.addEventListener('click', startAction);
1049 
1050         //双击时候不放大地图级别
1051         mask.addEventListener('dblclick', function(e){
1052             baidu.stopBubble(e);
1053         });
1054     }
1055 
1056     /**
1057      * 绑定鼠标画矩形的事件
1058      */
1059     DrawingManager.prototype._bindRectangle = function() {
1060 
1061         var me           = this,
1062             map          = this._map,
1063             mask         = this._mask,
1064             polygon      = null,
1065             startPoint   = null;
1066 
1067         /**
1068          * 开始绘制矩形
1069          */
1070         var startAction = function (e) {
1071             baidu.stopBubble(e);
1072             baidu.preventDefault(e);
1073             startPoint = e.point;
1074             var endPoint = startPoint;
1075             polygon = new BMap.Polygon(me._getRectanglePoint(startPoint, endPoint), me.rectangleOptions);
1076             map.addOverlay(polygon);
1077             mask.enableEdgeMove();
1078             mask.addEventListener('mousemove', moveAction);
1079             baidu.on(document, 'mouseup', endAction);
1080         }
1081 
1082         /**
1083          * 绘制矩形过程中，鼠标移动过程的事件
1084          */
1085         var moveAction = function(e) {
1086             polygon.setPath(me._getRectanglePoint(startPoint, e.point));
1087         }
1088 
1089         /**
1090          * 绘制矩形结束
1091          */
1092         var endAction = function (e) {
1093             var calculate = me._calculate(polygon, polygon.getPath()[2]);
1094             me._dispatchOverlayComplete(polygon, calculate);
1095             startPoint = null;
1096             mask.disableEdgeMove();
1097             mask.removeEventListener('mousemove', moveAction);
1098             baidu.un(document, 'mouseup', endAction);
1099         }
1100 
1101         mask.addEventListener('mousedown', startAction);
1102     }
1103 
1104     /**
1105      * 添加显示所绘制图形的面积或者长度
1106      * @param {overlay} 覆盖物
1107      * @param {point} 显示的位置
1108      */
1109     DrawingManager.prototype._calculate = function (overlay, point) {
1110         var result = {
1111             data  : 0,    //计算出来的长度或面积
1112             label : null  //显示长度或面积的label对象
1113         };
1114         if (this._enableCalculate && BMapLib.GeoUtils) {
1115             var type = overlay.toString();
1116             //不同覆盖物调用不同的计算方法
1117             switch (type) {
1118                 case "[object Polyline]":
1119                     result.data = BMapLib.GeoUtils.getPolylineDistance(overlay);
1120                     break;
1121                 case "[object Polygon]":
1122                     result.data = BMapLib.GeoUtils.getPolygonArea(overlay);
1123                     break;
1124                 case "[object Circle]":
1125                     var radius = overlay.getRadius();
1126                     result.data = Math.PI * radius * radius;
1127                     break;
1128             }
1129             //一场情况处理
1130             if (!result.data || result.data < 0) {
1131                 result.data = 0;
1132             } else {
1133                 //保留2位小数位
1134                 result.data = result.data.toFixed(2);
1135             }
1136             result.label = this._addLabel(point, result.data);
1137         }
1138         return result;
1139     }
1140 
1141     /**
1142      * 开启测距和测面功能需要依赖于GeoUtils库
1143      * 所以这里判断用户是否已经加载,若未加载则用js动态加载
1144      */
1145     DrawingManager.prototype._addGeoUtilsLibrary = function () {
1146         if (!BMapLib.GeoUtils) {
1147             var script = document.createElement('script');
1148             script.setAttribute("type", "text/javascript");
1149             script.setAttribute("src", 'http://api.map.baidu.com/library/GeoUtils/1.2/src/GeoUtils_min.js');
1150             document.body.appendChild(script);
1151         }
1152     }
1153 
1154     /**
1155      * 向地图中添加文本标注
1156      * @param {Point}
1157      * @param {String} 所以显示的内容
1158      */
1159     DrawingManager.prototype._addLabel = function (point, content) {
1160         var label = new BMap.Label(content, {
1161             position: point
1162         });
1163         this._map.addOverlay(label);
1164         return label;
1165     }
1166 
1167     /**
1168      * 根据起终点获取矩形的四个顶点
1169      * @param {Point} 起点
1170      * @param {Point} 终点
1171      */
1172     DrawingManager.prototype._getRectanglePoint = function (startPoint, endPoint) {
1173         return [
1174             new BMap.Point(startPoint.lng,startPoint.lat),
1175             new BMap.Point(endPoint.lng,startPoint.lat),
1176             new BMap.Point(endPoint.lng,endPoint.lat),
1177             new BMap.Point(startPoint.lng,endPoint.lat)
1178         ];
1179     }
1180 
1181     /**
1182      * 派发事件
1183      */
1184     DrawingManager.prototype._dispatchOverlayComplete = function (overlay, calculate) {
1185         var options = {
1186             'overlay'     : overlay,
1187             'drawingMode' : this._drawingType,
1188             'calculate'   : calculate.data  || null,
1189             'label'       : calculate.label || null
1190         };
1191         this.dispatchEvent(this._drawingType + 'complete', overlay);
1192         this.dispatchEvent('overlaycomplete', options);
1193     }
1194 
1195     /**
1196      * 创建遮罩对象
1197      */
1198     function Mask(){
1199         /**
1200          * 鼠标到地图边缘的时候是否自动平移地图
1201          */
1202         this._enableEdgeMove = false;
1203     }
1204 
1205     Mask.prototype = new BMap.Overlay();
1206 
1207     /**
1208      * 这里不使用api中的自定义事件，是为了更灵活使用
1209      */
1210     Mask.prototype.dispatchEvent = baidu.lang.Class.prototype.dispatchEvent;
1211     Mask.prototype.addEventListener = baidu.lang.Class.prototype.addEventListener;
1212     Mask.prototype.removeEventListener = baidu.lang.Class.prototype.removeEventListener;
1213 
1214     Mask.prototype.initialize = function(map){
1215         var me = this;
1216         this._map = map;
1217         var div = this.container = document.createElement("div");
1218         var size = this._map.getSize();
1219         div.style.cssText = "position:absolute;background:url(about:blank);cursor:crosshair;width:" + size.width + "px;height:" + size.height + "px";
1220         this._map.addEventListener('resize', function(e) {
1221             me._adjustSize(e.size);
1222         });
1223         this._map.getPanes().floatPane.appendChild(div);
1224         this._bind();
1225         return div; 
1226     };
1227 
1228     Mask.prototype.draw = function() {
1229         var map   = this._map,
1230             point = map.pixelToPoint(new BMap.Pixel(0, 0)),
1231             pixel = map.pointToOverlayPixel(point);
1232         this.container.style.left = pixel.x + "px";
1233         this.container.style.top  = pixel.y + "px"; 
1234     };
1235 
1236     /**
1237      * 开启鼠标到地图边缘，自动平移地图
1238      */
1239     Mask.prototype.enableEdgeMove = function() {
1240         this._enableEdgeMove = true;
1241     }
1242 
1243     /**
1244      * 关闭鼠标到地图边缘，自动平移地图
1245      */
1246     Mask.prototype.disableEdgeMove = function() {
1247         clearInterval(this._edgeMoveTimer);
1248         this._enableEdgeMove = false;
1249     }
1250 
1251     /**
1252      * 绑定事件,派发自定义事件
1253      */
1254     Mask.prototype._bind = function() {
1255 
1256         var me = this,
1257             map = this._map,
1258             container = this.container,
1259             lastMousedownXY = null,
1260             lastClickXY = null;
1261 
1262         /**
1263          * 根据event对象获取鼠标的xy坐标对象
1264          * @param {Event}
1265          * @return {Object} {x:e.x, y:e.y}
1266          */
1267         var getXYbyEvent = function(e){
1268             return {
1269                 x : e.clientX,
1270                 y : e.clientY
1271             }
1272         };
1273 
1274         var domEvent = function(e) {
1275             var type = e.type;
1276                 e = baidu.getEvent(e);
1277                 point = me.getDrawPoint(e); //当前鼠标所在点的地理坐标
1278 
1279             var dispatchEvent = function(type) {
1280                 e.point = point;
1281                 me.dispatchEvent(e);
1282             }
1283 
1284             if (type == "mousedown") {
1285                 lastMousedownXY = getXYbyEvent(e);
1286             }
1287 
1288             var nowXY = getXYbyEvent(e);
1289             //click经过一些特殊处理派发，其他同事件按正常的dom事件派发
1290             if (type == "click") {
1291                 //鼠标点击过程不进行移动才派发click和dblclick
1292                 if (Math.abs(nowXY.x - lastMousedownXY.x) < 5 && Math.abs(nowXY.y - lastMousedownXY.y) < 5 ) {
1293                     if (!lastClickXY || !(Math.abs(nowXY.x - lastClickXY.x) < 5 && Math.abs(nowXY.y - lastClickXY.y) < 5)) {
1294                         dispatchEvent('click');
1295                         lastClickXY = getXYbyEvent(e);
1296                     } else {
1297                         lastClickXY = null;
1298                     }
1299                 }
1300             } else {
1301                 dispatchEvent(type);
1302             }
1303         }
1304 
1305         /**
1306          * 将事件都遮罩层的事件都绑定到domEvent来处理
1307          */
1308         var events = ['click', 'mousedown', 'mousemove', 'mouseup', 'dblclick'],
1309             index = events.length;
1310         while (index--) {
1311             baidu.on(container, events[index], domEvent);
1312         }
1313 
1314         //鼠标移动过程中，到地图边缘后自动平移地图
1315         baidu.on(container, 'mousemove', function(e) {
1316             if (me._enableEdgeMove) {
1317                 me.mousemoveAction(e);
1318             }
1319         });
1320     };
1321 
1322     //鼠标移动过程中，到地图边缘后自动平移地图
1323     Mask.prototype.mousemoveAction = function(e) {
1324         function getClientPosition(e) {
1325             var clientX = e.clientX,
1326                 clientY = e.clientY;
1327             if (e.changedTouches) {
1328                 clientX = e.changedTouches[0].clientX;
1329                 clientY = e.changedTouches[0].clientY;
1330             }
1331             return new BMap.Pixel(clientX, clientY);
1332         }
1333 
1334         var map       = this._map,
1335             me        = this,
1336             pixel     = map.pointToPixel(this.getDrawPoint(e)),
1337             clientPos = getClientPosition(e),
1338             offsetX   = clientPos.x - pixel.x,
1339             offsetY   = clientPos.y - pixel.y;
1340         pixel = new BMap.Pixel((clientPos.x - offsetX), (clientPos.y - offsetY));
1341         this._draggingMovePixel = pixel;
1342         var point = map.pixelToPoint(pixel),
1343             eventObj = {
1344                 pixel: pixel,
1345                 point: point
1346             };
1347         // 拖拽到地图边缘移动地图
1348         this._panByX = this._panByY = 0;
1349         if (pixel.x <= 20 || pixel.x >= map.width - 20
1350             || pixel.y <= 50 || pixel.y >= map.height - 10) {
1351             if (pixel.x <= 20) {
1352                 this._panByX = 8;
1353             } else if (pixel.x >= map.width - 20) {
1354                 this._panByX = -8;
1355             }
1356             if (pixel.y <= 50) {
1357                 this._panByY = 8;
1358             } else if (pixel.y >= map.height - 10) {
1359                 this._panByY = -8;
1360             }
1361             if (!this._edgeMoveTimer) {
1362                 this._edgeMoveTimer = setInterval(function(){
1363                     map.panBy(me._panByX, me._panByY, {"noAnimation": true});
1364                 }, 30);
1365             }
1366         } else {
1367             if (this._edgeMoveTimer) {
1368                 clearInterval(this._edgeMoveTimer);
1369                 this._edgeMoveTimer = null;
1370             }
1371         }
1372     }
1373 
1374     /*
1375      * 调整大小
1376      * @param {Size}
1377      */
1378     Mask.prototype._adjustSize = function(size) {
1379         this.container.style.width  = size.width + 'px';
1380         this.container.style.height = size.height + 'px';
1381     };
1382 
1383     /**
1384      * 获取当前绘制点的地理坐标
1385      *
1386      * @param {Event} e e对象
1387      * @return Point对象的位置信息
1388      */
1389     Mask.prototype.getDrawPoint = function(e) {
1390         
1391         var map = this._map,
1392         trigger = baidu.getTarget(e),
1393         x = e.offsetX || e.layerX || 0,
1394         y = e.offsetY || e.layerY || 0;
1395         if (trigger.nodeType != 1) trigger = trigger.parentNode;
1396         while (trigger && trigger != map.getContainer()) {
1397             if (!(trigger.clientWidth == 0 &&
1398                 trigger.clientHeight == 0 &&
1399                 trigger.offsetParent && trigger.offsetParent.nodeName == 'TD')) {
1400                 x += trigger.offsetLeft || 0;
1401                 y += trigger.offsetTop || 0;
1402             }
1403             trigger = trigger.offsetParent;
1404         }
1405         var pixel = new BMap.Pixel(x, y);
1406         var point = map.pixelToPoint(pixel);
1407         return point;
1408 
1409     }
1410 
1411     /**
1412      * 绘制工具面板，自定义控件
1413      */
1414     function DrawingTool(drawingManager, drawingToolOptions) {
1415         this.drawingManager = drawingManager;
1416 
1417         drawingToolOptions = this.drawingToolOptions = drawingToolOptions || {};
1418         // 默认停靠位置和偏移量
1419         this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
1420         this.defaultOffset = new BMap.Size(10, 10);
1421 
1422         //默认所有工具栏都显示
1423         this.defaultDrawingModes = [
1424             BMAP_DRAWING_MARKER,
1425             BMAP_DRAWING_CIRCLE,
1426             BMAP_DRAWING_POLYLINE,
1427             BMAP_DRAWING_POLYGON,
1428             BMAP_DRAWING_RECTANGLE
1429         ];
1430         //工具栏可显示的绘制模式
1431         if (drawingToolOptions.drawingModes) {
1432             this.drawingModes = drawingToolOptions.drawingModes;
1433         } else {
1434             this.drawingModes = this.defaultDrawingModes
1435         }
1436 
1437         //用户设置停靠位置和偏移量
1438         if (drawingToolOptions.anchor) {
1439             this.setAnchor(drawingToolOptions.anchor);
1440         }
1441         if (drawingToolOptions.offset) {
1442             this.setOffset(drawingToolOptions.offset);
1443         }
1444     }
1445 
1446     // 通过JavaScript的prototype属性继承于BMap.Control
1447     DrawingTool.prototype = new BMap.Control();
1448 
1449     // 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
1450     // 在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中
1451     DrawingTool.prototype.initialize = function(map){
1452         // 创建一个DOM元素
1453         var container = this.container = document.createElement("div");
1454         container.className = "BMapLib_Drawing";
1455         //用来设置外层边框阴影
1456         var panel = this.panel = document.createElement("div");
1457         panel.className = "BMapLib_Drawing_panel";
1458         if (this.drawingToolOptions && this.drawingToolOptions.scale) {
1459             this._setScale(this.drawingToolOptions.scale);
1460         }
1461         container.appendChild(panel);
1462         // 添加内容
1463         panel.innerHTML = this._generalHtml();
1464         //绑定事件
1465         this._bind(panel);
1466         // 添加DOM元素到地图中
1467         map.getContainer().appendChild(container);
1468         // 将DOM元素返回
1469         return container;
1470     }
1471 
1472     //生成工具栏的html元素
1473     DrawingTool.prototype._generalHtml = function(map){
1474 
1475         //鼠标经过工具栏上的提示信息
1476         var tips = {};
1477         tips["hander"]               = "拖动地图";
1478         tips[BMAP_DRAWING_MARKER]    = "画点";
1479         tips[BMAP_DRAWING_CIRCLE]    = "画圆";
1480         tips[BMAP_DRAWING_POLYLINE]  = "画折线";
1481         tips[BMAP_DRAWING_POLYGON]   = "画多边形";
1482         tips[BMAP_DRAWING_RECTANGLE] = "画矩形";
1483 
1484         var getItem = function(className, drawingType) {
1485             return '<a class="' + className + '" drawingType="' + drawingType + '" href="javascript:void(0)" title="' + tips[drawingType] + '" onfocus="this.blur()"></a>';
1486         }
1487 
1488         var html = [];
1489         html.push(getItem("BMapLib_box BMapLib_hander", "hander"));
1490         for (var i = 0, len = this.drawingModes.length; i < len; i++) {
1491             var classStr = 'BMapLib_box BMapLib_' + this.drawingModes[i];
1492             if (i == len-1) {
1493                 classStr += ' BMapLib_last';
1494             }
1495             html.push(getItem(classStr, this.drawingModes[i]));
1496         }
1497         return html.join('');
1498     }
1499 
1500     /**
1501      * 设置工具栏的缩放比例
1502      */
1503     DrawingTool.prototype._setScale = function(scale){
1504         var width  = 390,
1505             height = 50,
1506             ml = -parseInt((width - width * scale) / 2, 10),
1507             mt = -parseInt((height - height * scale) / 2, 10);
1508         this.container.style.cssText = [
1509             "-moz-transform: scale(" + scale + ");",
1510             "-o-transform: scale(" + scale + ");",
1511             "-webkit-transform: scale(" + scale + ");",
1512             "transform: scale(" + scale + ");",
1513             "margin-left:" + ml + "px;",
1514             "margin-top:" + mt + "px;",
1515             "*margin-left:0px;", //ie6、7
1516             "*margin-top:0px;",  //ie6、7
1517             "margin-left:0px\\0;", //ie8
1518             "margin-top:0px\\0;",  //ie8
1519             //ie下使用滤镜
1520             "filter: progid:DXImageTransform.Microsoft.Matrix(",
1521             "M11=" + scale + ",",
1522             "M12=0,",
1523             "M21=0,",
1524             "M22=" + scale + ",",
1525             "SizingMethod='auto expand');"
1526         ].join('');
1527     }
1528 
1529     //绑定工具栏的事件
1530     DrawingTool.prototype._bind = function(panel){
1531         var me = this;
1532         baidu.on(this.panel, 'click', function (e) {
1533             var target = baidu.getTarget(e);
1534             var drawingType = target.getAttribute('drawingType');
1535             me.setStyleByDrawingMode(drawingType);
1536             me._bindEventByDraingMode(drawingType);
1537         });
1538     }
1539 
1540     //设置工具栏当前选中的项样式
1541     DrawingTool.prototype.setStyleByDrawingMode = function(drawingType){
1542         if (!drawingType) {
1543             return;
1544         }
1545         var boxs = this.panel.getElementsByTagName("a");
1546         for (var i = 0, len = boxs.length; i < len; i++) {
1547             var box = boxs[i];
1548             if (box.getAttribute('drawingType') == drawingType) {
1549                 var classStr = "BMapLib_box BMapLib_" + drawingType + "_hover";
1550                 if (i == len - 1) {
1551                     classStr += " BMapLib_last";
1552                 }
1553                 box.className = classStr;
1554             } else {
1555                 box.className = box.className.replace(/_hover/, "");
1556             }
1557         }
1558     }
1559 
1560     //设置工具栏当前选中的项样式
1561     DrawingTool.prototype._bindEventByDraingMode = function(drawingType){
1562         var drawingManager = this.drawingManager;
1563         //点在拖拽地图的按钮上
1564         if (drawingType == "hander") {
1565             drawingManager.close();
1566         } else {
1567             drawingManager.setDrawingMode(drawingType);
1568             drawingManager.open();
1569         }
1570     }
1571 
1572     //用来存储用户实例化出来的drawingmanager对象
1573     var instances = [];
1574 
1575     /*
1576      * 关闭其他实例的绘制模式
1577      * @param {DrawingManager} 当前的实例
1578      */
1579     function closeInstanceExcept(instance) {
1580         var index = instances.length;
1581         while (index--) {
1582             if (instances[index] != instance) {
1583                 instances[index].close();
1584             }
1585         }
1586     }
1587 
1588 })();
1589 