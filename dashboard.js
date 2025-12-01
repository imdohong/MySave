// 1. 초기 데이터
const initialDashboardData = [
    { 
        id: 1, 
        title: "React 19의 새로운 기능 완벽 정리", 
        tag: "Dev", 
        tagColor: "#3b5998", 
        date: "2025.11.30", 
        bgColor: "#ffb3b3",
        isStarred: true, 
        isRead: false, 
        hasSummary: true, 
        content: "React 19의 새로운 기능인 Actions와 Compiler에 대해 알아봅니다.", 
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop"
    },
    { 
        id: 2, 
        title: "2025 AI 디자인 트렌드 분석 리포트", 
        tag: "Design", 
        tagColor: "#E91E63", 
        date: "2025.11.20", 
        bgColor: "#cce0ff",
        isStarred: false, 
        isRead: true, 
        hasSummary: false, 
        content: "AI 툴의 발전으로 인한 디자인 프로세스 혁신에 대해 다룹니다.", 
        image: "" 
    },
    { 
        id: 3, 
        title: "효율적인 팀 커뮤니케이션 가이드", 
        tag: "Work", 
        tagColor: "#475569", 
        date: "2025.11.15", 
        bgColor: "#b3e6b3",
        isStarred: true, 
        isRead: true, 
        hasSummary: true, 
        content: "비동기 커뮤니케이션의 핵심은 명확한 문서화입니다.", 
        image: null
    },
    {
        id: 4,
        title: "프론트엔드 성능 최적화 베스트 프랙티스",
        tag: "Dev",
        tagColor: "#3b5998",
        date: "2025.11.20",
        bgColor: "#ffdbb3",
        isStarred: false,
        isRead: false,
        hasSummary: true,
        content: "Lighthouse 점수를 올리기 위한 이미지 최적화 및 코드 스플리팅 기법.",
        image: null
    },
    {
        id: 5,
        title: "UX 심리학: 사용자를 사로잡는 법칙들",
        tag: "Design",
        tagColor: "#3b5998",
        date: "2025.11.19",
        bgColor: "#e6e6e6",
        isStarred: false,
        isRead: false,
        hasSummary: false,
        content: "제이콥의 법칙: 사용자는 다른 사이트에서 겪은 경험을 기대한다.",
        image: null
    }
];

// 2. 데이터 가져오기 및 저장
function getDashboardData() {
    const stored = localStorage.getItem('bookmarks');
    if (!stored) {
        localStorage.setItem('bookmarks', JSON.stringify(initialDashboardData));
        return initialDashboardData;
    }
    return JSON.parse(stored);
}

function saveDashboardData(newData) {
    localStorage.setItem('bookmarks', JSON.stringify(newData));
}

