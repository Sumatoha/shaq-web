import Foundation
import SwiftUI

@MainActor
final class JokeStore: ObservableObject {
    @Published private(set) var feed: JokeFeed?
    @Published private(set) var isLoading = false
    @Published private(set) var lastError: String?

    private let feedURL = URL(string: "https://raw.githubusercontent.com/sumatoha/shaq-web/main/jokes.json")!
    private let cacheURL: URL = {
        let dir = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask).first!
        return dir.appendingPathComponent("jokes.json")
    }()

    func bootstrap() async {
        loadFromCache()
        await refresh()
    }

    func refresh() async {
        isLoading = true
        defer { isLoading = false }
        do {
            var request = URLRequest(url: feedURL)
            request.cachePolicy = .reloadIgnoringLocalCacheData
            request.timeoutInterval = 15
            let (data, response) = try await URLSession.shared.data(for: request)
            guard let http = response as? HTTPURLResponse, (200..<300).contains(http.statusCode) else {
                lastError = "HTTP error"
                return
            }
            let decoded = try JSONDecoder().decode(JokeFeed.self, from: data)
            feed = decoded
            try? data.write(to: cacheURL, options: .atomic)
            lastError = nil
            await NotificationScheduler.shared.reschedule(for: decoded.jokes)
        } catch {
            lastError = error.localizedDescription
        }
    }

    private func loadFromCache() {
        guard let data = try? Data(contentsOf: cacheURL),
              let decoded = try? JSONDecoder().decode(JokeFeed.self, from: data) else {
            return
        }
        feed = decoded
    }

    var todaysJoke: Joke? {
        guard let jokes = feed?.jokes else { return nil }
        let today = Self.today()
        return jokes.first { $0.date == today }
    }

    var upcomingJokes: [Joke] {
        guard let jokes = feed?.jokes else { return [] }
        let today = Self.today()
        return jokes
            .filter { $0.date >= today }
            .sorted { $0.date < $1.date }
    }

    static func today() -> String {
        Joke.dateFormatter.string(from: Date())
    }
}
