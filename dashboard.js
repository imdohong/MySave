// 1. 초기 데이터 (확장된 데이터 구조)
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

// 3. 화면 렌더링
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

        const card = document.createElement('div');
        card.className = 'card';
        
        card.innerHTML = `
            <div class="card-img" style="background-color: ${item.bgColor || '#eee'};">
                ${unreadBadge}
                ${imageContent}
            </div>
            <div class="card-body">
                <h4 class="card-title">${item.title}</h4>
                <div class="card-footer">
                    <span class="tag-badge" style="background-color: ${item.tagColor}">#${item.tag}</span>
                    <div class="date-star">
                        <span>${item.date}</span>
                        <i class="star-btn ${starIconClass} fa-star ${activeClass}" style="color: ${starColor}; cursor: pointer;"></i>
                    </div>
                </div>
            </div>
        `;

        // 카드 클릭 시 페이지 이동 + 출처(from) 정보 전달
        card.addEventListener('click', () => {
            // 읽음 처리
            if (!item.isRead) {
                const allData = getDashboardData();
                const target = allData.find(d => d.id === item.id);
                if (target) {
                    target.isRead = true;
                    saveDashboardData(allData);
                }
            }
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

// 5. 실행
document.addEventListener('DOMContentLoaded', () => {
    const data = getDashboardData();
    renderCards(data);
});