import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

abstract interface class TravelApiGateway {
  Future<List<Map<String, dynamic>>> getList(String path, {String? rootKey});

  Future<Map<String, dynamic>> postMap(
    String path, {
    Map<String, dynamic>? body,
  });
}

final dioProvider = Provider<Dio>((ref) {
  final dio = Dio(
    BaseOptions(
      baseUrl: const String.fromEnvironment(
        'CHILLTRAVEL_API_BASE_URL',
        defaultValue: 'http://localhost:3000/api',
      ),
      connectTimeout: const Duration(seconds: 5),
      receiveTimeout: const Duration(seconds: 8),
      sendTimeout: const Duration(seconds: 5),
      headers: const {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-WanderViet-Client': 'mobile',
      },
    ),
  );

  dio.interceptors.add(
    InterceptorsWrapper(
      onRequest: (options, handler) {
        options.extra['usesLocalAiProvider'] = true;
        handler.next(options);
      },
    ),
  );

  return dio;
});

final travelApiGatewayProvider = Provider<TravelApiGateway>((ref) {
  return DioTravelApiGateway(ref.watch(dioProvider));
});

class DioTravelApiGateway implements TravelApiGateway {
  DioTravelApiGateway(this._dio);

  final Dio _dio;

  @override
  Future<List<Map<String, dynamic>>> getList(
    String path, {
    String? rootKey,
  }) async {
    final response = await _dio.get<Object?>(path);
    final data = response.data;

    if (data case final List<Object?> rows) {
      return rows.whereType<Map<String, dynamic>>().toList(growable: false);
    }

    if (data case final Map<String, dynamic> map) {
      final value = rootKey == null ? map['data'] : map[rootKey];
      if (value case final List<Object?> rows) {
        return rows.whereType<Map<String, dynamic>>().toList(growable: false);
      }
    }

    return const [];
  }

  @override
  Future<Map<String, dynamic>> postMap(
    String path, {
    Map<String, dynamic>? body,
  }) async {
    final response = await _dio.post<Object?>(path, data: body);
    final data = response.data;

    if (data case final Map<String, dynamic> map) {
      return map;
    }

    return const {};
  }
}
