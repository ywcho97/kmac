
$(function () {
  // GNB 메뉴 반응형 동작
  let isMobileView = window.innerWidth <= 799;

  function setNavInteraction() {
    const isMobile = window.innerWidth <= 799;
    $('nav li').off('mouseenter mouseleave click');
    $('.twoD').stop(true, true).slideUp(0);

    if (!isMobile) {
      $('nav').hover(
        function () {
          $('.twoD').stop(true, true).slideDown(200);
        },
        function () {
          $('.twoD').stop(true, true).slideUp(200);
        }
      );
    }
  }

  setNavInteraction();

  $(window).on('resize', function () {
    const newIsMobile = window.innerWidth <= 799;
    if (newIsMobile !== isMobileView) {
      isMobileView = newIsMobile;
      setNavInteraction();
    }
  });
});

// quickTop 버튼 기능
const quickTopBtn = document.getElementById('quickTop');
if (quickTopBtn) {
  window.addEventListener('scroll', function () {
    if (window.scrollY > 800) {
      quickTopBtn.classList.add('show');
    } else {
      quickTopBtn.classList.remove('show');
    }
  });

  quickTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// 햄버거 메뉴 클릭 동작
const hamber = document.querySelector('.hamber');
if (hamber) {
  hamber.addEventListener('click', function () {
    this.classList.toggle('active');
    this.classList.toggle('act');
    const gnb = document.querySelector('.gnb');
    if (gnb) {
      gnb.classList.toggle('side_open');
      document.body.classList.toggle('no_scroll', gnb.classList.contains('side_open'));
    }
  });
}

// Swiper 슬라이드 및 프로그레스 링
const swiperContainer = document.querySelector('.main_slide .swiper-container');
if (swiperContainer) {
  const swiper = new Swiper(swiperContainer, {
    effect: 'fade',
    fadeEffect: { crossFade: true },
    loop: true,
    loopAdditionalSlides: 1,
    speed: 1000,
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true,
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    on: {
      slideChangeTransitionStart: function () {
        const circle = document.querySelector('.progress-ring_circle');
        if (!circle) return;

        circle.style.transition = 'none';
        circle.style.strokeDashoffset = 138;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            circle.style.transition = 'stroke-dashoffset 3s linear';
            circle.style.strokeDashoffset = 0;
          });
        });
      }
    }
  });

  const arrow = document.querySelector('.arrow-icon');
  if (arrow) {
    arrow.addEventListener('click', function () {
      swiper.slideNext();
    });
  }
}

function revealOnScroll() {
  const contents = document.querySelectorAll('.content');
  const triggerPoint = window.innerHeight * 0.85;

  contents.forEach((el) => {
    const elementTop = el.getBoundingClientRect().top;
    const elementBottom = el.getBoundingClientRect().bottom;

    // 요소가 화면 안에 들어왔을 때 show 추가
    if (elementTop < triggerPoint && elementBottom > 0) {
      el.classList.add('show');
    } else {
      el.classList.remove('show'); // 화면 벗어나면 다시 제거
    }
  });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);


// degitalCont 슬라이드
const degitalSections = document.querySelectorAll('.degitalCont');
const DOWN_OFFSET = 250;
const UP_OFFSET = 50;

