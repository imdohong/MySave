// 초기 태그 데이터
let tags = [
    { id: 1, name: "디자인", color: "#ffadad", dotColor: "#d32f2f", count: 5 },
    { id: 2, name: "공부", color: "#fdffb6", dotColor: "#fbc02d", count: 5 },
    { id: 3, name: "AI", color: "#a0c4ff", dotColor: "#1976d2", count: 5 }
];

// 현재 선택된 색상 (기본값: red 계열)
let selectedColorBg = "#ffadad";
let selectedColorDot = "#d32f2f";

// 페이지 로드 완료 시 실행
document.addEventListener('DOMContentLoaded', () => {
    renderTags(); // 초기 태그 목록 그리기
    setupColorSelection(); // 색상 선택 기능 연결
    
    // 생성 버튼 클릭 이벤트
    document.getElementById('createTagBtn').addEventListener('click', addNewTag);
    
    // 엔터키 입력 시 생성 이벤트
    document.getElementById('tagNameInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addNewTag();
    });
});

// 태그 목록 렌더링 함수
function renderTags() {
    const container = document.getElementById('tagListContainer');
    container.innerHTML = ''; // 기존 목록 비우기

    tags.forEach(tag => {
        const cardHTML = `
            <div class="tag-card" style="background-color: ${tag.color};">
                <i class="fa-solid fa-xmark delete-btn" onclick="deleteTag(${tag.id})"></i>
                <div class="tag-info">
                    <div class="tag-dot" style="background-color: ${tag.dotColor};"></div>
                    <span class="tag-name">${tag.name}</span>
                </div>
                <span class="tag-count">${tag.count}개의 글</span>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}

// 색상 선택 로직 설정
function setupColorSelection() {
    const circles = document.querySelectorAll('.color-circle');
    
    circles.forEach(circle => {
        circle.addEventListener('click', () => {
            // 모든 원에서 selected 클래스 제거
            circles.forEach(c => c.classList.remove('selected'));
            // 클릭한 원에 selected 클래스 추가
            circle.classList.add('selected');
            
            // 선택된 색상값 업데이트
            const colorName = circle.getAttribute('data-color');
            updateSelectedColors(colorName);
        });
    });
}

// 색상 이름에 따른 색상 코드 설정
function updateSelectedColors(colorName) {
    switch(colorName) {
        case 'red': selectedColorBg = "#ffadad"; selectedColorDot = "#d32f2f"; break;
        case 'orange': selectedColorBg = "#ffd6a5"; selectedColorDot = "#e65100"; break;
        case 'yellow': selectedColorBg = "#fdffb6"; selectedColorDot = "#fbc02d"; break;
        case 'green': selectedColorBg = "#caffbf"; selectedColorDot = "#2e7d32"; break;
        case 'blue': selectedColorBg = "#a0c4ff"; selectedColorDot = "#1565c0"; break;
        case 'purple': selectedColorBg = "#bdb2ff"; selectedColorDot = "#6a1b9a"; break;
        case 'grey': selectedColorBg = "#cfcfcf"; selectedColorDot = "#424242"; break;
    }
}

// 새 태그 추가 함수
function addNewTag() {
    const input = document.getElementById('tagNameInput');
    const name = input.value.trim();

    if (!name) {
        alert("태그 이름을 입력해주세요!");
        return;
    }

    const newTag = {
        id: Date.now(),
        name: name,
        color: selectedColorBg,
        dotColor: selectedColorDot,
        count: 0
    };

    tags.push(newTag);
    renderTags(); // 화면 갱신
    input.value = ''; // 입력창 비우기
}

// 태그 삭제 함수
function deleteTag(id) {
    if(confirm("정말 이 태그를 삭제하시겠습니까?")) {
        tags = tags.filter(tag => tag.id !== id);
        renderTags();
    }
}