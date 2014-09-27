define(["durandal/system","durandal/app","durandal/composition","durandal/activator","durandal/viewEngine","jquery","knockout"],function(e,t,n,i,r,o,a){function s(t){return e.defer(function(n){e.isString(t)?e.acquire(t).then(function(t){n.resolve(e.resolveObject(t))}).fail(function(n){e.error("Failed to load dialog module ("+t+"). Details: "+n.message)}):n.resolve(t)}).promise()}var l,u={},c=a.observable(0),d=function(e,t,n,i,r){this.message=e,this.title=t||d.defaultTitle,this.options=n||d.defaultOptions,this.autoclose=i||!1,this.settings=o.extend({},d.defaultSettings,r)};return d.prototype.selectOption=function(e){l.close(this,e)},d.prototype.getView=function(){return r.processMarkup(d.defaultViewMarkup)},d.setViewUrl=function(e){delete d.prototype.getView,d.prototype.viewUrl=e},d.defaultTitle=t.title||"Application",d.defaultOptions=["Ok"],d.defaultSettings={buttonClass:"btn btn-default",primaryButtonClass:"btn-primary autofocus",secondaryButtonClass:"","class":"modal-content messageBox",style:null},d.setDefaults=function(e){o.extend(d.defaultSettings,e)},d.prototype.getButtonClass=function(e){var t="";return this.settings&&(this.settings.buttonClass&&(t=this.settings.buttonClass),0===e()&&this.settings.primaryButtonClass&&(t.length>0&&(t+=" "),t+=this.settings.primaryButtonClass),e()>0&&this.settings.secondaryButtonClass&&(t.length>0&&(t+=" "),t+=this.settings.secondaryButtonClass)),t},d.prototype.getClass=function(){return this.settings?this.settings["class"]:"messageBox"},d.prototype.getStyle=function(){return this.settings?this.settings.style:null},d.prototype.getButtonText=function(t){var n=o.type(t);return"string"===n?t:"object"===n?"string"===o.type(t.text)?t.text:(e.error("The object for a MessageBox button does not have a text property that is a string."),null):(e.error("Object for a MessageBox button is not a string or object but "+n+"."),null)},d.prototype.getButtonValue=function(t){var n=o.type(t);return"string"===n?t:"object"===n?"undefined"===o.type(t.text)?(e.error("The object for a MessageBox button does not have a value property defined."),null):t.value:(e.error("Object for a MessageBox button is not a string or object but "+n+"."),null)},d.defaultViewMarkup=['<div data-view="plugins/messageBox" data-bind="css: getClass(), style: getStyle()">','<div class="modal-header">','<h3 data-bind="html: title"></h3>',"</div>",'<div class="modal-body">','<p class="message" data-bind="html: message"></p>',"</div>",'<div class="modal-footer">',"<!-- ko foreach: options -->",'<button data-bind="click: function () { $parent.selectOption($parent.getButtonValue($data)); }, text: $parent.getButtonText($data), css: $parent.getButtonClass($index)"></button>',"<!-- /ko -->",'<div style="clear:both;"></div>',"</div>","</div>"].join("\n"),l={MessageBox:d,currentZIndex:1050,getNextZIndex:function(){return++this.currentZIndex},isOpen:a.computed(function(){return c()>0}),getContext:function(e){return u[e||"default"]},addContext:function(e,t){t.name=e,u[e]=t;var n="show"+e.substr(0,1).toUpperCase()+e.substr(1);this[n]=function(t,n){return this.show(t,n,e)}},createCompositionSettings:function(e,t){var n={model:e,activate:!1,transition:!1};return t.binding&&(n.binding=t.binding),t.attached&&(n.attached=t.attached),t.compositionComplete&&(n.compositionComplete=t.compositionComplete),n},getDialog:function(e){return e?e.__dialog__:void 0},close:function(e){var t=this.getDialog(e);if(t){var n=Array.prototype.slice.call(arguments,1);t.close.apply(t,n)}},show:function(t,r,o){var a=this,l=u[o||"default"];return e.defer(function(e){s(t).then(function(t){var o=i.create();o.activateItem(t,r).then(function(i){if(i){var r=t.__dialog__={owner:t,context:l,activator:o,close:function(){var n=arguments;o.deactivateItem(t,!0).then(function(i){i&&(c(c()-1),l.removeHost(r),delete t.__dialog__,0===n.length?e.resolve():1===n.length?e.resolve(n[0]):e.resolve.apply(e,n))})}};r.settings=a.createCompositionSettings(t,l),l.addHost(r),c(c()+1),n.compose(r.host,r.settings)}else e.resolve(!1)})})}).promise()},showMessage:function(t,n,i,r,o){return e.isString(this.MessageBox)?l.show(this.MessageBox,[t,n||d.defaultTitle,i||d.defaultOptions,r||!1,o||{}]):l.show(new this.MessageBox(t,n,i,r,o))},install:function(e){t.showDialog=function(e,t,n){return l.show(e,t,n)},t.closeDialog=function(){return l.close.apply(l,arguments)},t.showMessage=function(e,t,n,i,r){return l.showMessage(e,t,n,i,r)},e.messageBox&&(l.MessageBox=e.messageBox),e.messageBoxView&&(l.MessageBox.prototype.getView=function(){return r.processMarkup(e.messageBoxView)}),e.messageBoxViewUrl&&l.MessageBox.setViewUrl(e.messageBoxViewUrl)}},l.addContext("default",{blockoutOpacity:.2,removeDelay:200,addHost:function(e){var t=o("body"),n=o('<div class="modalBlockout"></div>').css({"z-index":l.getNextZIndex(),opacity:this.blockoutOpacity}).appendTo(t),i=o('<div class="modalHost"></div>').css({"z-index":l.getNextZIndex()}).appendTo(t);if(e.host=i.get(0),e.blockout=n.get(0),!l.isOpen()){e.oldBodyMarginRight=t.css("margin-right"),e.oldInlineMarginRight=t.get(0).style.marginRight;var r=o("html"),a=t.outerWidth(!0),s=r.scrollTop();o("html").css("overflow-y","hidden");var u=o("body").outerWidth(!0);t.css("margin-right",u-a+parseInt(e.oldBodyMarginRight,10)+"px"),r.scrollTop(s)}},removeHost:function(e){if(o(e.host).css("opacity",0),o(e.blockout).css("opacity",0),setTimeout(function(){a.removeNode(e.host),a.removeNode(e.blockout)},this.removeDelay),!l.isOpen()){var t=o("html"),n=t.scrollTop();t.css("overflow-y","").scrollTop(n),e.oldInlineMarginRight?o("body").css("margin-right",e.oldBodyMarginRight):o("body").css("margin-right","")}},attached:function(e){o(e).css("visibility","hidden")},compositionComplete:function(e,t,n){var i=l.getDialog(n.model),r=o(e),a=r.find("img").filter(function(){var e=o(this);return!(this.style.width&&this.style.height||e.attr("width")&&e.attr("height"))});r.data("predefinedWidth",r.get(0).style.width);var s=function(e,t){setTimeout(function(){var n=o(e);t.context.reposition(e),o(t.host).css("opacity",1),n.css("visibility","visible"),n.find(".autofocus").first().focus()},1)};s(e,i),a.load(function(){s(e,i)}),(r.hasClass("autoclose")||n.model.autoclose)&&o(i.blockout).click(function(){i.close()})},reposition:function(e){var t=o(e),n=o(window);t.data("predefinedWidth")||t.css({width:""});var i=t.outerWidth(!1),r=t.outerHeight(!1),a=n.height()-10,s=n.width()-10,l=Math.min(r,a),u=Math.min(i,s);t.css({"margin-top":(-l/2).toString()+"px","margin-left":(-u/2).toString()+"px"}),r>a?t.css("overflow-y","auto").outerHeight(a):t.css({"overflow-y":"",height:""}),i>s?t.css("overflow-x","auto").outerWidth(s):(t.css("overflow-x",""),t.data("predefinedWidth")?t.css("width",t.data("predefinedWidth")):t.outerWidth(u))}}),l});