degitalSections.forEach((section) => {
  if (window.innerWidth <= 799) return;
  
  const track = section.querySelector('.horizontal-track');
  const boxes = section.querySelectorAll('.offeringBox');
  const rightBtn = section.querySelector('.rightBtn .right');
  const leftBtn = section.querySelector('.rightBtn .left');

  if (!track || boxes.length === 0) return;

  let slideIndex = 0;
  let manualSlide = false;
  let manualTimeout = null;
  let scrollTimeout = null;
  let prevScrollY = window.scrollY;

  let boxWidth = boxes[0].offsetWidth + parseFloat(getComputedStyle(boxes[0]).marginRight);
  let maxIndex = boxes.length - Math.floor(window.innerWidth / boxWidth);

  function syncSlideIndexWithTransform() {
    const matrix = window.getComputedStyle(track).transform;
    if (matrix !== 'none') {
      const translateX = parseFloat(matrix.split(',')[4]) * -1;
      slideIndex = Math.round((translateX - getOffset()) / boxWidth);
    } else {
      slideIndex = 0;
    }
  }

  function getOffset(isScrollingDown = true) {
    return isScrollingDown ? DOWN_OFFSET : UP_OFFSET;
  }

  function enableManualMode() {
    manualSlide = true;
    clearTimeout(manualTimeout);
    manualTimeout = setTimeout(() => {
      manualSlide = false;
    }, 2000);
  }

  function scrollToCorrespondingY(translateX, maxTranslate, sectionTop, sectionHeight, isScrollingDown = true) {
    const offset = getOffset(isScrollingDown);
    const scrollProgress = (translateX - offset) / maxTranslate;
    const scrollY = sectionTop + scrollProgress * (sectionHeight - window.innerHeight);
    window.scrollTo({ top: scrollY, behavior: 'smooth' });
  }

  rightBtn?.addEventListener('click', () => {
    syncSlideIndexWithTransform();
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const maxTranslate = track.scrollWidth - window.innerWidth;

    if (slideIndex < maxIndex) {
      slideIndex++;
      let translateX = slideIndex * boxWidth + getOffset(true);
      if (translateX > maxTranslate + getOffset(true)) {
        translateX = maxTranslate + getOffset(true);
      }
      track.style.transform = `translateX(-${translateX}px)`;
      enableManualMode();
      scrollToCorrespondingY(translateX, maxTranslate, sectionTop, sectionHeight, true);
    }
  });

  leftBtn?.addEventListener('click', () => {
    syncSlideIndexWithTransform();
    if (slideIndex > 0) {
      slideIndex--;
      const translateX = slideIndex * boxWidth + getOffset(false);
      track.style.transform = `translateX(-${translateX}px)`;
      enableManualMode();

      if (slideIndex > 0) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const maxTranslate = track.scrollWidth - window.innerWidth;
        scrollToCorrespondingY(translateX, maxTranslate, sectionTop, sectionHeight, false);
      }
    }
  });

  window.addEventListener('scroll', () => {
    if (manualSlide) return;

    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const scrollY = window.scrollY;
    const isScrollingDown = scrollY > prevScrollY;

    const scrollStart = scrollY - sectionTop;
    const maxScroll = sectionHeight - window.innerHeight;
    const maxTranslate = track.scrollWidth - window.innerWidth;
    const offset = getOffset(isScrollingDown);

    if (scrollY >= sectionTop && scrollY <= sectionTop + sectionHeight) {
      const progress = Math.min(Math.max(scrollStart / maxScroll, 0), 1);
      const translateX = progress * maxTranslate + offset;
      track.style.transform = `translateX(-${translateX}px)`;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        slideIndex = Math.round((translateX - offset) / boxWidth);
      }, 150);
    }

    prevScrollY = scrollY;
  });

  window.addEventListener('resize', () => {
    boxWidth = boxes[0].offsetWidth + parseFloat(getComputedStyle(boxes[0]).marginRight);
    maxIndex = boxes.length - Math.floor(window.innerWidth / boxWidth);
  });
});


/* 전체동의 */
const allAgree = document.getElementById('allAgree');
const checkboxes = document.querySelectorAll('.agree');

if (allAgree && checkboxes.length > 0) {
  // '전체 동의' 클릭 시 개별 체크박스 모두 체크/해제
  allAgree.addEventListener('change', function () {
    checkboxes.forEach(chk => chk.checked = this.checked);
  });

  // 개별 체크박스 변경 시 전체 동의 상태 갱신
  checkboxes.forEach(chk => {
    chk.addEventListener('change', function () {
      allAgree.checked = [...checkboxes].every(chk => chk.checked);
    });
  });
}

function openAgreeModal(id) {
  const requiredChecks = document.querySelectorAll('.agree');
  const allChecked = Array.from(requiredChecks).slice(0, 3).every(chk => chk.checked);

  if (!allChecked) {
    document.getElementById(id).style.display = 'block';
    document.body.style.overflow = 'hidden'; // 스크롤 잠금
  } else {
    // 필수 동의 완료 시
    location.href = "join02.html";
  }
}

function closeAgreeModal(id) {
  document.getElementById(id).style.display = 'none';
  document.body.style.overflow = 'auto';
}


/* 회원가입 */
document.querySelector('.next').addEventListener('click', function (e) {
  const inputGroups = document.querySelectorAll('.inputGroup');
  let isValid = true;
  let passwordValue = '';

  inputGroups.forEach(group => {
    const inputTexts = group.querySelectorAll('.inputText');

    inputTexts.forEach(inputText => {
      const must = inputText.querySelector('.must span');
      const inputs = inputText.querySelectorAll('input[type="text"], input[type="password"]');

      // 체크박스 그룹 검사
      const checkboxes = inputText.querySelectorAll('input[type="checkbox"]');
      if (checkboxes.length > 0) {
        const isAnyChecked = Array.from(checkboxes).some(cb => cb.checked);
        if (!isAnyChecked) {
          must.style.display = 'inline';
          isValid = false;
        } else {
          must.style.display = 'none';
        }
        return;
      }

      // 일반 입력 검사
      let hasValue = true;
      inputs.forEach(input => {
        if (!input.value.trim()) {
          hasValue = false;
        }
      });

      if (!hasValue) {
        must.style.display = 'inline';
        isValid = false;
        return;
      } else {
        must.style.display = 'none';
      }

      // 비밀번호 유효성 검사
      const labelText = inputText.querySelector('.must p').textContent;
      const input = inputs[0];

      if (labelText.includes('비밀번호') && !labelText.includes('확인')) {
        passwordValue = input.value;
        const pw = input.value;
        const pwValid = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/;

        if (!pwValid.test(pw)) {
          must.textContent = '비밀번호 조건을 확인해 주세요!';
          must.style.display = 'inline';
          isValid = false;
        } else {
          must.textContent = '입력해주세요!';
          must.style.display = 'none';
        }
      }

      // 비밀번호 확인 검사
      if (labelText.includes('비밀번호 확인')) {
        if (input.value !== passwordValue) {
          must.textContent = '비밀번호가 일치하지 않습니다!';
          must.style.display = 'inline';
          isValid = false;
        } else {
          must.textContent = '입력해주세요!';
          must.style.display = 'none';
        }
      }
    });
  });

  if (isValid) {
    location.href = 'join03.html';
  }
});


