/* Bàn quyết định Lãnh đạo Sở — ứng dụng tĩnh, dữ liệu lưu trong trình duyệt của người dùng. */
(function () {
  'use strict';
  var KEY = 'bqd-lds.v1';
  var DAY = 86400000;

  // ---------- tiện ích ----------
  function e(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function today() { var t = new Date(); t.setHours(0, 0, 0, 0); return t; }
  function iso(dt) { var m = dt.getMonth() + 1, d = dt.getDate(); return dt.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (d < 10 ? '0' : '') + d; }
  function rel(n) { return iso(new Date(today().getTime() + n * DAY)); }
  function parse(s) { if (!s) return null; var p = s.split('-'); return p.length === 3 ? new Date(+p[0], p[1] - 1, +p[2]) : null; }
  function dd(s) { var t = parse(s); return t ? (t.getDate() + '/' + (t.getMonth() + 1) + '/' + t.getFullYear()) : '……'; }
  function daysTo(s) { var t = parse(s); return t ? Math.round((t - today()) / DAY) : null; }
  function law(id) { for (var i = 0; i < D.LAWS.length; i++) if (D.LAWS[i].id === id) return D.LAWS[i]; return null; }
  function capOf(id) { for (var i = 0; i < D.CAP.length; i++) if (D.CAP[i].id === id) return D.CAP[i]; return D.CAP[D.CAP.length - 1]; }
  function stage(id) { for (var i = 0; i < D.STAGES.length; i++) if (D.STAGES[i].id === id) return D.STAGES[i]; return { ten: '' }; }
  function num(v) { var n = parseFloat(String(v).replace(',', '.')); return isFinite(n) ? n : 0; }
  function fmt(n, k) { return (Math.round(n * Math.pow(10, k || 0)) / Math.pow(10, k || 0)).toLocaleString('vi-VN'); }
  function lawName(id) { var l = law(id); return l ? (l.loai + ' ' + l.so) : ''; }

  // ---------- dữ liệu mẫu ----------
  function sample() {
    return {
      ver: 1,
      cs: {
        step: 1,
        ten: 'Điều chỉnh dự án Nâng cấp đường liên xã ĐX-07', ma: 'DA-ĐX07', gd: 'qd', nhom: 'C', gtri: 48,
        phu: 'Phòng Quản lý đầu tư', han: rel(12), cq: 'UBND tỉnh',
        mota: 'Chi phí bồi thường tăng khoảng 6,5 tỷ đồng do áp dụng bảng giá đất mới, làm tổng mức đầu tư vượt mức đã duyệt. Dự án do UBND huyện (cũ) quyết định đầu tư trước khi sắp xếp chính quyền hai cấp; các phòng chưa thống nhất cơ quan có thẩm quyền quyết định điều chỉnh.',
        anh: 'Đoạn Km2–Km3+400 phải chờ; đoạn Km0–Km2 đã có mặt bằng sạch, có thể tiếp tục thi công.',
        tq: 'chua-ro', cc: 'chuyen-tiep', nl: 'du', pa: 'co', tach: 'co', dm: 'khong', ton: 46,
        rr: { lon: false, dc: true, kn: true, bt: false },
        cf: {
          a: { van: 'L58', cap: 'luat', cq: 'Quốc hội', ngay: '2024-11-29', hl: 'sua-doi', pv: 'chung', dk: 'Quy định về thẩm quyền điều chỉnh dự án đầu tư công', nd: 'Người quyết định đầu tư có thẩm quyền quyết định điều chỉnh dự án.' },
          b: { van: '', cap: 'qd-ubnd', cq: 'UBND tỉnh', ngay: rel(-420), hl: 'con', pv: 'chung', dk: 'Quyết định phân cấp, ủy quyền quản lý dự án sau sắp xếp đơn vị hành chính', nd: 'Giao UBND cấp xã tiếp nhận dự án do cấp huyện quản lý; chưa nêu thẩm quyền điều chỉnh tổng mức đầu tư.' },
          tn: false
        },
        hoi: 'Đối với dự án nhóm C do UBND huyện (cũ) quyết định đầu tư trước ngày sắp xếp, nay cần điều chỉnh tăng tổng mức đầu tư do chi phí bồi thường tăng, cơ quan nào có thẩm quyền quyết định điều chỉnh dự án?',
        w: { cc: 30, td: 20, rr: 20, dn: 15, cp: 15 },
        opts: [
          { ten: 'PA1. Điều chỉnh dự án, tăng tổng mức đầu tư; Sở tham mưu UBND tỉnh quyết định', mo: 'Giữ nguyên quy mô tuyến; bổ sung 6,5 tỷ đồng từ nguồn dự phòng kế hoạch trung hạn.', tq: false, s: { cc: 4, td: 3, rr: 4, dn: 4, cp: 2 } },
          { ten: 'PA2. Giữ tổng mức; điều chỉnh giảm quy mô đoạn Km2–Km3+400', mo: 'Không tăng vốn; cắt giảm 1,4 km, chuyển phần còn lại sang giai đoạn sau.', tq: true, s: { cc: 3, td: 4, rr: 3, dn: 2, cp: 4 } },
          { ten: 'PA3. Tạm dừng toàn bộ dự án, chờ hướng dẫn', mo: 'Không phát sinh rủi ro pháp lý mới nhưng chậm giải ngân, ảnh hưởng người dân.', tq: true, s: { cc: 5, td: 1, rr: 4, dn: 1, cp: 3 } }
        ]
      },
      reg: [
        { id: 'VM-01', hs: 'DA-ĐX07 · Điều chỉnh dự án đường liên xã ĐX-07', dk: 'Thẩm quyền điều chỉnh dự án do UBND huyện (cũ) quyết định đầu tư: quy định chuyển tiếp chưa nêu rõ cơ quan tiếp nhận thẩm quyền.', so: 'Tiếp tục thi công đoạn Km0–Km2 đã có mặt bằng.', cap: 'Xác định cơ quan quyết định điều chỉnh dự án.', cq: 'UBND tỉnh', pa: 'UBND tỉnh quyết định điều chỉnh; Sở thẩm định.', phu: 'P. QLĐT · Trần Minh Khoa', han: rel(-2), tt: 'Đã xin ý kiến', tq: 'cap-tren' },
        { id: 'VM-02', hs: 'Quyết toán 3 dự án hoàn thành năm 2025', dk: 'Mẫu biểu quyết toán theo Thông tư 91/2025/TT-BTC hay Thông tư 73/2026/TT-BTC cho hồ sơ lập trước 01/7/2026.', so: 'Thẩm tra số liệu, phần không phụ thuộc mẫu biểu.', cap: 'Hướng dẫn mẫu áp dụng cho hồ sơ chuyển tiếp.', cq: 'Bộ Tài chính', pa: 'Áp dụng mẫu mới cho hồ sơ nộp sau ngày hiệu lực.', phu: 'P. Tài chính ĐT · Lê Thu Hà', han: rel(5), tt: 'Đang phân tích', tq: 'cap-tren' },
        { id: 'VM-03', hs: 'Kế hoạch vốn 2027 · 5 dự án chuyển tiếp', dk: 'Thứ tự ưu tiên trong nghị quyết HĐND tỉnh chưa cập nhật theo Nghị quyết 70 đã sửa đổi bởi Nghị quyết 120.', so: 'Sắp xếp danh mục theo tiêu chí trung ương đã sửa đổi.', cap: 'Kiến nghị điều chỉnh nghị quyết của HĐND tỉnh.', cq: 'UBND tỉnh trình HĐND', pa: 'Trình điều chỉnh tiêu chí tại kỳ họp gần nhất.', phu: 'P. Kế hoạch · Phạm Quốc Bảo', han: rel(9), tt: 'Mới ghi nhận', tq: 'cap-tren' },
        { id: 'VM-04', hs: 'Gói thầu tư vấn giám sát trường THCS Mẫu', dk: 'Hai cách hiểu về điều kiện áp dụng chỉ định thầu giữa phòng chuyên môn và bên mời thầu.', so: 'Thống nhất cách hiểu theo ý kiến pháp chế Sở.', cap: '', cq: '', pa: 'Áp dụng đấu thầu rộng rãi để bảo đảm an toàn.', phu: 'Pháp chế · Đỗ Ngọc Lan', han: rel(-6), tt: 'Đã đóng', tq: 'so' }
      ],
      hs: [
        { ma: 'HS-1021', ten: 'Thẩm định điều chỉnh dự án ĐX-07', phu: 'Trần Minh Khoa', buoc: 'Chờ xác định thẩm quyền', nhan: rel(-46), han: rel(-4), ly: 'Vướng pháp lý', ld: true, next: 'Đôn đốc UBND tỉnh trả lời VM-01', vm: 'VM-01' },
        { ma: 'HS-1034', ten: 'Quyết toán dự án Trạm y tế xã Bình Mẫu', phu: 'Lê Thu Hà', buoc: 'Thẩm tra số liệu', nhan: rel(-38), han: rel(2), ly: 'Vướng pháp lý', ld: false, next: 'Hoàn tất thẩm tra phần không phụ thuộc mẫu biểu', vm: 'VM-02' },
        { ma: 'HS-1040', ten: 'Chủ trương đầu tư kè sông Mẫu đoạn 2', phu: 'Ngô Văn Tài', buoc: 'Lấy ý kiến các sở', nhan: rel(-29), han: rel(-1), ly: 'Chờ ý kiến phòng khác', ld: false, next: 'Họp liên phòng chốt ý kiến', vm: '' },
        { ma: 'HS-1043', ten: 'Điều chỉnh kế hoạch vốn 2026 lần 2', phu: 'Phạm Quốc Bảo', buoc: 'Dự thảo tờ trình', nhan: rel(-21), han: rel(6), ly: 'Chờ lãnh đạo quyết', ld: true, next: 'Trình phương án cắt giảm dự án giải ngân thấp', vm: '' },
        { ma: 'HS-1047', ten: 'Thẩm định báo cáo KTKT nhà văn hóa phường 3', phu: 'Ngô Văn Tài', buoc: 'Chờ chủ đầu tư bổ sung', nhan: rel(-19), han: rel(8), ly: 'Chờ bổ sung hồ sơ', ld: false, next: 'Gửi một lần đủ danh mục bổ sung', vm: '' },
        { ma: 'HS-1050', ten: 'Kế hoạch lựa chọn nhà thầu trường THCS Mẫu', phu: 'Đỗ Ngọc Lan', buoc: 'Hoàn thiện báo cáo thẩm định', nhan: rel(-12), han: rel(3), ly: 'Quá tải người xử lý', ld: false, next: 'Phân công thêm người hỗ trợ', vm: 'VM-04' },
        { ma: 'HS-1052', ten: 'Thẩm định dự án chuyển đổi số một cửa', phu: 'Vũ Thanh Tâm', buoc: 'Chờ ý kiến chuyên ngành CNTT', nhan: rel(-10), han: rel(11), ly: 'Chờ ý kiến phòng khác', ld: false, next: 'Lấy ý kiến bằng phiếu, hạn 5 ngày', vm: '' },
        { ma: 'HS-1055', ten: 'Báo cáo giám sát, đánh giá đầu tư 6 tháng', phu: 'Trần Minh Khoa', buoc: 'Tổng hợp số liệu', nhan: rel(-6), han: rel(1), ly: 'Quá tải người xử lý', ld: false, next: 'Dùng số liệu từ báo cáo giải ngân tháng', vm: '' }
      ],
      tasks: [
        { ten: 'Họp giao ban Sở hằng tuần', loai: 'Họp', lan: 4, gio: 2, ng: 14, tq: true, trung: '', de: 'Giữ' },
        { ten: 'Họp tiến độ giải ngân riêng của từng phòng', loai: 'Họp', lan: 4, gio: 1.5, ng: 8, tq: true, trung: 'Giao ban tuần', de: 'Hợp nhất' },
        { ten: 'Báo cáo giải ngân tuần gửi Văn phòng Sở', loai: 'Báo cáo', lan: 4, gio: 3, ng: 3, tq: true, trung: 'Báo cáo tháng theo Thông tư 37', de: 'Hợp nhất' },
        { ten: 'Báo cáo tháng theo mẫu Thông tư 37/2025/TT-BTC', loai: 'Báo cáo', lan: 1, gio: 8, ng: 2, tq: false, trung: '', de: 'Giữ' },
        { ten: 'Nhập lại danh mục dự án vào bảng tính của 3 phòng', loai: 'Nhập liệu', lan: 3, gio: 4, ng: 3, tq: true, trung: 'Hệ thống quản lý hồ sơ', de: 'Nguồn dữ liệu chung' },
        { ten: 'Xin ý kiến nội bộ bằng văn bản giữa các phòng', loai: 'Xin ý kiến nội bộ', lan: 12, gio: 1, ng: 2, tq: true, trung: '', de: 'Rút gọn' },
        { ten: 'Trình ký qua 3 cấp với văn bản thông thường', loai: 'Luân chuyển hồ sơ', lan: 30, gio: 0.5, ng: 3, tq: true, trung: '', de: 'Ủy quyền' },
        { ten: 'Báo cáo đột xuất theo yêu cầu cấp trên', loai: 'Báo cáo', lan: 3, gio: 4, ng: 2, tq: false, trung: '', de: 'Giữ' }
      ],
      staff: [
        { ten: 'Trần Minh Khoa', lv: 'Thẩm định dự án', d: 4, tb: 5, pt: 4, ot: 26, sai: 2, thay: false },
        { ten: 'Lê Thu Hà', lv: 'Quyết toán', d: 6, tb: 4, pt: 2, ot: 14, sai: 1, thay: false },
        { ten: 'Ngô Văn Tài', lv: 'Chủ trương đầu tư', d: 8, tb: 6, pt: 1, ot: 10, sai: 1, thay: true },
        { ten: 'Phạm Quốc Bảo', lv: 'Kế hoạch vốn', d: 3, tb: 6, pt: 3, ot: 18, sai: 0, thay: true },
        { ten: 'Đỗ Ngọc Lan', lv: 'Pháp chế, đấu thầu', d: 5, tb: 7, pt: 3, ot: 22, sai: 1, thay: false },
        { ten: 'Vũ Thanh Tâm', lv: 'Dự án CNTT', d: 9, tb: 2, pt: 0, ot: 2, sai: 0, thay: true },
        { ten: 'Hoàng Mai Anh', lv: 'Tổng hợp, báo cáo', d: 14, tb: 2, pt: 0, ot: 4, sai: 0, thay: true }
      ],
      hr: { kho: 'Thẩm định dự án; quyết toán vốn đầu tư', nghi: 3, bc: 18 },
      proc: [
        { ten: 'Thẩm định báo cáo kinh tế – kỹ thuật', sl: 22, bs: 2.4, tre: 31 },
        { ten: 'Thẩm định điều chỉnh dự án', sl: 9, bs: 1.8, tre: 44 },
        { ten: 'Thẩm tra quyết toán dự án hoàn thành', sl: 14, bs: 2.9, tre: 38 },
        { ten: 'Lấy ý kiến chủ trương đầu tư', sl: 11, bs: 1.1, tre: 18 }
      ],
      proj: [
        { ten: 'Đường liên xã ĐX-07', gt: 48, dc: 2, kn: 3, gn: 41, bt: false },
        { ten: 'Kè sông Mẫu đoạn 2', gt: 186, dc: 1, kn: 0, gn: 12, bt: false },
        { ten: 'Bệnh viện đa khoa khu vực Mẫu', gt: 420, dc: 3, kn: 1, gn: 58, bt: true },
        { ten: 'Trường THCS Mẫu', gt: 36, dc: 0, kn: 0, gn: 72, bt: false },
        { ten: 'Chuyển đổi số bộ phận một cửa', gt: 22, dc: 1, kn: 0, gn: 25, bt: false },
        { ten: 'Nhà văn hóa phường 3', gt: 9, dc: 0, kn: 2, gn: 90, bt: false }
      ],
      flags: { xd: true, gp: true, dt: true },
      plan: { p1a: true, p1b: true, p1c: true },
      kpi: { qh: { a: 23, b: 11 }, tuoi: { a: 41, b: 27 }, tg: { a: 34, b: 26 }, bs: { a: 2.6, b: 1.4 }, sua: { a: 18, b: 9 }, ph: { a: 52, b: 68 }, dh: { a: 81, b: 88 } }
    };
  }

  // ---------- lưu trữ ----------
  var S;
  function load() {
    try { var raw = localStorage.getItem(KEY); if (raw) { S = JSON.parse(raw); if (S && S.ver === 1) return; } } catch (x) { }
    S = sample();
  }
  var saveT;
  function save() { clearTimeout(saveT); saveT = setTimeout(function () { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (x) { } }, 250); }
  function getP(p) { var o = S, k = p.split('.'); for (var i = 0; i < k.length; i++) { if (o == null) return undefined; o = o[k[i]]; } return o; }
  function setP(p, v) { var o = S, k = p.split('.'); for (var i = 0; i < k.length - 1; i++) { if (o[k[i]] == null) o[k[i]] = {}; o = o[k[i]]; } o[k[k.length - 1]] = v; }

  // ---------- điều khiển biểu mẫu ----------
  function inp(p, type, attrs) { var v = getP(p); return '<input id="f-' + p.replace(/\./g, '-') + '" data-b="' + p + '"' + (type === 'number' ? ' data-n="1" inputmode="decimal"' : '') + ' type="' + (type || 'text') + '" value="' + e(v) + '"' + (attrs || '') + '>'; }
  function txt(p, rows) { return '<textarea id="f-' + p.replace(/\./g, '-') + '" data-b="' + p + '" rows="' + (rows || 3) + '">' + e(getP(p)) + '</textarea>'; }
  function sel(p, opts, rr) {
    var v = getP(p);
    return '<select id="f-' + p.replace(/\./g, '-') + '" data-b="' + p + '"' + (rr ? ' data-rr="1"' : '') + '>' + opts.map(function (o) { var val = Array.isArray(o) ? o[0] : o, t = Array.isArray(o) ? o[1] : o; return '<option value="' + e(val) + '"' + (String(v) === String(val) ? ' selected' : '') + '>' + e(t) + '</option>'; }).join('') + '</select>';
  }
  function chk(p, label, rr) { return '<label class="chk"><input type="checkbox" id="f-' + p.replace(/\./g, '-') + '" data-b="' + p + '"' + (rr ? ' data-rr="1"' : '') + (getP(p) ? ' checked' : '') + '><span>' + label + '</span></label>'; }
  function seg(p, opts) {
    var v = getP(p);
    return '<div class="seg" role="radiogroup">' + opts.map(function (o) {
      var id = 'r-' + p.replace(/\./g, '-') + '-' + o[0];
      return '<input type="radio" name="' + p + '" id="' + id + '" value="' + o[0] + '" data-b="' + p + '"' + (v === o[0] ? ' checked' : '') + '><label for="' + id + '">' + o[1] + '</label>';
    }).join('') + '</div>';
  }
  function fld(label, ctl, hint, cls) { return '<div class="fld ' + (cls || '') + '"><label>' + label + '</label>' + ctl + (hint ? '<small>' + hint + '</small>' : '') + '</div>'; }
  function pill(t, k) { return '<span class="pill ' + (k || '') + '">' + e(t) + '</span>'; }
  function copyBtn(target, label) { return '<button class="btn" data-act="copy" data-t="' + target + '">' + (label || 'Sao chép') + '</button>'; }

  // =====================================================================
  // CHẨN ĐOÁN
  // =====================================================================
  var LOAI = {
    vuot: { ten: 'Vượt thẩm quyền của Sở', k: 'steel', lam: ['Sở xử lý ngay phần thuộc thẩm quyền, không để cả hồ sơ chờ.', 'Lập hồ sơ trình đúng cấp: vấn đề, căn cứ, phương án, kiến nghị cụ thể.', 'Ghi vào danh mục kiến nghị vượt thẩm quyền và theo dõi đến khi có kết quả.'] },
    tq: { ten: 'Chưa rõ thẩm quyền', k: 'warn', lam: ['Rà văn bản phân cấp, ủy quyền hiện hành và quy định chuyển tiếp sau sắp xếp chính quyền.', 'Pháp chế Sở xác định thẩm quyền bằng văn bản trong thời hạn ngắn.', 'Nếu vẫn chưa rõ: xin ý kiến cơ quan có thẩm quyền bằng câu hỏi cụ thể kèm phương án.'] },
    cc: { ten: 'Thiếu căn cứ hoặc quy định chồng chéo', k: 'seal', lam: ['Phân tích hai quy định ở Bước 3 để xác định có tự áp dụng được không.', 'Lấy ý kiến đúng đầu mối pháp chế; không gửi công văn chung chung "đề nghị hướng dẫn".', 'Ghi vào sổ vướng mắc, giao người theo dõi và mốc báo cáo.'] },
    nl: { ten: 'Cán bộ chưa đủ năng lực xử lý', k: 'warn', lam: ['Hướng dẫn trực tiếp trên hồ sơ thực tế, không chỉ đào tạo chung.', 'Bố trí người có kinh nghiệm hỗ trợ, kiểm tra kết quả trước khi trình.', 'Lưu hồ sơ mẫu để dùng lại cho loại việc tương tự.'] },
    nt: { ten: 'Đủ căn cứ nhưng có dấu hiệu né tránh, đùn đẩy', k: 'crit', lam: ['Giao nhiệm vụ bằng văn bản: người chịu trách nhiệm, sản phẩm, thời hạn cụ thể.', 'Theo dõi tại giao ban; quá hạn không có lý do thì xem xét trách nhiệm theo quy định.', 'Không thay cán bộ quyết định; yêu cầu trình phương án.'] },
    ok: { ten: 'Đủ điều kiện để quyết định', k: 'ok', lam: ['Quyết định trong thời hạn, trên phiếu trình ngắn.', 'Lưu căn cứ và lý do lựa chọn phương án để kiểm tra lại khi cần.'] }
  };
  function riskScore(c) { var r = c.rr || {}; return (r.lon ? 3 : 0) + (r.dc ? 2 : 0) + (r.kn ? 2 : 0) + (r.bt ? 4 : 0) + (num(c.gtri) >= 120 ? 1 : 0); }
  function diag(c) {
    var hit = [];
    if (c.tq === 'cap-tren') hit.push('vuot');
    if (c.tq === 'chua-ro') hit.push('tq');
    if (c.cc !== 'ro') hit.push('cc');
    if (c.nl === 'chua') hit.push('nl');
    if (c.tq === 'so' && c.cc === 'ro' && c.nl === 'du' && (num(c.ton) > 20 || c.pa !== 'co')) hit.push('nt');
    if (!hit.length) hit.push('ok');
    var rs = riskScore(c), muc = rs >= 5 ? 'cao' : rs >= 2 ? 'trung bình' : 'thấp';
    var han = { vuot: 10, tq: 7, cc: c.cc === 'nhieu-cach-hieu' ? 10 : 15, nl: 7, nt: 3, ok: 5 }[hit[0]];
    var ks = muc === 'cao' ? 'Kiểm tra chéo bởi pháp chế và một lãnh đạo phòng độc lập; lãnh đạo Sở duyệt phiếu trình trực tiếp.'
      : muc === 'trung bình' ? 'Pháp chế Sở cho ý kiến bằng văn bản trước khi trình.' : 'Kiểm soát theo quy trình thông thường của phòng.';
    return { hit: hit, chinh: LOAI[hit[0]], rs: rs, muc: muc, han: han, ks: ks };
  }

  // =====================================================================
  // PHÂN TÍCH CHỒNG CHÉO
  // =====================================================================
  var HL = [['con', 'Còn hiệu lực'], ['sua-doi', 'Còn hiệu lực, đã bị sửa đổi một phần'], ['chua', 'Chưa có hiệu lực'], ['het', 'Hết hiệu lực / bị bãi bỏ'], ['chua-ro', 'Chưa kiểm tra']];
  var CC = [['ro', 'Căn cứ rõ, thống nhất'], ['nhieu-cach-hieu', 'Một quy định, nhiều cách hiểu'], ['mau-thuan', 'Hai quy định khác nhau về cùng vấn đề'], ['khoang-trong', 'Chưa có quy định (khoảng trống)'], ['chuyen-tiep', 'Quy định chuyển tiếp chưa rõ']];
  var SHORT = { luat: 'Luật', 'nq-ubtvqh': 'Nghị quyết', nd: 'Nghị định', 'qd-ttg': 'Quyết định', tt: 'Thông tư', 'nq-hdnd': 'Nghị quyết', 'qd-ubnd': 'Quyết định', cv: 'Công văn' };
  function nm(x) { var l = law(x.van); return l ? lawName(x.van) : ((SHORT[x.cap] || 'Văn bản') + ' của ' + (x.cq || '…') + (x.ngay ? ' ngày ' + dd(x.ngay) : '')); }
  function analyze(c) {
    var A = c.cf.a, B = c.cf.b, ca = capOf(A.cap), cb = capOf(B.cap), st = [], muc = 'phap-che', ket = '', hoiCq = c.cq || '';
    function push(t, r, k) { st.push({ t: t, r: r, k: k }); }
    // 1. hiệu lực
    var hlTxt = function (x) { return (HL.filter(function (h) { return h[0] === x.hl; })[0] || HL[4])[1].toLowerCase(); };
    if (A.hl === 'het' || B.hl === 'het') {
      var dead = A.hl === 'het' ? 'A' : 'B';
      push('Kiểm tra hiệu lực', 'Quy định ' + dead + ' đã hết hiệu lực: không áp dụng, trừ trường hợp quy định chuyển tiếp cho phép tiếp tục áp dụng với hồ sơ đang xử lý.', 'stop');
    } else if (A.hl === 'chua-ro' || B.hl === 'chua-ro') {
      push('Kiểm tra hiệu lực', 'Chưa kiểm tra hiệu lực của ít nhất một văn bản. Tra Công báo và Cơ sở dữ liệu quốc gia về pháp luật trước khi kết luận.', 'warn');
    } else if (A.hl === 'chua' || B.hl === 'chua') {
      push('Kiểm tra hiệu lực', 'Có văn bản chưa có hiệu lực: xác định thời điểm phát sinh hồ sơ và điều khoản chuyển tiếp của văn bản mới.', 'warn');
    } else {
      push('Kiểm tra hiệu lực', 'A: ' + hlTxt(A) + '; B: ' + hlTxt(B) + '.' + ((A.hl === 'sua-doi' || B.hl === 'sua-doi') ? ' Đọc kèm văn bản sửa đổi hoặc văn bản hợp nhất, không đọc riêng văn bản gốc.' : ''), (A.hl === 'sua-doi' || B.hl === 'sua-doi') ? 'warn' : 'ok');
    }
    // 2. tính chất VBQPPL
    if (A.cap === 'cv' || B.cap === 'cv') push('Tính chất văn bản', 'Công văn, hướng dẫn không phải văn bản quy phạm pháp luật nên không thể thay đổi quy định của VBQPPL. Chỉ dùng để tham khảo cách hiểu của cơ quan ban hành.', 'warn');
    // 3. theo loại vướng mắc
    var hi = ca.bac < cb.bac ? 'A' : 'B', hiX = hi === 'A' ? A : B, loX = hi === 'A' ? B : A;
    if (c.cc === 'mau-thuan') {
      if (A.hl === 'het' || B.hl === 'het') {
        var alive = A.hl === 'het' ? 'B' : 'A';
        ket = 'Áp dụng quy định ' + alive + ' (còn hiệu lực), trừ khi quy định chuyển tiếp cho phép tiếp tục áp dụng quy định đã hết hiệu lực với hồ sơ này. Pháp chế Sở xác nhận.';
        muc = 'phap-che';
      } else if (ca.bac === 99 || cb.bac === 99) {
        var vb = ca.bac === 99 ? 'B' : 'A';
        push('Văn bản quy phạm và công văn', 'Áp dụng quy định ' + vb + ' (văn bản quy phạm pháp luật). Nếu công văn hướng dẫn khác quy định, đề nghị cơ quan ban hành công văn xem xét lại.', 'ok');
        ket = 'Áp dụng quy định ' + vb + '; công văn chỉ dùng tham khảo. Pháp chế Sở xác nhận bằng văn bản.';
        muc = 'tu-ap-dung';
      } else if (ca.bac !== cb.bac) {
        push('So sánh thứ bậc hiệu lực', 'Quy định ' + hi + ' (' + capOf(hiX.cap).ten + ') có hiệu lực pháp lý cao hơn. Theo nguyên tắc áp dụng VBQPPL, áp dụng văn bản có hiệu lực cao hơn.', 'ok');
        push('Lưu ý', 'Kiểm tra quy định cấp dưới có phải là quy định chi tiết theo giao quyền của văn bản cấp trên không. Nếu cấp dưới trái cấp trên: kiến nghị cơ quan ban hành xử lý văn bản.', 'warn');
        ket = 'Áp dụng quy định ' + hi + ' (' + nm(hiX) + '). Pháp chế Sở xác nhận bằng văn bản; kiến nghị ' + (loX.cq || 'cơ quan ban hành') + ' rà soát quy định còn lại.';
        muc = 'tu-ap-dung';
      } else if ((A.cq || '').trim().toLowerCase() === (B.cq || '').trim().toLowerCase() && A.cq) {
        var pa = parse(A.ngay), pb = parse(B.ngay);
        if (pa && pb && +pa !== +pb) {
          var later = pa > pb ? 'A' : 'B';
          push('Cùng cơ quan ban hành', 'Hai văn bản cùng do ' + A.cq + ' ban hành. Áp dụng quy định của văn bản ban hành sau: quy định ' + later + '.', 'ok');
          ket = 'Áp dụng quy định ' + later + ' (văn bản ban hành sau của cùng cơ quan). Kiểm tra quy định chuyển tiếp nếu hồ sơ phát sinh trước ngày văn bản sau có hiệu lực.';
          muc = 'tu-ap-dung';
        } else {
          push('Cùng cơ quan ban hành', 'Cần ngày ban hành của cả hai văn bản để xác định văn bản ban hành sau.', 'warn');
          ket = 'Bổ sung ngày ban hành để kết luận.'; muc = 'phap-che';
        }
      } else {
        push('Cùng thứ bậc, khác cơ quan', 'Hai văn bản có cùng thứ bậc nhưng do cơ quan khác nhau ban hành. Sở không tự chọn quy định để áp dụng.', 'stop');
        ket = 'Xin ý kiến cơ quan có thẩm quyền với câu hỏi cụ thể kèm phương án; đồng thời kiến nghị xử lý văn bản mâu thuẫn.';
        muc = 'xin-y-kien'; hoiCq = (A.cq || '') + (B.cq ? ' và ' + B.cq : '');
      }
      if (A.pv !== B.pv) push('Luật chung và chuyên ngành', 'Một quy định mang tính chuyên ngành. Đọc điều khoản về áp dụng pháp luật trong chính các luật liên quan trước khi kết luận theo thứ bậc.', 'warn');
    } else if (c.cc === 'nhieu-cach-hieu') {
      push('Xác định cách hiểu', 'Pháp chế Sở lập bảng so sánh các cách hiểu, mỗi cách hiểu kèm căn cứ và hệ quả với hồ sơ.', 'warn');
      push('Thống nhất trong phạm vi Sở', 'Nếu thuộc thẩm quyền Sở: Giám đốc Sở chủ trì kết luận cách áp dụng, ghi rõ căn cứ vào phiếu trình.', 'ok');
      ket = 'Giám đốc Sở kết luận cách áp dụng trên cơ sở ý kiến pháp chế. Nếu cách hiểu ảnh hưởng thẩm quyền hoặc quyền lợi của bên thứ ba: xin ý kiến cơ quan ban hành ' + nm(A) + '.';
      muc = 'phap-che'; hoiCq = A.cq || hoiCq;
    } else if (c.cc === 'khoang-trong') {
      push('Chưa có quy định', 'Không tự đặt ra quy định để áp dụng. Xác định cơ quan quản lý nhà nước chuyên ngành có trách nhiệm hướng dẫn.', 'stop');
      if (c.dm === 'co') push('Đề xuất đổi mới, sáng tạo', 'Nếu là đề xuất đổi mới, sáng tạo: thực hiện đúng nguyên tắc, điều kiện, thủ tục tại Nghị định 73/2023/NĐ-CP. Lời hứa "lãnh đạo chịu trách nhiệm" không phải là bảo đảm miễn trách nhiệm pháp lý.', 'warn');
      ket = 'Xin ý kiến cơ quan có thẩm quyền kèm phương án Sở đề xuất; xử lý trước các phần hồ sơ độc lập.';
      muc = 'xin-y-kien';
    } else if (c.cc === 'chuyen-tiep') {
      push('Xác định mốc thời gian', 'Xác định thời điểm phát sinh hồ sơ (ngày quyết định đầu tư, ngày nộp hồ sơ) và ngày hiệu lực của văn bản mới.', 'ok');
      push('Đọc điều khoản chuyển tiếp', 'Đọc điều khoản chuyển tiếp của văn bản ban hành sau (' + (parse(A.ngay) && parse(B.ngay) ? (parse(A.ngay) > parse(B.ngay) ? 'quy định A' : 'quy định B') : 'văn bản mới') + ') và văn bản phân cấp, ủy quyền hiện hành.', 'warn');
      ket = 'Nếu điều khoản chuyển tiếp xác định được: Sở tự áp dụng, pháp chế xác nhận. Nếu không: xin ý kiến cơ quan ban hành văn bản mới với câu hỏi cụ thể.';
      muc = 'phap-che';
    } else {
      push('Không có xung đột', 'Căn cứ rõ ràng, thống nhất. Áp dụng và quyết định trong thời hạn.', 'ok');
      ket = 'Áp dụng căn cứ hiện có và quyết định.'; muc = 'tu-ap-dung';
    }
    if (c.cf.tn) push('Trách nhiệm pháp lý', 'Với nội dung về trách nhiệm pháp lý hoặc xử lý vi phạm: nếu văn bản mới không quy định trách nhiệm hoặc quy định nhẹ hơn với hành vi xảy ra trước đó, áp dụng văn bản mới.', 'warn');
    if (c.tach === 'co') push('Phần hồ sơ độc lập', 'Hồ sơ có phần không bị vướng. Xem xét tiếp tục xử lý phần độc lập theo quy định thay vì để cả hồ sơ chờ.', 'ok');
    return { st: st, ket: ket, muc: muc, hoiCq: hoiCq };
  }
  var MUC = { 'tu-ap-dung': ['Sở tự áp dụng', 'ok'], 'phap-che': ['Cần pháp chế kết luận', 'warn'], 'xin-y-kien': ['Phải xin ý kiến cấp trên', 'crit'] };

  // =====================================================================
  // CHẤM ĐIỂM PHƯƠNG ÁN
  // =====================================================================
  var CRIT = [['cc', 'Căn cứ pháp lý vững'], ['td', 'Tiến độ, giải ngân'], ['rr', 'An toàn trước thanh tra, kiểm toán'], ['dn', 'Lợi ích người dân, doanh nghiệp'], ['cp', 'Tiết kiệm chi phí, nguồn lực']];
  function scoreOpts(c) {
    var sw = 0; CRIT.forEach(function (k) { sw += num(c.w[k[0]]); });
    var r = c.opts.map(function (o, i) {
      var t = 0; CRIT.forEach(function (k) { t += num(c.w[k[0]]) * num(o.s[k[0]]); });
      return { i: i, o: o, pt: sw ? t / (5 * sw) * 100 : 0 };
    });
    var best = r.slice().sort(function (a, b) { return b.pt - a.pt; })[0];
    return { r: r, best: best };
  }

  // =====================================================================
  // VĂN BẢN SINH TỰ ĐỘNG
  // =====================================================================
  function phieuTrinh(c) {
    var d = diag(c), a = analyze(c), sc = scoreOpts(c), b = sc.best, n = new Date();
    var L = [];
    L.push('SỞ ………………………………                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM');
    L.push((c.phu || 'PHÒNG ……').toUpperCase() + '                Độc lập - Tự do - Hạnh phúc');
    L.push('Số: ……/PTr-……                       ……, ngày ' + n.getDate() + ' tháng ' + (n.getMonth() + 1) + ' năm ' + n.getFullYear());
    L.push('');
    L.push('PHIẾU TRÌNH QUYẾT ĐỊNH');
    L.push('V/v: ' + c.ten + (c.ma ? ' (' + c.ma + ')' : ''));
    L.push('');
    L.push('Kính gửi: Giám đốc Sở');
    L.push('');
    L.push('1. Vấn đề cần quyết định');
    L.push('   ' + c.mota);
    L.push('   Phạm vi ảnh hưởng: ' + c.anh);
    L.push('   Giai đoạn: ' + stage(c.gd).ten + '. Nhóm dự án: ' + c.nhom + '. Giá trị: ' + fmt(num(c.gtri), 1) + ' tỷ đồng. Hồ sơ đã tồn ' + num(c.ton) + ' ngày.');
    L.push('');
    L.push('2. Thẩm quyền');
    L.push('   ' + ({ so: 'Thuộc thẩm quyền quyết định của Sở.', 'cap-tren': 'Vượt thẩm quyền của Sở; Sở tham mưu trình ' + (c.cq || 'cấp có thẩm quyền') + '.', 'chua-ro': 'Chưa xác định rõ; cần làm rõ trước khi quyết định (xem mục 3).' }[c.tq]));
    L.push('');
    L.push('3. Căn cứ và đánh giá pháp lý');
    L.push('   Quy định A: ' + nm(c.cf.a) + (c.cf.a.dk ? ' – ' + c.cf.a.dk : '') + '.');
    if (c.cf.a.nd) L.push('      Nội dung: ' + c.cf.a.nd);
    L.push('   Quy định B: ' + nm(c.cf.b) + (c.cf.b.dk ? ' – ' + c.cf.b.dk : '') + '.');
    if (c.cf.b.nd) L.push('      Nội dung: ' + c.cf.b.nd);
    L.push('   Tính chất vướng mắc: ' + CC.filter(function (x) { return x[0] === c.cc; })[0][1] + '.');
    a.st.forEach(function (s) { L.push('   - ' + s.t + ': ' + s.r); });
    L.push('   Kết luận sơ bộ: ' + a.ket);
    L.push('');
    L.push('4. Các phương án');
    sc.r.forEach(function (x) { L.push('   ' + x.o.ten + ' — điểm tổng hợp ' + fmt(x.pt) + '/100' + (x.o.tq ? '' : ' (cần trình cấp trên)')); if (x.o.mo) L.push('      ' + x.o.mo); });
    L.push('   Tiêu chí, trọng số: ' + CRIT.map(function (k) { return k[1] + ' ' + num(c.w[k[0]]); }).join('; ') + '.');
    L.push('');
    L.push('5. Rủi ro và kiểm soát');
    L.push('   Mức rủi ro: ' + d.muc + '. ' + d.ks);
    L.push('   Chẩn đoán điểm nghẽn: ' + d.hit.map(function (h) { return LOAI[h].ten; }).join('; ') + '.');
    L.push('');
    L.push('6. Kiến nghị');
    if (b) L.push('   Chọn ' + b.o.ten + (b.o.tq ? '.' : '; Sở hoàn thiện hồ sơ trình ' + (c.cq || 'cấp có thẩm quyền') + '.'));
    if (c.tach === 'co') L.push('   Tiếp tục xử lý phần hồ sơ không bị vướng: ' + c.anh);
    L.push('   Giao ' + (c.phu || '……') + ' chủ trì; mốc báo cáo: ' + dd(rel(d.han)) + '.');
    L.push('');
    L.push('Phụ lục: hồ sơ chuyên môn chi tiết, bảng so sánh quy định, ý kiến các phòng.');
    L.push('');
    L.push('Ý KIẾN CỦA GIÁM ĐỐC SỞ');
    L.push('   [ ] Đồng ý phương án kiến nghị     [ ] Chọn phương án khác: ……     [ ] Yêu cầu bổ sung: ……');
    return L.join('\n');
  }
  function congVan(c) {
    var a = analyze(c), sc = scoreOpts(c), b = sc.best, n = new Date();
    var L = [];
    L.push('SỞ ………………………………                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM');
    L.push('                                       Độc lập - Tự do - Hạnh phúc');
    L.push('Số: ……/S……-……                       ……, ngày ' + n.getDate() + ' tháng ' + (n.getMonth() + 1) + ' năm ' + n.getFullYear());
    L.push('V/v xin ý kiến về ' + c.ten.charAt(0).toLowerCase() + c.ten.slice(1));
    L.push('');
    L.push('Kính gửi: ' + (a.hoiCq || c.cq || '……………'));
    L.push('');
    L.push('1. Tình huống: ' + c.mota);
    L.push('');
    L.push('2. Quy định liên quan:');
    L.push('   a) ' + nm(c.cf.a) + (c.cf.a.dk ? ', ' + c.cf.a.dk : '') + (c.cf.a.nd ? ': "' + c.cf.a.nd + '"' : '') + ';');
    L.push('   b) ' + nm(c.cf.b) + (c.cf.b.dk ? ', ' + c.cf.b.dk : '') + (c.cf.b.nd ? ': "' + c.cf.b.nd + '"' : '') + '.');
    L.push('');
    L.push('3. Câu hỏi cụ thể: ' + (c.hoi || '……'));
    L.push('');
    L.push('4. Phương án Sở đề xuất: ' + (b ? b.o.ten + '. ' + (b.o.mo || '') : '……'));
    L.push('   Căn cứ đề xuất: ' + a.ket);
    if (c.tach === 'co') L.push('   Trong thời gian chờ ý kiến, Sở tiếp tục xử lý phần không bị vướng: ' + c.anh);
    L.push('');
    L.push('Đề nghị Quý cơ quan cho ý kiến trước ngày ' + dd(rel(15)) + ' để Sở kịp thời tổ chức thực hiện.');
    L.push('Đầu mối liên hệ: ' + (c.phu || '……') + '.');
    return L.join('\n');
  }

  // =====================================================================
  // CÁC MÀN HÌNH
  // =====================================================================
  var V = {};

  // ---------- Tổng quan ----------
  function stats() {
    var hs = S.hs, qh = 0, gan = 0, ld = 0, tuoi = 0;
    hs.forEach(function (h) { var k = daysTo(h.han); if (k !== null && k < 0) qh++; else if (k !== null && k <= 3) gan++; if (h.ld) ld++; var a = daysTo(h.nhan); tuoi += a === null ? 0 : -a; });
    var mo = S.reg.filter(function (r) { return r.tt !== 'Đã đóng'; }), vmqh = mo.filter(function (r) { var k = daysTo(r.han); return k !== null && k < 0; }).length;
    var kn = mo.filter(function (r) { return r.tq === 'cap-tren'; }).length;
    var tot = 0, done = 0; D.PLAN.forEach(function (p) { p.items.forEach(function (it) { tot++; if (S.plan[it[0]]) done++; }); });
    return { n: hs.length, qh: qh, gan: gan, ld: ld, tuoi: hs.length ? tuoi / hs.length : 0, mo: mo.length, vmqh: vmqh, kn: kn, plan: tot ? done / tot * 100 : 0 };
  }
  V['tong-quan'] = {
    title: 'Tổng quan',
    render: function () {
      var s = stats();
      var probs = [
        ['Quy định chồng chéo', 'Quản lý từng điểm vướng đến khi có hướng xử lý.', 'Điều khoản nào vướng, Sở quyết được phần nào, ai theo dõi?', 'vuong-mac', 'Sổ vướng mắc'],
        ['Tâm lý sợ sai', 'Phân biệt thiếu căn cứ, thiếu năng lực và né tránh.', 'Hồ sơ này kẹt vì luật, vì người hay vì không ai muốn ký?', 'quyet-dinh', 'Công cụ quyết định'],
        ['Quá tải sau tinh gọn', 'Giảm việc không cần thiết trước khi tăng chỉ tiêu.', 'Bao nhiêu giờ mỗi tháng đang dành cho họp, báo cáo trùng?', 'tai-viec', 'Tải công việc'],
        ['Chuyển đổi số', 'Bắt đầu từ điểm nghẽn của công việc.', 'Hồ sơ đang ở đâu, ai giữ, vì sao chậm?', 'ho-so', 'Bảng hồ sơ tồn'],
        ['Thanh tra, kỷ luật, dư luận', 'Đưa kiểm soát vào trước thời điểm quyết định.', 'Dự án nào cần kiểm tra trước?', 'kiem-soat', 'Kiểm soát rủi ro'],
        ['Đãi ngộ và giữ người', 'Kiến nghị bằng dữ liệu, cải thiện ngay môi trường làm việc.', 'Vị trí nào chỉ một người làm được?', 'tai-viec', 'Nhân sự kế cận']
      ];
      return '<header class="hero"><p class="eyebrow">Đầu tư công · Văn bản chồng chéo · Điều hành 90 ngày</p>' +
        '<h1>Cán bộ biết rõ mình được quyết việc gì, dựa trên căn cứ nào, khi vướng thì ai tháo gỡ và trong bao lâu.</h1>' +
        '<p class="lede">Bộ công cụ giúp lãnh đạo Sở chuyển yêu cầu "quyết liệt hơn" thành cơ chế cụ thể: chẩn đoán điểm nghẽn, phân tích quy định chồng chéo, chấm điểm phương án và lập phiếu trình có thể kiểm tra lại.</p>' +
        '<div class="row"><a class="btn primary" href="#quyet-dinh">Mở công cụ ra quyết định</a><a class="btn" href="#van-ban">Tra cứu văn bản đầu tư công</a></div></header>' +
        '<section class="tiles">' +
        tile('Hồ sơ tồn', s.n, s.qh + ' quá hạn · ' + s.gan + ' sắp đến hạn', s.qh ? 'crit' : 'ok', 'ho-so') +
        tile('Tuổi tồn bình quân', fmt(s.tuoi), 'ngày kể từ khi nhận', s.tuoi > 30 ? 'warn' : 'ok', 'ho-so') +
        tile('Vướng mắc đang mở', s.mo, s.vmqh + ' quá mốc báo cáo', s.vmqh ? 'crit' : 'ok', 'vuong-mac') +
        tile('Kiến nghị vượt thẩm quyền', s.kn, 'đang chờ cấp trên', s.kn ? 'warn' : 'ok', 'lo-trinh') +
        tile('Lộ trình 90 ngày', fmt(s.plan) + '%', 'việc đã hoàn thành', 'steel', 'lo-trinh') +
        '</section>' +
        '<section class="card"><h2>Ba việc làm ngay</h2><p class="muted">Những việc lãnh đạo Sở có thể bắt đầu mà không phải chờ giải quyết toàn bộ vấn đề thể chế.</p><ol class="three">' +
        '<li><b>Lập danh mục hồ sơ tồn có người chịu trách nhiệm.</b><span>' + s.n + ' hồ sơ, ' + S.hs.filter(function (h) { return !h.phu; }).length + ' hồ sơ chưa có người phụ trách.</span><a href="#ho-so">Mở bảng hồ sơ tồn →</a></li>' +
        '<li><b>Xử lý định kỳ vướng mắc pháp lý bằng phương án cụ thể.</b><span>' + S.reg.filter(function (r) { return r.tt !== 'Đã đóng' && !r.pa; }).length + ' vướng mắc đang mở chưa có phương án đề xuất.</span><a href="#vuong-mac">Mở sổ vướng mắc →</a></li>' +
        '<li><b>Cắt bỏ yêu cầu nội bộ trùng lặp.</b><span>Có thể giảm khoảng ' + fmt(taskCalc().save) + ' giờ-người mỗi tháng theo dữ liệu hiện có.</span><a href="#tai-viec">Mở rà soát tải công việc →</a></li></ol></section>' +
        '<section><h2 class="sec">Sáu nhóm vấn đề và công cụ tương ứng</h2><div class="grid3">' +
        probs.map(function (p, i) { return '<a class="prob" href="#' + p[3] + '"><span class="n">' + (i + 1) + '</span><h3>' + p[0] + '</h3><p>' + p[1] + '</p><p class="q">' + p[2] + '</p><span class="go">' + p[4] + ' →</span></a>'; }).join('') +
        '</div></section>' +
        '<section class="grid2">' +
        '<div class="card"><h3>Dùng AI trong công việc của Sở</h3><ul class="tight"><li>Bắt đầu với tài liệu công khai và việc hỗ trợ: dự thảo, tóm tắt.</li><li>Người có chuyên môn kiểm tra kết quả trước khi sử dụng.</li><li>Dữ liệu cá nhân, tài liệu nội bộ, tài liệu mật chỉ đưa lên công cụ trong môi trường được phép theo quy định.</li></ul></div>' +
        '<div class="card"><h3>Phạm vi của bộ công cụ</h3><ul class="tight"><li>Các giải pháp là đề xuất quản trị; khi áp dụng phải đối chiếu thẩm quyền, quy định chuyên ngành và phân cấp của địa phương.</li><li>Dữ liệu chỉ lưu trong trình duyệt của máy đang dùng, không gửi đi đâu.</li><li>Dữ liệu ban đầu là ví dụ minh họa, hư cấu.</li></ul></div></section>';
    }
  };
  function tile(l, v, s, k, href) { return '<a class="tile ' + k + '" href="#' + href + '"><span class="lbl">' + l + '</span><span class="val">' + v + '</span><span class="sub">' + s + '</span></a>'; }

  // ---------- Công cụ quyết định ----------
  var STEPS = ['Vấn đề', 'Chẩn đoán', 'Văn bản chồng chéo', 'Phương án', 'Phiếu trình'];
  V['quyet-dinh'] = {
    title: 'Công cụ ra quyết định',
    render: function () {
      var c = S.cs;
      var head = '<header class="vh"><p class="eyebrow">Công cụ ra quyết định</p><h1>' + e(c.ten || 'Hồ sơ cần quyết định') + '</h1>' +
        '<p class="muted">Năm bước từ mô tả vấn đề đến phiếu trình. Dữ liệu tự lưu. ' + (c.ma === 'DA-ĐX07' ? pill('Ví dụ minh họa', 'steel') : '') + '</p>' +
        '<div class="row"><button class="btn sm" data-act="newcase">Hồ sơ mới (để trống)</button><button class="btn sm" data-act="samplecase">Nạp lại ví dụ</button></div>' +
        '<nav class="stepper">' + STEPS.map(function (s, i) { return '<button data-act="step" data-s="' + (i + 1) + '" class="' + (c.step === i + 1 ? 'on' : '') + '"><b>' + (i + 1) + '</b>' + s + '</button>'; }).join('') + '</nav></header>';
      return head + '<div id="stepbody">' + this['s' + c.step]() + '</div>' +
        '<div class="row between nav2">' + (c.step > 1 ? '<button class="btn" data-act="step" data-s="' + (c.step - 1) + '">← ' + STEPS[c.step - 2] + '</button>' : '<span></span>') +
        (c.step < 5 ? '<button class="btn primary" data-act="step" data-s="' + (c.step + 1) + '">' + STEPS[c.step] + ' →</button>' : '') + '</div>';
    },
    s1: function () {
      return '<section class="card"><h2>1. Mô tả vấn đề</h2><div class="form">' +
        fld('Tên hồ sơ, công việc', inp('cs.ten'), '', 'w2') + fld('Mã hồ sơ', inp('cs.ma')) +
        fld('Giai đoạn dự án', sel('cs.gd', D.STAGES.map(function (s) { return [s.id, s.ten]; }))) +
        fld('Nhóm dự án', sel('cs.nhom', [['QTQG', 'Quan trọng quốc gia'], ['A', 'Nhóm A'], ['B', 'Nhóm B'], ['C', 'Nhóm C'], ['K', 'Không phải dự án']])) +
        fld('Giá trị liên quan (tỷ đồng)', inp('cs.gtri', 'number')) +
        fld('Đơn vị, người chủ trì', inp('cs.phu')) + fld('Hạn xử lý', inp('cs.han', 'date')) +
        fld('Cấp có thẩm quyền liên quan', inp('cs.cq'), 'Cơ quan sẽ nhận tờ trình hoặc công văn xin ý kiến') +
        fld('Mô tả vấn đề', txt('cs.mota', 4), 'Viết sự việc, không viết nhận xét', 'w3') +
        fld('Phần công việc bị ảnh hưởng và phần có thể tiếp tục', txt('cs.anh', 2), '', 'w3') +
        '</div></section>';
    },
    s2: function () {
      return '<section class="split"><div class="card"><h2>2. Chẩn đoán điểm nghẽn</h2>' +
        '<div class="q"><p>Việc quyết định thuộc thẩm quyền của ai?</p>' + seg('cs.tq', [['so', 'Của Sở'], ['cap-tren', 'Của cấp trên'], ['chua-ro', 'Chưa rõ']]) + '</div>' +
        '<div class="q"><p>Căn cứ pháp lý hiện ở tình trạng nào?</p>' + seg('cs.cc', CC) + '</div>' +
        '<div class="q"><p>Người thụ lý đã đủ kinh nghiệm với loại việc này?</p>' + seg('cs.nl', [['du', 'Đủ'], ['chua', 'Chưa đủ']]) + '</div>' +
        '<div class="q"><p>Đã có phương án đề xuất bằng văn bản?</p>' + seg('cs.pa', [['co', 'Có'], ['khong', 'Chưa']]) + '</div>' +
        '<div class="q"><p>Có phần hồ sơ độc lập, có thể xử lý tiếp?</p>' + seg('cs.tach', [['co', 'Có'], ['khong', 'Không']]) + '</div>' +
        '<div class="q"><p>Là đề xuất đổi mới, sáng tạo chưa có quy định?</p>' + seg('cs.dm', [['co', 'Có'], ['khong', 'Không']]) + '</div>' +
        '<div class="q"><p>Số ngày hồ sơ đã tồn</p>' + inp('cs.ton', 'number', ' class="short"') + '</div>' +
        '<div class="q"><p>Dấu hiệu rủi ro</p><div class="chks">' + chk('cs.rr.lon', 'Giá trị lớn') + chk('cs.rr.dc', 'Điều chỉnh nhiều lần') + chk('cs.rr.kn', 'Khiếu nại, phản ánh lặp lại') + chk('cs.rr.bt', 'Dấu hiệu bất thường') + '</div></div>' +
        '</div><aside id="out-diag" class="out">' + diagOut() + '</aside></section>';
    },
    s3: function () {
      var lawOpts = [['', '— Văn bản khác (nhập tay) —']].concat(D.LAWS.map(function (l) { return [l.id, l.loai + ' ' + l.so]; }));
      function side(k, lbl) {
        var b = 'cs.cf.' + k + '.';
        return '<div class="prov"><h3>' + lbl + '</h3>' +
          fld('Chọn từ thư viện', sel(b + 'van', lawOpts, true)) +
          '<div class="form f2">' + fld('Loại văn bản', sel(b + 'cap', D.CAP.map(function (x) { return [x.id, x.ten]; }))) +
          fld('Cơ quan ban hành', inp(b + 'cq')) + fld('Ngày ban hành', inp(b + 'ngay', 'date')) +
          fld('Tình trạng hiệu lực', sel(b + 'hl', HL)) + fld('Phạm vi', sel(b + 'pv', [['chung', 'Quy định chung'], ['chuyen', 'Quy định chuyên ngành, đặc thù']])) + '</div>' +
          fld('Điều, khoản', inp(b + 'dk')) + fld('Nội dung quy định (trích)', txt(b + 'nd', 3)) + '</div>';
      }
      return '<section class="card"><h2>3. Phân tích văn bản chồng chéo</h2><p class="muted">Nhập hai quy định đang được hiểu hoặc áp dụng khác nhau. Công cụ đi lần lượt qua: hiệu lực → tính chất văn bản → thứ bậc → cơ quan ban hành → chuyển tiếp, rồi cho biết Sở có tự áp dụng được không.</p>' +
        fld('Tính chất vướng mắc', seg('cs.cc', CC)) +
        '<div class="two">' + side('a', 'Quy định A') + side('b', 'Quy định B') + '</div>' +
        chk('cs.cf.tn', 'Nội dung liên quan đến trách nhiệm pháp lý, xử lý vi phạm') + '</section>' +
        '<section id="out-cf">' + cfOut() + '</section>' +
        '<section class="card"><h3>Câu hỏi cụ thể gửi cấp có thẩm quyền</h3><p class="muted">Tránh "đề nghị hướng dẫn giải quyết". Một câu hỏi trả lời được bằng một quyết định.</p>' + txt('cs.hoi', 3) + '</section>';
    },
    s4: function () {
      var c = S.cs;
      return '<section class="card"><h2>4. So sánh phương án</h2><p class="muted">Chấm 1–5 cho mỗi tiêu chí (5 là tốt nhất). Trọng số phản ánh ưu tiên của lãnh đạo Sở.</p>' +
        '<div class="wts">' + CRIT.map(function (k) { return fld(k[1], inp('cs.w.' + k[0], 'number', ' min="0" max="100"'), '', 'wt'); }).join('') + '</div>' +
        c.opts.map(function (o, i) {
          return '<div class="opt"><div class="opth">' + inp('cs.opts.' + i + '.ten') + '<button class="btn sm ghost" data-act="delopt" data-i="' + i + '" aria-label="Xóa phương án">Xóa</button></div>' +
            fld('Mô tả ngắn', inp('cs.opts.' + i + '.mo')) + chk('cs.opts.' + i + '.tq', 'Thuộc thẩm quyền của Sở') +
            '<div class="sc">' + CRIT.map(function (k) { return '<label class="rng"><span>' + k[1] + '</span><input type="range" min="1" max="5" step="1" data-n="1" id="f-cs-opts-' + i + '-s-' + k[0] + '" data-b="cs.opts.' + i + '.s.' + k[0] + '" value="' + num(o.s[k[0]]) + '"><output id="o-' + i + '-' + k[0] + '">' + num(o.s[k[0]]) + '</output></label>'; }).join('') + '</div></div>';
        }).join('') +
        '<button class="btn" data-act="addopt">+ Thêm phương án</button></section><section id="out-opt">' + optOut() + '</section>';
    },
    s5: function () {
      var c = S.cs, a = analyze(c);
      return '<section class="card"><div class="row between"><h2>5. Phiếu trình quyết định</h2><div class="row">' + copyBtn('doc-pt', 'Sao chép phiếu trình') + '<button class="btn" data-act="toreg">Ghi vào sổ vướng mắc</button></div></div>' +
        '<p class="muted">Ngắn gọn: vấn đề, thẩm quyền, căn cứ, phương án, rủi ro, kiến nghị. Tài liệu chuyên môn chi tiết để ở phụ lục.</p>' +
        '<pre class="paper" id="doc-pt">' + e(phieuTrinh(c)) + '</pre></section>' +
        '<section class="card"><div class="row between"><h2>Công văn xin ý kiến</h2>' + copyBtn('doc-cv', 'Sao chép công văn') + '</div>' +
        '<p class="muted">' + (a.muc === 'xin-y-kien' ? 'Phân tích ở Bước 3 cho thấy cần xin ý kiến cấp trên.' : 'Chỉ dùng khi pháp chế Sở không kết luận được.') + '</p>' +
        '<pre class="paper" id="doc-cv">' + e(congVan(c)) + '</pre></section>';
    },
    update: function () {
      var x;
      if ((x = document.getElementById('out-diag'))) x.innerHTML = diagOut();
      if ((x = document.getElementById('out-cf'))) x.innerHTML = cfOut();
      if ((x = document.getElementById('out-opt'))) x.innerHTML = optOut();
      document.querySelectorAll('output[id^="o-"]').forEach(function (o) { var p = o.id.split('-'); o.textContent = num(S.cs.opts[p[1]] && S.cs.opts[p[1]].s[p[2]]); });
      var h = document.querySelector('.vh h1'); if (h) h.textContent = S.cs.ten || 'Hồ sơ cần quyết định';
    }
  };
  function diagOut() {
    var c = S.cs, d = diag(c);
    return '<p class="eyebrow">Kết quả chẩn đoán</p><h3 class="k-' + d.chinh.k + '">' + d.chinh.ten + '</h3>' +
      (d.hit.length > 1 ? '<p class="muted">Đồng thời: ' + d.hit.slice(1).map(function (h) { return LOAI[h].ten.toLowerCase(); }).join('; ') + '.</p>' : '') +
      '<h4>Lãnh đạo Sở nên làm</h4><ol class="tight">' + d.chinh.lam.map(function (l) { return '<li>' + l + '</li>'; }).join('') + '</ol>' +
      (c.tach === 'co' ? '<p class="note ok">Có phần hồ sơ độc lập: xem xét tiếp tục xử lý phần này theo quy định.</p>' : '') +
      (c.dm === 'co' ? '<p class="note warn">Đề xuất đổi mới, sáng tạo: thực hiện đúng quy trình tại Nghị định 73/2023/NĐ-CP. Lời hứa "lãnh đạo chịu trách nhiệm" không thay thế quy trình này.</p>' : '') +
      '<dl class="kv"><dt>Mức rủi ro</dt><dd>' + pill(d.muc, d.muc === 'cao' ? 'crit' : d.muc === 'thấp' ? 'ok' : 'warn') + ' ' + d.rs + ' điểm</dd>' +
      '<dt>Kiểm soát</dt><dd>' + d.ks + '</dd><dt>Mốc xử lý đề xuất</dt><dd>' + d.han + ' ngày, đến ' + dd(rel(d.han)) + '<br><small class="muted">Mốc nội bộ, điều chỉnh theo quy chế làm việc của Sở.</small></dd></dl>' +
      (d.hit.indexOf('cc') >= 0 ? '<button class="btn primary sm" data-act="step" data-s="3">Phân tích văn bản chồng chéo →</button>' : '');
  }
  function cfOut() {
    var a = analyze(S.cs), m = MUC[a.muc];
    return '<div class="card verdict"><div class="row between"><h3>Kết luận sơ bộ</h3>' + pill(m[0], m[1]) + '</div><p class="big">' + e(a.ket) + '</p>' +
      '<ol class="trace">' + a.st.map(function (s) { return '<li class="' + s.k + '"><b>' + s.t + '</b><span>' + e(s.r) + '</span></li>'; }).join('') + '</ol>' +
      '<p class="muted small">Công cụ áp dụng các nguyên tắc chung về áp dụng văn bản quy phạm pháp luật để định hướng. Kết luận cuối cùng do pháp chế và người có thẩm quyền đưa ra.</p></div>';
  }
  function optOut() {
    var c = S.cs, sc = scoreOpts(c), weak = c.opts.filter(function (o) { return num(o.s.cc) <= 2; });
    if (!c.opts.length) return '<div class="card"><p class="muted">Chưa có phương án. Thêm ít nhất hai phương án để so sánh.</p></div>';
    return '<div class="card"><h3>Xếp hạng</h3>' + sc.r.slice().sort(function (a, b) { return b.pt - a.pt; }).map(function (x, i) {
      return '<div class="bar' + (i === 0 ? ' top' : '') + '"><span class="bl">' + e(x.o.ten) + (x.o.tq ? '' : ' ' + pill('trình cấp trên', 'steel')) + '</span><span class="track"><i style="width:' + x.pt.toFixed(1) + '%"></i></span><b>' + fmt(x.pt) + '</b></div>';
    }).join('') +
      (sc.best ? '<p class="note ok">Kiến nghị: <b>' + e(sc.best.o.ten) + '</b>' + (sc.best.o.tq ? '' : ', Sở hoàn thiện hồ sơ trình ' + e(c.cq || 'cấp có thẩm quyền')) + '.</p>' : '') +
      (weak.length ? '<p class="note warn">Có phương án chấm căn cứ pháp lý từ 2 trở xuống. Không chọn phương án đó chỉ vì tiến độ.</p>' : '') + '</div>';
  }

  // ---------- Sổ vướng mắc ----------
  var regFilter = 'mo';
  V['vuong-mac'] = {
    title: 'Sổ theo dõi vướng mắc pháp lý',
    render: function () {
      var list = S.reg.map(function (r, i) { return { r: r, i: i }; }).filter(function (x) { return regFilter === 'all' ? true : regFilter === 'mo' ? x.r.tt !== 'Đã đóng' : x.r.tq === 'cap-tren' && x.r.tt !== 'Đã đóng'; });
      var cnt = {}; D.TT_VM.forEach(function (t) { cnt[t] = 0; }); S.reg.forEach(function (r) { cnt[r.tt] = (cnt[r.tt] || 0) + 1; });
      return '<header class="vh"><p class="eyebrow">Quy định chồng chéo</p><h1>Sổ theo dõi vướng mắc pháp lý</h1>' +
        '<p class="muted">Mỗi vướng mắc được theo dõi đến khi có hướng xử lý. Dùng thay cho công văn chung chung "đề nghị hướng dẫn giải quyết".</p></header>' +
        '<div class="pipeline">' + D.TT_VM.map(function (t) { return '<div><b>' + cnt[t] + '</b><span>' + t + '</span></div>'; }).join('') + '</div>' +
        '<div class="row between"><div class="seg">' + [['mo', 'Đang mở'], ['tren', 'Cần cấp trên'], ['all', 'Tất cả']].map(function (f) { return '<button class="' + (regFilter === f[0] ? 'on' : '') + '" data-act="regf" data-f="' + f[0] + '">' + f[1] + '</button>'; }).join('') + '</div>' +
        '<div class="row"><button class="btn" data-act="copyreg">Sao chép bảng (dán vào Excel)</button><button class="btn primary" data-act="addreg">+ Thêm vướng mắc</button></div></div>' +
        (list.length ? list.map(function (x) { return regCard(x.r, x.i); }).join('') : '<div class="card empty">Không có vướng mắc nào trong bộ lọc này.</div>');
    }
  };
  function regCard(r, i) {
    var k = daysTo(r.han), closed = r.tt === 'Đã đóng', st = closed ? 'done' : k !== null && k < 0 ? 'crit' : k !== null && k <= 3 ? 'warn' : 'ok';
    var b = 'reg.' + i + '.';
    return '<article class="vm ' + st + '"><div class="vmh"><b class="id">' + e(r.id) + '</b>' + inp(b + 'hs') +
      (closed ? pill('Đã đóng', 'muted') : k === null ? '' : k < 0 ? pill('Quá mốc ' + (-k) + ' ngày', 'crit') : pill('Còn ' + k + ' ngày', st)) + '</div>' +
      '<div class="form f3">' +
      fld('Điều khoản có cách hiểu khác nhau hoặc mâu thuẫn', txt(b + 'dk', 2), '', 'w3') +
      fld('Phần Sở quyết định trong thẩm quyền', txt(b + 'so', 2)) + fld('Nội dung cần cấp có thẩm quyền', txt(b + 'cap', 2)) + fld('Phương án đề xuất kèm căn cứ', txt(b + 'pa', 2)) +
      fld('Cơ quan cần xin ý kiến', inp(b + 'cq')) + fld('Người theo dõi', inp(b + 'phu')) + fld('Mốc báo cáo tiến độ', inp(b + 'han', 'date')) +
      fld('Trạng thái', sel(b + 'tt', D.TT_VM, true)) + fld('Thẩm quyền xử lý', sel(b + 'tq', [['so', 'Trong thẩm quyền Sở'], ['cap-tren', 'Vượt thẩm quyền']], true)) +
      '<div class="fld end"><button class="btn sm ghost" data-act="delreg" data-i="' + i + '">Xóa vướng mắc</button></div></div></article>';
  }

  // ---------- Hồ sơ tồn ----------
  V['ho-so'] = {
    title: 'Bảng theo dõi hồ sơ tồn',
    render: function () {
      var s = stats(), by = {}; D.LYDO.forEach(function (l) { by[l] = 0; }); S.hs.forEach(function (h) { by[h.ly] = (by[h.ly] || 0) + 1; });
      var mx = Math.max.apply(null, D.LYDO.map(function (l) { return by[l]; }).concat([1]));
      var ppl = {}; S.hs.forEach(function (h) { var n = h.phu || '(chưa giao)'; ppl[n] = (ppl[n] || 0) + 1; });
      var rows = S.hs.map(function (h, i) { return { h: h, i: i, k: daysTo(h.han) }; }).sort(function (a, b) { return (a.k === null ? 999 : a.k) - (b.k === null ? 999 : b.k); });
      return '<header class="vh"><p class="eyebrow">Ba việc làm ngay · Việc 1</p><h1>Bảng theo dõi hồ sơ tồn</h1>' +
        '<p class="muted">Lãnh đạo Sở xem trên một bảng: hồ sơ ở đâu, ai phụ trách, hồ sơ nào gần hạn hoặc quá hạn, vì sao chậm, việc nào cần lãnh đạo quyết.</p></header>' +
        '<section class="tiles sm">' + tile('Tổng hồ sơ tồn', s.n, 'đang theo dõi', 'steel', 'ho-so') + tile('Quá hạn', s.qh, 'cần xử lý ngay', s.qh ? 'crit' : 'ok', 'ho-so') + tile('Đến hạn trong 3 ngày', s.gan, 'cần đôn đốc', s.gan ? 'warn' : 'ok', 'ho-so') + tile('Cần lãnh đạo quyết', s.ld, 'đưa vào phiếu trình', s.ld ? 'warn' : 'ok', 'quyet-dinh') + '</section>' +
        '<section class="grid2"><div class="card"><h3>Vì sao chậm</h3>' + D.LYDO.map(function (l) { return '<div class="bar"><span class="bl">' + l + '</span><span class="track"><i style="width:' + (by[l] / mx * 100) + '%"></i></span><b>' + by[l] + '</b></div>'; }).join('') + '</div>' +
        '<div class="card"><h3>Hồ sơ theo người phụ trách</h3>' + Object.keys(ppl).sort(function (a, b) { return ppl[b] - ppl[a]; }).map(function (p) { return '<div class="bar"><span class="bl">' + e(p) + '</span><span class="track"><i style="width:' + (ppl[p] / S.hs.length * 100) + '%"></i></span><b>' + ppl[p] + '</b></div>'; }).join('') +
        '<p class="muted small">Một người giữ nhiều hồ sơ phức tạp là dấu hiệu phụ thuộc vào cá nhân. Xem thêm tại Tải công việc.</p></div></section>' +
        '<div class="row between"><h2 class="sec">Danh mục hồ sơ</h2><div class="row"><button class="btn" data-act="copyhs">Sao chép bảng</button><button class="btn primary" data-act="addhs">+ Thêm hồ sơ</button></div></div>' +
        '<div class="tbl"><table><thead><tr><th>Tình trạng</th><th>Mã</th><th>Tên hồ sơ</th><th>Phụ trách</th><th>Bước hiện tại</th><th>Ngày nhận</th><th>Hạn</th><th>Lý do chậm</th><th>Bước tiếp theo</th><th>Vướng mắc</th><th>Cần LĐ quyết</th><th></th></tr></thead><tbody>' +
        rows.map(function (x) {
          var h = x.h, k = x.k, b = 'hs.' + x.i + '.', tuoi = daysTo(h.nhan);
          var tt = k === null ? pill('Chưa có hạn', 'muted') : k < 0 ? pill('Quá ' + (-k) + ' ngày', 'crit') : k <= 3 ? pill('Còn ' + k + ' ngày', 'warn') : pill('Còn ' + k + ' ngày', 'ok');
          return '<tr><td>' + tt + (tuoi !== null ? '<small class="muted block">tồn ' + (-tuoi) + ' ngày</small>' : '') + '</td><td>' + inp(b + 'ma', 'text', ' class="w6"') + '</td><td>' + inp(b + 'ten', 'text', ' class="w16"') + '</td><td>' + inp(b + 'phu', 'text', ' class="w10"') + '</td><td>' + inp(b + 'buoc', 'text', ' class="w12"') +
            '</td><td>' + inp(b + 'nhan', 'date') + '</td><td>' + inp(b + 'han', 'date', ' data-rr="1"') + '</td><td>' + sel(b + 'ly', D.LYDO, true) + '</td><td>' + inp(b + 'next', 'text', ' class="w14"') + '</td><td>' +
            (h.vm ? '<a href="#vuong-mac">' + e(h.vm) + '</a>' : '<span class="muted">—</span>') + '</td><td class="c"><input type="checkbox" aria-label="Cần lãnh đạo quyết" id="f-hs-' + x.i + '-ld" data-b="' + b + 'ld" data-rr="1"' + (h.ld ? ' checked' : '') + '></td><td><button class="btn sm ghost" data-act="delhs" data-i="' + x.i + '" aria-label="Xóa hồ sơ">×</button></td></tr>';
        }).join('') + '</tbody></table></div>';
    }
  };

  // ---------- Văn bản đầu tư công ----------
  var lawF = { q: '', g: '', s: '' };
  V['van-ban'] = {
    title: 'Văn bản đầu tư công',
    render: function () {
      var picked = {}, notes = [], loc = [];
      D.BASE.forEach(function (id) { picked[id] = 1; });
      D.FLAGS.forEach(function (f) { if (S.flags[f.id]) { f.add.forEach(function (id) { picked[id] = 1; }); if (f.local) loc.push(f.local); if (f.note) notes.push(f.note); } });
      return '<header class="vh"><p class="eyebrow">Đầu tư công</p><h1>Văn bản đầu tư công</h1>' +
        '<p class="muted">Danh mục văn bản trung ương cốt lõi, có cập nhật năm 2026, sắp theo giai đoạn dự án. Văn bản gốc phải đọc cùng các sửa đổi và quy định chuyển tiếp.</p>' +
        '<p class="note warn">Đây chưa phải toàn bộ: chưa gồm văn bản chuyên ngành, cơ chế đặc thù từng dự án, quyết định giao vốn hằng năm và văn bản của địa phương. Kiểm tra hiệu lực tại <a href="https://congbao.chinhphu.vn" target="_blank" rel="noopener">Công báo</a> và <a href="https://vbpl.vn" target="_blank" rel="noopener">Cơ sở dữ liệu quốc gia về pháp luật</a> trước khi viện dẫn.</p></header>' +
        '<section class="card"><h2>Văn bản theo vòng đời dự án</h2><div class="life">' + D.STAGES.map(function (s, i) {
          var n = D.LAWS.filter(function (l) { return l.gd.indexOf(s.id) >= 0; }).length;
          return '<button data-act="stage" data-s="' + s.id + '" class="' + (lawF.s === s.id ? 'on' : '') + '"><small>' + (i + 1) + '</small>' + s.ten + '<em>' + n + ' văn bản</em></button>';
        }).join('') + '</div></section>' +
        '<section class="card"><h2>Chuỗi sửa đổi phải đọc cùng nhau</h2><div class="chains">' + D.CHAINS.map(function (ch) {
          return '<div class="chain"><h4>' + ch.ten + '</h4><div class="links">' + ch.buoc.map(function (id) { var l = law(id); return '<span class="doc">' + l.so + '<small>' + l.ngay + '</small></span>'; }).join('<span class="arr">→</span>') + '</div>' + (ch.ghi ? '<small class="muted">' + ch.ghi + '</small>' : '') + '</div>';
        }).join('') + '</div></section>' +
        '<section><div class="row between"><h2 class="sec">Danh mục</h2><div class="row filt">' +
        '<input type="search" id="lawq" placeholder="Tìm số hiệu, nội dung…" value="' + e(lawF.q) + '">' +
        '<select id="lawg"><option value="">Tất cả nhóm</option>' + D.GROUPS.map(function (g) { return '<option value="' + g.id + '"' + (lawF.g === g.id ? ' selected' : '') + '>' + g.ten + '</option>'; }).join('') + '</select>' +
        (lawF.s ? '<button class="btn sm" data-act="stage" data-s="">Bỏ lọc giai đoạn: ' + stage(lawF.s).ten + ' ×</button>' : '') + '</div></div>' +
        '<div id="lawlist">' + lawList() + '</div></section>' +
        '<section class="grid2"><div class="card"><h2>Bộ văn bản cho dự án của tôi</h2><p class="muted">Đánh dấu đặc điểm dự án. Bộ cơ bản luôn gồm ' + D.BASE.length + ' văn bản về đầu tư công, ngân sách, thanh toán, quyết toán, giám sát.</p>' +
        '<div class="chks col">' + D.FLAGS.map(function (f) { return chk('flags.' + f.id, f.ten, true); }).join('') + '</div></div>' +
        '<div class="card"><div class="row between"><h3>' + Object.keys(picked).length + ' văn bản trung ương cần tra cứu</h3>' + copyBtn('kit', 'Sao chép') + '</div><ol class="tight kit" id="kit">' +
        D.LAWS.filter(function (l) { return picked[l.id]; }).map(function (l) { return '<li>' + l.loai + ' ' + l.so + (l.qh ? ' <small class="muted">— ' + l.qh + '</small>' : '') + '</li>'; }).join('') +
        D.LOCAL.concat(loc).map(function (t) { return '<li class="loc">[Địa phương] ' + t + '</li>'; }).join('') + '</ol>' +
        notes.map(function (n) { return '<p class="note warn">' + n + '</p>'; }).join('') +
        '<p class="muted small">Tùy dự án còn rà soát pháp luật về ' + D.CHUYEN_NGANH.join(', ') + ', và cơ chế của từng chương trình mục tiêu quốc gia.</p></div></section>';
    }
  };
  function lawList() {
    var q = lawF.q.trim().toLowerCase();
    var L = D.LAWS.filter(function (l) { return (!lawF.g || l.nhom === lawF.g) && (!lawF.s || l.gd.indexOf(lawF.s) >= 0) && (!q || (l.so + ' ' + l.loai + ' ' + l.nd + ' ' + l.qh).toLowerCase().indexOf(q) >= 0); });
    if (!L.length) return '<div class="card empty">Không có văn bản phù hợp bộ lọc.</div>';
    return D.GROUPS.map(function (g) {
      var ls = L.filter(function (l) { return l.nhom === g.id; });
      if (!ls.length) return '';
      return '<h3 class="grp">' + g.ten + '</h3><div class="laws">' + ls.map(function (l) {
        return '<article class="law"><div class="lh"><b>' + l.so + '</b>' + pill(capOf(l.cap).ten.split(',')[0], 'steel') + '</div><h4>' + l.loai + '</h4><p>' + l.nd + '</p>' +
          '<small class="muted">Ban hành ' + l.ngay + (l.hl ? ' · ' + l.hl : '') + '</small>' + (l.qh ? '<p class="rel">' + l.qh + '</p>' : '') +
          '<div class="tags">' + l.gd.map(function (s) { return '<span>' + stage(s).ten + '</span>'; }).join('') + '</div></article>';
      }).join('') + '</div>';
    }).join('');
  }

  // ---------- Kiểm soát rủi ro ----------
  function projRisk(p) { return Math.min(num(p.gt) / 50, 3) + Math.min(num(p.dc), 4) + num(p.kn) * 1.5 + (num(p.gn) < 30 ? 2 : num(p.gn) < 60 ? 1 : 0) + (p.bt ? 4 : 0); }
  V['kiem-soat'] = {
    title: 'Kiểm soát rủi ro',
    render: function () {
      var rows = S.proj.map(function (p, i) { return { p: p, i: i, r: projRisk(p) }; }).sort(function (a, b) { return b.r - a.r; });
      return '<header class="vh"><p class="eyebrow">Thanh tra, kỷ luật, dư luận</p><h1>Kiểm soát rủi ro trước thời điểm quyết định</h1>' +
        '<p class="muted">Đặt điểm kiểm soát ở khâu dễ phát sinh sai phạm. Tập trung kiểm tra dự án giá trị lớn, nhiều điều chỉnh, khiếu nại lặp lại hoặc có dấu hiệu bất thường.</p></header>' +
        '<section><div class="row between"><h2 class="sec">Sàng lọc dự án cần kiểm tra trước</h2><button class="btn primary" data-act="addproj">+ Thêm dự án</button></div>' +
        '<div class="tbl"><table><thead><tr><th>Ưu tiên</th><th>Dự án</th><th>Giá trị (tỷ đồng)</th><th>Số lần điều chỉnh</th><th>Khiếu nại, phản ánh</th><th>Giải ngân (%)</th><th>Bất thường</th><th>Điểm</th><th></th></tr></thead><tbody>' +
        rows.map(function (x) {
          var b = 'proj.' + x.i + '.', k = x.r >= 7 ? ['Kiểm tra trước', 'crit'] : x.r >= 4 ? ['Theo dõi', 'warn'] : ['Thường xuyên', 'ok'];
          return '<tr><td>' + pill(k[0], k[1]) + '</td><td>' + inp(b + 'ten', 'text', ' class="w16"') + '</td><td>' + inp(b + 'gt', 'number', ' class="w5" data-rr="1"') + '</td><td>' + inp(b + 'dc', 'number', ' class="w4" data-rr="1"') + '</td><td>' + inp(b + 'kn', 'number', ' class="w4" data-rr="1"') + '</td><td>' + inp(b + 'gn', 'number', ' class="w4" data-rr="1"') +
            '</td><td class="c"><input type="checkbox" aria-label="Bất thường" id="f-proj-' + x.i + '-bt" data-b="' + b + 'bt" data-rr="1"' + (x.p.bt ? ' checked' : '') + '></td><td class="num"><b>' + fmt(x.r, 1) + '</b></td><td><button class="btn sm ghost" data-act="delproj" data-i="' + x.i + '" aria-label="Xóa dự án">×</button></td></tr>';
        }).join('') + '</tbody></table></div>' +
        '<p class="muted small">Cách tính: giá trị (tối đa 3 điểm, 50 tỷ = 1 điểm) + số lần điều chỉnh (tối đa 4) + 1,5 × số khiếu nại + giải ngân dưới 30% (2 điểm) hoặc dưới 60% (1 điểm) + bất thường (4 điểm). Từ 7 điểm: kiểm tra trước. Ngưỡng là đề xuất, điều chỉnh theo thực tế Sở. Nhập số liệu khi rời ô sẽ cập nhật xếp hạng.</p></section>' +
        '<section><h2 class="sec">Ma trận điểm kiểm soát</h2><div class="tbl"><table class="ctl"><thead><tr><th>Khâu</th><th>Nội dung kiểm soát</th><th>Dấu hiệu cần kiểm tra kỹ</th><th>Người lập</th><th>Người kiểm tra</th><th>Người phê duyệt</th></tr></thead><tbody>' +
        D.CONTROL.map(function (r) { return '<tr><th>' + r.khau + '</th><td>' + r.kiem + '</td><td>' + r.dau + '</td><td>' + r.lap + '</td><td>' + r.kt + '</td><td>' + r.pd + '</td></tr>'; }).join('') +
        '</tbody></table></div><p class="muted small">Phân công người lập, kiểm tra, phê duyệt theo quy định; ba vai trò không do một người đảm nhiệm. Theo dõi việc khắc phục đến khi hoàn thành.</p></section>' +
        '<section class="grid2"><div class="card"><h3>Công khai với người dân, doanh nghiệp</h3><ul class="tight"><li>Tiến độ xử lý hồ sơ, lý do chậm và đầu mối xử lý, trong phạm vi được phép.</li><li>Khi có phản ánh: xác minh, cung cấp thông tin nhất quán, có căn cứ.</li><li>Không để vụ việc kéo dài không có phản hồi.</li></ul></div>' +
        '<div class="card"><h3>Trước khi ký, kiểm tra năm câu</h3><ol class="tight"><li>Việc này có thuộc thẩm quyền của người ký?</li><li>Căn cứ còn hiệu lực, đã đọc cùng văn bản sửa đổi?</li><li>Người lập và người kiểm tra là hai người khác nhau?</li><li>Phương án bị loại có được ghi lý do?</li><li>Hồ sơ có lưu đủ để người khác kiểm tra lại?</li></ol></div></section>';
    }
  };

  // ---------- Tải công việc & nhân sự ----------
  var RATE = { 'Giữ': 0, 'Hợp nhất': 0.7, 'Bỏ': 1, 'Nguồn dữ liệu chung': 0.8, 'Rút gọn': 0.5, 'Ủy quyền': 0.6 };
  function taskCalc() { var tot = 0, sv = 0; S.tasks.forEach(function (t) { var h = num(t.lan) * num(t.gio) * num(t.ng); tot += h; sv += h * (t.tq ? (RATE[t.de] || 0) : 0); }); return { tot: tot, save: sv }; }
  function staffCalc() {
    var L = S.staff.map(function (s) { return num(s.d) + 2 * num(s.tb) + 4 * num(s.pt); }), avg = L.length ? L.reduce(function (a, b) { return a + b; }, 0) / L.length : 0;
    return { L: L, avg: avg };
  }
  V['tai-viec'] = {
    title: 'Tải công việc và nhân sự',
    render: function () {
      var tc = taskCalc(), sc = staffCalc(), mxL = Math.max.apply(null, sc.L.concat([1]));
      var pr = S.proc, mS = Math.max.apply(null, pr.map(function (p) { return num(p.sl); }).concat([1])), mB = Math.max.apply(null, pr.map(function (p) { return num(p.bs); }).concat([1])), mT = Math.max.apply(null, pr.map(function (p) { return num(p.tre); }).concat([1]));
      var prs = pr.map(function (p, i) { return { p: p, i: i, d: num(p.sl) / mS * 40 + num(p.bs) / mB * 30 + num(p.tre) / mT * 30 }; }).sort(function (a, b) { return b.d - a.d; });
      var spof = S.staff.filter(function (s) { return !s.thay && num(s.pt) > 0; });
      var ot = S.staff.reduce(function (a, s) { return a + num(s.ot); }, 0);
      return '<header class="vh"><p class="eyebrow">Quá tải sau tinh gọn · Đãi ngộ và giữ người</p><h1>Tải công việc và nhân sự</h1>' +
        '<p class="muted">Giảm việc không cần thiết trước khi tăng chỉ tiêu. Không lấy việc cán bộ thường xuyên làm ngoài giờ làm bằng chứng rằng biên chế hiện tại đã đủ.</p></header>' +
        '<section class="tiles sm">' + tile('Giờ-người mỗi tháng', fmt(tc.tot), 'cho họp, báo cáo, nhập liệu, luân chuyển', 'steel', 'tai-viec') + tile('Có thể giảm', fmt(tc.save), 'giờ-người/tháng trong thẩm quyền Sở', 'ok', 'tai-viec') +
        tile('Làm ngoài giờ', fmt(ot), 'giờ/tháng toàn bộ phận', ot > 60 ? 'warn' : 'ok', 'tai-viec') + tile('Vị trí phụ thuộc một người', spof.length, 'chưa có người thay thế', spof.length ? 'crit' : 'ok', 'tai-viec') + '</section>' +
        '<section><div class="row between"><h2 class="sec">Rà soát đầu việc chiếm nhiều thời gian</h2><button class="btn primary" data-act="addtask">+ Thêm đầu việc</button></div>' +
        '<div class="tbl"><table><thead><tr><th>Đầu việc</th><th>Loại</th><th>Lần/tháng</th><th>Giờ/lần</th><th>Số người</th><th>Giờ-người/tháng</th><th>Sở tự quyết?</th><th>Trùng với</th><th>Đề xuất</th><th>Giảm được</th><th></th></tr></thead><tbody>' +
        S.tasks.map(function (t, i) {
          var b = 'tasks.' + i + '.', h = num(t.lan) * num(t.gio) * num(t.ng), sv = h * (t.tq ? (RATE[t.de] || 0) : 0);
          return '<tr><td>' + inp(b + 'ten', 'text', ' class="w16"') + '</td><td>' + sel(b + 'loai', ['Họp', 'Báo cáo', 'Nhập liệu', 'Luân chuyển hồ sơ', 'Xin ý kiến nội bộ']) + '</td><td>' + inp(b + 'lan', 'number', ' class="w4" data-rr="1"') + '</td><td>' + inp(b + 'gio', 'number', ' class="w4" data-rr="1"') + '</td><td>' + inp(b + 'ng', 'number', ' class="w4" data-rr="1"') +
            '</td><td class="num">' + fmt(h, 1) + '</td><td class="c"><input type="checkbox" aria-label="Thuộc quyền quyết định của Sở" id="f-tasks-' + i + '-tq" data-b="' + b + 'tq" data-rr="1"' + (t.tq ? ' checked' : '') + '></td><td>' + inp(b + 'trung', 'text', ' class="w10"') + '</td><td>' + sel(b + 'de', Object.keys(RATE), true) + '</td><td class="num">' + (sv ? '<b>' + fmt(sv, 1) + '</b>' : '<span class="muted">—</span>') + '</td><td><button class="btn sm ghost" data-act="deltask" data-i="' + i + '" aria-label="Xóa">×</button></td></tr>';
        }).join('') + '</tbody></table></div>' +
        '<p class="muted small">Tỷ lệ giảm giả định: bỏ 100%, nguồn dữ liệu chung 80%, hợp nhất 70%, ủy quyền 60%, rút gọn 50%. Việc không thuộc quyền Sở (bỏ đánh dấu) không tính vào phần giảm, chuyển thành kiến nghị.</p></section>' +
        '<section><div class="row between"><h2 class="sec">Phân công theo độ phức tạp</h2><button class="btn primary" data-act="addstaff">+ Thêm cán bộ</button></div>' +
        '<div class="tbl"><table><thead><tr><th>Cán bộ</th><th>Lĩnh vực</th><th>Hồ sơ đơn giản ×1</th><th>Trung bình ×2</th><th>Phức tạp ×4</th><th>Tải quy đổi</th><th>Ngoài giờ (giờ/tháng)</th><th>Sai sót/tháng</th><th>Có người thay thế</th><th>Cảnh báo</th><th></th></tr></thead><tbody>' +
        S.staff.map(function (s, i) {
          var b = 'staff.' + i + '.', l = sc.L[i], r = sc.avg ? l / sc.avg : 0, w = [];
          if (r >= 1.3) w.push(pill('Quá tải ' + fmt(r * 100) + '%', 'crit')); else if (r <= 0.6) w.push(pill('Còn dư địa', 'ok'));
          if (!s.thay && num(s.pt) > 0) w.push(pill('Phụ thuộc một người', 'warn'));
          if (num(s.ot) >= 20) w.push(pill('Ngoài giờ cao', 'warn'));
          return '<tr><td>' + inp(b + 'ten', 'text', ' class="w10"') + '</td><td>' + inp(b + 'lv', 'text', ' class="w10"') + '</td><td>' + inp(b + 'd', 'number', ' class="w4" data-rr="1"') + '</td><td>' + inp(b + 'tb', 'number', ' class="w4" data-rr="1"') + '</td><td>' + inp(b + 'pt', 'number', ' class="w4" data-rr="1"') +
            '</td><td class="load"><span class="track"><i style="width:' + (l / mxL * 100) + '%"></i></span><b>' + fmt(l) + '</b></td><td>' + inp(b + 'ot', 'number', ' class="w4" data-rr="1"') + '</td><td>' + inp(b + 'sai', 'number', ' class="w4"') + '</td><td class="c"><input type="checkbox" aria-label="Có người thay thế" id="f-staff-' + i + '-thay" data-b="' + b + 'thay" data-rr="1"' + (s.thay ? ' checked' : '') + '></td><td>' + w.join(' ') + '</td><td><button class="btn sm ghost" data-act="delstaff" data-i="' + i + '" aria-label="Xóa">×</button></td></tr>';
        }).join('') + '</tbody></table></div>' +
        '<p class="muted small">Tải bình quân: ' + fmt(sc.avg, 1) + ' điểm. Chia đều số hồ sơ không phản ánh tải thật; một hồ sơ phức tạp được tính bằng bốn hồ sơ đơn giản.</p></section>' +
        '<section class="grid2"><div class="card"><h2>Chọn quy trình thí điểm cải tiến</h2><p class="muted">Ưu tiên quy trình nhiều hồ sơ, nhiều lần bổ sung, chậm nhất. Làm rõ các bước, bỏ thao tác thừa trước, cấu hình công nghệ sau.</p>' +
        '<div class="tbl"><table><thead><tr><th>Quy trình</th><th>Hồ sơ/tháng</th><th>Bổ sung TB</th><th>% trễ</th><th>Điểm</th></tr></thead><tbody>' +
        prs.map(function (x, j) { var b = 'proc.' + x.i + '.'; return '<tr' + (j === 0 ? ' class="hl"' : '') + '><td>' + inp(b + 'ten', 'text', ' class="w14"') + '</td><td>' + inp(b + 'sl', 'number', ' class="w4" data-rr="1"') + '</td><td>' + inp(b + 'bs', 'number', ' class="w4" data-rr="1"') + '</td><td>' + inp(b + 'tre', 'number', ' class="w4" data-rr="1"') + '</td><td class="num"><b>' + fmt(x.d) + '</b></td></tr>'; }).join('') +
        '</tbody></table></div>' + (prs[0] ? '<p class="note ok">Đề xuất thí điểm: <b>' + e(prs[0].p.ten) + '</b>.</p>' : '') + '</div>' +
        '<div class="card"><div class="row between"><h2>Kiến nghị nhân sự bằng dữ liệu</h2>' + copyBtn('hrtxt') + '</div><div class="form f2">' +
        fld('Vị trí khó tuyển', inp('hr.kho'), '', 'w2') + fld('Số người nghỉ việc 12 tháng qua', inp('hr.nghi', 'number')) + fld('Biên chế hiện có', inp('hr.bc', 'number')) + '</div>' +
        '<pre class="paper sm" id="hrtxt">' + e(hrText(tc, sc, spof, ot)) + '</pre></div></section>';
    }
  };
  function hrText(tc, sc, spof, ot) {
    var bc = num(S.hr.bc), ng = num(S.hr.nghi), over = S.staff.filter(function (s, i) { return sc.avg && sc.L[i] / sc.avg >= 1.3; });
    return 'Căn cứ số liệu theo dõi của Sở:\n' +
      '- Biên chế hiện có ' + bc + ' người; ' + ng + ' người nghỉ việc trong 12 tháng (tỷ lệ ' + (bc ? fmt(ng / bc * 100, 1) : '…') + '%).\n' +
      '- Vị trí khó tuyển: ' + (S.hr.kho || '…') + '.\n' +
      '- Làm ngoài giờ bình quân ' + fmt(S.staff.length ? ot / S.staff.length : 0, 1) + ' giờ/người/tháng; ' + over.length + ' cán bộ có tải quy đổi vượt 130% bình quân.\n' +
      '- ' + spof.length + ' lĩnh vực có hồ sơ phức tạp chỉ một người xử lý được' + (spof.length ? ' (' + spof.map(function (s) { return s.lv; }).join(', ') + ')' : '') + '.\n' +
      '- Sở đã chủ động cắt giảm khoảng ' + fmt(tc.save) + ' giờ-người/tháng từ họp, báo cáo, nhập liệu trùng lặp.\n' +
      'Sở kiến nghị cấp có thẩm quyền xem xét bổ sung chỉ tiêu và chính sách đãi ngộ cho các vị trí nêu trên.';
  }

  // ---------- Lộ trình 90 ngày ----------
  V['lo-trinh'] = {
    title: 'Lộ trình 90 ngày',
    render: function () {
      var kn = S.reg.filter(function (r) { return r.tq === 'cap-tren' && r.tt !== 'Đã đóng'; });
      return '<header class="vh"><p class="eyebrow">Điều hành</p><h1>Lộ trình 90 ngày</h1><p class="muted">Đánh dấu việc đã làm. Đo số liệu trước và sau để quyết định nhân rộng phần hiệu quả.</p></header>' +
        '<section class="phases">' + D.PLAN.map(function (p) {
          var d = p.items.filter(function (it) { return S.plan[it[0]]; }).length;
          return '<div class="phase card"><div class="row between"><h3>' + p.ten + '</h3><span class="muted">' + d + '/' + p.items.length + '</span></div><span class="track"><i style="width:' + (d / p.items.length * 100) + '%"></i></span>' +
            '<p><b>' + p.viec + '</b></p><ul class="todo">' + p.items.map(function (it) {
              return '<li>' + chk('plan.' + it[0], it[1], true) + ' <a href="#' + it[2] + '" class="small">mở →</a></li>';
            }).join('') + '</ul><p class="muted small">Kết quả cần thấy: ' + p.kq + '</p></div>';
        }).join('') + '</section>' +
        '<section class="card"><h2>Chỉ số trước – sau</h2><p class="muted">Chỉ theo dõi một số chỉ số thiết thực. Không chạy theo tỷ lệ đúng hạn: chỉ số này có thể che khuất việc trả hồ sơ hoặc yêu cầu bổ sung nhiều lần.</p>' +
        '<div class="tbl"><table class="kpi"><thead><tr><th>Chỉ số</th><th>Đơn vị</th><th>Trước</th><th>Sau</th><th>Thay đổi</th></tr></thead><tbody>' +
        D.KPI.map(function (k) {
          var v = S.kpi[k.id] || { a: '', b: '' }, a = num(v.a), b = num(v.b), dlt = a ? (b - a) / a * 100 : 0, good = k.tot === 'giam' ? dlt < 0 : dlt > 0;
          return '<tr' + (k.id === 'dh' ? ' class="dim"' : '') + '><th>' + k.ten + '</th><td>' + k.dv + '</td><td>' + inp('kpi.' + k.id + '.a', 'number', ' class="w5" data-rr="1"') + '</td><td>' + inp('kpi.' + k.id + '.b', 'number', ' class="w5" data-rr="1"') + '</td><td>' +
            (a ? pill((dlt > 0 ? '+' : '') + fmt(dlt) + '%', dlt === 0 ? 'muted' : good ? 'ok' : 'crit') : '<span class="muted">—</span>') + '</td></tr>';
        }).join('') + '</tbody></table></div>' +
        (S.kpi.dh && num(S.kpi.dh.b) > num(S.kpi.dh.a) && num(S.kpi.bs.b) >= num(S.kpi.bs.a) ? '<p class="note warn">Tỷ lệ đúng hạn tăng nhưng số lần bổ sung không giảm: kiểm tra việc trả hồ sơ hoặc yêu cầu bổ sung để "dừng đồng hồ".</p>' : '') + '</section>' +
        '<section class="card"><div class="row between"><h2>Danh mục kiến nghị vượt thẩm quyền</h2>' + copyBtn('kntxt') + '</div><p class="muted">Tự tổng hợp từ sổ vướng mắc (các mục vượt thẩm quyền, chưa đóng).</p>' +
        (kn.length ? '<pre class="paper sm" id="kntxt">' + e(kn.map(function (r, i) { return (i + 1) + '. ' + r.hs + '\n   Vướng mắc: ' + r.dk + '\n   Kiến nghị: ' + (r.cap || '…') + '\n   Phương án Sở đề xuất: ' + (r.pa || '…') + '\n   Cơ quan: ' + (r.cq || '…') + ' · Trạng thái: ' + r.tt; }).join('\n\n')) + '</pre>' : '<p class="empty" id="kntxt">Chưa có kiến nghị vượt thẩm quyền.</p>') + '</section>';
    }
  };

  // ---------- Sao lưu ----------
  V['du-lieu'] = {
    title: 'Sao lưu dữ liệu',
    render: function () {
      return '<header class="vh"><p class="eyebrow">Dữ liệu</p><h1>Sao lưu và khôi phục</h1><p class="muted">Dữ liệu chỉ nằm trong trình duyệt của máy này. Sao lưu định kỳ để chuyển sang máy khác hoặc phòng khi xóa dữ liệu trình duyệt.</p></header>' +
        '<section class="card"><div class="row"><button class="btn primary" data-act="backup">Tạo bản sao lưu</button>' + copyBtn('bk', 'Sao chép bản sao lưu') + '<button class="btn" data-act="restore">Khôi phục từ nội dung bên dưới</button></div>' +
        '<textarea id="bk" rows="10" spellcheck="false" placeholder="Bấm Tạo bản sao lưu, hoặc dán bản sao lưu đã lưu trước đó vào đây rồi bấm Khôi phục."></textarea>' +
        '<label class="btn file">Mở tệp sao lưu (.json)<input type="file" id="bkfile" accept=".json,application/json"></label></section>' +
        '<section class="card danger"><h3>Đặt lại dữ liệu ví dụ</h3><p class="muted">Xóa toàn bộ dữ liệu đã nhập và nạp lại dữ liệu ví dụ.</p><div class="row" id="rstbox"><button class="btn" data-act="reset1">Đặt lại…</button></div></section>';
    }
  };

  // =====================================================================
  // ĐIỀU HƯỚNG VÀ SỰ KIỆN
  // =====================================================================
  var NAV = [['tong-quan', 'Tổng quan'], ['quyet-dinh', 'Công cụ ra quyết định'], ['van-ban', 'Văn bản đầu tư công'], ['vuong-mac', 'Sổ vướng mắc pháp lý'], ['ho-so', 'Hồ sơ tồn'], ['kiem-soat', 'Kiểm soát rủi ro'], ['tai-viec', 'Tải công việc, nhân sự'], ['lo-trinh', 'Lộ trình 90 ngày'], ['du-lieu', 'Sao lưu dữ liệu']];
  var cur = 'tong-quan';
  function route() {
    var h = (location.hash || '').slice(1);
    if (h === 'chong-cheo') { S.cs.step = 3; h = 'quyet-dinh'; }
    cur = V[h] ? h : 'tong-quan';
    render(true);
  }
  function render(top) {
    var main = document.getElementById('main'), y = window.scrollY;
    main.innerHTML = V[cur].render();
    document.querySelectorAll('#nav a').forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + cur); a.setAttribute('aria-current', a.getAttribute('href') === '#' + cur ? 'page' : 'false'); });
    document.title = V[cur].title + ' · Bàn quyết định Lãnh đạo Sở';
    window.scrollTo(0, top ? 0 : y);
    var nav = document.getElementById('nav'), on = nav.querySelector('a.on');
    if (on && window.innerWidth < 900) nav.scrollLeft = on.offsetLeft - nav.offsetLeft - (nav.clientWidth - on.offsetWidth) / 2;
  }
  function toast(t) { var x = document.getElementById('toast'); x.textContent = t; x.classList.add('on'); clearTimeout(x._t); x._t = setTimeout(function () { x.classList.remove('on'); }, 2200); }
  function fillLaw(k) {
    var x = S.cs.cf[k], l = law(x.van); if (!l) return;
    x.cap = l.cap;
    x.cq = { luat: 'Quốc hội', 'nq-ubtvqh': 'Ủy ban Thường vụ Quốc hội', nd: 'Chính phủ', 'qd-ttg': 'Thủ tướng Chính phủ', tt: /BTC/.test(l.so) ? 'Bộ Tài chính' : 'Bộ' }[l.cap] || '';
    var m = l.ngay.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); if (m) x.ngay = m[3] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[1]).slice(-2);
    x.hl = l.qh && /sửa đổi/i.test(l.qh) ? 'sua-doi' : 'chua-ro';
  }
  function tsv(rows) { return rows.map(function (r) { return r.map(function (c) { return String(c == null ? '' : c).replace(/[\t\n]+/g, ' '); }).join('\t'); }).join('\n'); }
  function copyText(t, el) {
    function fb() { if (el) { var r = document.createRange(); r.selectNodeContents(el); var s = getSelection(); s.removeAllRanges(); s.addRange(r); if (el.select) el.select(); } toast('Đã chọn nội dung. Nhấn Ctrl+C để sao chép.'); }
    try { navigator.clipboard.writeText(t).then(function () { toast('Đã sao chép'); }, fb); } catch (x) { fb(); }
  }

  var ACT = {
    step: function (d) { S.cs.step = +d.s; save(); render(true); },
    newcase: function () { var w = S.cs.w; S.cs = { step: 1, ten: '', ma: '', gd: 'cd', nhom: 'C', gtri: 0, phu: '', han: rel(10), cq: '', mota: '', anh: '', tq: 'so', cc: 'ro', nl: 'du', pa: 'khong', tach: 'khong', dm: 'khong', ton: 0, rr: {}, cf: { a: { van: '', cap: 'luat', cq: '', ngay: '', hl: 'chua-ro', pv: 'chung', dk: '', nd: '' }, b: { van: '', cap: 'nd', cq: '', ngay: '', hl: 'chua-ro', pv: 'chung', dk: '', nd: '' }, tn: false }, hoi: '', w: w, opts: [{ ten: 'PA1. ', mo: '', tq: true, s: { cc: 3, td: 3, rr: 3, dn: 3, cp: 3 } }, { ten: 'PA2. ', mo: '', tq: true, s: { cc: 3, td: 3, rr: 3, dn: 3, cp: 3 } }] }; save(); render(true); toast('Đã tạo hồ sơ mới'); },
    samplecase: function () { S.cs = sample().cs; save(); render(true); toast('Đã nạp lại ví dụ'); },
    addopt: function () { S.cs.opts.push({ ten: 'PA' + (S.cs.opts.length + 1) + '. ', mo: '', tq: true, s: { cc: 3, td: 3, rr: 3, dn: 3, cp: 3 } }); save(); render(); },
    delopt: function (d) { S.cs.opts.splice(+d.i, 1); save(); render(); },
    toreg: function () {
      var c = S.cs, a = analyze(c), n = S.reg.length + 1, id = 'VM-' + (n < 10 ? '0' : '') + n, b = scoreOpts(c).best;
      S.reg.unshift({ id: id, hs: (c.ma ? c.ma + ' · ' : '') + c.ten, dk: nm(c.cf.a) + ' ↔ ' + nm(c.cf.b) + ': ' + (c.cf.a.dk || ''), so: c.tach === 'co' ? c.anh : '', cap: a.muc === 'xin-y-kien' || c.tq !== 'so' ? c.hoi : '', cq: a.hoiCq || c.cq, pa: b ? b.o.ten : '', phu: c.phu, han: rel(diag(c).han), tt: 'Mới ghi nhận', tq: c.tq === 'so' ? 'so' : 'cap-tren' });
      save(); toast('Đã ghi ' + id + ' vào sổ vướng mắc');
    },
    regf: function (d) { regFilter = d.f; render(); },
    addreg: function () { var n = S.reg.length + 1; S.reg.unshift({ id: 'VM-' + (n < 10 ? '0' : '') + n, hs: '', dk: '', so: '', cap: '', cq: '', pa: '', phu: '', han: rel(7), tt: 'Mới ghi nhận', tq: 'so' }); regFilter = 'mo'; save(); render(); },
    delreg: function (d) { S.reg.splice(+d.i, 1); save(); render(); },
    copyreg: function () { copyText(tsv([['Mã', 'Hồ sơ', 'Điều khoản vướng', 'Sở tự quyết', 'Cần cấp trên', 'Phương án', 'Cơ quan', 'Người theo dõi', 'Mốc báo cáo', 'Trạng thái', 'Thẩm quyền']].concat(S.reg.map(function (r) { return [r.id, r.hs, r.dk, r.so, r.cap, r.pa, r.cq, r.phu, dd(r.han), r.tt, r.tq === 'so' ? 'Sở' : 'Cấp trên']; })))); },
    addhs: function () { S.hs.push({ ma: 'HS-', ten: '', phu: '', buoc: '', nhan: rel(0), han: rel(15), ly: 'Chưa rõ nguyên nhân', ld: false, next: '', vm: '' }); save(); render(); },
    delhs: function (d) { S.hs.splice(+d.i, 1); save(); render(); },
    copyhs: function () { copyText(tsv([['Mã', 'Tên hồ sơ', 'Phụ trách', 'Bước hiện tại', 'Ngày nhận', 'Hạn', 'Lý do chậm', 'Bước tiếp theo', 'Vướng mắc', 'Cần LĐ quyết']].concat(S.hs.map(function (h) { return [h.ma, h.ten, h.phu, h.buoc, dd(h.nhan), dd(h.han), h.ly, h.next, h.vm, h.ld ? 'Có' : '']; })))); },
    stage: function (d) { lawF.s = lawF.s === d.s ? '' : d.s; render(); var l = document.getElementById('lawlist'); if (l && d.s) l.scrollIntoView({ behavior: 'smooth', block: 'start' }); },
    addproj: function () { S.proj.push({ ten: '', gt: 0, dc: 0, kn: 0, gn: 0, bt: false }); save(); render(); },
    delproj: function (d) { S.proj.splice(+d.i, 1); save(); render(); },
    addtask: function () { S.tasks.push({ ten: '', loai: 'Họp', lan: 1, gio: 1, ng: 1, tq: true, trung: '', de: 'Giữ' }); save(); render(); },
    deltask: function (d) { S.tasks.splice(+d.i, 1); save(); render(); },
    addstaff: function () { S.staff.push({ ten: '', lv: '', d: 0, tb: 0, pt: 0, ot: 0, sai: 0, thay: false }); save(); render(); },
    delstaff: function (d) { S.staff.splice(+d.i, 1); save(); render(); },
    copy: function (d) { var el = document.getElementById(d.t); if (el) copyText(el.value != null && el.tagName === 'TEXTAREA' ? el.value : el.innerText, el); },
    backup: function () { document.getElementById('bk').value = JSON.stringify(S, null, 1); toast('Đã tạo bản sao lưu bên dưới'); },
    restore: function () { try { var o = JSON.parse(document.getElementById('bk').value); if (!o || o.ver !== 1 || !o.cs) throw 0; S = o; save(); toast('Đã khôi phục dữ liệu'); render(); } catch (x) { toast('Nội dung không phải bản sao lưu hợp lệ của công cụ này'); } },
    reset1: function () { document.getElementById('rstbox').innerHTML = '<span>Xóa toàn bộ dữ liệu đã nhập?</span><button class="btn danger" data-act="reset2">Xóa và nạp ví dụ</button><button class="btn" data-act="reset0">Hủy</button>'; },
    reset0: function () { render(); },
    reset2: function () { S = sample(); save(); toast('Đã nạp lại dữ liệu ví dụ'); location.hash = '#tong-quan'; route(); }
  };

  function onEdit(ev, commit) {
    var t = ev.target;
    if (t.id === 'lawq') { lawF.q = t.value; document.getElementById('lawlist').innerHTML = lawList(); return; }
    if (t.id === 'lawg') { lawF.g = t.value; document.getElementById('lawlist').innerHTML = lawList(); return; }
    if (t.id === 'bkfile' && t.files && t.files[0]) { var r = new FileReader(); r.onload = function () { document.getElementById('bk').value = r.result; toast('Đã đọc tệp. Bấm Khôi phục để áp dụng.'); }; r.readAsText(t.files[0]); return; }
    var p = t.getAttribute && t.getAttribute('data-b'); if (!p) return;
    if (t.type === 'radio' && !t.checked) return;
    var v = t.type === 'checkbox' ? t.checked : t.hasAttribute('data-n') ? (t.value === '' ? '' : num(t.value)) : t.value;
    setP(p, v); save();
    var m = p.match(/^cs\.cf\.(a|b)\.van$/); if (m) { fillLaw(m[1]); render(); return; }
    var rr = t.hasAttribute('data-rr') || t.type === 'radio' && cur !== 'quyet-dinh';
    if (rr && (commit || t.type === 'checkbox' || t.tagName === 'SELECT')) { render(); return; }
    if (V[cur].update) V[cur].update();
  }
  document.addEventListener('input', function (ev) { onEdit(ev, false); });
  document.addEventListener('change', function (ev) { var t = ev.target; if (t.type === 'checkbox' || t.type === 'radio' || t.tagName === 'SELECT' || t.type === 'file' || t.hasAttribute('data-rr')) onEdit(ev, true); });
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-act]'); if (!b) return;
    ev.preventDefault(); var f = ACT[b.getAttribute('data-act')]; if (f) f(b.dataset);
  });
  window.addEventListener('hashchange', route);

  load();
  document.getElementById('nav').innerHTML = NAV.map(function (n, i) { return '<a href="#' + n[0] + '"' + (i === 1 ? ' class="key"' : '') + '>' + n[1] + '</a>'; }).join('');
  route();
})();
