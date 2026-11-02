/* Dữ liệu tham chiếu: văn bản đầu tư công, giai đoạn dự án, điểm kiểm soát, lộ trình 90 ngày.
   Danh mục văn bản lấy theo bản tổng hợp do người dùng cung cấp; trạng thái hiệu lực phải kiểm tra lại trên Công báo / CSDL quốc gia. */
window.D = {};

// Thứ bậc hiệu lực (tham khảo) dùng cho công cụ phân tích chồng chéo. Số nhỏ = hiệu lực cao hơn.
D.CAP = [
  { id: 'luat', ten: 'Luật, Nghị quyết của Quốc hội', bac: 1 },
  { id: 'nq-ubtvqh', ten: 'Nghị quyết của Ủy ban Thường vụ Quốc hội', bac: 2 },
  { id: 'nd', ten: 'Nghị định, Nghị quyết của Chính phủ', bac: 3 },
  { id: 'qd-ttg', ten: 'Quyết định của Thủ tướng Chính phủ', bac: 4 },
  { id: 'tt', ten: 'Thông tư của Bộ trưởng', bac: 5 },
  { id: 'nq-hdnd', ten: 'Nghị quyết của HĐND tỉnh', bac: 6 },
  { id: 'qd-ubnd', ten: 'Quyết định của UBND tỉnh', bac: 7 },
  { id: 'cv', ten: 'Công văn, hướng dẫn (không phải VBQPPL)', bac: 99 }
];

D.STAGES = [
  { id: 'cd', ten: 'Chủ trương đầu tư' },
  { id: 'qd', ten: 'Lập, thẩm định, quyết định đầu tư' },
  { id: 'kh', ten: 'Kế hoạch và phân bổ vốn' },
  { id: 'dt', ten: 'Lựa chọn nhà thầu' },
  { id: 'gp', ten: 'Đất đai, bồi thường, tái định cư' },
  { id: 'tc', ten: 'Thi công xây dựng' },
  { id: 'tt', ten: 'Thanh toán, giải ngân, báo cáo' },
  { id: 'qt', ten: 'Quyết toán' },
  { id: 'ts', ten: 'Bàn giao, khai thác tài sản' },
  { id: 'gs', ten: 'Giám sát, đánh giá' }
];

D.GROUPS = [
  { id: 'luat', ten: 'Luật trực tiếp điều chỉnh đầu tư công' },
  { id: 'nd', ten: 'Nghị định hướng dẫn và quản lý nguồn vốn' },
  { id: 'von', ten: 'Phân bổ vốn giai đoạn 2026–2030' },
  { id: 'tt', ten: 'Thông tư về báo cáo, giải ngân, quyết toán' },
  { id: 'lq', ten: 'Luật, văn bản liên quan theo loại dự án' }
];

