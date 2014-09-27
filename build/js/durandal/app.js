define(["durandal/system","durandal/viewEngine","durandal/composition","durandal/events","jquery"],function(e,t,n,i,r){function o(){return e.defer(function(t){return 0==s.length?(t.resolve(),void 0):(e.acquire(s).then(function(n){for(var i=0;i<n.length;i++){var r=n[i];if(r.install){var o=l[i];e.isObject(o)||(o={}),r.install(o),e.log("Plugin:Installed "+s[i])}else e.log("Plugin:Loaded "+s[i])}t.resolve()}).fail(function(t){e.error("Failed to load plugin(s). Details: "+t.message)}),void 0)}).promise()}var a,s=[],l=[];return a={title:"Application",configurePlugins:function(t,n){var i=e.keys(t);n=n||"plugins/",-1===n.indexOf("/",n.length-1)&&(n+="/");for(var r=0;r<i.length;r++){var o=i[r];s.push(n+o),l.push(t[o])}},start:function(){return e.log("Application:Starting"),this.title&&(document.title=this.title),e.defer(function(t){r(function(){o().then(function(){t.resolve(),e.log("Application:Started")})})}).promise()},setRoot:function(i,r,o){function a(){if(l.model)if(l.model.canActivate)try{var t=l.model.canActivate();t&&t.then?t.then(function(e){e&&n.compose(s,l)}).fail(function(t){e.error(t)}):t&&n.compose(s,l)}catch(i){e.error(i)}else n.compose(s,l);else n.compose(s,l)}var s,l={activate:!0,transition:r};s=!o||e.isString(o)?document.getElementById(o||"applicationHost"):o,e.isString(i)?t.isViewUrl(i)?l.view=i:l.model=i:l.model=i,e.isString(l.model)?e.acquire(l.model).then(function(t){l.model=e.resolveObject(t),a()}).fail(function(t){e.error("Failed to load root module ("+l.model+"). Details: "+t.message)}):a()}},i.includeIn(a),a});