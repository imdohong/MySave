// 더미 북마크 데이터 (대시보드보다 더 많이)
const bookmarkData = [
    { id: 1, title: "React 19의 새로운 기능 완벽 정리", tag: "Dev", tagColor: "#3b5998", date: "2025.11.21", isStarred: true, isRead: false, hasSummary: true },
    { id: 2, title: "2025 AI 디자인 트렌드 분석 리포트", tag: "Design", tagColor: "#3b5998", date: "2025.11.20", isStarred: false, isRead: true, hasSummary: false },
    { id: 3, title: "효율적인 팀 커뮤니케이션을 위한 가이드", tag: "Work", tagColor: "#475569", date: "2025.11.19", isStarred: true, isRead: true, hasSummary: true },
    { id: 4, title: "프론트엔드 성능 최적화 베스트 프랙티스", tag: "Dev", tagColor: "#3b5998", date: "2025.11.18", isStarred: false, isRead: false, hasSummary: true },
    { id: 5, title: "UX 심리학: 사용자를 사로잡는 법칙들", tag: "Design", tagColor: "#3b5998", date: "2025.11.17", isStarred: true, isRead: false, hasSummary: false },
    { id: 6, title: "생산성을 높이는 노션 활용 꿀팁 10가지", tag: "Work", tagColor: "#475569", date: "2025.11.16", isStarred: false, isRead: true, hasSummary: true },
    { id: 7, title: "타입스크립트 고급 기능 활용하기", tag: "Dev", tagColor: "#3b5998", date: "2025.11.15", isStarred: true, isRead: true, hasSummary: true },
    { id: 8, title: "피그마 오토레이아웃 마스터하기", tag: "Design", tagColor: "#3b5998", date: "2025.11.14", isStarred: false, isRead: false, hasSummary: false },
    { id: 9, title: "성공적인 리모트 워크를 위한 문화 만들기", tag: "Work", tagColor: "#475569", date: "2025.11.13", isStarred: false, isRead: true, hasSummary: true },
];

// DOM 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    renderBookmarks('all'); // 초기에는 '전체' 보기 설정

    // 필터 버튼 클릭 이벤트 설정
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 활성화 클래스 관리
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 선택된 필터로 렌더링
            const filterType = button.getAttribute('data-filter');
            renderBookmarks(filterType);
        });
    });
});

// 북마크 렌더링 함수
function renderBookmarks(filterType) {
    const container = document.getElementById('bookmarkCardContainer');
    container.innerHTML = ''; // 기존 내용 비우기

    // 필터링 로직
    let filteredData = bookmarkData;
    if (filterType === 'starred') {
        filteredData = bookmarkData.filter(item => item.isStarred);
    } else if (filterType === 'read') {
        filteredData = bookmarkData.filter(item => item.isRead);
    } else if (filterType === 'unread') {
        filteredData = bookmarkData.filter(item => !item.isRead);
    }

    // HTML 생성 및 주입
    filteredData.forEach(item => {
        // 요약 배지 또는 버튼 결정
        const summaryBadge = item.hasSummary 
            ? `<span class="summary-tag">요약됨</span>` 
            : `<button class="summary-btn">요약하기</button>`;

        // 별표 아이콘 스타일 결정 (채워진 별/빈 별)
        const starClass = item.isStarred ? 'fa-solid fa-star active' : 'fa-regular fa-star';

        const cardHTML = `
            <div class="card">
                <div class="card-img">
                    ${summaryBadge}
                </div>
                <div class="card-body">
                    <h4 class="card-title">${item.title}</h4>
                    <div class="card-footer">
                        <span class="tag-badge" style="background-color: ${item.tagColor}">#${item.tag}</span>
                        <div class="card-actions">
                            <span>${item.date}</span>
                            <i class="fa-solid fa-pen action-icon"></i>
                            <i class="fa-regular fa-trash-can action-icon"></i>
                            <i class="${starClass} action-icon star-icon" onclick="toggleBookmarkStar(this, ${item.id})"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}

// 별표 토글 함수 (개별 카드 동작용)
function toggleBookmarkStar(element, id) {
    // UI 상에서 클래스 토글
    if (element.classList.contains('fa-solid')) {
        element.classList.replace('fa-solid', 'fa-regular');
        element.classList.remove('active');
    } else {
        element.classList.replace('fa-regular', 'fa-solid');
        element.classList.add('active');
    }
    // 실제 데이터 업데이트는 생략 (서버 연동 필요)
    console.log(`Bookmark ID ${id} star toggled.`);
}