D.LAWS = [
  { id: 'L58', so: '58/2024/QH15', loai: 'Luật Đầu tư công', ngay: '29/11/2024', hl: 'Hiệu lực từ 01/01/2025', cap: 'luat', nhom: 'luat',
    gd: ['cd', 'qd', 'kh', 'gs'], nd: 'Văn bản nền tảng: chủ trương đầu tư, quyết định đầu tư, kế hoạch vốn, tổ chức thực hiện.',
    qh: 'Đọc cùng Luật 90/2025/QH15 (Điều 7 sửa đổi Luật Đầu tư công).' },
  { id: 'L90', so: '90/2025/QH15', loai: 'Luật sửa đổi nhiều luật', ngay: '25/6/2025', hl: '', cap: 'luat', nhom: 'luat',
    gd: ['cd', 'qd', 'kh', 'dt'], nd: 'Điều 7 sửa đổi Luật Đầu tư công; đồng thời sửa đổi Luật Đấu thầu.',
    qh: 'Sửa đổi Luật 58/2024/QH15 và Luật 22/2023/QH15.' },
  { id: 'L65', so: '65/2025/QH15', loai: 'Luật Tổ chức chính quyền địa phương', ngay: '2025', hl: '', cap: 'luat', nhom: 'luat',
    gd: ['cd', 'qd'], nd: 'Đối chiếu tác động đến hiệu lực một phần của Luật 58 trong giai đoạn chuyển đổi tổ chức chính quyền.',
    qh: 'Không dùng riêng văn bản này để xác định thẩm quyền hiện nay.' },
  { id: 'ND85', so: '85/2025/NĐ-CP', loai: 'Nghị định', ngay: '08/4/2025', hl: '', cap: 'nd', nhom: 'nd',
    gd: ['cd', 'qd', 'kh'], nd: 'Quy định chi tiết thi hành một số điều của Luật Đầu tư công.',
    qh: 'Được sửa đổi, bổ sung bởi Nghị định 275/2025/NĐ-CP.' },
  { id: 'ND275', so: '275/2025/NĐ-CP', loai: 'Nghị định', ngay: '18/10/2025', hl: '', cap: 'nd', nhom: 'nd',
    gd: ['cd', 'qd', 'kh'], nd: 'Sửa đổi, bổ sung Nghị định 85/2025/NĐ-CP.',
    qh: 'Nghị định 119/2026/NĐ-CP có nội dung bãi bỏ liên quan — kiểm tra phần còn hiệu lực.' },
  { id: 'ND254', so: '254/2025/NĐ-CP', loai: 'Nghị định', ngay: '26/9/2025', hl: '', cap: 'nd', nhom: 'nd',
    gd: ['tt', 'qt'], nd: 'Quản lý, thanh toán, quyết toán dự án sử dụng vốn đầu tư công.',
    qh: 'Nội dung quyết toán phải đối chiếu Nghị định 193/2026/NĐ-CP.' },
  { id: 'ND193', so: '193/2026/NĐ-CP', loai: 'Nghị định', ngay: '01/6/2026', hl: 'Hiệu lực từ 01/7/2026', cap: 'nd', nhom: 'nd',
    gd: ['qt'], nd: 'Quyết toán vốn đầu tư dự án.', qh: 'Đọc cùng Nghị định 254/2025/NĐ-CP và Thông tư 73/2026/TT-BTC.' },
  { id: 'ND19', so: '19/2026/NĐ-CP', loai: 'Nghị định', ngay: '14/01/2026', hl: '', cap: 'nd', nhom: 'nd',
    gd: ['qd', 'gs'], nd: 'Trình tự, thủ tục thẩm định dự án quan trọng quốc gia; giám sát, đánh giá đầu tư.', qh: '' },
  { id: 'ND242', so: '242/2025/NĐ-CP', loai: 'Nghị định', ngay: '10/9/2025', hl: '', cap: 'nd', nhom: 'nd',
    gd: ['cd', 'qd', 'kh', 'tt'], nd: 'Quản lý và sử dụng vốn ODA và vốn vay ưu đãi nước ngoài.',
    qh: 'Được sửa đổi bởi Nghị định 119/2026/NĐ-CP.' },
  { id: 'ND119', so: '119/2026/NĐ-CP', loai: 'Nghị định', ngay: '03/4/2026', hl: '', cap: 'nd', nhom: 'nd',
    gd: ['cd', 'qd', 'kh', 'tt'], nd: 'Sửa đổi Nghị định 242/2025/NĐ-CP; có nội dung bãi bỏ liên quan Nghị định 275/2025/NĐ-CP.', qh: '' },
  { id: 'NQ70', so: '70/2025/UBTVQH15', loai: 'Nghị quyết UBTVQH', ngay: '07/02/2025', hl: '', cap: 'nq-ubtvqh', nhom: 'von',
    gd: ['kh'], nd: 'Nguyên tắc, tiêu chí, định mức phân bổ vốn đầu tư công nguồn NSNN giai đoạn 2026–2030.',
    qh: 'Được sửa đổi, bổ sung bởi Nghị quyết 120/2026/UBTVQH15.' },
  { id: 'NQ120', so: '120/2026/UBTVQH15', loai: 'Nghị quyết UBTVQH', ngay: '03/02/2026', hl: '', cap: 'nq-ubtvqh', nhom: 'von',
    gd: ['kh'], nd: 'Sửa đổi, bổ sung Nghị quyết 70/2025/UBTVQH15.', qh: '' },
  { id: 'QD18', so: '18/2026/QĐ-TTg', loai: 'Quyết định Thủ tướng', ngay: '2026', hl: '', cap: 'qd-ttg', nhom: 'von',
    gd: ['kh'], nd: 'Quy định chi tiết một số điều của Nghị quyết 70 (đã sửa đổi bởi Nghị quyết 120).', qh: '' },
  { id: 'TT37', so: '37/2025/TT-BTC', loai: 'Thông tư', ngay: '12/6/2025', hl: '', cap: 'tt', nhom: 'tt',
    gd: ['tt', 'gs'], nd: 'Chế độ, biểu mẫu báo cáo tình hình thực hiện, giải ngân vốn đầu tư công.', qh: '' },
  { id: 'TT91', so: '91/2025/TT-BTC', loai: 'Thông tư', ngay: '26/9/2025', hl: '', cap: 'tt', nhom: 'tt',
    gd: ['qt'], nd: 'Hệ thống mẫu biểu trong công tác quyết toán.', qh: 'Đối chiếu nội dung cập nhật tại Thông tư 73/2026/TT-BTC.' },
  { id: 'TT73', so: '73/2026/TT-BTC', loai: 'Thông tư', ngay: '25/6/2026', hl: '', cap: 'tt', nhom: 'tt',
    gd: ['qt'], nd: 'Hệ thống mẫu biểu quyết toán vốn đầu tư dự án.', qh: '' },
  { id: 'NS89', so: '89/2025/QH15', loai: 'Luật Ngân sách nhà nước', ngay: '2025', hl: '', cap: 'luat', nhom: 'lq',
    gd: ['kh', 'tt', 'qt'], nd: 'Lập, phân bổ, điều chỉnh, chấp hành và quyết toán ngân sách.', qh: '' },
  { id: 'DT22', so: '22/2023/QH15', loai: 'Luật Đấu thầu', ngay: '2023', hl: '', cap: 'luat', nhom: 'lq',
    gd: ['dt'], nd: 'Lựa chọn nhà thầu.', qh: 'Sửa đổi tại Luật 57/2024/QH15 và Luật 90/2025/QH15.' },
  { id: 'ND214', so: '214/2025/NĐ-CP', loai: 'Nghị định', ngay: '2025', hl: '', cap: 'nd', nhom: 'lq',
    gd: ['dt'], nd: 'Hướng dẫn quy trình lựa chọn nhà thầu.', qh: 'Kiểm tra các văn bản sửa đổi, hướng dẫn tương ứng.' },
  { id: 'XD135', so: '135/2025/QH15', loai: 'Luật Xây dựng', ngay: '2025', hl: 'Hiệu lực chính từ 01/7/2026', cap: 'luat', nhom: 'lq',
    gd: ['qd', 'tc'], nd: 'Áp dụng cho dự án có hoạt động xây dựng.', qh: '' },
  { id: 'DD31', so: '31/2024/QH15', loai: 'Luật Đất đai', ngay: '2024', hl: '', cap: 'luat', nhom: 'lq',
    gd: ['gp'], nd: 'Thu hồi đất, giao đất, chuyển mục đích, bồi thường, tái định cư.', qh: 'Đọc cùng các sửa đổi và nghị định hướng dẫn.' },
  { id: 'TS15', so: '15/2017/QH14', loai: 'Luật Quản lý, sử dụng tài sản công', ngay: '2017', hl: '', cap: 'luat', nhom: 'lq',
    gd: ['ts'], nd: 'Quản lý, bàn giao, khai thác tài sản hình thành từ dự án.', qh: 'Đọc cùng các sửa đổi.' },
  { id: 'NC20', so: '20/2017/QH14', loai: 'Luật Quản lý nợ công', ngay: '2017', hl: '', cap: 'luat', nhom: 'lq',
    gd: ['kh'], nd: 'Dự án sử dụng vốn vay thuộc phạm vi quản lý nợ công.', qh: 'Đọc cùng các sửa đổi.' },
  { id: 'PPP64', so: '64/2020/QH14', loai: 'Luật Đầu tư theo phương thức PPP', ngay: '2020', hl: '', cap: 'luat', nhom: 'lq',
    gd: ['cd', 'qd'], nd: 'Dự án PPP có sử dụng vốn đầu tư công.', qh: 'Đọc cùng các sửa đổi.' }
];

