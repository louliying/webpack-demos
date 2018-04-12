(function(){

	var rem;
	/*var docEl = document.documentElement;
	var fontEl = document.createElement('style');
	var metaEl = document.querySelector('meta[name="viewport"]');

	var 	browerAgent = window.navigator.userAgent,
		isMobile = ( !! browerAgent.match(/android/gi),!!browerAgent.match(/iphone/gi)),
		wc = isMobile && !!browerAgent.match(/OS 9_3/),
		dpr = window.devicePixelRatio;
	
	var dpr = isMobile && !wc ? dpr >= 3 && (!dpr || dpr >= 3) ? 3 : dpr >= 2 && (!dpr || dpr >= 2) ? 2 : 1 : 1;
	var scale = 1 / dpr;

	// 设置viewport，进行缩放，达到高清效果
	metaEl.setAttribute('content', 'width=' + dpr * docEl.clientWidth + ',initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale + ',user-scalable=no');

	// 设置data-dpr属性，留作的css hack之用
	docEl.setAttribute('data-dpr', dpr);*/

	function w() {
		var r = document.documentElement;
		var a = r.getBoundingClientRect().width;
		a > 750 && (a = 750), rem = a/750 *100 , r.style.fontSize = rem + "px"
	}

	var t;
	w(), window.addEventListener("resize", function() {
	  t && clearTimeout(t), t = setTimeout(w, 300)
	}, false);

})();
