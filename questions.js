// 상식 퀴즈 문항 40개 (카테고리마다 10개)
// 형식은 PRD.md 4.2를 따른다. 정답은 choices[answer]다.
// 출처는 문항마다 주소를 실제로 열어 정답과 해설 내용을 확인했다.
const QUESTIONS = [
  // ===== 한국사 =====
  {
    id: "hist-01",
    category: "한국사",
    question: "1392년 공양왕을 몰아내고 새 왕조의 왕위에 올라 조선의 첫 임금이 된 인물은?",
    choices: ["왕건", "이성계", "이방원", "정도전"],
    answer: 1,
    explanation: "이성계는 위화도 회군으로 실권을 잡은 뒤 1392년 7월 새 왕조의 왕위에 올랐다.",
    source: { name: "한국민족문화대백과사전 「태조」", url: "https://encykorea.aks.ac.kr/Article/E0059033" }
  },
  {
    id: "hist-02",
    category: "한국사",
    question: "1443년 '훈민정음'이라는 새 글자를 만든 조선의 임금은?",
    choices: ["태종", "세조", "세종", "성종"],
    answer: 2,
    explanation: "세종은 1443년 훈민정음을 창제하고 1446년에 반포했다.",
    source: { name: "한국민족문화대백과사전 「한글」", url: "https://encykorea.aks.ac.kr/Article/E0061508" }
  },
  {
    id: "hist-03",
    category: "한국사",
    question: "918년 고려를 세우고 936년 후삼국을 통합한 인물은?",
    choices: ["견훤", "궁예", "신검", "왕건"],
    answer: 3,
    explanation: "고려는 918년 개성 출신 왕건이 세웠고, 936년 후삼국을 통합했다.",
    source: { name: "한국민족문화대백과사전 「고려」", url: "https://encykorea.aks.ac.kr/Article/E0003424" }
  },
  {
    id: "hist-04",
    category: "한국사",
    question: "1597년 정유재란 때 이순신이 울돌목에서 일본 수군을 크게 무찌른 해전은?",
    choices: ["명량 해전", "한산도 대첩", "노량 해전", "옥포 해전"],
    answer: 0,
    explanation: "명량 해전은 1597년 9월 이순신이 울돌목(명량)에서 일본 수군을 대파한 싸움이다.",
    source: { name: "한국민족문화대백과사전 「명량대첩」", url: "https://encykorea.aks.ac.kr/Article/E0018250" }
  },
  {
    id: "hist-05",
    category: "한국사",
    question: "1919년 전국에서 일어나 중국 상하이의 대한민국 임시 정부 수립으로 이어진 독립만세운동은?",
    choices: ["6·10 만세 운동", "3·1 운동", "물산 장려 운동", "국채 보상 운동"],
    answer: 1,
    explanation: "3·1 운동은 1919년 3월 1일 시작된 거족적 독립만세운동으로 임시 정부 수립으로 이어졌다.",
    source: { name: "한국민족문화대백과사전 「3·1운동」", url: "https://encykorea.aks.ac.kr/Article/E0026772" }
  },
  {
    id: "hist-06",
    category: "한국사",
    question: "1894년 전라도 고부에서 봉기해 동학 농민 운동을 이끈 동학 접주는?",
    choices: ["최제우", "김옥균", "전봉준", "최익현"],
    answer: 2,
    explanation: "동학 농민 운동은 1894년 고부의 동학 접주 전봉준 등을 지도자로 일어났다.",
    source: { name: "한국민족문화대백과사전 「동학운동」", url: "https://encykorea.aks.ac.kr/Article/E0016865" }
  },
  {
    id: "hist-07",
    category: "한국사",
    question: "동부여를 떠나 졸본에 도읍을 정하고 고구려를 세운 시조는?",
    choices: ["온조", "박혁거세", "김수로", "주몽"],
    answer: 3,
    explanation: "동명성왕 고주몽은 졸본으로 가서 도읍을 정하고 고구려를 세웠다.",
    source: { name: "한국민족문화대백과사전 「동명성왕」", url: "https://encykorea.aks.ac.kr/Article/E0016431" }
  },
  {
    id: "hist-08",
    category: "한국사",
    question: "고구려 옛 장수 출신으로 동모산에서 발해를 세운 인물은?",
    choices: ["대조영", "연개소문", "을지문덕", "양만춘"],
    answer: 0,
    explanation: "발해는 고구려 옛 장수인 대조영이 동모산에서 세운 나라다.",
    source: { name: "한국민족문화대백과사전 「발해」", url: "https://encykorea.aks.ac.kr/Article/E0021626" }
  },
  {
    id: "hist-09",
    category: "한국사",
    question: "정조 때 수원에 성을 쌓으며 거중기를 고안해 공사를 도운 실학자는?",
    choices: ["박지원", "정약용", "박제가", "유형원"],
    answer: 1,
    explanation: "정약용은 『기기도설』을 참고해 거중기를 만들어 수원 성 공사를 크게 도왔다.",
    source: { name: "한국민족문화대백과사전 「기기도설」", url: "https://encykorea.aks.ac.kr/Article/E0008132" }
  },
  {
    id: "hist-10",
    category: "한국사",
    question: "당의 대규모 침공을 물리치고 신라의 삼국 통일을 완수한 신라 제30대 왕은?",
    choices: ["진흥왕", "법흥왕", "문무왕", "무열왕"],
    answer: 2,
    explanation: "문무왕은 당의 침공을 물리치고 삼국 통일을 완수한 통일신라 제30대 왕이다.",
    source: { name: "한국민족문화대백과사전 「문무왕」", url: "https://encykorea.aks.ac.kr/Article/E0019473" }
  },

  // ===== 세계지리 =====
  {
    id: "geo-01",
    category: "세계지리",
    question: "오스트레일리아의 연방 수도는?",
    choices: ["시드니", "멜버른", "퍼스", "캔버라"],
    answer: 3,
    explanation: "캔버라는 오스트레일리아 연방 수도로, 1927년 의회가 멜버른에서 옮겨 왔다.",
    source: { name: "브리태니커 백과사전 「Canberra」", url: "https://www.britannica.com/place/Canberra" }
  },
  {
    id: "geo-02",
    category: "세계지리",
    question: "나일강이 흘러 들어가는 바다는?",
    choices: ["지중해", "홍해", "아라비아해", "카스피해"],
    answer: 0,
    explanation: "나일강은 아프리카 북동부를 길게 흐른 뒤 지중해로 흘러든다.",
    source: { name: "내셔널지오그래픽 교육 「Nile River」", url: "https://education.nationalgeographic.org/resource/nile-river/" }
  },
  {
    id: "geo-03",
    category: "세계지리",
    question: "에베레스트산이 속한 산맥은?",
    choices: ["알프스산맥", "히말라야산맥", "안데스산맥", "로키산맥"],
    answer: 1,
    explanation: "에베레스트산은 네팔과 중국 티베트 자치구 경계의 히말라야산맥에 있다.",
    source: { name: "브리태니커 백과사전 「Mount Everest」", url: "https://www.britannica.com/place/Mount-Everest" }
  },
  {
    id: "geo-04",
    category: "세계지리",
    question: "사하라 사막이 있는 대륙은?",
    choices: ["아시아", "남아메리카", "아프리카", "오세아니아"],
    answer: 2,
    explanation: "사하라 사막은 아프리카 북부의 거의 전부를 차지하는 사막이다.",
    source: { name: "브리태니커 백과사전 「Sahara」", url: "https://www.britannica.com/place/Sahara-desert-Africa" }
  },
  {
    id: "geo-05",
    category: "세계지리",
    question: "수에즈 운하가 이어 주는 두 바다는?",
    choices: ["흑해와 카스피해", "북해와 발트해", "지중해와 흑해", "지중해와 홍해"],
    answer: 3,
    explanation: "수에즈 운하는 이집트의 수에즈 지협을 지나 지중해와 홍해를 잇는다.",
    source: { name: "브리태니커 백과사전 「Suez Canal」", url: "https://www.britannica.com/topic/Suez-Canal" }
  },
  {
    id: "geo-06",
    category: "세계지리",
    question: "캐나다의 수도는?",
    choices: ["오타와", "토론토", "밴쿠버", "몬트리올"],
    answer: 0,
    explanation: "오타와는 캐나다의 수도로, 빅토리아 여왕이 수도로 골랐다.",
    source: { name: "브리태니커 백과사전 「Ottawa」", url: "https://www.britannica.com/place/Ottawa" }
  },
  {
    id: "geo-07",
    category: "세계지리",
    question: "안데스산맥이 뻗어 있는 대륙은?",
    choices: ["북아메리카", "남아메리카", "아프리카", "유럽"],
    answer: 1,
    explanation: "안데스산맥은 남아메리카의 산계로, 지구의 큰 자연 지형 가운데 하나다.",
    source: { name: "브리태니커 백과사전 「Andes Mountains」", url: "https://www.britannica.com/place/Andes-Mountains" }
  },
  {
    id: "geo-08",
    category: "세계지리",
    question: "세계의 본초 자오선(경도 0°)이 지나는 왕립 천문대가 있는 곳은?",
    choices: ["파리", "베를린", "그리니치", "워싱턴"],
    answer: 2,
    explanation: "영국 그리니치 왕립 천문대는 본초 자오선이 지나는 곳으로 유명하다.",
    source: { name: "영국 왕립 그리니치 박물관", url: "https://www.rmg.co.uk/stories/time/what-prime-meridian-why-it-greenwich" }
  },
  {
    id: "geo-09",
    category: "세계지리",
    question: "파나마 운하가 이어 주는 두 대양은?",
    choices: ["대서양과 인도양", "태평양과 인도양", "인도양과 북극해", "대서양과 태평양"],
    answer: 3,
    explanation: "파나마 운하는 좁은 파나마 지협을 지나 대서양과 태평양을 잇는다.",
    source: { name: "브리태니커 백과사전 「Panama Canal」", url: "https://www.britannica.com/topic/Panama-Canal" }
  },
  {
    id: "geo-10",
    category: "세계지리",
    question: "유네스코 세계유산인 킬리만자로 국립공원이 있는 나라는?",
    choices: ["탄자니아", "케냐", "에티오피아", "우간다"],
    answer: 0,
    explanation: "킬리만자로 국립공원은 탄자니아에 있으며 유네스코 세계유산에 올라 있다.",
    source: { name: "유네스코 세계유산센터", url: "https://whc.unesco.org/en/list/403" }
  },

  // ===== 과학 =====
  {
    id: "sci-01",
    category: "과학",
    question: "물 분자의 화학식은?",
    choices: ["CO₂", "H₂O", "O₂", "NaCl"],
    answer: 1,
    explanation: "물 분자는 수소 원자 2개와 산소 원자 1개로 이루어진 H₂O다.",
    source: { name: "브리태니커 백과사전 「Water」", url: "https://www.britannica.com/science/water" }
  },
  {
    id: "sci-02",
    category: "과학",
    question: "식물 세포에서 광합성이 일어나는 세포 소기관은?",
    choices: ["액포", "리보솜", "엽록체", "골지체"],
    answer: 2,
    explanation: "엽록체는 식물과 녹조류 세포 안에서 광합성이 일어나는 구조다.",
    source: { name: "브리태니커 백과사전 「Chloroplast」", url: "https://www.britannica.com/science/chloroplast" }
  },
  {
    id: "sci-03",
    category: "과학",
    question: "흙 속 철 광물이 녹슬어 '붉은 행성'이라 불리는 행성은?",
    choices: ["금성", "목성", "토성", "화성"],
    answer: 3,
    explanation: "화성은 흙 속 철 광물이 산화해 녹슬어서 '붉은 행성'이라 불린다.",
    source: { name: "NASA 과학 「Mars Facts」", url: "https://science.nasa.gov/mars/facts/" }
  },
  {
    id: "sci-04",
    category: "과학",
    question: "원소 기호가 Fe인 원소는?",
    choices: ["철", "구리", "납", "금"],
    answer: 0,
    explanation: "철(Fe)은 주기율표 8족의 금속 원소로, 라틴어 이름은 ferrum이다.",
    source: { name: "브리태니커 백과사전 「Iron」", url: "https://www.britannica.com/science/iron-chemical-element" }
  },
  {
    id: "sci-05",
    category: "과학",
    question: "1953년 DNA 분자가 긴 이중 나선 구조임을 밝힌 두 과학자는?",
    choices: ["퀴리 부부", "왓슨과 크릭", "멘델과 모건", "파스퇴르와 코흐"],
    answer: 1,
    explanation: "왓슨과 크릭은 1953년 DNA 분자가 긴 이중 나선 구조임을 밝혔다.",
    source: { name: "노벨상 공식 사이트 「James Watson」", url: "https://www.nobelprize.org/prizes/medicine/1962/watson/facts/" }
  },
  {
    id: "sci-06",
    category: "과학",
    question: "만유인력의 법칙을 세운 과학자는?",
    choices: ["갈릴레이", "케플러", "뉴턴", "아인슈타인"],
    answer: 2,
    explanation: "영국의 물리학자 뉴턴은 17세기 과학 혁명을 이끌며 만유인력의 법칙을 세웠다.",
    source: { name: "브리태니커 백과사전 「Isaac Newton」", url: "https://www.britannica.com/biography/Isaac-Newton" }
  },
  {
    id: "sci-07",
    category: "과학",
    question: "1928년 곰팡이 주변에서 세균이 자라지 않는 것을 보고 페니실린을 발견한 과학자는?",
    choices: ["파스퇴르", "코흐", "제너", "플레밍"],
    answer: 3,
    explanation: "플레밍은 1928년 곰팡이가 세균의 성장을 막는 것을 보고 페니실린을 찾아냈다.",
    source: { name: "노벨상 공식 사이트 「Alexander Fleming」", url: "https://www.nobelprize.org/prizes/medicine/1945/fleming/facts/" }
  },
  {
    id: "sci-08",
    category: "과학",
    question: "1901년 사람의 혈액형이 여러 가지임을 밝혀 안전한 수혈의 길을 연 과학자는?",
    choices: ["란트슈타이너", "히포크라테스", "레이우엔훅", "파스퇴르"],
    answer: 0,
    explanation: "란트슈타이너는 1901년 사람마다 혈액형이 다름을 밝혀 안전한 수혈을 가능하게 했다.",
    source: { name: "노벨상 공식 사이트 「Karl Landsteiner」", url: "https://www.nobelprize.org/prizes/medicine/1930/landsteiner/facts/" }
  },
  {
    id: "sci-09",
    category: "과학",
    question: "사람의 심장을 이루는 방(심방과 심실)은 모두 몇 개인가?",
    choices: ["2개", "4개", "3개", "6개"],
    answer: 1,
    explanation: "사람의 심장은 좌우 심방과 좌우 심실, 모두 네 개의 방으로 이루어진다.",
    source: { name: "브리태니커 백과사전 「Heart」", url: "https://www.britannica.com/science/heart" }
  },
  {
    id: "sci-10",
    category: "과학",
    question: "원소를 성질에 따라 주기적으로 분류한 주기율표를 만든 화학자는?",
    choices: ["라부아지에", "아보가드로", "멘델레예프", "베르셀리우스"],
    answer: 2,
    explanation: "멘델레예프는 원소의 주기적 분류, 곧 주기율표를 만든 러시아의 화학자다.",
    source: { name: "브리태니커 백과사전 「Dmitri Mendeleev」", url: "https://www.britannica.com/biography/Dmitri-Mendeleev" }
  },

  // ===== 예술과 문화 =====
  {
    id: "art-01",
    category: "예술과 문화",
    question: "파리 루브르 박물관에 있는 유화 「모나리자」를 그린 화가는?",
    choices: ["미켈란젤로", "라파엘로", "보티첼리", "다빈치"],
    answer: 3,
    explanation: "「모나리자」는 레오나르도 다빈치가 나무 판에 그린 유화로, 파리 루브르에 있다.",
    source: { name: "브리태니커 백과사전 「Mona Lisa」", url: "https://www.britannica.com/topic/Mona-Lisa-painting" }
  },
  {
    id: "art-02",
    category: "예술과 문화",
    question: "뉴욕 현대미술관(MoMA)에 있는 그림 「별이 빛나는 밤」을 그린 화가는?",
    choices: ["고흐", "고갱", "세잔", "모네"],
    answer: 0,
    explanation: "「별이 빛나는 밤」은 빈센트 반 고흐가 1889년 6월 생레미에서 그린 그림이다.",
    source: { name: "뉴욕 현대미술관(MoMA)", url: "https://www.moma.org/collection/works/79802" }
  },
  {
    id: "art-03",
    category: "예술과 문화",
    question: "'운명이 문을 두드리는 소리'로 해석되는 네 음 동기로 시작하는 교향곡 제5번의 작곡가는?",
    choices: ["모차르트", "베토벤", "하이든", "브람스"],
    answer: 1,
    explanation: "베토벤 교향곡 제5번은 '운명이 문을 두드리는' 네 음 동기로 널리 알려졌다.",
    source: { name: "브리태니커 백과사전 「Symphony No. 5」", url: "https://www.britannica.com/topic/Symphony-No-5-in-C-Minor-Op-67" }
  },
  {
    id: "art-04",
    category: "예술과 문화",
    question: "구경꾼들이 둘러앉은 가운데 두 사람이 맞붙어 힘을 겨루는 그림 「씨름」을 그린 조선 화가는?",
    choices: ["신윤복", "정선", "김홍도", "장승업"],
    answer: 2,
    explanation: "「씨름」은 김홍도의 풍속화 25점을 묶은 『풍속도 화첩』에 실린 그림이다.",
    source: { name: "한국민족문화대백과사전 「김홍도 필 풍속도 화첩」", url: "https://encykorea.aks.ac.kr/Article/E0013639" }
  },
  {
    id: "art-05",
    category: "예술과 문화",
    question: "비극 「햄릿」을 쓴 극작가는?",
    choices: ["몰리에르", "괴테", "입센", "셰익스피어"],
    answer: 3,
    explanation: "「햄릿」은 영국의 극작가 윌리엄 셰익스피어가 쓴 희곡이다.",
    source: { name: "브리태니커 백과사전 「Hamlet」", url: "https://www.britannica.com/topic/Hamlet-by-Shakespeare" }
  },
  {
    id: "art-06",
    category: "예술과 문화",
    question: "계절마다 한 곡씩, 바이올린 협주곡 네 곡으로 이루어진 「사계」의 작곡가는?",
    choices: ["비발디", "바흐", "헨델", "텔레만"],
    answer: 0,
    explanation: "「사계」는 비발디가 1720년 무렵 쓴 바이올린 협주곡 네 곡이다.",
    source: { name: "브리태니커 백과사전 「The Four Seasons」", url: "https://www.britannica.com/topic/The-Four-Seasons-by-Vivaldi" }
  },
  {
    id: "art-07",
    category: "예술과 문화",
    question: "1995년 불국사와 함께 유네스코 세계문화유산에 오른 석굴암이 있는 도시는?",
    choices: ["공주", "경주", "부여", "안동"],
    answer: 1,
    explanation: "석굴암은 경주 토함산 동쪽에 있는 통일신라의 석굴 사원이다.",
    source: { name: "한국민족문화대백과사전 「경주 석굴암 석굴」", url: "https://encykorea.aks.ac.kr/Article/E0028362" }
  },
  {
    id: "art-08",
    category: "예술과 문화",
    question: "1937년 스페인 게르니카 폭격 뒤 그려진 대형 흑백 유화 「게르니카」의 화가는?",
    choices: ["달리", "미로", "피카소", "고야"],
    answer: 2,
    explanation: "「게르니카」는 피카소가 1937년 독일군의 게르니카 폭격 뒤 그린 그림이다.",
    source: { name: "브리태니커 백과사전 「Guernica」", url: "https://www.britannica.com/topic/Guernica-by-Picasso" }
  },
  {
    id: "art-09",
    category: "예술과 문화",
    question: "1791년 빈 근교에서 초연된 오페라 「마술피리」의 작곡가는?",
    choices: ["베르디", "푸치니", "바그너", "모차르트"],
    answer: 3,
    explanation: "「마술피리」는 모차르트의 마지막 오페라로, 1791년 9월 빈 근교에서 초연됐다.",
    source: { name: "브리태니커 백과사전 「The Magic Flute」", url: "https://www.britannica.com/topic/The-Magic-Flute" }
  },
  {
    id: "art-10",
    category: "예술과 문화",
    question: "가체를 쓰고 다소곳이 서 있는 여인의 전신상 「미인도」(간송미술관 소장)를 그린 화가는?",
    choices: ["신윤복", "김홍도", "정선", "장승업"],
    answer: 0,
    explanation: "간송미술관의 「미인도」는 신윤복이 가체를 쓴 여인의 전신을 그린 그림이다.",
    source: { name: "한국민족문화대백과사전 「신윤복 필 미인도」", url: "https://encykorea.aks.ac.kr/Article/E0076917" }
  }
];
