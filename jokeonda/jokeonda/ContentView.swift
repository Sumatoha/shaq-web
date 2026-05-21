import SwiftUI
import UIKit
import UserNotifications

struct ContentView: View {
    @EnvironmentObject private var store: JokeStore
    @Environment(\.scenePhase) private var scenePhase
    @State private var authStatus: UNAuthorizationStatus = .notDetermined

    var body: some View {
        GeometryReader { geo in
            ZStack {
                DS.bg.ignoresSafeArea()

                ScrollView(showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 0) {
                        TopBar()
                            .padding(.top, 12)

                        Spacer(minLength: 28)

                        DateBlock(date: Date())

                        AccentBar()
                            .padding(.top, 20)
                            .padding(.bottom, 24)

                        JokeBlock(joke: store.todaysJoke, isLoading: store.isLoading)

                        Spacer(minLength: 28)

                        FooterBlock(
                            authStatus: authStatus,
                            scheduledDates: scheduledDates,
                            onRequestAuth: requestAuth,
                            onOpenSettings: openSettings
                        )
                        .padding(.bottom, 12)
                    }
                    .padding(.horizontal, DS.pagePadding)
                    .frame(minHeight: geo.size.height, alignment: .top)
                }
                .refreshable {
                    await store.refresh()
                    await refreshStatus()
                }
            }
        }
        .preferredColorScheme(.dark)
        .task {
            await refreshStatus()
        }
        .onChange(of: scenePhase) { phase in
            if phase == .active {
                Task { await refreshStatus() }
            }
        }
    }

    private var scheduledDates: Set<String> {
        Set(store.upcomingJokes.map(\.date))
    }

    private func requestAuth() {
        Task {
            _ = await NotificationScheduler.shared.requestAuthorizationIfNeeded()
            await store.refresh()
            await refreshStatus()
        }
    }

    private func openSettings() {
        guard let url = URL(string: UIApplication.openSettingsURLString) else { return }
        UIApplication.shared.open(url)
    }

    private func refreshStatus() async {
        authStatus = await NotificationScheduler.shared.authorizationStatus()
    }
}

private struct TopBar: View {
    var body: some View {
        HStack(alignment: .firstTextBaseline) {
            HStack(spacing: 8) {
                Circle()
                    .fill(DS.accent)
                    .frame(width: 8, height: 8)
                Text("JOKEONDA")
                    .font(.mono(12, .bold))
                    .tracking(2)
                    .foregroundStyle(DS.fg)
            }
            Spacer()
            Text("09:11")
                .font(.mono(12, .bold))
                .tracking(1.5)
                .foregroundStyle(DS.accent)
            Text("/")
                .font(.mono(12, .bold))
                .foregroundStyle(DS.dim)
                .padding(.horizontal, 6)
            Text(Self.todayShort())
                .font(.mono(12, .bold))
                .tracking(1)
                .foregroundStyle(DS.muted)
        }
    }

    private static func todayShort() -> String {
        Joke.shortDisplayFormatter.string(from: Date())
    }
}

private struct DateBlock: View {
    let date: Date

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(weekday)
                .font(.mono(11, .semibold))
                .tracking(3)
                .foregroundStyle(DS.muted)
            Text(headline)
                .font(.display(56, .black))
                .tracking(-1.5)
                .foregroundStyle(DS.fg)
                .lineLimit(1)
                .minimumScaleFactor(0.7)
        }
    }

    private var weekday: String {
        Joke.weekdayFormatter.string(from: date).uppercased()
    }

    private var headline: String {
        Joke.headlineFormatter.string(from: date).lowercased()
    }
}

private struct AccentBar: View {
    var body: some View {
        ZStack(alignment: .leading) {
            Rectangle()
                .fill(DS.stroke)
                .frame(maxWidth: .infinity)
                .frame(height: 1)
            Rectangle()
                .fill(DS.accent)
                .frame(width: 72, height: 6)
        }
        .frame(height: 6)
    }
}

private struct JokeBlock: View {
    let joke: Joke?
    let isLoading: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text(label)
                .font(.mono(11, .semibold))
                .tracking(3)
                .foregroundStyle(DS.accent.opacity(joke == nil ? 0.6 : 1))

