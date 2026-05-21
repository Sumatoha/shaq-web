import Foundation
import SwiftUI

@MainActor
final class JokeStore: ObservableObject {
    @Published private(set) var feed: JokeFeed?
    @Published private(set) var isLoading = false
    @Published private(set) var lastError: String?

    private static let feedURL = URL(string: "https://raw.githubusercontent.com/sumatoha/shaq-web/main/jokes.json")!
    private static let cacheURL: URL = {
        let dir = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask).first!
        return dir.appendingPathComponent("jokes.json")
    }()

    private var lastScheduledJokesHash: Int?

    func bootstrap() async {
        if let cached = await Self.loadCache() {
            feed = cached
        }
        await refresh()
    }

    func refresh() async {
        isLoading = true
        defer { isLoading = false }
        do {
            let decoded = try await Self.fetchAndPersist()
            feed = decoded
            lastError = nil

            let hash = decoded.jokes.hashValue
            if hash != lastScheduledJokesHash {
                lastScheduledJokesHash = hash
                await NotificationScheduler.shared.reschedule(for: decoded.jokes)
            }
        } catch {
            lastError = error.localizedDescription
        }
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

    static func fetchAndPersist() async throws -> JokeFeed {
        var request = URLRequest(url: feedURL)
        request.cachePolicy = .useProtocolCachePolicy
        request.timeoutInterval = 15
        let (data, response) = try await URLSession.shared.data(for: request)
        guard let http = response as? HTTPURLResponse, (200..<300).contains(http.statusCode) else {
            throw URLError(.badServerResponse)
        }
        let decoded = try JSONDecoder().decode(JokeFeed.self, from: data)
        let path = cacheURL
        Task.detached(priority: .utility) {
            try? data.write(to: path, options: .atomic)
        }
        return decoded
    }

    private static func loadCache() async -> JokeFeed? {
        let path = cacheURL
        return await Task.detached(priority: .utility) { () -> JokeFeed? in
            guard let data = try? Data(contentsOf: path) else { return nil }
            return try? JSONDecoder().decode(JokeFeed.self, from: data)
        }.value
    }
}
