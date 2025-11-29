// 1. 초기 샘플 데이터
const sampleData = [
    {
        id: 1,
        title: "React 19의 새로운 기능 완벽 정리",
        tag: "Dev",
        tagColor: "#3b5998",
        date: "2025.11.21",
        bgColor: "#ffb3b3", 
        isStarred: true
    },
    {
        id: 2,
        title: "2025 AI 디자인 트렌드 분석 리포트",
        tag: "Design",
        tagColor: "#3b5998", 
        date: "2025.11.21",
        bgColor: "#cce0ff", 
        isStarred: true
    },
    {
        id: 3,
        title: "효율적인 팀 커뮤니케이션을 위한 가이드",
        tag: "Work",
        tagColor: "#475569",
        date: "2025.11.21",
        bgColor: "#b3e6b3", 
        isStarred: true
    },
    {
        id: 4,
        title: "프론트엔드 성능 최적화 베스트 프랙티스",
        tag: "Dev",
        tagColor: "#3b5998",
        date: "2025.11.20",
        bgColor: "#ffdbb3", 
        isStarred: false
    },
    {
        id: 5,
        title: "UX 심리학: 사용자를 사로잡는 법칙들",
        tag: "Design",
        tagColor: "#3b5998",
        date: "2025.11.19",
        bgColor: "#e6e6e6", 
        isStarred: false
    }
];

// 2. 데이터 로드 (Read Only)

// 저장소에서 데이터 가져오기
let savedItems = JSON.parse(localStorage.getItem('myBookmarks'));

// 데이터가 없으면(첫 방문 시) 샘플 데이터로 초기화 (확장 프로그램 시뮬레이션)
if (!savedItems || savedItems.length === 0) {
    savedItems = sampleData;
    localStorage.setItem('myBookmarks', JSON.stringify(savedItems));
}

// 3. 화면 렌더링 (View)
document.addEventListener('DOMContentLoaded', () => {
    renderCards();
    
    // 북마크 추가 버튼은 이제 확장 프로그램의 역할이므로 이벤트 연결을 하지 않습니다.
    // HTML에 버튼이 남아있다면 "확장 프로그램을 이용해주세요" 같은 알림만 띄우거나, 버튼을 숨기는 것이 좋습니다.
    const addBtn = document.querySelector('.btn-primary');
    if(addBtn) {
        addBtn.addEventListener('click', () => {
            alert("북마크 추가는 크롬 확장 프로그램을 이용해주세요! 🧩");
        });
    }
});

function renderCards() {
    const cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = ''; 

    savedItems.forEach((item) => {
        const activeClass = item.isStarred ? 'active' : '';

        const cardHTML = `
            <div class="card">
                <div class="card-img" style="background-color: ${item.bgColor};">
                    <span class="summary-tag">요약됨</span>
                </div>
                <div class="card-body">
                    <h4 class="card-title">${item.title}</h4>
                    <div class="card-footer">
                        <span class="tag-badge" style="background-color: ${item.tagColor}">#${item.tag}</span>
                        <div class="date-star">
                            <span>${item.date}</span>
                            <i class="fa-solid fa-star star-icon ${activeClass}" 
                               onclick="toggleStar(this, ${item.id})"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
        cardContainer.innerHTML += cardHTML;
    });
}

// 4. 상태 관리 (별표 토글 등)

window.toggleStar = function(element, id) {
    const targetItem = savedItems.find(item => item.id === id);
    
    if (targetItem) {
        targetItem.isStarred = !targetItem.isStarred;
        
        // 상태 변경 후 저장소 업데이트 & 화면 갱신
        localStorage.setItem('myBookmarks', JSON.stringify(savedItems));
        renderCards();
    }
};