            if let joke {
                Text(joke.text)
                    .font(.display(jokeFontSize(for: joke.text), .bold))
                    .tracking(-0.5)
                    .foregroundStyle(DS.fg)
                    .fixedSize(horizontal: false, vertical: true)
                    .lineSpacing(2)
                    .transition(.opacity.combined(with: .move(edge: .bottom)))
            } else {
                Text("ТИШИНА.")
                    .font(.display(72, .black))
                    .tracking(-2)
                    .foregroundStyle(DS.fg)
                Text(isLoading ? "Грузим ленту." : "Шутки на сегодня нет. Завтра в 09:11.")
                    .font(.mono(13, .medium))
                    .foregroundStyle(DS.muted)
                    .padding(.top, 4)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .animation(.easeInOut(duration: 0.25), value: joke?.id)
    }

    private var label: String {
        joke == nil ? "// ПУСТО" : "// ШУТКА ДНЯ"
    }

    private func jokeFontSize(for text: String) -> CGFloat {
        switch text.count {
        case ..<60: return 34
        case ..<140: return 28
        case ..<220: return 22
        default: return 18
        }
    }
}

private struct FooterBlock: View {
    let authStatus: UNAuthorizationStatus
    let scheduledDates: Set<String>
    let onRequestAuth: () -> Void
    let onOpenSettings: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            Rectangle()
                .fill(DS.stroke)
                .frame(height: 1)

            QueueRow(scheduledDates: scheduledDates)

            statusRow
        }
        .padding(.bottom, 8)
    }

    @ViewBuilder
    private var statusRow: some View {
        switch authStatus {
        case .authorized, .provisional, .ephemeral:
            HStack(spacing: 10) {
                Circle()
                    .fill(DS.accent)
                    .frame(width: 7, height: 7)
                Text("УВЕДОМЛЕНИЯ ВКЛ · УДАР В 09:11")
                    .font(.mono(11, .semibold))
                    .tracking(2)
                    .foregroundStyle(DS.muted)
                Spacer()
            }
        case .denied:
            Button(action: onOpenSettings) {
                HStack {
                    Text("УВЕДОМЛЕНИЯ ВЫКЛ")
                        .font(.mono(12, .bold))
                        .tracking(2)
                        .foregroundStyle(DS.danger)
                    Spacer()
                    Text("ОТКРЫТЬ НАСТРОЙКИ →")
                        .font(.mono(11, .bold))
                        .tracking(1.5)
                        .foregroundStyle(DS.fg)
                }
                .padding(.vertical, 14)
                .padding(.horizontal, 18)
                .background(
                    Rectangle()
                        .strokeBorder(DS.danger, lineWidth: 1.5)
                )
            }
            .buttonStyle(.plain)
        case .notDetermined:
            Button(action: onRequestAuth) {
                HStack {
                    Text("ВКЛЮЧИТЬ ШУТКУ ДНЯ")
                        .font(.mono(13, .black))
                        .tracking(2)
                        .foregroundStyle(DS.bg)
                    Spacer()
                    Text("→")
                        .font(.mono(16, .black))
                        .foregroundStyle(DS.bg)
                }
                .padding(.vertical, 18)
                .padding(.horizontal, 20)
                .background(DS.accent)
            }
            .buttonStyle(.plain)
        @unknown default:
            EmptyView()
        }
    }
}

private struct QueueRow: View {
    let scheduledDates: Set<String>
    private let days = 14

    var body: some View {
        let states = stateArray()
        let filled = states.lazy.filter { $0 }.count

        VStack(alignment: .leading, spacing: 8) {
            HStack(spacing: 6) {
                ForEach(0..<days, id: \.self) { offset in
                    Rectangle()
                        .fill(states[offset] ? DS.accent : DS.dim)
                        .frame(width: 10, height: 18)
                }
                Spacer(minLength: 0)
            }
            Text("ОЧЕРЕДЬ · \(filled) ИЗ \(days) ДНЕЙ")
                .font(.mono(10, .semibold))
                .tracking(2)
                .foregroundStyle(DS.muted)
        }
    }

    private func stateArray() -> [Bool] {
        let cal = Calendar.current
        let now = Date()
        return (0..<days).map { offset in
            guard let day = cal.date(byAdding: .day, value: offset, to: now) else { return false }
            return scheduledDates.contains(Joke.dateFormatter.string(from: day))
        }
    }
}

#Preview {
    ContentView().environmentObject(JokeStore())
}
