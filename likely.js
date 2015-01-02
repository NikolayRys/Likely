//! Based on Social Likes by Artem Sapegin, see http://sapegin.github.com/social-likes
/*global define:false, socialLikesButtons:false */

(function(factory) {  // Try to register as an anonymous AMD module
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	}
	else {
		factory(jQuery);
	}
}(function($, undefined) {

	'use strict';

	var prefix = 'likely';
	var classPrefix = prefix + '__';
	var openClass = prefix + '_opened';
	var protocol = location.protocol === 'https:' ? 'https:' : 'http:';
	var svgiB = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M';
	var svgiE = 'z"/></svg>';


	var services = {
		facebook: {
			// https://developers.facebook.com/docs/reference/fql/link_stat/
			svgi: '12 1H4C2 1 1 2 1 4v8c0 2 1 3 3 3h5V9H7V7h2V5c0-2 2-2 2-2h2v2h-2v2h2v2h-2v6h1c2 0 3-1 3-3V4c0-2-1-3-3-3',
			counterUrl: 'https://graph.facebook.com/fql?q=SELECT+total_count+FROM+link_stat+WHERE+url%3D%22{url}%22&callback=?',
			convertNumber: function(data) {
				return data.data[0].total_count;
			},
			popupUrl: 'https://www.facebook.com/sharer/sharer.php?u={url}',
			popupWidth: 600,
			popupHeight: 500
		},
		twitter: {
			svgi: '14.964 4.036c-.035.134-.125.272-.207.362l-.104.05v.105l-.517.466-.206.257c-.044.03-.35.183-.362.207v1.24h-.052v.414h-.052v.258h-.05v.26h-.053v.205h-.05v.208h-.053L13 9h-.052v.103h-.05l-.053.26h-.052l-.104.31h-.053l-.104.31-.103.052-.052.207-.104.052v.103l-.104.053v.104h-.052l-.05.154-.105.053v.104l-.155.104v.104l-.207.155v.104c-.17.155-.344.312-.516.466l-.465.518h-.105c-.052.068-.104.137-.155.207l-.155.052-.052.104h-.104l-.053.104c-.05.018-.104.035-.155.052v.052h-.104l-.052.104c-.104.034-.207.068-.31.104l-.052.104-.207.05v.054c-.103.033-.207.068-.31.104v.05h-.155v.053H8.55v.052h-.156v.05H8.29v.053h-.155v.052H7.98v.052l-.362.052v.05H7.41c-.583.194-1.273.26-2.067.26h-.775v-.052h-.465v-.053h-.258v-.05h-.26v-.054H3.33v-.05h-.155v-.052h-.207v-.052H2.81v-.052h-.154v-.052H2.5v-.052h-.154v-.052h-.104v-.052l-.258-.052v-.05l-.31-.105v-.054H1.57v-.05h-.104v-.054h-.104v-.05h-.104l-.05-.105h-.105v-.052c-.115-.07-.073.022-.155-.104h1.396v-.05c.258-.036.517-.07.775-.105v-.052h.154v-.052h.207v-.05h.105v-.053h.155v-.05h.104v-.054H4v-.05c.068-.02.137-.036.206-.054v-.052l.207-.053.052-.103.207-.052c.017-.035.034-.068.05-.104h.105l.052-.104h.103c.03-.02.042-.068.104-.104v-.05c-.892-.07-1.612-.474-2.017-1.036-.07-.05-.138-.104-.207-.154v-.104l-.104-.052v-.104c-.1-.177-.234-.31-.26-.57.4.005.87.01 1.19-.05v-.053c-.222-.008-.41-.07-.57-.154v-.05h-.103v-.053c-.064-.017-.133-.034-.202-.05l-.052-.104H2.66c-.035-.052-.07-.103-.104-.156h-.103l-.207-.258-.103-.053v-.103l-.155-.103c-.306-.44-.525-1.006-.517-1.757h.053c.18.204.83.33 1.19.362v-.053c-.226-.102-.593-.472-.725-.67v-.105l-.104-.05-.103-.31h-.05V5.74h-.053c-.034-.172-.07-.345-.103-.517-.053-.166-.18-.61-.104-.88h.052v-.36h.052V3.83h.052v-.155h.05V3.52h.053l.103-.31h.104v.052l.31.26v.103c.034.015.068.032.103.05l.206.258.155.05.31.362h.105l.155.208h.104l.05.104h.105l.102.155h.104l.05.103.208.052.052.103c.104.034.207.068.31.104l.05.103c.156.05.31.104.466.154v.054h.104v.05c.07.02.138.036.207.053v.052l.31.05v.052h.155v.052h.155v.052h.155v.052h.207v.052L6.59 6v.053c.412.05.826.103 1.24.154V6c-.09-.098-.053-.387-.052-.568 0-.502.132-.868.31-1.19V4.14c.034-.02.07-.035.104-.053l.05-.206c.053-.033.105-.067.156-.103v-.104l.362-.31.052-.102h.104l.103-.155c.068-.017.137-.035.206-.05l.05-.105h.105v-.052h.104v-.05h.155v-.054h.154v-.05h.155V2.69h.257v-.05h.93v.05h.26v.053h.154v.05h.156v.054h.155v.05h.105v.053h.104l.05.104.207.052.104.155h.104l.052.104c.125.115.17.142.414.156.12-.105.248-.044.414-.104v-.053h.155v-.05h.154V3.26l.207-.052v-.052h.156l.517-.31V3h-.052l-.05.26h-.053v.102h-.052v.104l-.103.053v.103c-.052.034-.104.068-.155.104v.103l-.104.052-.31.36h-.104l-.156.208h.052c.116-.1.353-.047.517-.104l.93-.31',
			counterUrl: 'https://cdn.api.twitter.com/1/urls/count.json?url={url}&callback=?',
			convertNumber: function(data) {
				return data.count;
			},
			popupUrl: 'https://twitter.com/intent/tweet?url={url}&text={title}',
			popupWidth: 600,
			popupHeight: 450,
			click: function() {
				// Add colon to improve readability
				if (!/[\.:\-–—]\s*$/.test(this.options.title)) this.options.title += ':';
				return true;
			}
		},
		vk: {
			svgi: '8.932 7.008c.19-.15.283-.393.283-.73 0-.186-.032-.34-.094-.46s-.146-.213-.25-.28c-.106-.067-.226-.114-.363-.14-.136-.027-.277-.04-.424-.04h-1.36v1.874H8.21c.292 0 .533-.075.722-.224zm-.598 1.425h-1.61v2.198h1.58c.16 0 .314-.016.46-.05.148-.033.277-.09.39-.168.11-.078.2-.185.266-.32.067-.134.1-.306.1-.516 0-.41-.108-.704-.325-.88-.218-.175-.504-.263-.86-.263zM12 1H4C2 1 1 2 1 4v8c0 2 1 3 3 3h8c2 0 3-1 3-3V4c0-2-1-3-3-3zm-.967 9.727c-.146.295-.344.537-.592.724-.247.187-.53.326-.848.416-.317.09-.644.134-.98.134H5V4h3.508c.356 0 .682.023.975.09.293.068.544.18.754.332.21.153.372.357.487.61.115.255.173.57.173.943 0 .403-.085.74-.256 1.01-.17.268-.423.49-.76.66.462.144.806.393 1.033.747.227.355.34.784.34 1.285 0 .405-.073.755-.22 1.05',
			counterUrl: protocol + '//vk.com/share.php?act=count&url={url}&index={index}',
			counter: function(jsonUrl, deferred) {
				var options = services.vk;
				if (!options._) {
					options._ = [];
					if (!window.VK) window.VK = {};
					window.VK.Share = {
						count: function(idx, number) {
							options._[idx].resolve(number);
						}
					};
				}

				var index = options._.length;
				options._.push(deferred);
				$.getScript(makeUrl(jsonUrl, {index: index}))
					.fail(deferred.reject);
			},
			popupUrl: protocol + '//vk.com/share.php?url={url}&title={title}',
			popupWidth: 550,
			popupHeight: 330
		},
		gplus: {
			svgi: '15 7h-2V5h-1v2h-2v1h2v2h1V8h2z"/><path d="M4.604 14.352c-1.227-.01-2.164-.28-2.783-.808C1.19 13.05.867 12.44.867 11.73c0-.34.104-.724.31-1.136.2-.42.567-.79 1.086-1.098.564-.325 1.168-.546 1.795-.656.458-.067.846-.11 1.177-.135-.052-.084-.1-.17-.146-.26-.124-.193-.19-.442-.19-.73 0-.175.026-.32.08-.447v-.005c-.092.006-.18.008-.267.008-.958-.01-1.702-.322-2.21-.922-.522-.547-.79-1.202-.79-1.94 0-.886.375-1.698 1.113-2.415.512-.426 1.047-.703 1.593-.832.52-.106 1.022-.16 1.49-.16H10l-1.65.967-.627.017c.133.144.257.306.38.498.12.19.23.42.328.686.084.272.125.587.125.937-.01.65-.158 1.18-.437 1.573-.132.185-.272.354-.42.51-.163.162-.333.313-.512.47-.08.086-.167.196-.247.318-.084.116-.122.235-.122.38 0 .13.036.235.106.312.092.116.172.206.25.286l.563.46c.367.303.695.64.97 1.006.28.394.425.905.437 1.522 0 .88-.388 1.668-1.154 2.342-.785.687-1.923 1.046-3.382 1.067h-.004zm.975-4.826c-.113 0-.3.013-.562.038-.334.047-.686.127-1.04.236-.074.027-.19.075-.343.14-.14.065-.288.16-.435.28-.134.12-.252.274-.35.458-.11.193-.164.42-.164.693 0 .54.24.975.73 1.33.478.36 1.15.55 2 .56.748-.01 1.324-.175 1.71-.488.366-.304.544-.684.544-1.16 0-.382-.126-.72-.375-1.005-.28-.288-.74-.656-1.36-1.09l-.356.01zm-.724-7.583c-.404.012-.732.172-1.002.49-.227.337-.335.713-.324 1.14 0 .586.173 1.204.515 1.84.16.287.37.532.624.73.24.19.518.286.825.286.394-.017.716-.156.98-.428.11-.17.192-.37.226-.567.024-.205.036-.392.036-.54 0-.64-.166-1.296-.494-1.948-.147-.3-.343-.55-.58-.734-.23-.166-.5-.258-.806-.27',
			// HTTPS not supported yet: http://clubs.ya.ru/share/1499
			counterUrl: protocol === 'http:' ? 'http://share.yandex.ru/gpp.xml?url={url}' : undefined,
			counter: function(jsonUrl, deferred) {
				var options = services.gplus;
				if (options._) {
					// Reject all counters except the first because Yandex Share counter doesn’t return URL
					deferred.reject();
					return;
				}

				if (!window.services) window.services = {};
				window.services.gplus = {
					cb: function(number) {
						options._.resolve(number);
					}
				};

				options._ = deferred;
				$.getScript(makeUrl(jsonUrl))
					.fail(deferred.reject);
			},
			popupUrl: 'https://plus.google.com/share?url={url}',
			popupWidth: 700,
			popupHeight: 500
		},
		pinterest: {
			svgi: '7.99.625C3.92.625.617 3.927.617 8c0 3.124 1.944 5.793 4.687 6.868-.065-.584-.123-1.48.026-2.116.133-.575.864-3.666.864-3.666s-.22-.442-.22-1.095c0-1.024.593-1.79 1.333-1.79.63 0 .933.472.933 1.04 0 .632-.403 1.578-.61 2.454-.175.734.367 1.333 1.09 1.333 1.312 0 2.32-1.382 2.32-3.377 0-1.766-1.27-3-3.082-3-2.098 0-3.33 1.574-3.33 3.2 0 .634.244 1.314.55 1.683.06.073.068.137.05.21-.056.234-.18.735-.205.838-.032.136-.107.165-.247.1-.92-.43-1.497-1.776-1.497-2.857 0-2.326 1.69-4.463 4.872-4.463 2.558 0 4.547 1.823 4.547 4.26 0 2.54-1.604 4.586-3.828 4.586-.747 0-1.45-.388-1.69-.847l-.46 1.752c-.166.64-.615 1.444-.916 1.933.69.214 1.423.33 2.184.33 4.073 0 7.375-3.303 7.375-7.376S12.065.624 7.99.624',
			counterUrl: protocol + '//api.pinterest.com/v1/urls/count.json?url={url}&callback=?',
			convertNumber: function(data) {
				return data.count;
			},
			popupUrl: protocol + '//pinterest.com/pin/create/button/?url={url}&description={title}',
			popupWidth: 630,
			popupHeight: 270
		}
		/*
		mailru: {
			counterUrl: protocol + '//connect.mail.ru/share_count?url_list={url}&callback=1&func=?',
			convertNumber: function(data) {
				for (var url in data) {
					if (data.hasOwnProperty(url)) {
						return data[url].shares;
					}
				}
			},
			popupUrl: protocol + '//connect.mail.ru/share?share_url={url}&title={title}',
			popupWidth: 550,
			popupHeight: 360
		},
		odnoklassniki: {
			counterUrl: protocol + '//www.ok.ru/dk/?st.cmd=extLike&ref={url}&uid={index}',
			counter: function(jsonUrl, deferred) {
				var options = services.odnoklassniki;
				if (!options._) {
					options._ = [];
					if (!window.ODKL) window.ODKL = {};
					window.ODKL.updateCount = function(idx, number) {
						options._[idx].resolve(number);
					};
				}

				var index = options._.length;
				options._.push(deferred);
				$.getScript(makeUrl(jsonUrl, {index: index}))
					.fail(deferred.reject);
			},
			popupUrl: 'http://www.ok.ru/dk/?st.cmd=addShare&st._surl={url}',
			popupWidth: 550,
			popupHeight: 360
		},
		*/
	};


	/**
	 * Counters manager
	 */
	var counters = {
		promises: {},
		fetch: function(service, url, extraOptions) {
			if (!counters.promises[service]) counters.promises[service] = {};
			var servicePromises = counters.promises[service];

			if (!extraOptions.forceUpdate && servicePromises[url]) {
				return servicePromises[url];
			}
			else {
				var options = $.extend({}, services[service], extraOptions);
				var deferred = $.Deferred();
				var jsonUrl = options.counterUrl && makeUrl(options.counterUrl, {url: url});

				if (jsonUrl && $.isFunction(options.counter)) {
					options.counter(jsonUrl, deferred);
				}
				else if (options.counterUrl) {
					$.getJSON(jsonUrl)
						.done(function(data) {
							try {
								var number = data;
								if ($.isFunction(options.convertNumber)) {
									number = options.convertNumber(data);
								}
								deferred.resolve(number);
							}
							catch (e) {
								deferred.reject();
							}
						})
						.fail(deferred.reject);
				}
				else {
					deferred.reject();
				}

				servicePromises[url] = deferred.promise();
				return servicePromises[url];
			}
		}
	};


	/**
	 * jQuery plugin
	 */
	$.fn.socialLikes = function(options) {
		return this.each(function() {
			var elem = $(this);
			var instance = elem.data(prefix);
			if (instance) {
				if ($.isPlainObject(options)) {
					instance.update(options);
				}
			}
			else {
				instance = new SocialLikes(elem, $.extend({}, $.fn.socialLikes.defaults, options, dataToOptions(elem)));
				elem.data(prefix, instance);
			}
		});
	};

	$.fn.socialLikes.defaults = {
		url: window.location.href.replace(window.location.hash, ''),
		title: document.title,
		counters: true,
		zeroes: false,
		wait: 1000,
		popupCheckInterval: 500,
		//singleTitle: 'Share'
	};

	function SocialLikes(container, options) {
		this.container = container;
		this.options = options;
		this.init();
	}

	SocialLikes.prototype = {
		init: function() {
			// Add class in case of manual initialization
			this.container.addClass(prefix);

			//this.single = this.container.hasClass(prefix + '_single');

			this.initUserButtons();

			this.countersLeft = 0;
			this.number = 0;
			this.container.on('counter.' + prefix, $.proxy(this.updateCounter, this));

			var buttons = this.container.children();

			// this.makeSingleButton();

			this.buttons = [];
			buttons.each($.proxy(function(idx, elem) {
				var button = new Button($(elem), this.options);
				this.buttons.push(button);
				if (button.options.counterUrl) this.countersLeft++;
			}, this));

			if (this.options.counters) {
				this.timer = setTimeout($.proxy(this.appear, this), this.options.wait);
			}
			else {
				this.appear();
			}
		},
		initUserButtons: function() {
			if (!this.userButtonInited && window.socialLikesButtons) {
				$.extend(true, services, socialLikesButtons);
			}
			this.userButtonInited = true;
		},

		update: function(options) {
			if (!options.forceUpdate && options.url === this.options.url) return;

			// Reset counters
			this.number = 0;
			this.countersLeft = this.buttons.length;
			if (this.widget) this.widget.find('.' + prefix + '__counter').remove();

			// Update options
			$.extend(this.options, options);
			for (var buttonIdx = 0; buttonIdx < this.buttons.length; buttonIdx++) {
				this.buttons[buttonIdx].update(options);
			}
		},
		updateCounter: function(e, service, number) {
			if (number) {
				this.number += number;
				/*
				if (this.single) {
					this.getCounterElem().text(this.number);
				}
				*/
			}

			this.countersLeft--;
			if (this.countersLeft === 0) {
				this.appear();
				this.container.addClass(prefix + '_ready');
				this.container.trigger('ready.' + prefix, this.number);
			}
		},
		appear: function() {
			this.container.addClass(prefix + '_visible');
		},
		getCounterElem: function() {
			var counterElem = this.widget.find('.' + classPrefix + 'counter_single');
			if (!counterElem.length) {
				counterElem = $('<span>', {
					'class': getElementClassNames('counter', 'single')
				});
				this.widget.append(counterElem);
			}
			return counterElem;
		}
	};


	function Button(widget, options) {
		this.widget = widget;
		this.options = $.extend({}, options);
		this.detectService();
		if (this.service) {
			this.init();
		}
	}

	Button.prototype = {
		init: function() {
			this.detectParams();
			this.initHtml();
			setTimeout($.proxy(this.initCounter, this), 0);
		},

		update: function(options) {
			$.extend(this.options, {forceUpdate: false}, options);
			this.widget.find('.' + prefix + '__counter').remove();  // Remove old counter
			this.initCounter();
		},

		detectService: function() {
			var service = this.widget.data('service');
			if (!service) {
				// class="facebook"
				var node = this.widget[0];
				var classes = node.classList || node.className.split(' ');
				for (var classIdx = 0; classIdx < classes.length; classIdx++) {
					var cls = classes[classIdx];
					if (services[cls]) {
						service = cls;
						break;
					}
				}
				if (!service) return;
			}
			this.service = service;
			$.extend(this.options, services[service]);
		},

		detectParams: function() {
			var data = this.widget.data();

			// Custom page counter URL or number
			if (data.counter) {
				var number = parseInt(data.counter, 10);
				if (isNaN(number)) {
					this.options.counterUrl = data.counter;
				}
				else {
					this.options.counterNumber = number;
				}
			}

			// Custom page title
			if (data.title) {
				this.options.title = data.title;
			}

			// Custom page URL
			if (data.url) {
				this.options.url = data.url;
			}
		},

		initHtml: function() {
			var options = this.options;
			var widget = this.widget;

			// Old initialization HTML
			var a = widget.find('a');
			if (a.length) {
				this.cloneDataAttrs(a, widget);
			}

			// Button
			var button = $('<span>', {
				'class': this.getElementClassNames('button'),
				'text': widget.text()
			});
			if (options.clickUrl) {
				var url = makeUrl(options.clickUrl, {
					url: options.url,
					title: options.title
				});
				var link = $('<a>', {
					href: url
				});
				this.cloneDataAttrs(widget, link);
				widget.replaceWith(link);
				this.widget = widget = link;
			}
			else {
				widget.click($.proxy(this.click, this));
			}

			widget.removeClass(this.service);
			widget.addClass(this.getElementClassNames('widget'));

			console.log(options)

			// Icon
			button.prepend($('<span class="likely__icon">'+svgiB+options.svgi+svgiE+'</span>', {'class': this.getElementClassNames('icon')}));

			widget.empty().append(button);
			this.button = button;
		},

		initCounter: function() {
			if (this.options.counters) {
				if (this.options.counterNumber) {
					this.updateCounter(this.options.counterNumber);
				}
				else {
					var extraOptions = {
						counterUrl: this.options.counterUrl,
						forceUpdate: this.options.forceUpdate
					};
					counters.fetch(this.service, this.options.url, extraOptions)
						.always($.proxy(this.updateCounter, this));
				}
			}
		},

		cloneDataAttrs: function(source, destination) {
			var data = source.data();
			for (var key in data) {
				if (data.hasOwnProperty(key)) {
					destination.data(key, data[key]);
				}
			}
		},

		getElementClassNames: function(elem) {
			return getElementClassNames(elem, this.service);
		},

		updateCounter: function(number) {
			number = parseInt(number, 10) || 0;

			var params = {
				'class': this.getElementClassNames('counter'),
				'text': number
			};
			if (!number && !this.options.zeroes) {
				params['class'] += ' ' + prefix + '__counter_empty';
				params.text = '';
			}
			var counterElem = $('<span>', params);
			this.widget.append(counterElem);

			this.widget.trigger('counter.' + prefix, [this.service, number]);
		},

		click: function(e) {
			var options = this.options;
			var process = true;
			if ($.isFunction(options.click)) {
				process = options.click.call(this, e);
			}
			if (process) {
				var url = makeUrl(options.popupUrl, {
					url: options.url,
					title: options.title
				});
				url = this.addAdditionalParamsToUrl(url);
				this.openPopup(url, {
					width: options.popupWidth,
					height: options.popupHeight
				});
			}
			return false;
		},

		addAdditionalParamsToUrl: function(url) {
			var params = $.param($.extend(this.widget.data(), this.options.data));
			if ($.isEmptyObject(params)) return url;
			var glue = url.indexOf('?') === -1 ? '?' : '&';
			return url + glue + params;
		},

		openPopup: function(url, params) {
			var left = Math.round(screen.width/2 - params.width/2);
			var top = 0;
			if (screen.height > params.height) {
				top = Math.round(screen.height/3 - params.height/2);
			}

			var win = window.open(url, 'sl_' + this.service, 'left=' + left + ',top=' + top + ',' +
			   'width=' + params.width + ',height=' + params.height + ',personalbar=0,toolbar=0,scrollbars=1,resizable=1');
			if (win) {
				win.focus();
				this.widget.trigger('popup_opened.' + prefix, [this.service, win]);
				var timer = setInterval($.proxy(function() {
					if (!win.closed) return;
					clearInterval(timer);
					this.widget.trigger('popup_closed.' + prefix, this.service);
				}, this), this.options.popupCheckInterval);
			}
			else {
				location.href = url;
			}
		}
	};


	/**
	 * Helpers
	 */

	 // Camelize data-attributes
	function dataToOptions(elem) {
		function upper(m, l) {
			return l.toUpper();
		}
		var options = {};
		var data = elem.data();
		for (var key in data) {
			var value = data[key];
			if (value === 'yes') value = true;
			else if (value === 'no') value = false;
			options[key.replace(/-(\w)/g, upper)] = value;
		}
		return options;
	}

	function makeUrl(url, context) {
		return template(url, context, encodeURIComponent);
	}

	function template(tmpl, context, filter) {
		return tmpl.replace(/\{([^\}]+)\}/g, function(m, key) {
			// If key doesn't exists in the context we should keep template tag as is
			return key in context ? (filter ? filter(context[key]) : context[key]) : m;
		});
	}

	function getElementClassNames(elem, mod) {
		var cls = classPrefix + elem;
		return cls + ' ' + cls + '_' + mod;
	}

	function closeOnClick(elem, callback) {
		function handler(e) {
			if ((e.type === 'keydown' && e.which !== 27) || $(e.target).closest(elem).length) return;
			elem.removeClass(openClass);
			doc.off(events, handler);
			if ($.isFunction(callback)) callback();
		}
		var doc = $(document);
		var events = 'click touchstart keydown';
		doc.on(events, handler);
	}

	function showInViewport(elem) {
		var offset = 10;
		if (document.documentElement.getBoundingClientRect) {
			var left = parseInt(elem.css('left'), 10);
			var top = parseInt(elem.css('top'), 10);

			var rect = elem[0].getBoundingClientRect();
			if (rect.left < offset)
				elem.css('left', offset - rect.left + left);
			else if (rect.right > window.innerWidth - offset)
				elem.css('left', window.innerWidth - rect.right - offset + left);

			if (rect.top < offset)
				elem.css('top', offset - rect.top + top);
			else if (rect.bottom > window.innerHeight - offset)
				elem.css('top', window.innerHeight - rect.bottom - offset + top);
		}
		elem.addClass(openClass);
	}


	/**
	 * Auto initialization
	 */
	$(function() {
		$('.' + prefix).socialLikes();
	});

}));
