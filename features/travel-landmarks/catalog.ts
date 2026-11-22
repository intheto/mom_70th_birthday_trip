import castlePhoto from './photos/castle.jpg';
import dotonboriPhoto from './photos/dotonbori.jpg';
import tsutenkakuPhoto from './photos/tsutenkaku.jpg';
import umedaPhoto from './photos/umeda.jpg';
import kaiyukanPhoto from './photos/kaiyukan.jpg';

export const landmarks = [
  {
    "id": "castle",
    "name": "오사카성",
    "ja": "大阪城",
    "area": "오사카성 일대",
    "kind": "역사 · 산책",
    "tagline": "시민들의 마음으로 다시 세운 성",
    "intro": "황금 장식의 천수각과 넓은 공원이 어우러진 오사카의 대표 명소예요. 성을 바라보며 가족사진을 남기기에도 좋은 곳이에요.",
    "fact": "지금의 천수각은 1931년, 시민들의 기부로 다시 세워졌어요.",
    "tip": "공원이 넓어 역에서 천수각까지 걷는 구간이 있어요. 가족의 걸음에 맞춰 공원 산책과 내부 관람 중 원하는 코스를 골라보세요.",
    "slug": "osaka-castle-main-keep",
    "map": "Osaka Castle",
    "photoAlt": "벚꽃과 조명 아래의 오사카성 천수각",
    "photoPosition": "50% 10%",
    "photo": castlePhoto
  },
  {
    "id": "dotonbori",
    "name": "도톤보리",
    "ja": "道頓堀",
    "area": "난바",
    "kind": "거리 · 먹거리",
    "tagline": "커다란 간판 아래, 오사카의 활기",
    "intro": "글리코 간판과 거대한 게 간판, 강변 산책길이 있는 번화가예요. 오사카의 먹거리와 활기찬 거리 풍경을 함께 만날 수 있어요.",
    "fact": "‘도톤보리’는 강을 파기 시작한 야스이 도톤의 이름에서 유래했대요.",
    "tip": "사람이 많은 거리예요. 가족끼리 만날 장소를 정하고, 강변에서 잠깐 쉬어가는 여유를 두면 좋아요.",
    "slug": "dotonbori",
    "map": "Dotonbori Osaka",
    "photoAlt": "글리코 간판과 도톤보리의 야경",
    "photoPosition": "65% 58%",
    "photo": dotonboriPhoto
  },
  {
    "id": "tsutenkaku",
    "name": "쓰텐카쿠",
    "ja": "通天閣",
    "area": "신세카이",
    "kind": "전망 · 복고 거리",
    "tagline": "옛 오사카의 풍경을 품은 전망탑",
    "intro": "신세카이의 상징인 전망탑이에요. 주변 골목에는 꼬치튀김 가게와 개성 있는 간판이 이어져 복고풍 오사카를 느낄 수 있어요.",
    "fact": "쓰텐카쿠 주변에는 예전에 ‘루나파크’라는 유원지가 있었대요.",
    "tip": "전망탑 관람과 신세카이 거리 산책을 함께 생각해 보세요. 주변에서 식사하며 쉬어가는 코스도 잘 어울려요.",
    "slug": "shinsekai",
    "map": "Tsutenkaku Osaka",
    "photoAlt": "신세카이 상점가 뒤로 보이는 쓰텐카쿠",
    "photoPosition": "65% 28%",
    "photo": tsutenkakuPhoto
  },
  {
    "id": "umeda",
    "name": "우메다 스카이빌딩",
    "ja": "梅田スカイビル",
    "area": "우메다",
    "kind": "건축 · 전망",
    "tagline": "두 건물 사이, 하늘 위 산책",
    "intro": "두 동의 고층 건물이 위에서 연결되는 독특한 건축물이에요. 공중정원 전망대에서 오사카의 도심 풍경을 내려다볼 수 있어요.",
    "fact": "‘공중정원’은 꽃밭이 아니라, 지상 173m에 있는 전망 시설이에요.",
    "tip": "실내 전망 공간과 야외 옥상 공간이 있어요. 날씨와 바람을 보고 머무를 곳을 고르면 좋아요.",
    "slug": "umeda-sky-building",
    "map": "Umeda Sky Building",
    "photoAlt": "두 건물과 공중정원이 연결된 우메다 스카이빌딩",
    "photoPosition": "55% 20%",
    "photo": umedaPhoto
  },
  {
    "id": "kaiyukan",
    "name": "가이유칸",
    "ja": "海遊館",
    "area": "덴포잔 · 오사카항",
    "kind": "수족관 · 실내",
    "tagline": "고래상어와 함께, 태평양 한 바퀴",
    "intro": "커다란 수조에서 헤엄치는 고래상어를 만날 수 있는 수족관이에요. 태평양과 주변 바다의 자연을 따라 다양한 해양 생물을 만나요.",
    "fact": "수조의 배치에도 실제 태평양의 지리적 위치가 반영되어 있어요.",
    "tip": "실내에서 천천히 둘러보는 코스로 생각해 보세요. 가족이 좋아하는 수조 앞에서 충분히 시간을 보내도 좋아요.",
    "slug": "osaka-aquarium-kaiyukan",
    "map": "Osaka Aquarium Kaiyukan",
    "photoAlt": "고래상어가 헤엄치는 가이유칸의 대형 수조",
    "photoPosition": "65% 40%",
    "photo": kaiyukanPhoto
  }
] as const;