function togglePopup(popupId) {
  const popup = document.getElementById(popupId);
  if (!popup) return; // 요소 없으면 중단

  if (popup.style.display === 'block') {
    popup.style.display = 'none';
    document.body.style.overflow = ''; // 스크롤 잠금 해제
  } else {
    popup.style.display = 'block';
    document.body.style.overflow = 'hidden'; // 스크롤 잠금
  }
}

function toggleModalPopup(popupId) {
  const popup = document.getElementById(popupId);
  if (!popup) return;

  popup.style.display = (popup.style.display === 'block') ? 'none' : 'block';
}

function closePopup(popupId) {
  const popup = document.getElementById(popupId);
  if (!popup) return;

  popup.style.display = 'none';
  document.body.style.overflow = ''; // 스크롤 잠금 해제
}


/* 탭메뉴 */

document.addEventListener("DOMContentLoaded", function () {
  // 탭 콘텐츠와 버튼을 전역으로 수집
  const tabConts = document.querySelectorAll(".content_wrap > div[id^='tab']");
  const allTabBtns = document.querySelectorAll(".tabBtn button");

  allTabBtns.forEach(btn => {
    btn.addEventListener("click", function () {
      const tabName = this.innerText.trim(); // 버튼 텍스트로 구분 (아이디 찾기 / 비밀번호 찾기)

      // 버튼 상태 초기화
      allTabBtns.forEach(b => b.classList.remove("active"));

      // 콘텐츠 전부 숨기기
      tabConts.forEach(cont => cont.style.display = "none");

      // 해당 탭과 버튼만 다시 표시
      if (tabName === "아이디 찾기") {
        document.getElementById("tab1").style.display = "block";
        document.querySelectorAll(".tabBtn button")[0].classList.add("active");
        document.querySelectorAll(".tabBtn button")[2].classList.add("active"); // 아래쪽 버튼도
      } else if (tabName === "비밀번호 찾기") {
        document.getElementById("tab2").style.display = "block";
        document.querySelectorAll(".tabBtn button")[1].classList.add("active");
        document.querySelectorAll(".tabBtn button")[3].classList.add("active"); // 아래쪽 버튼도
      }
    });
  });

  // 초기 상태: tab1만 표시
  document.getElementById("tab1").style.display = "block";
  document.getElementById("tab2").style.display = "none";
});


const regiTel = (target) => {
  target.value = target.value
  .replace(/[^0-9]/g, '')
  .replace(/^(\d{3})(\d{4})(\d{4})$/, `$1-$2-$3`);
}
const businessTel = (target) => {
  target.value = target.value
  .replace(/[^0-9]/g, '')
  .replace(/^(\d{3})(\d{2})(\d{5})$/, `$1-$2-$3`);
}


// 페이지 로드 시 URL 해시를 읽고 해당 탭을 엽니다.
document.addEventListener('DOMContentLoaded', function() {
    var hash = window.location.hash.substring(1);
    if (hash) {
        openTab(null, hash);
        var tabLink = document.querySelector('.tab-btn[onclick="openTab(event, \'' + hash + '\')"]');
        if (tabLink) {
            tabLink.classList.add('active');
        }
    } else {
        // 해시가 없으면 첫 번째 탭을 엽니다.
        openTab(null, 'tabCont1_1');
        document.querySelector('.tab-btn').classList.add('active');
    }
    
});

function openTab(event, tabName) {
    // 모든 탭 콘텐츠를 숨깁니다.
    var tabContents = document.querySelectorAll('.tab_detail');
    tabContents.forEach(function(tabContent) {
        tabContent.classList.remove('active');
    });

    // 모든 탭 링크에서 active 클래스를 제거합니다.
    var tabLinks = document.querySelectorAll('.tab-btn');
    tabLinks.forEach(function(tabLink) {
        tabLink.classList.remove('active');
    });

    // 선택한 탭 콘텐츠를 표시하고, 해당 탭 링크에 active 클래스를 추가합니다.
    document.getElementById(tabName).classList.add('active');
    if (event) {
        event.currentTarget.classList.add('active');
        showWriteContent(1);
        taking(1);
    }
}