// Chuỗi sửa đổi cần đọc cùng nhau
D.CHAINS = [
  { ten: 'Luật Đầu tư công', buoc: ['L58', 'L90'], ghi: 'Đối chiếu thêm Luật 65/2025/QH15 cho giai đoạn chuyển đổi chính quyền' },
  { ten: 'Nghị định hướng dẫn', buoc: ['ND85', 'ND275', 'ND119'], ghi: 'Nghị định 119 có nội dung bãi bỏ liên quan Nghị định 275' },
  { ten: 'Vốn ODA, vay ưu đãi', buoc: ['ND242', 'ND119'], ghi: '' },
  { ten: 'Phân bổ vốn 2026–2030', buoc: ['NQ70', 'NQ120', 'QD18'], ghi: 'Quyết định 18 hướng dẫn Nghị quyết 70 đã sửa đổi' },
  { ten: 'Thanh toán, quyết toán', buoc: ['ND254', 'ND193', 'TT91', 'TT73'], ghi: 'Nội dung quyết toán cập nhật năm 2026' }
];

D.BASE = ['L58', 'L90', 'L65', 'ND85', 'ND275', 'NQ70', 'NQ120', 'QD18', 'NS89', 'ND254', 'ND193', 'TT37', 'TT91', 'TT73', 'ND19'];

