class Destination {
  const Destination({
    required this.id,
    required this.name,
    required this.region,
    required this.summary,
    required this.tags,
    required this.rating,
  });

  factory Destination.fromJson(Map<String, dynamic> json) {
    return Destination(
      id: _string(json['id'], fallback: 'destination'),
      name: _string(json['name'], fallback: 'Điểm đến Việt Nam'),
      region: _string(json['region'], fallback: 'Việt Nam'),
      summary: _string(json['summary'], fallback: 'Điểm nổi bật du lịch local'),
      tags: _stringList(json['tags']),
      rating: _double(json['rating'], fallback: 4.7),
    );
  }

  final String id;
  final String name;
  final String region;
  final String summary;
  final List<String> tags;
  final double rating;
}

class ItineraryDay {
  const ItineraryDay({
    required this.day,
    required this.title,
    required this.area,
    required this.activities,
    required this.offlineReady,
  });

  factory ItineraryDay.fromJson(Map<String, dynamic> json) {
    return ItineraryDay(
      day: _int(json['day'], fallback: 1),
      title: _string(json['title'], fallback: 'Ngày trong chuyến đi'),
      area: _string(json['area'], fallback: 'Việt Nam'),
      activities: _stringList(json['activities']),
      offlineReady: _bool(json['offlineReady'], fallback: true),
    );
  }

  final int day;
  final String title;
  final String area;
  final List<String> activities;
  final bool offlineReady;
}

class WishlistItem {
  const WishlistItem({
    required this.id,
    required this.title,
    required this.type,
    required this.location,
    required this.savedAt,
    required this.offlineAvailable,
  });

  factory WishlistItem.fromJson(Map<String, dynamic> json) {
    return WishlistItem(
      id: _string(json['id'], fallback: 'wishlist-item'),
      title: _string(json['title'], fallback: 'Địa điểm đã lưu'),
      type: _string(json['type'], fallback: 'địa điểm'),
      location: _string(json['location'], fallback: 'Việt Nam'),
      savedAt: _dateTime(json['savedAt']),
      offlineAvailable: _bool(json['offlineAvailable'], fallback: true),
    );
  }

  final String id;
  final String title;
  final String type;
  final String location;
  final DateTime savedAt;
  final bool offlineAvailable;
}

class BookingSummary {
  const BookingSummary({
    required this.id,
    required this.label,
    required this.status,
    required this.amountLabel,
    required this.sandboxOnly,
    required this.updatedAt,
  });

  factory BookingSummary.fromJson(Map<String, dynamic> json) {
    return BookingSummary(
      id: _string(json['id'], fallback: 'booking'),
      label: _string(json['label'], fallback: 'Đặt chỗ du lịch'),
      status: _string(json['status'], fallback: 'Giữ chỗ local'),
      amountLabel: _string(json['amountLabel'], fallback: 'Demo'),
      sandboxOnly: _bool(json['sandboxOnly'], fallback: true),
      updatedAt: _dateTime(json['updatedAt']),
    );
  }

  final String id;
  final String label;
  final String status;
  final String amountLabel;
  final bool sandboxOnly;
  final DateTime updatedAt;
}

class ChatMessage {
  const ChatMessage({
    required this.role,
    required this.content,
    required this.createdAt,
  });

  factory ChatMessage.fromJson(Map<String, dynamic> json) {
    return ChatMessage(
      role: _string(json['role'], fallback: 'assistant'),
      content: _string(
        json['content'],
        fallback: 'Mình có thể giúp gì cho chuyến đi Việt Nam của bạn?',
      ),
      createdAt: _dateTime(json['createdAt']),
    );
  }

  final String role;
  final String content;
  final DateTime createdAt;
}

class HomeSnapshot {
  const HomeSnapshot({
    required this.itineraryDays,
    required this.savedItems,
    required this.sandboxBookings,
  });

  final int itineraryDays;
  final int savedItems;
  final int sandboxBookings;
}

String _string(Object? value, {required String fallback}) {
  if (value case final String text when text.trim().isNotEmpty) {
    return text;
  }
  return fallback;
}

List<String> _stringList(Object? value) {
  if (value case final List<Object?> rows) {
    return rows.whereType<String>().toList(growable: false);
  }
  return const [];
}

double _double(Object? value, {required double fallback}) {
  if (value case final num number) {
    return number.toDouble();
  }
  return fallback;
}

int _int(Object? value, {required int fallback}) {
  if (value case final num number) {
    return number.toInt();
  }
  return fallback;
}

bool _bool(Object? value, {required bool fallback}) {
  if (value case final bool flag) {
    return flag;
  }
  return fallback;
}

DateTime _dateTime(Object? value) {
  if (value case final String text) {
    return DateTime.tryParse(text) ?? DateTime.now();
  }
  if (value case final DateTime dateTime) {
    return dateTime;
  }
  return DateTime.now();
}
