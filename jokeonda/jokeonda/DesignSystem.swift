import SwiftUI

enum DS {
    static let bg = Color(red: 0.043, green: 0.043, blue: 0.051)
    static let surface = Color(red: 0.09, green: 0.09, blue: 0.10)
    static let stroke = Color(red: 0.16, green: 0.16, blue: 0.18)
    static let fg = Color(red: 0.97, green: 0.97, blue: 0.97)
    static let muted = Color(red: 0.45, green: 0.45, blue: 0.48)
    static let dim = Color(red: 0.28, green: 0.28, blue: 0.30)
    static let accent = Color(red: 0.83, green: 1.0, blue: 0.10)
    static let danger = Color(red: 1.0, green: 0.36, blue: 0.36)

    static let pagePadding: CGFloat = 24
}

extension Font {
    static func mono(_ size: CGFloat, _ weight: Font.Weight = .semibold) -> Font {
        .system(size: size, weight: weight, design: .monospaced)
    }

    static func display(_ size: CGFloat, _ weight: Font.Weight = .black) -> Font {
        .system(size: size, weight: weight, design: .default)
    }
}
