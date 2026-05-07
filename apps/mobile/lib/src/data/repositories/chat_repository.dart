import '../../core/api/vietwander_api_client.dart';
import '../../domain/travel_models.dart';
import '../cache/travel_offline_cache.dart';

class ChatRepository {
  ChatRepository({
    required TravelApiGateway api,
    required TravelOfflineCache cache,
  }) : _api = api,
       _cache = cache;

  final TravelApiGateway _api;
  final TravelOfflineCache _cache;

  Future<List<ChatMessage>> getMessages() {
    return _cache.getChatMessages();
  }

  Future<ChatMessage> sendMessage(String prompt, {DateTime? now}) async {
    final timestamp = now ?? DateTime.now();
    final userMessage = ChatMessage(
      role: 'user',
      content: prompt,
      createdAt: timestamp,
    );

    try {
      final response = await _api.postMap(
        '/local-ai/chat',
        body: {'message': prompt},
      );
      final data = response['data'] is Map<String, dynamic>
          ? response['data'] as Map<String, dynamic>
          : response;
      final provider = data['provider'] is Map<String, dynamic>
          ? data['provider'] as Map<String, dynamic>
          : const <String, dynamic>{};
      final citations = data['citations'] is List ? data['citations'] as List : const [];
      final assistant = ChatMessage.fromJson({
        'role': 'assistant',
        'content':
            '${data['answer'] ?? data['message'] ?? data['content']}\n\nNguồn local: ${citations.length} citation · Provider: ${provider['chatProvider'] ?? provider['chat_provider'] ?? 'sample fallback'}',
        'createdAt': timestamp.toIso8601String(),
      });
      await _cache.addChatMessages([userMessage, assistant]);
      return assistant;
    } catch (_) {
      final fallback = ChatMessage(
        role: 'assistant',
        content:
            'Gợi ý local: lưu bản đồ, đi vừa nhịp, chuẩn bị gói offline và chỉ dùng đặt chỗ demo.',
        createdAt: timestamp,
      );
      await _cache.addChatMessages([userMessage, fallback]);
      return fallback;
    }
  }
}