D.FLAGS = [
  { id: 'xd', ten: 'Có hoạt động xây dựng', add: ['XD135'] },
  { id: 'gp', ten: 'Có thu hồi đất, bồi thường, tái định cư', add: ['DD31'], local: 'Quy định địa phương về bồi thường, hỗ trợ, tái định cư; bảng giá đất' },
  { id: 'dt', ten: 'Có lựa chọn nhà thầu', add: ['DT22', 'ND214'] },
  { id: 'oda', ten: 'Dùng vốn ODA, vay ưu đãi nước ngoài', add: ['ND242', 'ND119', 'NC20'] },
  { id: 'vay', ten: 'Dùng vốn vay thuộc phạm vi nợ công', add: ['NC20'] },
  { id: 'ppp', ten: 'Dự án PPP có vốn đầu tư công', add: ['PPP64'] },
  { id: 'ts', ten: 'Hình thành tài sản công cần bàn giao, khai thác', add: ['TS15'] },
  { id: 'dg', ten: 'Có cơ chế đặc thù hoặc thuộc chương trình MTQG', add: [], local: 'Nghị quyết, quyết định về cơ chế đặc thù; văn bản của chương trình mục tiêu quốc gia' },
  { id: 'cntt', ten: 'Dự án công nghệ thông tin, chuyển đổi số', add: [], note: 'Rà soát pháp luật chuyên ngành về ứng dụng CNTT (số hiệu chưa được kiểm chứng trong bộ này).' }
];

D.CHUYEN_NGANH = ['quy hoạch', 'bảo vệ môi trường', 'phòng cháy chữa cháy', 'công nghệ thông tin', 'di sản', 'lâm nghiệp', 'tài nguyên nước', 'giao thông', 'y tế', 'giáo dục'];