// 3. 화면 렌더링 (메인 카드)
function renderCards(data) {
    const cardContainer = document.getElementById('cardContainer');
    if (!cardContainer) return;
    
    cardContainer.innerHTML = ''; 
    data.forEach((item) => {
        const activeClass = item.isStarred ? 'active' : '';
        const starIconClass = item.isStarred ? 'fa-solid' : 'fa-regular';
        const starColor = item.isStarred ? '#facc15' : '#ccc';
        const unreadBadge = !item.isRead ? '<div class="unread-dot"></div>' : '';

        const imageContent = item.image 
            ? `<img src="${item.image}" style="width:100%; height:100%; object-fit:cover; border-radius: inherit;">` 
            : '<span class="summary-tag">요약됨</span>';

        // 리마인드 배지 표시 로직
        // 리마인드가 있으면 파란색 배지, 없으면 일반 날짜 표시
        const reminderBadge = item.reminderTime 
            ? `
            <div style="
                position: absolute; 
                top: 10px; 
                left: 10px; 
                width: 28px; 
                height: 28px; 
                background-color: rgba(255, 255, 255, 0.95); 
                border-radius: 50%; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                box-shadow: 0 2px 5px rgba(0,0,0,0.15); 
                z-index: 10;
            " title="리마인드 설정됨">
                <i class="fa-solid fa-bell" style="color: #3182F6; font-size: 13px;"></i>
            </div>`
            : '';

        const card = document.createElement('div');
        card.className = 'card';
        
        card.innerHTML = `
            <div class="card-img" style="background-color: ${item.bgColor || '#eee'}; position: relative;">
                ${reminderBadge} ${unreadBadge}
                ${imageContent}
            </div>
            <div class="card-body">
                <h4 class="card-title">${item.title}</h4>
                <div class="card-footer">
                    <span class="tag-badge" style="background-color: ${item.tagColor}">#${item.tag}</span>
                    <div class="date-star">
                        <span style="color: #888; font-size: 13px;">${item.date}</span>
                        
                        <i class="star-btn ${starIconClass} fa-star ${activeClass}" style="color: ${starColor}; cursor: pointer;"></i>
                    </div>
                </div>
            </div>
        `;

        // 카드 클릭 이벤트
        card.addEventListener('click', () => {
            if (!item.isRead) {
                const allData = getDashboardData();
                const target = allData.find(d => d.id === item.id);
                if (target) {
                    target.isRead = true;
                    saveDashboardData(allData);
                }
            }
            // 이동 전 필요한 정보 저장
            localStorage.setItem('currentBookmarkId', item.id);
            localStorage.setItem('previousPage', 'dashboard');
            localStorage.setItem('editMode', 'false');
            
            window.location.href = `bookmarkcontent.html?id=${item.id}&from=dashboard`;
        });

        // 별표 클릭 (이동 방지)
        const starBtn = card.querySelector('.star-btn');
        starBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleStar(starBtn, item.id);
        });

        cardContainer.appendChild(card);
    });
}

// 4. 별표 토글
function toggleStar(element, id) {
    const allData = getDashboardData();
    const targetItem = allData.find(item => item.id === id);
    
    if (targetItem) {
        targetItem.isStarred = !targetItem.isStarred;
        saveDashboardData(allData);

        if (targetItem.isStarred) {
            element.classList.remove('fa-regular');
            element.classList.add('fa-solid', 'active');
            element.style.color = '#facc15';
        } else {
            element.classList.remove('fa-solid', 'active');
            element.classList.add('fa-regular');
            element.style.color = '#ccc';
        }
    }
}

// 5. 사이드바 리마인드 렌더링 함수
function renderSidebarReminders() {
    const container = document.getElementById('sidebarReminderList');
    if (!container) return; // 사이드바가 없으면 패스

    const bookmarks = getDashboardData();
    const reminders = bookmarks.filter(item => item.reminderTime);

    if (reminders.length === 0) {
        container.innerHTML = `<div style="padding: 20px; text-align: center; color: #aaa; font-size: 13px;">예정된 리마인드가 없습니다.</div>`;
        return;
    }

    // 날짜별 분류
    const groups = { today: [], tomorrow: [] };
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    reminders.forEach(item => {
        const tDate = new Date(item.reminderTime);
        const tStart = new Date(tDate.getFullYear(), tDate.getMonth(), tDate.getDate());
        const diffDays = Math.ceil((tStart - todayStart) / (1000 * 60 * 60 * 24));
        
        item.displayTime = tDate.toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit' });

        if (diffDays === 0) groups.today.push(item);
        else if (diffDays === 1) groups.tomorrow.push(item);
    });

    // 정렬
    groups.today.sort((a, b) => new Date(a.reminderTime) - new Date(b.reminderTime));
    groups.tomorrow.sort((a, b) => new Date(a.reminderTime) - new Date(b.reminderTime));

    // HTML 그리기
    container.innerHTML = '';
    
    if (groups.today.length > 0) {
        container.innerHTML += createSidebarGroupHTML('오늘', 'blue', groups.today);
    }
    if (groups.tomorrow.length > 0) {
        container.innerHTML += createSidebarGroupHTML('내일', 'yellow', groups.tomorrow);
    }

    if (groups.today.length === 0 && groups.tomorrow.length === 0) {
         container.innerHTML = `<div style="padding: 20px; text-align: center; color: #aaa; font-size: 13px;">오늘, 내일 일정이 없습니다.<br><a href="reminder.html" style="color:#3182F6">전체 보기</a></div>`;
    }
}

