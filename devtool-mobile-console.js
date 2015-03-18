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
			var consoleStyle 		= document.createElement('style');

			var css 				= '';

			css += '#console {';
			css += '	position: fixed;';
			css += '	bottom: 0;';
			css += '	left: 0;';
			css += '	padding: 0em 1em;';
			css += '	width: 100%;';
			css += '	background-color: rgba(255,255,255,0.9);';
			css += '	font-family: "courier new", courier, monospace;';
			css += '	font-size: 11px;';
			css += '	color: #000;';
			css += '	line-height: 1em;';
			css += '	z-index: 100000;';
			css += '	-webkit-transition: all 400ms ease-out; -moz-transition: all 400ms ease-out; -ms-transition: all 400ms ease-out; -o-transition: all 400ms ease-out; transition: all 400ms ease-out;';
			css += '}';

			css += '#console.top {';
			css += '	bottom: auto;';
			css += '	top: 0;';
			css += '}';

			css += '#console:before {';
			css += '	display: block;';
			css += '	content: "mobile Console";';
			css += '	position: absolute;';
			css += '	bottom: 100%;';
			css += '	left: 25%;';
			css += '	right: 25%;';
			css += '	background-color: #fff;';
			css += '	border: solid #999;';
			css += '	border-width: 1px 0 0;';
			css += '	font-size: 9px;';
			css += '	text-align: center;';
			css += '	-webkit-border-radius: 50% 50% 0 0; -moz-border-radius: 50% 50% 0 0; -ms-border-radius: 50% 50% 0 0; -o-border-radius: 50% 50% 0 0; border-radius: 50% 50% 0 0;';
			css += '	-webkit-transition: all 400ms ease-out; -moz-transition: all 400ms ease-out; -ms-transition: all 400ms ease-out; -o-transition: all 400ms ease-out; transition: all 400ms ease-out;';
			css += '}';

			css += '#console.top:before {';
			css += '	bottom: auto;';
			css += '	top: 100%;';
			css += '	border-width: 0 0 1px;';
			css += '	-webkit-border-radius: 0 0 50% 50%; -moz-border-radius: 0 0 50% 50%; -ms-border-radius: 0 0 50% 50%; -o-border-radius: 0 0 50% 50%; border-radius: 0 0 50% 50%;';
			css += '}';

			css += '#console > div {';
			css += '	overflow: hidden;';
			css += '	overflow-y: scroll;';
			css += '	-webkit-overflow-scrolling: touch;';
			css += '	max-height: 0em;';
			css += '	-webkit-transition: all 400ms ease-out; -moz-transition: all 400ms ease-out; -ms-transition: all 400ms ease-out; -o-transition: all 400ms ease-out; transition: all 400ms ease-out;';
			css += '}';

			css += '#console > div > div {';
			css += '	padding: 0.25em;';
			css += '	border-bottom: 1px solid #ccc;';
			css += '}';

			css += '#console.visible {';
			css += '	padding-top: 1em;';
			css += '	padding-bottom: 1em;';
			//css += '	-webkit-box-shadow: 0 0 20px 0 rgba(0,0,0,0.25); -moz-box-shadow: 0 0 20px 0 rgba(0,0,0,0.25); -ms-box-shadow: 0 0 20px 0 rgba(0,0,0,0.25); -o-box-shadow: 0 0 20px 0 rgba(0,0,0,0.25); box-shadow: 0 0 20px 0 rgba(0,0,0,0.25);';
			css += '}';

			css += '#console.visible:before {';
			css += '	left: 0%;';
			css += '	right: 0%;';
			css += '	-webkit-box-shadow: 0 0 10px 0 rgba(0,0,0,0.25); -moz-box-shadow: 0 0 10px 0 rgba(0,0,0,0.25); -ms-box-shadow: 0 0 10px 0 rgba(0,0,0,0.25); -o-box-shadow: 0 0 10px 0 rgba(0,0,0,0.25); box-shadow: 0 0 10px 0 rgba(0,0,0,0.25);';
			css += '}';

			css += '#console.visible > div {';
			css += '	max-height: 8em;';
			css += '}';
			
			consoleContainer.id = 'console';
			consoleStyle.type 	= 'text/css';
			
			if(top)
				consoleContainer.className = 'top';
			
			if(consoleStyle.styleSheet) {
				consoleStyle.styleSheet.cssText = css;
			} else {
				consoleStyle.appendChild(document.createTextNode(css));
			}

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