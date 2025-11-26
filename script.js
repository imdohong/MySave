// Daum 클론 기본 스크립트
console.log("Daum Clone Loaded");

function logout() {
    if(confirm("로그아웃 하시겠습니까?")) alert("로그아웃 되었습니다.");
}

// ★★★ [NEW] 추천 위젯 데이터 및 렌더링 ★★★
const miniData = [
    { id: 1, title: "React 19의 새로운 기능 완벽 정리", tag: "Dev", color: "#ffccd5" }, // 핑크
    { id: 2, title: "2025 AI 디자인 트렌드 분석", tag: "Design", color: "#fff4bd" },    // 노랑
    { id: 3, title: "효율적인 팀 커뮤니케이션 가이드", tag: "Work", color: "#e2f0cb" },   // 그린
    { id: 4, title: "프론트엔드 성능 최적화 팁", tag: "Dev", color: "#e2e2e2" }         // 그레이
];

function renderMiniCards() {
    const container = document.getElementById('miniCardGrid');
    if (!container) return;

    container.innerHTML = '';

    miniData.forEach(item => {
        const html = `
            <div class="mini-card">
                <div class="mini-thumb" style="background-color: ${item.color};">
                    <span class="mini-badge">요약됨</span>
                </div>
                <div class="mini-title">${item.title}</div>
                <span class="mini-tag">#${item.tag}</span>
            </div>
        `;
        container.innerHTML += html;
    });
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    renderMiniCards();
});