D.LOCAL = [
  'Nghị quyết HĐND về nguyên tắc, tiêu chí, định mức phân bổ vốn của địa phương',
  'Nghị quyết về kế hoạch đầu tư công trung hạn và hằng năm',
  'Quyết định UBND giao, điều chỉnh kế hoạch vốn',
  'Văn bản phân cấp, ủy quyền và quy định trách nhiệm quản lý dự án',
  'Quy định địa phương về bồi thường, hỗ trợ, tái định cư; đơn giá, giá xây dựng',
  'Nghị quyết, quyết định về cơ chế đặc thù áp dụng cho địa phương hoặc dự án'
];

// Ma trận điểm kiểm soát trước thời điểm quyết định
D.CONTROL = [
  { khau: 'Xác định điều kiện, chủ trương', kiem: 'Sự phù hợp quy hoạch, nguồn vốn dự kiến, khả năng cân đối; thẩm quyền quyết định chủ trương',
    dau: 'Nguồn vốn chưa xác định; quy mô thay đổi nhiều lần trước khi trình', lap: 'Phòng chuyên môn', kt: 'Phòng thẩm định / pháp chế', pd: 'Cấp có thẩm quyền' },
  { khau: 'Thẩm định dự án', kiem: 'Hồ sơ đầy đủ, tổng mức đầu tư, cơ sở tính chi phí, ý kiến các ngành',
    dau: 'Đơn giá khác mặt bằng chung; thiếu ý kiến ngành liên quan', lap: 'Chủ đầu tư', kt: 'Cơ quan thẩm định', pd: 'Người quyết định đầu tư' },
  { khau: 'Phân bổ, điều chỉnh vốn', kiem: 'Tiêu chí, định mức phân bổ; thứ tự ưu tiên; lý do điều chỉnh',
    dau: 'Điều chỉnh vốn nhiều lần trong năm; dự án giải ngân thấp vẫn được bổ sung vốn', lap: 'Phòng kế hoạch', kt: 'Lãnh đạo phụ trách', pd: 'Cấp có thẩm quyền' },
  { khau: 'Lựa chọn nhà thầu', kiem: 'Kế hoạch lựa chọn nhà thầu, tiêu chuẩn đánh giá, hình thức lựa chọn',
    dau: 'Ít nhà thầu tham dự; tiêu chí hạn chế cạnh tranh; giá trúng thầu sát giá gói thầu', lap: 'Bên mời thầu', kt: 'Tổ thẩm định', pd: 'Chủ đầu tư' },
  { khau: 'Nghiệm thu', kiem: 'Khối lượng thực tế so với hồ sơ; chất lượng; phát sinh',
    dau: 'Khối lượng phát sinh lớn; nghiệm thu dồn cuối năm', lap: 'Tư vấn giám sát', kt: 'Chủ đầu tư', pd: 'Chủ đầu tư' },
  { khau: 'Thanh toán', kiem: 'Hồ sơ thanh toán khớp nghiệm thu; tạm ứng và thu hồi tạm ứng',
    dau: 'Tạm ứng lớn chậm thu hồi; thanh toán vượt khối lượng nghiệm thu', lap: 'Ban quản lý dự án', kt: 'Kế toán', pd: 'Chủ đầu tư' },
  { khau: 'Quyết toán', kiem: 'Mẫu biểu, số liệu đối chiếu, thời hạn lập và thẩm tra quyết toán',
    dau: 'Dự án hoàn thành lâu chưa quyết toán; chênh lệch số liệu', lap: 'Chủ đầu tư', kt: 'Cơ quan thẩm tra', pd: 'Người có thẩm quyền phê duyệt' }
];

