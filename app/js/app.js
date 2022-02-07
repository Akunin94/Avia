import $ from 'jquery';
import "slick-carousel";
import noUiSlider from 'nouislider'
// import lightGallery from 'lightgallery';


// JQUERY FIX START
jQuery.event.special.touchstart = {
	setup: function (_, ns, handle) {
		this.addEventListener("touchstart", handle, { passive: !ns.includes("noPreventDefault") });
	},
};
jQuery.event.special.touchmove = {
	setup: function (_, ns, handle) {
		this.addEventListener("touchmove", handle, { passive: !ns.includes("noPreventDefault") });
	},
};
jQuery.event.special.wheel = {
	setup: function (_, ns, handle) {
		this.addEventListener("wheel", handle, { passive: true });
	},
};
jQuery.event.special.mousewheel = {
	setup: function (_, ns, handle) {
		this.addEventListener("mousewheel", handle, { passive: true });
	},
};
// JQUERY FIX END

$(function(){
	// BURGER START
	$(document).on('click', '.spectre-header__burger', function(){
		$('.spectre-header, .spectre-header__popup').addClass('active');
	});
	$(document).on('click', '.spectre-header__popup-close', function(){
		$('.spectre-header, .spectre-header__popup').removeClass('active');
	});
	// BURGER END


	// SLIDERS START
	$('.spectre-slider__slider').each(function(){
		let $slider = $(this),
			$items = $slider.find('.spectre-slider__item'),
			itemsLength = $items.length;

		if ( itemsLength > 1 ) {
			$slider.on('init', function(slick){
				$slider.append(`<div class="spectre-slider__pager"><span class="spectre-slider__current">1</span>/<span class="spectre-slider__total">${itemsLength}</span></div>`);
			});
			$slider.slick({
				dots: false,
				autoplay: false,
				autoplaySpeed: 15000,
				arrows: true,
				fade: true,
				infinite: true,
				pauseOnHover: false,
				rows: 0,
			});
			$slider.on('afterChange', function(event, slick, currentSlide, nextSlide){
				$slider.find('.spectre-slider__current').text(currentSlide+1);
			});
		}
	});
	// SLIDERS END

	// CALC START
	let calc = {
		summ: 1500000,
		year: 1
	}
	let numberFormat = {
		to: function (value) {
			return value.toFixed(0);
		},
		from: function (value) {
			return Number(value);
		}
	};
	
	$('.spectre-calc__block-left-slider').each(function(){
		let $this = $(this),
			slider = $this.get(0),
			min = $this.data('min'),
			max = $this.data('max'),
			step = $this.data('step'),
			hasTooltips = ($this.hasClass('spectre-calc__block-left-slider--year')) ? true : false;

		noUiSlider.create(slider, {
			connect: [false, true],
			start: [min],
			step,
			tooltips: [hasTooltips],
			range: {
				'min': [min],
				'max': [max]
			},
			format: numberFormat
		});

		slider.noUiSlider.on('update', function(values){
			if ($this.hasClass('spectre-calc__block-left-slider--summ')) {
				calc.summ = +values[0];
				$('#spectre-calc-summ').text(formatMoney(calc.summ))
			} else if ($this.hasClass('spectre-calc__block-left-slider--year')) {
				calc.year = +values[0];
				// $('#spectre-calc-year').text(calc.year)

				// if (calc.year == 1) {
				// 	$('#spectre-calc-year-text').text('год')
				// } else if (calc.year > 1 && calc.year < 5) {
				// 	$('#spectre-calc-year-text').text('года')
				// } else {
				// 	$('#spectre-calc-year-text').text('лет')
				// }
			}

			spectreCalc();
		});
	});

	function spectreCalc() {
		var S = calc.summ;
		var n = calc.year;
		var p = calc.summ < 3000000 ? 3 : 4.7;

		if (
			typeof S != "number" ||
			typeof p != "number" ||
			typeof n != "number"
		) return false;

		p = p / 1200;
		n = n * 12;

		$('#spectre-permonth').text(formatMoney(S * p / (1 - Math.pow(1 + p, -n))));
	}
	// CALC END


	// SLIDER SOLO START
	let $slider = $('.spectre-slider1__slider'),
	$items = $slider.find('.spectre-slider1__item'),
	itemsLength = $items.length;

	if ( itemsLength > 1 ) {
		$slider.on('init', function(slick){
			$slider.append(`<div class="spectre-slider1__pager"><span class="spectre-slider1__current">1</span> / <span class="spectre-slider1__total">${itemsLength}</span></div>`);
		});
		$slider.slick({
			dots: false,
			autoplay: true,
			autoplaySpeed: 15000,
			arrows: true,
			infinite: true,
			fade: true,
			pauseOnHover: false,
			rows: 0,
		});
		$slider.on('afterChange', function(event, slick, currentSlide, nextSlide){
			$slider.find('.spectre-slider1__current').text(currentSlide+1);
		});
	}
	// SLIDER SOLO END


	// VIDEO POPUP START
	$(document).on('click', '.spectre-main-block__video-button', function(){
		let $this = $(this),
			url = $this.data('url'),
			$popup = $this.parent().find('.spectre-main-block__video-popup'),
			$popupBody = $this.parent().find('.spectre-main-block__video-body');
		
		$popupBody.html(url);
		$popup.addClass('active');
	});
	$(document).on('click', function (event) {
		if ($(event.target).closest('.spectre-main-block__video-popup iframe').length || $(event.target).closest('.spectre-main-block__video').length) return;
		
		hideVideoPopup();
		event.stopPropagation();
	});
	$(document).on('keydown', function (event) {
		if (event.which == 27 ) {
			hideVideoPopup();
		}
	});
	$(document).on('click', '.spectre-main-block__video-close',  function (event) {
		hideVideoPopup();
	});

	function hideVideoPopup() {
		$('.spectre-main-block__video-body').html('');
		$('.spectre-main-block__video-popup').removeClass('active');
	}
	// VIDEO POPUP END



	// MASK START
	$('input[name=phone]').inputmask("+7 (999) 999-99-99");
	// MASK END


	// POPUP FORM START
	$(".spectre-popup").on("click", function (event) {
		showForm();

		event.preventDefault();
	});
	$(".spectre-popup-form__close").on("click", function (event) {
		hideForm();
		event.preventDefault();
	});
	$(document).keydown(function (event) {
		if (event.which == 27) {
			hideForm();
		}
	});
	$(document).click(function (event) {
		if ($(event.target).closest(".spectre-popup-form__wrap").length || $(event.target).closest(".spectre-popup").length || $(event.target).closest(".spectre-popup-form1__wrap").length || $(event.target).closest(".spectre-tabs__blocks-item").length) return;
		hideForm();
		event.stopPropagation();
	});

	$(".spectre-tabs__blocks-item").on("click", function (event) {
		showForm1($(this));

		event.preventDefault();
	});
	$(".spectre-popup-form1__close").on("click", function (event) {
		hideForm1();
		event.preventDefault();
	});
	$(document).keydown(function (event) {
		if (event.which == 27) {
			hideForm1();
		}
	});
	$(document).click(function (event) {
		if ($(event.target).closest(".spectre-popup-form1__wrap").length || $(event.target).closest(".spectre-tabs__blocks-item").length || $(event.target).closest(".spectre-popup-form__wrap").length || $(event.target).closest(".spectre-popup").length) return;
		hideForm1();
		event.stopPropagation();
	});

	function hideForm() {
		$("body").removeClass("spectre-overflowhidden");
		$(".spectre-popup-form").removeClass("active");
	}
	function showForm() {
		$("body").addClass("spectre-overflowhidden");
		$(".spectre-popup-form").addClass("active");
	}

	function hideForm1() {
		$("body").removeClass("spectre-overflowhidden");
		$(".spectre-popup-form1").removeClass("active");
		$(".spectre-wrap__left").removeClass("notmain");
	}
	function showForm1($item) {
		const $image = $item.find('.spectre-tabs__blocks-image').html() || '';
		const $name = $item.data('size') || '';
		const $square = $item.find('.spectre-tabs__blocks-square').html() || '';
		const $type = $item.data('type') || '';
		const $material = $item.data('material') || '';

		$("body").addClass("spectre-overflowhidden");

		$('.spectre-popup-form1__left').html($image);
		$('.spectre-popup-form1__name').html($name);
		$('.spectre-popup-form1__option--square .spectre-popup-form1__option-value').html($square);
		$('.spectre-popup-form1__option--type .spectre-popup-form1__option-value').html($type);
		$('.spectre-popup-form1__option--material .spectre-popup-form1__option-value').html($material);

		$(".spectre-popup-form1").addClass("active");
		$(".spectre-wrap__left").addClass("notmain");
	}
	// POPUP FORM END



	// FORM SEND START
	$('.spectre-popup-form__form, .spectre-popup-form1__form, .spectre-form1-block__form, .spectre-prices__right-form, .spectre-form-block__right-form, .spectre-form-block-new__right-form, .spectre-doublecard__form').on('submit', function(){
		let $this = $(this),
			$success_block = $this.next(),
			url = $this.attr('action'),
			formData = $this.serialize();

		formAjax(url, formData, $this, $success_block)

		return false;
	});
	$('.spectre-calc__block-form').on('submit', function(){
		let $this = $(this),
			$success_block = $('.spectre-calc__block-form-title--success, .spectre-calc__block-form'),
			$hide_block = $('.spectre-calc__block-form > *'),
			url = $this.data('action'),
			formData = $this.serialize();

		formAjax(url, formData, $this, $success_block, $hide_block)

		return false;
	});

	function formAjax(url, formData, $form, $success_block, $hide_block) {
		ym(87187798,'reachGoal','zayavka')

		$.ajax({
			type: 'post',
			url,
			data: formData,
			success: function(data) {
				$form.hide();

				if ($hide_block) {
					$hide_block.hide();
				}

				$success_block.show();
			},
			error: function(data) {
				//console.error(data)
				$form.hide();

				if ($hide_block) {
					$hide_block.hide();
				}

				$success_block.show();
			}
		});
	}
	// FORM SEND END



	// LINKTOP START
	$(window).scroll(function(){
		if ($(this).scrollTop() >= 200 ) {
			$('.spectre-footer__linktop').addClass('active');
		} else {
			$('.spectre-footer__linktop').removeClass('active');
		}
	});
	// LINKTOP END


	// ANCHOR MENU START
	$(".spectre-header__popup-menu a, .spectre-main-block__downbutton, .spectre-info__buttonwrap-button, .spectre-footer__linktop").on(
		"click",
		function (event) {
			let position = $(this.hash).offset().top;

			if ($("body").width() < 1200) {
				position = position - 60;
			} else {
				if (this.hash == '#main') {
					position -= 50;
				} else if (this.hash == '#ipoteka' || this.hash == '#properties' || this.hash == '#products') {
					position -= 20;
				}
			}

			$("html, body").animate({ scrollTop: position }, 800);

			$(".spectre-header__popup").removeClass("active");
			$("body").removeClass("spectre-overflowhidden");

			event.preventDefault();
		}
	);
	// ANCHOR MENU END



	// TABS START
	$('.spectre-tabs__blocks-block').each(function(){
		let $block = $(this),
			count = $block.find('.spectre-tabs__blocks-item').length,
			$button = $block.find('.spectre-tabs__blocks-button');

		if (count <= 9) {
			$button.hide();
		}
	});

	$(document).on('click', '.spectre-tabs__nav-item:not(.active)', function(){
		let $this = $(this),
			index = $this.index(),
			$body = $this.closest('.spectre-tabs').find('.spectre-tabs__blocks-block').eq(index);
		
		$this.addClass('active');
		$this.siblings().removeClass('active');

		$body.addClass('active');
		$body.siblings().removeClass('active');
	});
	$(document).on('click', '.spectre-tabs__blocks-button', function(){
		var $this = $(this),
			$button = $this,
			$allItems = $this.closest('.spectre-tabs__blocks-block').find('.spectre-tabs__blocks-item'),
			$items = $this.closest('.spectre-tabs__blocks-block').find('.spectre-tabs__blocks-item:not(:visible)');
		
		if($button.hasClass('active')) {
			$button.text('Показать еще');
			$button.removeClass('active');
			$allItems.removeAttr('style');
		} else {
			if ($items.length) {
				$items.each(function(index){
					var $this = $(this);

					if (index < 9) {
						$(this).css('display', 'flex');
					}

					$items = $this.closest('.spectre-tabs__blocks-block').find('.spectre-tabs__blocks-item:not(:visible)')

					if(!$items.length) {
						$button.text('Скрыть');
						$button.addClass('active');
					}
				});
			} else {
				$button.text('Скрыть');
				$allItems.css('display', 'flex');
			}
		}
	});
	// TABS END



	// MAP START
	function init2Gis() {
		let map;

		DG.then(function () {
			const zoom = $('body').width() > 960 ? 14 : 13;
			map = DG.map('map', {
				center: [54.980907, 82.875047],
				zoom,
				dragging : true,
				touchZoom: false,
				scrollWheelZoom: false,
				doubleClickZoom: false,
				boxZoom: false,
				geoclicker: false,
				zoomControl: false,
				fullscreenControl: false
			});

			const mainMarker = setMarkers(
				map,
				[],
				'images/dist/logo_m.svg', true
			)
			const type1 = setMarkers(
				map,
				[],
				'images/dist/comp1.svg'
			)
			const type2 = setMarkers(
				map,
				[],
				'images/dist/comp2.svg'
			)
			const type3 = setMarkers(
				map,
				[],
				'images/dist/comp3.svg'
			)
			const type4 = setMarkers(
				map,
				[],
				'images/dist/comp4.svg'
			)
			const type5 = setMarkers(
				map,
				[],
				'images/dist/comp5.svg'
			)
			const type6 = setMarkers(
				map,
				[],
				'images/dist/comp6.svg'
			)
			const type7 = setMarkers(
				map,
				[],
				'images/dist/comp7.svg'
			)
			const type8 = setMarkers(
				map,
				[],
				'images/dist/comp8.svg'
			)
			const type9 = setMarkers(
				map,
				[],
				'images/dist/comp9.svg'
			)

			function removeAllMarkers() {
				const groups = [
					type1, type2, type3, type4, type5, type6, type7, type8, type9
				]

				groups.forEach(group => group.removeFrom(map))
			}

			$('.spectre-map__nav-item').click(function() {
				if ( $(this).hasClass('spectre-map__nav-item--all') ) {
					$('.spectre-map__nav-item').removeClass('active');
				} else {
					$(this).siblings().removeClass('active');
					$(this).addClass('active');
				}
			})
			$('.spectre-map__nav-item--type1').click(function () {
				removeAllMarkers()
				type1.addTo(map);
			})
			$('.spectre-map__nav-item--type2').click(function () {
				removeAllMarkers()
				type2.addTo(map);
			})
			$('.spectre-map__nav-item--type3').click(function () {
				removeAllMarkers()
				type3.addTo(map);
			})
			$('.spectre-map__nav-item--type4').click(function () {
				removeAllMarkers()
				type4.addTo(map);
			})
			$('.spectre-map__nav-item--type5').click(function () {
				removeAllMarkers()
				type5.addTo(map);
			})
			$('.spectre-map__nav-item--type6').click(function () {
				removeAllMarkers()
				type6.addTo(map);
			})
			$('.spectre-map__nav-item--type7').click(function () {
				removeAllMarkers()
				type7.addTo(map);
			})
			$('.spectre-map__nav-item--type8').click(function () {
				removeAllMarkers()
				type8.addTo(map);
			})
			$('.spectre-map__nav-item--type9').click(function () {
				removeAllMarkers()
				type9.addTo(map);
			})
			$('.spectre-map__nav-item--all').click(function () {
				removeAllMarkers()
				mainMarker.addTo(map);
				type1.addTo(map);
				type2.addTo(map);
				type3.addTo(map);
				type4.addTo(map);
				type5.addTo(map);
				type6.addTo(map);
				type7.addTo(map);
				type8.addTo(map);
				type9.addTo(map);
			})
		});
	}

	function setMarkers(map, coords, iconUrl, main = false) {
		var iconSize = [40, 40];
		if (main) {
			iconSize = [64, 64];
		}
		coords.forEach( function(item){
			if (item[0] < 60 ) {
				item.reverse();
			}
		});
		const markers = DG.featureGroup()
		coords.forEach(c => DG.marker([c[1], c[0]], {icon: DG.icon({iconUrl: iconUrl, iconSize: iconSize})}).addTo(markers))
		markers.addTo(map);

		return markers
	}
	
	init2Gis()
	// MAP END



	// ACTIVE MENU START
	let scrollingBlocks = document.querySelectorAll('.spectre-section');

	let leftMenu = document.querySelector('.anchor-menu'),
		menuItems = leftMenu.querySelectorAll('a');

	window.addEventListener('scroll', function () {
		let windowTop = window.scrollY;

		scrollingBlocks.forEach(function (item) {
			let topPosition = item.offsetTop - 20,
				bottomPosition = topPosition + item.clientHeight;

			if (windowTop >= topPosition && windowTop <= bottomPosition && !item.classList.contains('active')) {
				let id = $(item).attr('id');
				let scrollingBlocksSiblings = document.querySelectorAll('.spectre-section:not(#'+id+')');

				item.classList.add('active')
				$(scrollingBlocksSiblings).removeClass('active');

				let linkHref = item.id;
				$('.spectre-header__popup-menu a').removeClass('active');
				$('.spectre-header__popup-menu a[href="#'+linkHref+'"]').addClass('active');
			}
		});
	});
	// ACTIVE MENU END



	function formatMoney(amount, decimalCount = 0, decimal = ".", thousands = " ") {
		try {
			decimalCount = Math.abs(decimalCount);
			decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
	
			const negativeSign = amount < 0 ? "-" : "";
	
			let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
			let j = (i.length > 3) ? i.length % 3 : 0;
	
			return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
		} catch (e) {
			console.log(e)
		}
	};
});
