// 1. 초기 더미 데이터
const initialBookmarkData = [
    { 
        id: 1, 
        title: "React 19의 새로운 기능 완벽 정리", 
        tag: "Dev", 
        tagColor: "#3b5998", 
        date: "2025.11.21", 
        isStarred: true, 
        isRead: false, 
        hasSummary: true,
        content: "React 19의 새로운 기능인 Actions, useOptimistic 등을 소개하고 있습니다...",
        aiSummary: "React 19는 서버 컴포넌트 통합 강화...",
        memo: "이번 프로젝트에 바로 적용해봐야겠다."
    },
    { 
        id: 2, 
        title: "2025 AI 디자인 트렌드 분석 리포트", 
        tag: "Design", 
        tagColor: "#E91E63", 
        date: "2025.11.20", 
        isStarred: false, 
        isRead: true, 
        hasSummary: false,
        content: "2025년 디자인 트렌드는...",
        aiSummary: "",
        memo: ""
    },
    { 
        id: 3, 
        title: "효율적인 팀 커뮤니케이션을 위한 가이드", 
        tag: "Work", 
        tagColor: "#2E7D32", 
        date: "2025.11.19", 
        isStarred: true, 
        isRead: true, 
        hasSummary: true,
        content: "비동기 커뮤니케이션의 중요성이...",
        aiSummary: "비동기 커뮤니케이션 확산...",
        memo: "우리 팀 회의 규칙에 건의해보기."
    },
    { id: 4, title: "프론트엔드 성능 최적화 베스트 프랙티스", tag: "Dev", tagColor: "#3b5998", date: "2025.11.18", isStarred: false, isRead: false, hasSummary: true, content: "내용...", aiSummary: "요약...", memo: "" },
    { id: 5, title: "UX 심리학: 사용자를 사로잡는 법칙들", tag: "Design", tagColor: "#E91E63", date: "2025.11.17", isStarred: true, isRead: false, hasSummary: false, content: "내용...", aiSummary: "", memo: "" },
    { id: 6, title: "생산성을 높이는 노션 활용 꿀팁 10가지", tag: "Work", tagColor: "#2E7D32", date: "2025.11.16", isStarred: false, isRead: true, hasSummary: true, content: "내용...", aiSummary: "요약...", memo: "" },
    { id: 7, title: "타입스크립트 고급 기능 활용하기", tag: "Dev", tagColor: "#3b5998", date: "2025.11.15", isStarred: true, isRead: true, hasSummary: true, content: "내용...", aiSummary: "요약...", memo: "" },
    { id: 8, title: "피그마 오토레이아웃 마스터하기", tag: "Design", tagColor: "#E91E63", date: "2025.11.14", isStarred: false, isRead: false, hasSummary: false, content: "내용...", aiSummary: "", memo: "" },
    { id: 9, title: "성공적인 리모트 워크를 위한 문화 만들기", tag: "Work", tagColor: "#2E7D32", date: "2025.11.13", isStarred: false, isRead: true, hasSummary: true, content: "내용...", aiSummary: "요약...", memo: "" },
];

// 전역 상태 변수
let currentFilterType = 'all';
let currentSortOrder = 'latest'; // 'latest' (최신순) or 'oldest' (오래된순)

document.addEventListener('DOMContentLoaded', () => {
    // 로컬 스토리지 초기화
    if (!localStorage.getItem('bookmarks')) {
        localStorage.setItem('bookmarks', JSON.stringify(initialBookmarkData));
    }

    renderBookmarks('all');

    // 1. 필터 버튼 (전체, 즐겨찾기 등)
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            currentFilterType = button.getAttribute('data-filter');
            const searchQuery = document.querySelector('.search-container input').value;
            renderBookmarks(currentFilterType, searchQuery);
        });
    });

    // 2. 검색창
    const searchInput = document.querySelector('.search-container input');
    searchInput.addEventListener('input', (e) => {
        const searchQuery = e.target.value;
        renderBookmarks(currentFilterType, searchQuery);
    });

    // 3. [추가됨] 정렬 버튼 (최신순 <-> 오래된순)
    const sortBtn = document.querySelector('.sort-btn');
    if (sortBtn) {
        sortBtn.addEventListener('click', () => {
            // 정렬 상태 토글
            if (currentSortOrder === 'latest') {
                currentSortOrder = 'oldest';
                sortBtn.innerHTML = '오래된순 <i class="fa-solid fa-chevron-up"></i>';
            } else {
                currentSortOrder = 'latest';
                sortBtn.innerHTML = '최신순 <i class="fa-solid fa-chevron-down"></i>';
            }
            
            // 다시 렌더링
            const searchQuery = searchInput.value;
            renderBookmarks(currentFilterType, searchQuery);
        });
    }
});

