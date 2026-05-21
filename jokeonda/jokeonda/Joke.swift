import Foundation

struct Joke: Codable, Identifiable, Hashable {
    let date: String
    let text: String

    var id: String { date }

    var calendarDate: Date? {
        Self.dateFormatter.date(from: date)
    }

    static let dateFormatter: DateFormatter = {
        let f = DateFormatter()
        f.calendar = Calendar(identifier: .gregorian)
        f.locale = Locale(identifier: "en_US_POSIX")
        f.timeZone = TimeZone.current
        f.dateFormat = "yyyy-MM-dd"
        return f
    }()
}

struct JokeFeed: Codable {
    let version: Int
    let title_ru: String?
    let jokes: [Joke]
}
