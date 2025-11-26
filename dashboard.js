// 최근 저장 목록 데이터 (이미지 내용을 기반으로 생성)
const savedItems = [
    {
        title: "React 19의 새로운 기능 완벽 정리",
        tag: "Dev",
        tagColor: "#3b5998",
        date: "2025.11.21",
        bgColor: "#ffb3b3", // 파스텔 레드
        isStarred: true
    },
    {
        title: "2025 AI 디자인 트렌드 분석 리포트",
        tag: "Design",
        tagColor: "#3b5998", // 네이비 계열
        date: "2025.11.21",
        bgColor: "#cce0ff", // 파스텔 블루
        isStarred: true
    },
    {
        title: "효율적인 팀 커뮤니케이션을 위한 가이드",
        tag: "Work",
        tagColor: "#475569",
        date: "2025.11.21",
        bgColor: "#b3e6b3", // 파스텔 그린
        isStarred: true
    },
    {
        title: "React 19의 새로운 기능 (2)",
        tag: "Dev",
        tagColor: "#3b5998",
        date: "2025.11.21",
        bgColor: "#ffdbb3", // 파스텔 오렌지
        isStarred: true
    },
    {
        title: "이미지가 없을 때는 여기에 텍스트를 넣을 거 같습니다.",
        tag: "Dev",
        tagColor: "#3b5998",
        date: "2025.11.21",
        bgColor: "#e6e6e6", // 파스텔 그레이
        isStarred: true
    },
    {
        title: "React 19의 새로운 기능 (3)",
        tag: "Dev",
        tagColor: "#3b5998",
        date: "2025.11.21",
        bgColor: "#d9d9d9", // 그레이
        isStarred: true
    }
];

// DOM 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    const cardContainer = document.getElementById('cardContainer');

    // 데이터 기반으로 카드 HTML 생성 및 주입
    savedItems.forEach((item, index) => {
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
                            <i class="fa-solid fa-star star-icon ${item.isStarred ? 'active' : ''}" onclick="toggleStar(this)"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
        cardContainer.innerHTML += cardHTML;
    });
});

// 별표 토글 함수
function toggleStar(element) {
    element.classList.toggle('active');
    
    // 실제 앱에서는 여기서 서버로 API 요청을 보내 상태를 저장합니다.
    if(element.classList.contains('active')) {
        console.log("즐겨찾기 추가됨");
    } else {
        console.log("즐겨찾기 해제됨");
    }
}