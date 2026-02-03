import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="text-6xl font-serif font-bold text-foreground mb-4">404</h1>
        <p className="text-xl text-muted mb-8">Страница не найдена</p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-light transition-colors"
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}
