import SwiftUI

@main
struct jokeondaApp: App {
    @StateObject private var store = JokeStore()
    @Environment(\.scenePhase) private var scenePhase

    init() {
        BackgroundRefresh.register()
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(store)
                .task {
                    await store.bootstrap()
                }
        }
        .onChange(of: scenePhase) { phase in
            switch phase {
            case .active:
                Task { await store.refresh() }
            case .background:
                BackgroundRefresh.schedule()
            default:
                break
            }
        }
    }
}
