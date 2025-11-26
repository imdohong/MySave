// 리마인드 데이터 (그룹핑)
const timelineData = [
    {
        group: "오늘",
        color: "blue", // dot color
        items: [
            { time: "오후 2:00", title: "react 19 기능 문서 읽기", url: "https://react.dev/blog/react-19" },
            { time: "오후 5:00", title: "react 20 기능 문서 읽기", url: "https://react.dev/blog/react-20" }
        ]
    },
    {
        group: "내일",
        color: "yellow",
        items: [
            { time: "오후 2:00", title: "react 19 기능 문서 읽기", url: "https://react.dev/blog/react-19" },
            { time: "오후 5:00", title: "react 20 기능 문서 읽기", url: "https://react.dev/blog/react-20" }
        ]
    },
    {
        group: "이번주",
        color: "pink",
        items: [
            { time: "D-2", title: "디자인 레퍼런스 정리", url: "https://react.dev/blog/react-19" },
            { time: "D-6", title: "팀 회의 안건 작성하기", url: "" }
        ]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('timelineContainer');
    
    // 데이터 순회하며 HTML 생성
    timelineData.forEach(group => {
        // 1. 아이템 리스트 HTML 생성
        let itemsHTML = '';
        group.items.forEach(item => {
            itemsHTML += `
                <div class="reminder-item">
                    <div class="item-left">
                        <div class="item-icon"></div>
                        <div class="item-info">
                            <span class="item-time">${item.time}</span>
                            <span class="item-title">${item.title}</span>
                            <span class="item-link-text">${item.url ? new URL(item.url).hostname : 'No link'}</span>
                        </div>
                    </div>
                    <div class="item-right">
                        <a href="${item.url}" class="item-action">
                            <i class="fa-solid fa-arrow-up-right-from-square"></i> 원본 글 보기
                        </a>
                    </div>
                </div>
            `;
        });

        // 2. 그룹(날짜 헤더 + 아이템 리스트) HTML 생성
        const groupHTML = `
            <div class="timeline-group">
                <div class="date-header">
                    <div class="dot-wrapper ${group.color}">
                        <div class="dot ${group.color}"></div>
                    </div>
                    <span>${group.group}</span>
                </div>
                <div class="timeline-items">
                    ${itemsHTML}
                </div>
            </div>
        `;

        container.innerHTML += groupHTML;
    });
});