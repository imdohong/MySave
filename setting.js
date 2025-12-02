document.addEventListener('DOMContentLoaded', () => {
    // 1. 요소 가져오기 (없을 수도 있으므로 const로 선언 후 확인)
    const aiToggle = document.getElementById('aiToggle');
    const notiToggle = document.getElementById('notiToggle');
    const darkModeToggle = document.getElementById('darkModeToggle');

    // 2. 다크 모드 토글 로직 (버튼이 존재할 때만 실행)
    if (darkModeToggle) {
        // 페이지 로드 시, 저장된 상태를 보고 스위치 위치(ON/OFF) 맞추기
        if (localStorage.getItem('darkMode') === 'true') {
            darkModeToggle.checked = true;
        }

        // 스위치를 찰칵 눌렀을 때 이벤트
        darkModeToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'true'); // 저장
                console.log("다크 모드: ON");
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'false'); // 저장 해제
                console.log("다크 모드: OFF");
            }
        });
    }

    // 3. 기타 토글 이벤트 (존재 여부 확인)
    if (aiToggle) {
        aiToggle.addEventListener('change', (e) => {
            console.log("AI 설정:", e.target.checked);
        });
    }
    if (notiToggle) {
        notiToggle.addEventListener('change', (e) => {
            console.log("알림 설정:", e.target.checked);
        });
    }
    
    // 프로필 편집 버튼 예시
    const editBtn = document.querySelector('.edit-icon-btn');
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            alert('프로필 이미지 변경 창이 열립니다.');
        });
    }

    // 5. 검색창 엔터키 기능
    const searchInput = document.querySelector('.search-container input');
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { // 엔터키를 눌렀을 때만 실행
                const query = e.target.value.trim();
                if (query) {
                    // 검색어를 가지고 bookmark.html로 이동
                    window.location.href = `bookmark.html?q=${encodeURIComponent(query)}`;
                }
            }
        });
    }
});