// 사이드바 그룹 HTML 생성 헬퍼
function createSidebarGroupHTML(label, color, items) {
    const listHTML = items.map(item => `
        <div class="reminder-item" onclick="location.href='bookmarkcontent.html?id=${item.id}&from=dashboard'" style="cursor: pointer;">
            <span class="time">${item.displayTime}</span>
            <span class="task" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.title}</span>
        </div>
    `).join('');

    return `
        <div class="day-group">
            <div class="day-label"><span class="dot ${color}"></span> ${label}</div>
            ${listHTML}
        </div>
    `;
}


// 6. 상단 통계 카드 업데이트 함수
function updateDashboardStats() {
    // DOM 요소 가져오기
    const totalReminderEl = document.getElementById('totalReminderCount');
    const todayReminderDescEl = document.getElementById('todayReminderDesc');
    const weeklyRateEl = document.getElementById('weeklyRate');
    const weeklyDescEl = document.getElementById('weeklyDesc');
    
    // 요소가 하나라도 없으면 중단
    if (!totalReminderEl || !todayReminderDescEl || !weeklyRateEl || !weeklyDescEl) return;

    // 데이터 준비
    const bookmarks = getDashboardData();
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // 카운터 변수 초기화
    let totalIncompleteCount = 0; // 미완료 리마인드
    let todayDueCount = 0;        // 오늘 마감 리마인드
    
    let totalSavedCount = bookmarks.length; // 전체 저장된 글 개수
    let totalReadCount = 0;                 // 전체 읽은 글 개수

    // 데이터 순회하며 계산
    bookmarks.forEach(item => {
        // 리마인드 통계 계산
        if (item.reminderTime) {
            // 안 읽은 리마인드 개수 (큰 숫자)
            if (!item.isRead) {
                totalIncompleteCount++; 
            }

            // 오늘 마감 개수 (작은 설명)
            const targetDate = new Date(item.reminderTime);
            const targetDayStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
            const diffDays = Math.ceil((targetDayStart - todayStart) / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
                todayDueCount++; 
            }
        }

        // 전체 읽기 달성률 계산 
        if (item.isRead) {
            totalReadCount++;
        }
    });

    // 화면 업데이트
    // (1) 리마인드 통계 반영
    totalReminderEl.textContent = totalIncompleteCount;
    todayReminderDescEl.textContent = `오늘 마감되는 항목 ${todayDueCount} 건`;

    // (2) 전체 읽기 달성률 반영
    let percentage = 0;
    if (totalSavedCount > 0) {
        percentage = Math.round((totalReadCount / totalSavedCount) * 100);
    }
    
    weeklyRateEl.textContent = percentage;
    weeklyDescEl.textContent = `전체 ${totalSavedCount}개 중 ${totalReadCount}개 읽음`;
}

// 7. 실행
document.addEventListener('DOMContentLoaded', () => {
    // 1. 전체 데이터 가져오기
    const allData = getDashboardData();
    
    // 2. 최신순 정렬 (날짜 내림차순)
    allData.sort((a, b) => b.date.localeCompare(a.date));

    // 3. 상위 6개만 자르기
    const recentData = allData.slice(0, 6);
    
    // 4. 잘라낸 데이터로 카드 그리기
    renderCards(recentData);
    
    // 나머지 기능 실행
    renderSidebarReminders();
    updateDashboardStats();

    // 검색 기능 (검색할 때는 6개 제한 없이 검색된 것 다 보여줌)
    const searchInput = document.querySelector('.search-container input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const keyword = e.target.value.toLowerCase().trim();
            const currentData = getDashboardData(); // 다시 전체 데이터 가져옴
            
            // 검색어 필터링
            const filtered = currentData.filter(item => 
                item.title.toLowerCase().includes(keyword) || 
                item.tag.toLowerCase().includes(keyword)
            );
            
            // 검색 중일 때는 개수 제한 없이
            renderCards(filtered);
        });
    }
});