		 (() => {	
			 	let yOffset = 0; // javascript의 스크롤탑 window.pageYoffset대신 쓸 값
			 	let prevScrollHeight = 0; // 현재 스크롤 위치보다 이전에 있는 스크롤 높이
			 	let currentScene = 0; // 현재 씬
			 	let enterNewScene = false; // 새로운 씬이 시작되면  true
			 	
			 	//  여기서부터는 나중에 표기 
			 	let acc = 0.2; 
			 	let delayedYOffset = 0;
			 	let rafId;
			 	let rafState;	
			 	

			    
			 	let scene01Point = [
					[0.3, 0.5]
				];
			 

			 	const sceneInfo = [
					{
						// 0
						type: 'sticky',
						heightNum: 2, // 브라우저 높이의 5배로 scrollHeight 세팅
						scrollHeight: 0,
						objs: {
							container: document.querySelector('#scroll-section-0'),
							bg : document.querySelector('#scroll-section-0 .bg'),
							scene01FstCopy : document.querySelector('#scroll-section-0 .text_info'),	
						},
						values : { 
							
							scene01_bg_opacity : [1, 0, {start : 0.5, end : 0.8}],
							scene01_bg_translateOut : [0, -500, {start : 0.5, end : 0.8}],							
							
							scene01FstCopy_out01 : [0, 70, {start :0.02, end : 0.4}],
							scene01FstCopy_out02 : [0, 150, {start :0.02, end : 0.4}]
							
						}
					},
					{
						// 1
						type: 'sticky',
						heightNum: 2, // 브라우저 높이의 5배로 scrollHeight 세팅
						scrollHeight: 0,
						objs: {
							container: document.querySelector('#scroll-section-1'),
						},
						values : { 
							scene02_bg_opacity : [1, 0, {start : 0.4, end : 0.5}],
							scene02_bg_translateOut : [0, -500, {start : 0.4, end : 0.5}],
						}
					},
					{
						// 2
						type: 'sticky',
						heightNum: 2, // 브라우저 높이의 5배로 scrollHeight 세팅
						scrollHeight: 0,
						objs: {
							container: document.querySelector('#scroll-section-2'),
						},
						values : { 
							
						}
					},
					{
						// 3
						type: 'sticky',
						heightNum: 1, // 브라우저 높이의 5배로 scrollHeight 세팅
						scrollHeight: 0,
						objs: {
							container: document.querySelector('#scroll-section-3'),
							
						},
						values : { 
							
						}
					},					
			 	];
			 	
			 	// 레이아웃 설정
			 	function setLayout() { 		
					for (let i = 0; i < sceneInfo.length; i++) {
						if (sceneInfo[i].type === 'sticky') {
							sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;							
						} else if (sceneInfo[i].type === 'normal')  {
							sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;

						}
						sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
					}
			 		
			 		
			 		yOffset = window.pageYOffset;
			 		let totalScrollHeight = 0;
			 		for(let i = 0; i < sceneInfo.length; i++) { 
			 			totalScrollHeight += sceneInfo[i].scrollHeight;
			 			if(totalScrollHeight > yOffset) { 
			 			   currentScene = i;			   	
			 			   break;							   
			 			}			
			 		}
			 		
			 		document.body.setAttribute('id', `show-scene-${currentScene}`);
			 		
			 		
			 	}
			 	
			 	function calcValues(values, currentYOffset) { 
					
			 		let rv;
			 		//현재씬에서 스크롤된 비율 구하기
			 		//console.log(values);	
			 		const scrollHeight = sceneInfo[currentScene].scrollHeight;
			 		const scrollRatio = currentYOffset / sceneInfo[currentScene].scrollHeight;					 		
			 		if(values.length == 3) { 
			 		   //start ~ end 사이 애니메이션 실행
			 		   	const partScrollStart = values[2].start * scrollHeight;
			 		   	const partScrollEnd = values[2].end * scrollHeight;
			 			const partScrollHeight = partScrollEnd - partScrollStart;
			 			
			 			if(currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) { 
			 				rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
			 			} else if(currentYOffset < partScrollStart) { 
			 				rv = values[0];
			 			} else if(currentYOffset > partScrollEnd) { 
			 				rv = values[1];
			 			}
			 			
			 		} else { 
			 			rv = scrollRatio * (values[1] - values[0]) + values[0];	   
			 		}
			 		
			 		
			 		return rv;
			 	}
			 	
			 	function totalCalcValue(values, yOffset) { 
			 		let rv;
			 		
					
			 		const totalScrollHeight = sceneInfo[0].scrollHeight + sceneInfo[1].scrollHeight + sceneInfo[2].scrollHeight + sceneInfo[3].scrollHeight;
			 		const totalScrollRatio = yOffset / totalScrollHeight;
					
					//console.log(values[2].start, totalScrollHeight);
					
			 		const partScrollStart = values[2].start * totalScrollHeight;
			 		const partScrollEnd = values[2].end * totalScrollHeight;
			 		const partScrollHeight = partScrollEnd - partScrollStart;		
			 		
			 		//rv = (yOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
			 		
			 		
			 		//console.log("partScrollStart ==", partScrollStart);
			 		//console.log("토탈스크롤 ", totalScrollRatio);
			 		//console.log("partScrollHeight ==", partScrollHeight);
			 		
			 		if(yOffset >= partScrollStart && yOffset <= partScrollEnd) { 
			 			
			 			rv = (yOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
			 			//console.log(rv)			
			 		} else if(yOffset < partScrollStart) { 
			 			rv = values[0];
			 			//console.log("시작전", rv);
			 		} else if(yOffset > partScrollEnd) { 
			 			rv = values[1];
			 			//console.log("시작후", rv);
			 		}
			 		//console.log("rv ", rv);
			 		
			 		return rv;
			 	}
			 	
			 	
			 	function playAnimation() { 
			 		const objs = sceneInfo[currentScene].objs;
			 		const values = sceneInfo[currentScene].values;
			 		const currentYOffset = yOffset - prevScrollHeight;
			 		const scrollHeight = sceneInfo[currentScene].scrollHeight;
			 		const scrollRatio = (yOffset - prevScrollHeight) / scrollHeight; //yOffset / 현재 씬의 scrollHeight;	
			 		
			 		const totalScrollHeight = sceneInfo[0].scrollHeight + sceneInfo[1].scrollHeight + sceneInfo[2].scrollHeight +  + sceneInfo[3].scrollHeight;
			 		const totalScrollRatio = yOffset / totalScrollHeight;

			 		
					const scene03_objs = sceneInfo[3].objs;
			 		const scene03_values = sceneInfo[3].values;
					
					//console.log(totalScrollRatio);		
					
					if(totalScrollRatio >= 0.19) { 
						//document.getElementsByClassName("#scroll-section-1 .title").classList.add("on");
						$("#scroll-section-1 .title_box").addClass("on");
					} else { 
						$("#scroll-section-1 .title_box").removeClass("on");
					}
					
					if(totalScrollRatio >= 0.22) { 
						$('.cass_img').addClass("on");
					} else { 
						$('.cass_img').removeClass("on");	
					}		
					
					if(totalScrollRatio >= 0.27) { 
						$('.info').addClass("on");
					} else { 
						$('.info').removeClass("on");	
					}	
					if(totalScrollRatio >= 0.4) { 
						$("#scroll-section-2 .title_box2").addClass("on");
					} else { 
						$("#scroll-section-2 .title_box2").removeClass("on");
					}
					if(totalScrollRatio >= 0.5) { 
						$('.can_img').addClass("on");
					} else { 
						$('.can_img').removeClass("on");	
					}	
					if(totalScrollRatio >= 0.72) { 
						$("#scroll-section-3 .title_box3").addClass("on");
					} else { 
						$("#scroll-section-3 .title_box3").removeClass("on");
					}
										
		 		

			 		switch(currentScene) { 
			 			case 0 :
							
		 					console.log(scrollRatio);
							
						
							let scene01_bg_translateOut = calcValues(values.scene01_bg_translateOut, currentYOffset);
							let scene01_bg_opacity = calcValues(values.scene01_bg_opacity, currentYOffset);
							
							let scene01FstCopy_out01 = calcValues(values.scene01FstCopy_out01, currentYOffset);
							let scene01FstCopy_out02 = calcValues(values.scene01FstCopy_out02, currentYOffset);
							
							if(scrollRatio <= scene01Point[0][0]) { 
								
							} else { 
								objs.bg.setAttribute("style", 'opacity :' + scene01_bg_opacity + '; transform : translateY(' + scene01_bg_translateOut + 'px)');	
							}

							
			 				if(scrollRatio <= scene01Point[0][1]) { 
			 					//objs.messageA.style.opacity = messageA_opacity_in;			 					
								objs.scene01FstCopy.setAttribute("style", '--gradient-progress :' + scene01FstCopy_out01 + '%; --gradient-progress-2 :' + scene01FstCopy_out02 + '%');			 	
								
			 				} else { 
								
			 				}	
							
							
							
							
			 				break;
			 			case 1 : 
			 				//console.log(scrollRatio);
							
			 				break;
			 			
			 			case 2 : 
			 				//console.log(scrollRatio);

			
			 				
			 				break;
			 				
			 			case 3 :
							
							break;	
			 				
			 				
			 		}
			 		
			 		// 2번째 화면이 윈도우상에서 보이기 시작한 시점부터 애니메이션이 동작해야함 
			 		var zz = document.getElementById("scroll-section-1").offsetHeight;
			 		//console.log(zz);
			 		//console.log(totalScrollRatio);
					
				
			 	}
			 	
			 	function scrollLoop() { 
			 		prevScrollHeight = 0;
			 		enterNewScene = false
			 		for(let i = 0; i < currentScene; i++) { 
			 			prevScrollHeight += sceneInfo[i].scrollHeight;
			 		}

			 		//console.log("prevScrollHeight ==", prevScrollHeight);
			 		//console.log("현재신의 스크롤하이트 ==", sceneInfo[currentScene].scrollHeight);
			 		//console.log("yOffset ==", yOffset);
			 		
			 		
			 		if(yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) { 
			 			enterNewScene = true;
			 			currentScene++;		
			 			document.body.setAttribute('id', `show-scene-${currentScene}`);
			 		}

			 		if(yOffset < prevScrollHeight) { 
			 			enterNewScene = true;
			 			if(currentScene === 0) return;
			 			currentScene--;
			 			document.body.setAttribute('id', `show-scene-${currentScene}`);
			 		}
			 		//console.log(yOffset);
			 		if(enterNewScene) return;
			 		playAnimation();
			 	}
			 	
			 	
			 	window.addEventListener('scroll', () => { 
			 		yOffset = window.pageYOffset;
			 		scrollLoop();
			 	});
			 	
			 	window.addEventListener('load', setLayout);
			 	window.addEventListener('resize', setLayout);
			
			 	
				$(function(){

					$('.navlist > li').find(".dp2").parent().addClass("act");


					$('.menubtn').on("click", function() {
						if($('nav').hasClass("on")) {
							$('nav').removeClass("on");
						} else {
							$('nav').addClass("on");
						}
					});

					$('nav .navlist > li > a').on("click", function() {
						var _this = $(this);
						var _thispt = _this.parent();
						var _target = _thispt.find(".dp2");

						if(_thispt.hasClass("on")) {
							_thispt.removeClass("on");
							_target.slideUp();
						} else {
							$('nav .navlist > li').removeClass("on") 
							_thispt.addClass("on");

						}


					})

				});


			 
			 	$(".can_img .btn").click(function(e){
					e.preventDefault();
					
					var txtArr = [
						"일반 맥주와 같은 원료를 사용하여 동일한 발표 및 숙성 과정을 거칩니다.<br> 마지막 여과 단계에서 ‘스마트 알코올 분리 공법’을 통해 알코올만 추출하여,<br>카스 고유의 자릿하고 청량한 맛을 그대로 느낄 수 있습니다.",
						"최고의 노하우와 기술력으로 세 가지 홉과 <br>국내 유일의 빙점숙성을 사용하여 맥주의 맛을 올리고<br>독자적인 고 발효 공법을 통해 칼로리는 33% 줄이고 맛은 더욱 상쾌하고 깔끔해졌습니다.",
						"비열처리공법으로 맥주의 신선하고 톡 쏘는 맛을 더욱 향상시켰습니다.<br>톡 쏘는 상쾌한 맛으로 대한민국에서 가장 사랑받는 카스 프레시는 <br>언제 어디서나 신선한 활력과 짜릿한 즐거움을 선사합니다."
					];
					var txtArr2 = [
						"종류: 알코올 맥주 ALC :0.05%미만",
						"종류:Lager ALC :4.0%  ",
						"종류:Lager ALC :4.5%  "
					];					
					
					$("#modal").addClass("active");
					var _this = $(this);
					var _attr = _this.attr("data-num");
					var _origin = $("#modal");
					console.log(_attr);
					
					$('body').css('overflow', 'hidden');
											
						_origin.find(".upinfo .uptitle > img").attr('src','img/popuptitle0' + _attr + '.png');
						_origin.find(".upimg > img").attr('src','img/popup_can0' + _attr + '.png');
						_origin.find(".upinfo .upsize > img").attr('src','img/popup_size0' + _attr + '.png');
					
						_origin.find(".upbody").html(txtArr[_attr - 1]);
						_origin.find(".uptxt").html(txtArr2[_attr - 1]);
						
										
					
				});
			 	$(".closebtn").click(function(){
					$("#modal").removeClass("active");
					$('body').removeAttr("style");
				});
			 
			 
			 
			 })();	

		








