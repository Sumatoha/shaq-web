import Foundation
import UserNotifications

actor NotificationScheduler {
    static let shared = NotificationScheduler()

    private let notificationHour = 9
    private let notificationMinute = 11
    private let maxScheduled = 60

    func requestAuthorizationIfNeeded() async -> Bool {
        let center = UNUserNotificationCenter.current()
        let settings = await center.notificationSettings()
        switch settings.authorizationStatus {
        case .authorized, .provisional, .ephemeral:
            return true
        case .denied:
            return false
        case .notDetermined:
            return (try? await center.requestAuthorization(options: [.alert, .sound, .badge])) ?? false
        @unknown default:
            return false
        }
    }

    func reschedule(for jokes: [Joke]) async {
        let granted = await requestAuthorizationIfNeeded()
        guard granted else { return }

        let center = UNUserNotificationCenter.current()
        center.removeAllPendingNotificationRequests()

        let calendar = Calendar.current
        let now = Date()

        let upcoming = jokes
            .compactMap { joke -> (Joke, DateComponents)? in
                guard let day = joke.calendarDate else { return nil }
                var comps = calendar.dateComponents([.year, .month, .day], from: day)
                comps.hour = notificationHour
                comps.minute = notificationMinute
                guard let fireDate = calendar.date(from: comps), fireDate > now else { return nil }
                return (joke, comps)
            }
            .prefix(maxScheduled)

        for (joke, comps) in upcoming {
            let content = UNMutableNotificationContent()
            content.title = "Шутка дня"
            content.body = joke.text
            content.sound = .default

            let trigger = UNCalendarNotificationTrigger(dateMatching: comps, repeats: false)
            let request = UNNotificationRequest(
                identifier: "jokeonda.\(joke.date)",
                content: content,
                trigger: trigger
            )
            do {
                try await center.add(request)
            } catch {
                continue
            }
        }
    }

    func pendingCount() async -> Int {
        let center = UNUserNotificationCenter.current()
        return await withCheckedContinuation { cont in
            center.getPendingNotificationRequests { reqs in
                cont.resume(returning: reqs.count)
            }
        }
    }

    func authorizationStatus() async -> UNAuthorizationStatus {
        await UNUserNotificationCenter.current().notificationSettings().authorizationStatus
    }
}
