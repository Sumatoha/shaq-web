import SwiftUI
import UIKit
import UserNotifications

struct ContentView: View {
    @EnvironmentObject private var store: JokeStore
    @State private var authStatus: UNAuthorizationStatus = .notDetermined
    @State private var pendingCount: Int = 0

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    header
                    jokeCard
                    statusBlock
                    upcomingList
                }
                .padding(20)
            }
            .background(Color(.systemGroupedBackground))
            .navigationTitle("jokeonda")
            .refreshable {
                await store.refresh()
                await refreshStatus()
            }
            .task {
                await refreshStatus()
            }
        }
    }

    private var header: some View {
        VStack(spacing: 6) {
            Text("Одна шутка. Каждый день. В 09:11.")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity, alignment: .center)
    }

    private var jokeCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(todayHeadline)
                .font(.caption.weight(.semibold))
                .foregroundStyle(.secondary)
                .textCase(.uppercase)
            if let joke = store.todaysJoke {
                Text(joke.text)
                    .font(.title3)
                    .fixedSize(horizontal: false, vertical: true)
            } else {
                Text("Сегодняшней шутки ещё нет в ленте. Загляни позже или потяни, чтобы обновить.")
                    .font(.body)
                    .foregroundStyle(.secondary)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(20)
        .background(
            RoundedRectangle(cornerRadius: 20)
                .fill(Color(.secondarySystemBackground))
        )
    }

    private var statusBlock: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: authStatusIcon)
                    .foregroundStyle(authStatusColor)
                Text(authStatusLabel)
                    .font(.subheadline)
                Spacer()
                if authStatus == .notDetermined {
                    Button("Разрешить") {
                        Task {
                            _ = await NotificationScheduler.shared.requestAuthorizationIfNeeded()
                            await store.refresh()
                            await refreshStatus()
                        }
                    }
                    .buttonStyle(.borderedProminent)
                    .controlSize(.small)
                } else if authStatus == .denied {
                    Button("Настройки") {
                        if let url = URL(string: UIApplication.openSettingsURLString) {
                            UIApplication.shared.open(url)
                        }
                    }
                    .buttonStyle(.bordered)
                    .controlSize(.small)
                }
            }
            HStack {
                Image(systemName: "calendar.badge.clock")
                    .foregroundStyle(.secondary)
                Text("Запланировано шуток: \(pendingCount)")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                Spacer()
            }
            if let err = store.lastError {
                Text("Ошибка: \(err)")
                    .font(.caption)
                    .foregroundStyle(.red)
            }
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color(.secondarySystemBackground))
        )
    }

    @ViewBuilder
    private var upcomingList: some View {
        let upcoming = store.upcomingJokes.dropFirst()
        if !upcoming.isEmpty {
            VStack(alignment: .leading, spacing: 12) {
                Text("Дальше")
                    .font(.headline)
                ForEach(Array(upcoming.prefix(5))) { joke in
                    HStack(alignment: .top, spacing: 12) {
                        Text(joke.date)
                            .font(.caption.monospacedDigit())
                            .foregroundStyle(.secondary)
                            .frame(width: 84, alignment: .leading)
                        Text("•••")
                            .font(.body)
                            .foregroundStyle(.tertiary)
                    }
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(16)
            .background(
                RoundedRectangle(cornerRadius: 16)
                    .fill(Color(.secondarySystemBackground))
            )
        }
    }

    private var todayHeadline: String {
        let f = DateFormatter()
        f.locale = Locale(identifier: "ru_RU")
        f.dateFormat = "d MMMM"
        return "Сегодня · \(f.string(from: Date()))"
    }

    private var authStatusLabel: String {
        switch authStatus {
        case .authorized, .provisional, .ephemeral:
            return "Уведомления включены"
        case .denied:
            return "Уведомления отключены"
        case .notDetermined:
            return "Разреши уведомления, чтобы получать шутку"
        @unknown default:
            return "Статус неизвестен"
        }
    }

    private var authStatusIcon: String {
        switch authStatus {
        case .authorized, .provisional, .ephemeral: return "bell.fill"
        case .denied: return "bell.slash.fill"
        default: return "bell"
        }
    }

    private var authStatusColor: Color {
        switch authStatus {
        case .authorized, .provisional, .ephemeral: return .green
        case .denied: return .red
        default: return .orange
        }
    }

    private func refreshStatus() async {
        authStatus = await NotificationScheduler.shared.authorizationStatus()
        pendingCount = await NotificationScheduler.shared.pendingCount()
    }
}

#Preview {
    ContentView().environmentObject(JokeStore())
}
