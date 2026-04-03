import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Background3D from '../components/three/Background3D';
import Button from '../components/ui/Button';
import { BookOpen, Clock, Shield, BarChart3, Sparkles, Users, Zap, QrCode } from 'lucide-react';

const features = [
  {
    icon: Clock,
    title: 'Smart FIFO Queue',
    description: 'Fair first-in-first-out scheduling ensures every student gets served in order.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Zap,
    title: 'Priority Scheduling',
    description: 'Faculty and urgent requests get priority lane access for faster processing.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: BarChart3,
    title: 'Real-time Updates',
    description: 'Live queue tracking with WebSocket technology. See your position update instantly.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Shield,
    title: 'Admin Dashboard',
    description: 'Comprehensive admin panel with analytics, queue management, and book tracking.',
    color: 'from-purple-500 to-violet-500',
  },
  {
    icon: QrCode,
    title: 'QR Code Issuance',
    description: 'Instant book verification with QR code scanning at the library counter.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Sparkles,
    title: 'AI Recommendations',
    description: 'Discover new books based on what similar students have borrowed.',
    color: 'from-indigo-500 to-purple-500',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Landing() {
  return (
    <div className="min-h-screen relative">
      <Background3D />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-medium text-primary-400">Powered by FIFO Scheduling Algorithm</span>
            </div>
            
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Smart Library
              <br />
              <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-pink-400 bg-clip-text text-transparent">
                Book Queue System
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Minimize waiting time for book issuance with our intelligent queue scheduling system.
              Real-time tracking, priority lanes, and a futuristic interface.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="min-w-[200px]">
                  <BookOpen className="w-5 h-5" />
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg" className="min-w-[200px]">
                  <Users className="w-5 h-5" />
                  Login
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {[
              { label: 'Avg Wait Time', value: '~5 min', icon: '⏱️' },
              { label: 'Books Available', value: '2,000+', icon: '📚' },
              { label: 'Daily Requests', value: '150+', icon: '📋' },
              { label: 'Satisfaction', value: '98%', icon: '⭐' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm border-y border-white/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              A complete library management system with cutting-edge scheduling algorithms
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={item}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading font-bold text-lg text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-400">Three simple steps to get your book</p>
          </motion.div>

          <div className="space-y-8">
            {[
              { step: '01', title: 'Browse & Request', desc: 'Search our catalog and request any book with one click. Your request enters the FIFO queue automatically.', emoji: '🔍' },
              { step: '02', title: 'Track Your Position', desc: 'Watch real-time updates as the queue moves. Get notified when you\'re next in line.', emoji: '📊' },
              { step: '03', title: 'Collect Your Book', desc: 'Show your QR code at the counter. Book is issued instantly, and the queue advances.', emoji: '✅' },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex items-start gap-6 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-2xl">
                  {s.emoji}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono font-bold text-primary-400">STEP {s.step}</span>
                  </div>
                  <h3 className="font-heading font-bold text-xl text-white mb-1">{s.title}</h3>
                  <p className="text-gray-400">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto bg-gradient-to-br from-primary-500/20 to-accent-500/20 backdrop-blur-sm rounded-3xl p-12 border border-white/10"
        >
          <h2 className="font-heading text-3xl font-bold text-white mb-4">
            Ready to Skip the Wait?
          </h2>
          <p className="text-gray-400 mb-8">
            Join hundreds of students already using LibQueue for faster book access
          </p>
          <Link to="/register">
            <Button size="lg">
              <Sparkles className="w-5 h-5" />
              Create Free Account
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-8 px-4 text-center">
        <p className="text-sm text-gray-500">
          © 2026 LibQueue — Library Book Issue Scheduling System
        </p>
      </footer>
    </div>
  );
}
