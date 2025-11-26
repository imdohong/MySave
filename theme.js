(function() {
    // 로컬 스토리지 확인
    const isDarkMode = localStorage.getItem('darkMode') === 'true';

    // 저장된 값이 다크모드면 body에 클래스 즉시 추가
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
})();