D.PLAN = [
  { id: 'p1', ten: 'Ngày 1–30', viec: 'Rà hồ sơ tồn, điểm vướng pháp lý, tải công việc và thẩm quyền',
    kq: 'Mỗi việc tồn có người phụ trách, nguyên nhân và bước xử lý tiếp theo',
    items: [
      ['p1a', 'Lập danh mục hồ sơ tồn, mỗi hồ sơ có một người chịu trách nhiệm', 'ho-so'],
      ['p1b', 'Lập sổ theo dõi vướng mắc pháp lý trên hệ thống hiện có', 'vuong-mac'],
      ['p1c', 'Rà đầu việc chiếm nhiều thời gian: họp, báo cáo, nhập liệu, luân chuyển, xin ý kiến nội bộ', 'tai-viec'],
      ['p1d', 'Rà văn bản phân công, ủy quyền hiện hành', 'van-ban'],
      ['p1e', 'Đo số liệu "trước": quá hạn, tuổi tồn, thời gian xử lý, số lần bổ sung', 'lo-trinh']
    ] },
  { id: 'p2', ten: 'Ngày 31–60', viec: 'Thử nghiệm tại một quy trình; chuẩn hóa phiếu trình; giảm báo cáo trùng',
    kq: 'Ít vòng chuyển hồ sơ, ít bổ sung lặp lại, rõ trách nhiệm',
    items: [
      ['p2a', 'Chọn một quy trình có nhiều hồ sơ, nhiều lần bổ sung hoặc chậm nhất để thí điểm', 'tai-viec'],
      ['p2b', 'Áp dụng mẫu phiếu trình quyết định ngắn cho hồ sơ phức tạp', 'quyet-dinh'],
      ['p2c', 'Bỏ hoặc hợp nhất báo cáo, cuộc họp trùng lặp thuộc quyền Giám đốc Sở', 'tai-viec'],
      ['p2d', 'Quy định một nguồn dữ liệu dùng chung cho các phòng', 'tai-viec'],
      ['p2e', 'Họp định kỳ xử lý vướng mắc pháp lý bằng phương án cụ thể', 'vuong-mac']
    ] },
  { id: 'p3', ten: 'Ngày 61–90', viec: 'Đánh giá kết quả, sửa cách làm, nhân rộng phần hiệu quả',
    kq: 'Có số liệu trước–sau và danh mục kiến nghị vượt thẩm quyền',
    items: [
      ['p3a', 'Đo số liệu "sau" và so sánh với "trước"', 'lo-trinh'],
      ['p3b', 'Tổng hợp danh mục kiến nghị vượt thẩm quyền gửi cấp trên', 'lo-trinh'],
      ['p3c', 'Bố trí người kế cận, tài liệu bàn giao cho vị trí trọng yếu', 'tai-viec'],
      ['p3d', 'Nhân rộng cách làm hiệu quả sang quy trình thứ hai', 'lo-trinh']
    ] }
];

D.KPI = [
  { id: 'qh', ten: 'Hồ sơ quá hạn', dv: 'hồ sơ', tot: 'giam' },
  { id: 'tuoi', ten: 'Tuổi tồn đọng bình quân', dv: 'ngày', tot: 'giam' },
  { id: 'tg', ten: 'Thời gian xử lý thực tế bình quân', dv: 'ngày', tot: 'giam' },
  { id: 'bs', ten: 'Số lần yêu cầu bổ sung / hồ sơ', dv: 'lần', tot: 'giam' },
  { id: 'sua', ten: 'Tỷ lệ phải sửa kết quả', dv: '%', tot: 'giam' },
  { id: 'ph', ten: 'Phản hồi tích cực của người dùng dịch vụ', dv: '%', tot: 'tang' },
  { id: 'dh', ten: 'Tỷ lệ đúng hạn (chỉ đọc cùng các chỉ số trên)', dv: '%', tot: 'tang' }
];

D.LYDO = ['Vướng pháp lý', 'Chờ ý kiến phòng khác', 'Chờ bổ sung hồ sơ', 'Chờ lãnh đạo quyết', 'Quá tải người xử lý', 'Chưa rõ nguyên nhân'];
D.TT_VM = ['Mới ghi nhận', 'Đang phân tích', 'Đã xin ý kiến', 'Đã có hướng xử lý', 'Đã đóng'];
