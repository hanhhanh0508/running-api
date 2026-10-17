Chức năng	Endpoint	Gửi lên	Trả về
Đăng ký	POST /auth/register	{name, email, password}	{token, user}
Đăng nhập	POST /auth/login	{email, password}	{token, user}
Lưu buổi chạy	POST /runs	{distanceKm, durationSec, startedAt, route}	{run}
Lịch sử	GET /runs	(kèm token)	[run, ...]
Thống kê	GET /stats	(kèm token)	{totalKm, totalSec, totalRuns}