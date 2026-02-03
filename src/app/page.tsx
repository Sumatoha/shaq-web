'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, MessageSquare, Globe2, MapPin, Camera, Sparkles,
  Check, ChevronDown, Menu, X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCTA = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/auth/callback');
    }
  };

  const features = [
    { icon: Users, title: 'Персональные ссылки', desc: 'Каждый гость получает уникальную ссылку с персональным обращением' },
    { icon: MessageSquare, title: 'RSVP-дашборд', desc: 'Отслеживайте ответы гостей в реальном времени' },
    { icon: Globe2, title: 'Двуязычность', desc: 'Приглашения на казахском и русском языках' },
    { icon: MapPin, title: '2GIS навигация', desc: 'Гости легко найдут дорогу через 2GIS или Google Maps' },
    { icon: Camera, title: 'Photo Hub', desc: 'Соберите все фото гостей после события в одном месте' },
    { icon: Sparkles, title: 'AI-помощник', desc: 'Скоро: AI поможет написать текст приглашения', badge: 'Скоро' },
  ];

  const pricing = [
    {
      name: 'Free',
      price: '0',
      features: ['1 приглашение', 'До 50 гостей', '2 базовые темы', 'RSVP отслеживание'],
      cta: 'Начать бесплатно',
      highlighted: false,
    },
    {
      name: 'Standard',
      price: '2990',
      features: ['До 3 приглашений', 'До 200 гостей', 'Все темы', 'Рассадка гостей', 'Photo Hub'],
      cta: 'Выбрать',
      highlighted: true,
    },
    {
      name: 'Premium',
      price: '5990',
      features: ['Безлимитные приглашения', 'Безлимитные гости', 'Премиум темы', 'Приоритетная поддержка', 'Свой домен'],
      cta: 'Выбрать',
      highlighted: false,
    },
  ];

  const faqs = [
    { q: 'Как гости получат приглашение?', a: 'Вы можете отправить персональную ссылку каждому гостю через WhatsApp, Telegram или другой мессенджер. Каждый гость получит уникальную ссылку с персональным обращением.' },
    { q: 'Можно ли редактировать приглашение после публикации?', a: 'Да, вы можете вносить изменения в любое время. Все гости увидят обновлённую версию по той же ссылке.' },
    { q: 'Что такое RSVP?', a: 'RSVP — это подтверждение присутствия. Гости могут нажать кнопку "Приду" или "Не смогу" прямо в приглашении, а вы увидите их ответы в дашборде.' },
    { q: 'Как работает рассадка гостей?', a: 'В конструкторе есть удобный инструмент для распределения гостей по столам. Вы можете drag-and-drop перетаскивать гостей между столами.' },
    { q: 'Работает ли на мобильных устройствах?', a: 'Да, приглашения оптимизированы для просмотра на смартфонах. Большинство гостей будут смотреть через WhatsApp на телефоне.' },
    { q: 'Есть ли пробный период?', a: 'Бесплатный тариф доступен всегда. Вы можете создать одно приглашение до 50 гостей совершенно бесплатно.' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-background/80 backdrop-blur-lg shadow-sm' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-serif font-bold text-foreground">Shaq</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted hover:text-foreground transition-colors">Возможности</a>
              <a href="#pricing" className="text-sm text-muted hover:text-foreground transition-colors">Тарифы</a>
              <a href="#faq" className="text-sm text-muted hover:text-foreground transition-colors">FAQ</a>
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <Button onClick={handleCTA}>Создать приглашение</Button>
            </div>

            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-background border-t border-muted-foreground/10"
          >
            <div className="px-4 py-4 space-y-4">
              <a href="#features" className="block text-foreground">Возможности</a>
              <a href="#pricing" className="block text-foreground">Тарифы</a>
              <a href="#faq" className="block text-foreground">FAQ</a>
              <Button onClick={handleCTA} className="w-full">Создать приглашение</Button>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight">
                Создайте приглашение, которое запомнят
              </h1>
              <p className="mt-6 text-lg text-muted max-w-xl">
                Красивые цифровые приглашения на свадьбу, той, юбилей.
                Персональные ссылки для гостей, отслеживание RSVP, рассадка гостей.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={handleCTA}>
                  Создать приглашение
                </Button>
                <Button variant="outline" size="lg">
                  Посмотреть примеры
                </Button>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-muted">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-accent" />
                  <span>Бесплатно до 50 гостей</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">2500+</span>
                  <span>приглашений</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative mx-auto w-[280px] h-[560px] bg-foreground rounded-[3rem] p-3 shadow-2xl">
                <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden">
                  <div className="h-full bg-gradient-to-b from-gold-light/20 to-background flex flex-col items-center justify-center p-6 text-center">
                    <div className="text-gold text-xs tracking-widest mb-4">ПРИГЛАШЕНИЕ</div>
                    <h2 className="font-serif text-2xl text-foreground">Айдар & Дана</h2>
                    <div className="mt-4 text-sm text-muted">25 августа 2026</div>
                    <div className="mt-8 w-16 h-px bg-gold/50" />
                    <p className="mt-8 text-sm text-muted leading-relaxed">
                      Құрметті қонақ!<br />
                      Сіздерді біздің үйлену тойымызға шақырамыз
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
              Всё для идеального приглашения
            </h2>
            <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
              Мощные инструменты, которые упростят организацию вашего торжества
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="text-accent" size={24} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  {feature.badge && (
                    <span className="text-xs bg-gold/20 text-gold-DEFAULT px-2 py-0.5 rounded-full">
                      {feature.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-foreground/[0.02]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
              Простые и понятные тарифы
            </h2>
            <p className="mt-4 text-lg text-muted">
              Начните бесплатно, обновитесь когда понадобится
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-2xl p-8 ${
                  plan.highlighted ? 'ring-2 ring-accent shadow-lg scale-105' : 'shadow-sm'
                }`}
              >
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted">₸</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted">
                      <Check size={16} className="text-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.highlighted ? 'primary' : 'outline'}
                  className="w-full mt-8"
                  onClick={handleCTA}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
              Частые вопросы
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between p-5 text-left"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-medium text-foreground">{faq.q}</span>
                  <ChevronDown
                    className={`text-muted transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                    size={20}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5 text-sm text-muted">{faq.a}</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-accent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Готовы создать приглашение?
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Присоединяйтесь к тысячам пар, которые уже используют Shaq
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="mt-8"
            onClick={handleCTA}
          >
            Начать бесплатно
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-muted-foreground/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-serif font-bold">Shaq</span>
          </div>
          <div className="text-sm text-muted">
            Сделано в Казахстане
          </div>
          <div className="flex items-center gap-6 text-sm text-muted">
            <a href="#" className="hover:text-foreground transition-colors">Политика конфиденциальности</a>
            <a href="#" className="hover:text-foreground transition-colors">Условия использования</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
