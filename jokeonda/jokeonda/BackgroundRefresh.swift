import Foundation
import BackgroundTasks

enum BackgroundRefresh {
    static let taskIdentifier = "com.jokeonda.refresh"
    private static let interval: TimeInterval = 6 * 60 * 60

    static func register() {
        BGTaskScheduler.shared.register(forTaskWithIdentifier: taskIdentifier, using: nil) { task in
            guard let refreshTask = task as? BGAppRefreshTask else {
                task.setTaskCompleted(success: false)
                return
            }
            handle(task: refreshTask)
        }
    }

    static func schedule() {
        let request = BGAppRefreshTaskRequest(identifier: taskIdentifier)
        request.earliestBeginDate = Date(timeIntervalSinceNow: interval)
        try? BGTaskScheduler.shared.submit(request)
    }

    private static func handle(task: BGAppRefreshTask) {
        schedule()

        let work = Task {
            do {
                let feed = try await JokeStore.fetchAndPersist()
                try Task.checkCancellation()
                await NotificationScheduler.shared.reschedule(for: feed.jokes)
                task.setTaskCompleted(success: true)
            } catch {
                task.setTaskCompleted(success: false)
            }
        }

        task.expirationHandler = {
            work.cancel()
        }
    }
}
