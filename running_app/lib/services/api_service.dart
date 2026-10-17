import '../models/run.dart';

class ApiService {
  // Dữ liệu giả, sau này đổi thành gọi API thật
  Future<List<Run>> getRuns() async {
    await Future.delayed(const Duration(milliseconds: 500));
    return [
      Run(id: 1, distanceKm: 5.2, durationSec: 1800, startedAt: DateTime.now()),
      Run(id: 2, distanceKm: 3.0, durationSec: 1000, startedAt: DateTime.now()),
    ];
  }
}