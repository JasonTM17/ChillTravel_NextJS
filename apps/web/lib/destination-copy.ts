import type { Destination } from '@vietwander/shared';

interface DestinationCopy {
  name: string;
  country: string;
  city: string;
  summary: string;
  bestTimeToVisit: string;
  foodHighlights: string[];
  cultureNotes: string[];
}

const copyBySlug: Record<string, DestinationCopy> = {
  'ha-noi': {
    name: 'Hà Nội',
    country: 'Việt Nam',
    city: 'Hà Nội',
    summary:
      'Phố cổ buổi sáng, cà phê ven hồ, ngõ nghề thủ công và ẩm thực miền Bắc nhiều tầng vị.',
    bestTimeToVisit: 'Tháng 10 đến tháng 4',
    foodHighlights: ['phở', 'bún chả', 'cà phê trứng'],
    cultureNotes: [
      'Giữ nhịp đi bộ chậm trong phố cổ đông người.',
      'Ăn mặc lịch sự khi vào đền, chùa và di tích.',
      'Ưu tiên taxi/xe công nghệ hoặc tuyến đi bộ đã chuẩn bị.',
    ],
  },
  'ha-long': {
    name: 'Hạ Long',
    country: 'Việt Nam',
    city: 'Quảng Ninh',
    summary: 'Vịnh đá vôi, buổi sáng trên boong tàu, bữa tối hải sản và nhịp nghỉ dưỡng chậm rãi.',
    bestTimeToVisit: 'Tháng 10 đến tháng 5',
    foodHighlights: ['chả mực', 'hải sản vịnh', 'sá sùng'],
    cultureNotes: [
      'Kiểm tra lịch tàu và thời tiết chính thức trước khi ra vịnh.',
      'Tôn trọng quy định bảo tồn trong khu di sản.',
      'Mang áo khoác nhẹ nếu ngủ đêm trên du thuyền.',
    ],
  },
  sapa: {
    name: 'Sapa',
    country: 'Việt Nam',
    city: 'Lào Cai',
    summary:
      'Ruộng bậc thang, khí núi, chợ phiên và những cung trekking cần tôn trọng văn hóa bản địa.',
    bestTimeToVisit: 'Tháng 9 đến tháng 11',
    foodHighlights: ['thắng cố', 'cá suối', 'rau bản'],
    cultureNotes: [
      'Xin phép trước khi chụp ảnh người dân địa phương.',
      'Chuẩn bị giày bám tốt vì đường núi dễ trơn.',
      'Đi cùng hướng dẫn viên địa phương khi trekking bản xa.',
    ],
  },
  'ninh-binh': {
    name: 'Ninh Bình',
    country: 'Việt Nam',
    city: 'Ninh Bình',
    summary: 'Sông trong hang, núi đá vôi, đường đền cổ và homestay đồng quê rất hợp chuyến ngắn.',
    bestTimeToVisit: 'Tháng 2 đến tháng 5',
    foodHighlights: ['cơm cháy', 'dê núi', 'ốc núi'],
    cultureNotes: [
      'Mang mũ nón khi đi thuyền nắng trưa.',
      'Giữ im lặng tại khu tâm linh.',
      'Không đứng sát mép đá ở các điểm ngắm cảnh.',
    ],
  },
  hue: {
    name: 'Huế',
    country: 'Việt Nam',
    city: 'Thừa Thiên Huế',
    summary: 'Di sản cung đình, nhà vườn, ẩm thực hoàng gia và nhịp sống miền Trung trầm tĩnh.',
    bestTimeToVisit: 'Tháng 1 đến tháng 4',
    foodHighlights: ['bún bò Huế', 'cơm hến', 'bánh bèo'],
    cultureNotes: [
      'Ăn mặc kín đáo khi tham quan lăng tẩm.',
      'Dành thời gian nghỉ giữa trưa vì thời tiết có thể nắng gắt.',
      'Nói chuyện nhỏ nhẹ trong khu di tích.',
    ],
  },
  'da-nang': {
    name: 'Đà Nẵng',
    country: 'Việt Nam',
    city: 'Đà Nẵng',
    summary:
      'Buổi sáng ở biển Mỹ Khê, bán đảo Sơn Trà, hải sản buổi tối và cầu nối rất dễ sang Hội An.',
    bestTimeToVisit: 'Tháng 2 đến tháng 8',
    foodHighlights: ['mì Quảng', 'bánh tráng cuốn thịt heo', 'hải sản Mỹ Khê'],
    cultureNotes: [
      'Theo dõi cảnh báo thời tiết khi đi Sơn Trà hoặc Bà Nà.',
      'Giữ trang phục lịch sự tại chùa Linh Ứng.',
      'Đặt xe sớm nếu về Hội An buổi tối.',
    ],
  },
  'hoi-an': {
    name: 'Hội An',
    country: 'Việt Nam',
    city: 'Quảng Nam',
    summary:
      'Phố đèn lồng, tiệm may, bờ sông buổi tối và các tuyến ẩm thực miền Trung rất dễ đi bộ.',
    bestTimeToVisit: 'Tháng 2 đến tháng 8',
    foodHighlights: ['cao lầu', 'bánh mì Hội An', 'mì Quảng'],
    cultureNotes: [
      'Không chen lấn trong phố cổ giờ cao điểm.',
      'Giữ vé tham quan nếu vào các nhà cổ.',
      'Hạn chế dùng đèn flash trong không gian di sản.',
    ],
  },
  'nha-trang': {
    name: 'Nha Trang',
    country: 'Việt Nam',
    city: 'Khánh Hòa',
    summary: 'Đảo gần bờ, resort biển, hải sản và lịch trình nghỉ dưỡng dễ cân bằng cho gia đình.',
    bestTimeToVisit: 'Tháng 3 đến tháng 9',
    foodHighlights: ['bún cá', 'nem nướng', 'hải sản'],
    cultureNotes: [
      'Kiểm tra điều kiện biển trước khi đi tour đảo.',
      'Dùng kem chống nắng và uống đủ nước.',
      'Chọn đơn vị tour có áo phao và hướng dẫn rõ ràng.',
    ],
  },
  'da-lat': {
    name: 'Đà Lạt',
    country: 'Việt Nam',
    city: 'Lâm Đồng',
    summary: 'Đồi thông, quán cà phê, thời tiết mát, thác nước và những ngày nghỉ núi nhẹ nhàng.',
    bestTimeToVisit: 'Tháng 11 đến tháng 3',
    foodHighlights: ['bánh căn', 'lẩu gà lá é', 'sữa đậu nành'],
    cultureNotes: [
      'Mang áo ấm cho buổi tối.',
      'Đi chậm trên đường đèo và tránh lái khi sương mù.',
      'Giữ vệ sinh tại vườn hoa và điểm săn mây.',
    ],
  },
  'phu-quoc': {
    name: 'Phú Quốc',
    country: 'Việt Nam',
    city: 'Kiên Giang',
    summary: 'Biển hoàng hôn, chợ đêm, resort gia đình và những ngày nghỉ đảo dễ thả lỏng.',
    bestTimeToVisit: 'Tháng 11 đến tháng 4',
    foodHighlights: ['gỏi cá trích', 'bún quậy', 'hải sản chợ đêm'],
    cultureNotes: [
      'Kiểm tra mùa mưa trước khi đặt tour đảo.',
      'Không chạm san hô khi lặn ngắm biển.',
      'Giữ lịch linh hoạt nếu đi cùng trẻ nhỏ.',
    ],
  },
  'can-tho': {
    name: 'Cần Thơ',
    country: 'Việt Nam',
    city: 'Tây Nam Bộ',
    summary: 'Chợ nổi, bữa sáng trên sông, vườn trái cây và văn hóa ẩm thực miền Tây hiền hòa.',
    bestTimeToVisit: 'Tháng 12 đến tháng 4',
    foodHighlights: ['bún riêu', 'lẩu mắm', 'bánh xèo miền Tây'],
    cultureNotes: [
      'Dậy sớm để đi chợ nổi đúng nhịp.',
      'Mang tiền mặt nhỏ khi mua hàng trên ghe.',
      'Tôn trọng đời sống sông nước của người dân.',
    ],
  },
  'ha-giang': {
    name: 'Hà Giang',
    country: 'Việt Nam',
    city: 'Hà Giang',
    summary: 'Đèo cao, cao nguyên đá, chợ phiên và hành trình road trip cần chuẩn bị kỹ.',
    bestTimeToVisit: 'Tháng 9 đến tháng 11',
    foodHighlights: ['thắng dền', 'cháo ấu tẩu', 'lợn cắp nách'],
    cultureNotes: [
      'Không tự lái nếu chưa quen đường đèo.',
      'Luôn kiểm tra phanh, áo mưa và giấy tờ xe.',
      'Xin phép trước khi vào nhà hoặc chụp ảnh người dân.',
    ],
  },
  tokyo: {
    name: 'Tokyo',
    country: 'Nhật Bản',
    city: 'Tokyo',
    summary:
      'Ẩm thực theo khu phố, cửa hàng thiết kế, đền chùa, tàu điện và năng lượng đêm rất cuốn.',
    bestTimeToVisit: 'Tháng 3 đến tháng 5 hoặc tháng 10 đến tháng 11',
    foodHighlights: ['ramen', 'sushi', 'izakaya'],
    cultureNotes: [
      'Giữ trật tự trên tàu điện.',
      'Xếp hàng đúng lượt tại quán đông.',
      'Kiểm tra quy định visa từ nguồn chính thức trước chuyến đi.',
    ],
  },
  seoul: {
    name: 'Seoul',
    country: 'Hàn Quốc',
    city: 'Seoul',
    summary:
      'Cung điện, quán cà phê, chợ đêm, đồi ngắm phố và lịch trình thành thị dễ đi cho lần đầu.',
    bestTimeToVisit: 'Tháng 4 đến tháng 6 hoặc tháng 9 đến tháng 11',
    foodHighlights: ['bibimbap', 'gà rán', 'tteokbokki'],
    cultureNotes: [
      'Tôn trọng quy tắc xếp hàng ở ga tàu.',
      'Mang giày dễ đi vì lịch trình thường nhiều bước.',
      'Kiểm tra yêu cầu nhập cảnh từ nguồn chính thức.',
    ],
  },
  bangkok: {
    name: 'Bangkok',
    country: 'Thái Lan',
    city: 'Bangkok',
    summary: 'Ẩm thực đường phố, tuyến sông, đền chùa, rooftop và lựa chọn hợp ngân sách.',
    bestTimeToVisit: 'Tháng 11 đến tháng 2',
    foodHighlights: ['pad thai', 'tom yum', 'mango sticky rice'],
    cultureNotes: [
      'Ăn mặc kín đáo khi vào đền.',
      'Thỏa thuận giá hoặc dùng app gọi xe rõ ràng.',
      'Uống đủ nước trong ngày nắng nóng.',
    ],
  },
  singapore: {
    name: 'Singapore',
    country: 'Singapore',
    city: 'Singapore',
    summary:
      'Kiến trúc vườn, hawker center, giao thông sạch và lịch trình gia đình rất thuận tiện.',
    bestTimeToVisit: 'Quanh năm, ưu tiên mùa ít mưa',
    foodHighlights: ['cơm gà Hải Nam', 'laksa', 'chili crab'],
    cultureNotes: [
      'Giữ vệ sinh nơi công cộng.',
      'Tuân thủ quy định ăn uống trên MRT.',
      'Đặt trước điểm tham quan nổi tiếng vào cuối tuần.',
    ],
  },
  bali: {
    name: 'Bali',
    country: 'Indonesia',
    city: 'Bali',
    summary: 'Ruộng bậc thang, biển lướt sóng, đền, wellness stay và buổi chiều ven biển chậm rãi.',
    bestTimeToVisit: 'Tháng 4 đến tháng 10',
    foodHighlights: ['nasi goreng', 'satay', 'babi guling'],
    cultureNotes: [
      'Mặc sarong khi vào đền nếu được yêu cầu.',
      'Tôn trọng nghi lễ địa phương.',
      'Kiểm tra sóng và dòng chảy trước khi xuống biển.',
    ],
  },
  paris: {
    name: 'Paris',
    country: 'Pháp',
    city: 'Paris',
    summary: 'Bảo tàng buổi sáng, tiệm bánh, dạo sông Seine và những khu phố lãng mạn vừa sức.',
    bestTimeToVisit: 'Tháng 4 đến tháng 6 hoặc tháng 9 đến tháng 10',
    foodHighlights: ['croissant', 'bistro', 'macaron'],
    cultureNotes: [
      'Đặt vé bảo tàng trước vào mùa cao điểm.',
      'Cẩn thận móc túi ở điểm đông khách.',
      'Luôn kiểm tra thông tin đình công/giao thông từ nguồn chính thức.',
    ],
  },
  rome: {
    name: 'Rome',
    country: 'Ý',
    city: 'Rome',
    summary: 'Đường cổ, espresso, quảng trường và tuyến ẩm thực đi bộ quanh di sản La Mã.',
    bestTimeToVisit: 'Tháng 4 đến tháng 6 hoặc tháng 9 đến tháng 10',
    foodHighlights: ['carbonara', 'gelato', 'pizza al taglio'],
    cultureNotes: [
      'Che vai/gối khi vào nhà thờ.',
      'Đặt vé Colosseum/Vatican sớm.',
      'Mang giày đi bộ thoải mái.',
    ],
  },
  barcelona: {
    name: 'Barcelona',
    country: 'Tây Ban Nha',
    city: 'Barcelona',
    summary: 'Kiến trúc, chợ, biển, tapas và những buổi tối sôi động nhưng không cần vội.',
    bestTimeToVisit: 'Tháng 5 đến tháng 6 hoặc tháng 9 đến tháng 10',
    foodHighlights: ['tapas', 'paella', 'churros'],
    cultureNotes: [
      'Cẩn thận tài sản ở Las Ramblas.',
      'Đặt vé Sagrada Familia trước.',
      'Tôn trọng giờ ăn tối muộn của địa phương.',
    ],
  },
  london: {
    name: 'London',
    country: 'Vương quốc Anh',
    city: 'London',
    summary: 'Bảo tàng, công viên, chợ, sân khấu và tuyến phố theo từng khu rất dễ tổ chức.',
    bestTimeToVisit: 'Tháng 5 đến tháng 9',
    foodHighlights: ['fish and chips', 'Sunday roast', 'afternoon tea'],
    cultureNotes: [
      'Đứng đúng bên khi đi thang cuốn.',
      'Chuẩn bị áo mưa nhẹ.',
      'Kiểm tra giờ mở cửa vì nhiều điểm đổi lịch theo mùa.',
    ],
  },
  'new-york': {
    name: 'New York',
    country: 'Hoa Kỳ',
    city: 'New York',
    summary: 'Bảo tàng lớn, skyline, khu ẩm thực, công viên và nhịp thành phố năng lượng cao.',
    bestTimeToVisit: 'Tháng 4 đến tháng 6 hoặc tháng 9 đến tháng 11',
    foodHighlights: ['pizza lát', 'bagel', 'deli sandwich'],
    cultureNotes: [
      'Tính thêm thời gian di chuyển bằng subway.',
      'Giữ tài sản cẩn thận ở nơi đông người.',
      'Kiểm tra quy định visa từ nguồn chính thức.',
    ],
  },
  'swiss-alps': {
    name: 'Dãy Alps Thụy Sĩ',
    country: 'Thụy Sĩ',
    city: 'Valais',
    summary: 'Tàu núi, thị trấn ven hồ, cung hiking và những ngày nghỉ alpine rất yên tĩnh.',
    bestTimeToVisit: 'Tháng 6 đến tháng 9 hoặc mùa trượt tuyết',
    foodHighlights: ['fondue', 'raclette', 'sô cô la'],
    cultureNotes: [
      'Kiểm tra thời tiết núi trước khi hiking.',
      'Đi đúng tuyến được đánh dấu.',
      'Dự trù ngân sách cao hơn mặt bằng châu Âu.',
    ],
  },
  santorini: {
    name: 'Santorini',
    country: 'Hy Lạp',
    city: 'Cyclades',
    summary: 'Đường caldera, làng trắng, hải sản, hoàng hôn và mùa vai ít đông hơn.',
    bestTimeToVisit: 'Tháng 4 đến tháng 6 hoặc tháng 9 đến tháng 10',
    foodHighlights: ['hải sản', 'fava', 'rượu vang Assyrtiko'],
    cultureNotes: [
      'Đặt chỗ ngắm hoàng hôn sớm vào mùa cao điểm.',
      'Mang giày bám tốt trên đường đá.',
      'Tôn trọng khu dân cư trong các làng nhỏ.',
    ],
  },
  sydney: {
    name: 'Sydney',
    country: 'Úc',
    city: 'New South Wales',
    summary: 'Cảng biển, bãi tắm, brunch, phà và lịch trình thành phố ven biển rất dễ thở.',
    bestTimeToVisit: 'Tháng 9 đến tháng 11 hoặc tháng 3 đến tháng 5',
    foodHighlights: ['brunch', 'hải sản', 'meat pie'],
    cultureNotes: [
      'Luôn bơi giữa cờ an toàn ở bãi biển.',
      'Dùng kem chống nắng mạnh.',
      'Kiểm tra quy định nhập cảnh từ nguồn chính thức.',
    ],
  },
  dubai: {
    name: 'Dubai',
    country: 'Các Tiểu vương quốc Ả Rập Thống nhất',
    city: 'Dubai',
    summary: 'Sa mạc, kiến trúc hiện đại, điểm vui chơi gia đình và lựa chọn nghỉ dưỡng cao cấp.',
    bestTimeToVisit: 'Tháng 11 đến tháng 3',
    foodHighlights: ['shawarma', 'mezze', 'luqaimat'],
    cultureNotes: [
      'Ăn mặc lịch sự ở nơi công cộng và khu tôn giáo.',
      'Tránh nắng gắt giữa trưa.',
      'Kiểm tra quy định nhập cảnh từ nguồn chính thức.',
    ],
  },
};

export function getDestinationCopy(destination: Destination): DestinationCopy {
  return (
    copyBySlug[destination.slug] ?? {
      name: destination.name,
      country: destination.country,
      city: destination.city,
      summary: destination.summary,
      bestTimeToVisit: destination.bestTimeToVisit,
      foodHighlights: destination.foodHighlights,
      cultureNotes: destination.cultureNotes,
    }
  );
}
