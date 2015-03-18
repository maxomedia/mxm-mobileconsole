(function debug() {
	if(!'ontouchstart' in window || ('msMaxTouchPoints' in navigator && ua.indexOf(' arm;') >= 0) || window.console == undefined)
		return false;

	var top 		= false;

	var $console 	= document.getElementById('mxmConsole');
	var $inner;

	var timeout;	
	
	window.console 	= window.console || {};
	window.console.log = function() {
		createHTMLConsole();
		argsLogger(arguments);
	};

	function argsLogger(args) {
		if(!args)
			return false;

		console.info(typeof args, args.length, args);
		
		for(var i in args) {
			// if is DOM-Element
			if(args[i].nodeType != undefined) {
				var nodeName 	= (args[i].nodeName || args[i].tagName).toLowerCase();
				var attributes 	= args[i].attributes;

				var outputAttrs = '';

				if(attributes) {
					for(var i=0; i<attributes.length; i++) {
						outputAttrs += ' ' + attributes[i].name + '="' + attributes[i].value + '"';
					};
				}

				output('<' + nodeName + outputAttrs + '></' + nodeName + '>');

			// if is jQuery Element
			} else if(args[i].selector != undefined) {
				for(var j=0; j<args[i].length; j++) {
					argsLogger([args[i][j]]);
				}

			// if is Object
			} else if(typeof args[i] == 'object') {
				argsLogger(args[i]);

			// if is Loggable
			} else {
				output(args[i]);
			}
		}

		function output(log) {
			var div = document.createElement('div');
			div.innerText = log;

			$inner.appendChild(div);
			showConsole();
		};
	};

	function showConsole() {
		$console.className = $console.className.replace(/\s?visible/g,'') + ' visible';
		$inner.scrollTop = $inner.scrollHeight;
		hideConsole();
	};

	function hideConsole() {
		if(timeout)
			clearTimeout(timeout);

		timeout = setTimeout(function() {
			$console.className = $console.className.replace(/ visible/g,'');
		},15000);
	};

	function createHTMLConsole() {
		if(!$console) {
			var consoleContainer 	= document.createElement('div');
			var consoleInner 		= document.createElement('div');
			var consoleStyle 		= document.createElement('link');
			
			consoleContainer.id = 'console';
			consoleStyle.type 	= 'text/css';
			consoleStyle.rel = 'stylesheet';
			consoleStyle.href = 'https://raw.githubusercontent.com/maxomedia/mxm-mobileconsole/externalize/styles.less';
			
			if(top)
				consoleContainer.className = 'top';
			
			/*if(consoleStyle.styleSheet) {
				consoleStyle.styleSheet.cssText = css;
			} else {
				consoleStyle.appendChild(document.createTextNode(css));
			}*/

			consoleContainer.appendChild(consoleInner);
			consoleContainer.appendChild(consoleStyle);

			document.body.appendChild(consoleContainer);

			$console 	= consoleContainer;
			$inner 		= consoleInner;

			$console.addEventListener('touchmove', function(e) {
				if(e.stopPropagation)
					e.stopPropagation();

				if(e.cancelBubble)
					e.cancelBubble = true;
			});
		} else {
			$inner = $console.childNodes[0];
		}
	};
}());