/**
 * 북마크 렌더링 함수
 */
function renderBookmarks(filterType, searchQuery = '') {
    const container = document.getElementById('bookmarkCardContainer');
    container.innerHTML = '';

    const bookmarks = JSON.parse(localStorage.getItem('bookmarks'));

    // 1단계: 탭 필터링
    let filteredData = bookmarks;
    if (filterType === 'starred') filteredData = bookmarks.filter(item => item.isStarred);
    else if (filterType === 'read') filteredData = bookmarks.filter(item => item.isRead);
    else if (filterType === 'unread') filteredData = bookmarks.filter(item => !item.isRead);

    // 2단계: 검색어 필터링
    if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        filteredData = filteredData.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.tag.toLowerCase().includes(query) ||
            (item.content && item.content.toLowerCase().includes(query))
        );
    }

    // 3단계: [추가됨] 정렬 로직 (날짜 문자열 비교)
    filteredData.sort((a, b) => {
        // 날짜 형식 "2025.11.21"을 비교하기 위해 Date 객체로 변환하거나 문자열 비교
        // 문자열 비교 (YYYY.MM.DD 형식이라 가능)
        if (currentSortOrder === 'latest') {
            return b.date.localeCompare(a.date); // 내림차순 (최신 날짜가 위로)
        } else {
            return a.date.localeCompare(b.date); // 오름차순 (오래된 날짜가 위로)
        }
    });

    // 결과 없음 처리
    if (filteredData.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888; margin-top: 50px;">검색 결과가 없습니다.</p>';
        return;
    }

    // 카드 생성
    filteredData.forEach(item => {
        const summaryBadge = item.hasSummary 
            ? `<span class="summary-tag">요약됨</span>` 
            : `<button class="summary-btn" onclick="event.stopPropagation(); alert('요약 생성 기능 준비중')">요약하기</button>`;

        const starClass = item.isStarred ? 'fa-solid fa-star active' : 'fa-regular fa-star';

        const cardHTML = `
            <div class="card" onclick="goToDetail(${item.id})">
                <div class="card-img">
                    ${summaryBadge}
                </div>
                <div class="card-body">
                    <h4 class="card-title">${item.title}</h4>
                    <div class="card-footer">
                        <span class="tag-badge" style="background-color: ${item.tagColor}">#${item.tag}</span>
                        <div class="card-actions">
                            <span>${item.date}</span>
                            <i class="fa-solid fa-pen action-icon" onclick="editBookmark(event, ${item.id})"></i>
                            <i class="fa-regular fa-trash-can action-icon" onclick="event.stopPropagation(); deleteBookmark(${item.id})"></i>
                            <i class="${starClass} action-icon star-icon" onclick="toggleBookmarkStar(event, ${item.id})"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}

function goToDetail(id) {
    localStorage.setItem('currentBookmarkId', id);
    localStorage.removeItem('editMode');
    window.location.href = 'bookmarkcontent.html';
}

function editBookmark(event, id) {
    event.stopPropagation();
    localStorage.setItem('currentBookmarkId', id);
    localStorage.setItem('editMode', 'true');
    window.location.href = 'bookmarkcontent.html';
}

function toggleBookmarkStar(event, id) {
    event.stopPropagation(); 
    const element = event.target;
    
    if (element.classList.contains('fa-solid')) {
        element.classList.replace('fa-solid', 'fa-regular');
        element.classList.remove('active');
    } else {
        element.classList.replace('fa-regular', 'fa-solid');
        element.classList.add('active');
    }

    const bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    const targetIndex = bookmarks.findIndex(b => b.id === id);
    if (targetIndex > -1) {
        bookmarks[targetIndex].isStarred = !bookmarks[targetIndex].isStarred;
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
}

function deleteBookmark(id) {
    if(confirm('정말 삭제하시겠습니까?')) {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
        const newBookmarks = bookmarks.filter(b => b.id !== id);
        
        localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
        
        const searchQuery = document.querySelector('.search-container input').value;
        renderBookmarks(currentFilterType, searchQuery);
    }
}