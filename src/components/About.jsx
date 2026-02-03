import { Shield, Target, Eye, Heart, Code, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { TEAM_INFO, TAXGRID_BENEFITS, GST_FACTS, FRAUD_STATISTICS, GI_FRAUD_STATS, FAQS, IMPACT_STORIES } from '../utils/appData';

export default function About() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center p-12 bg-gradient-to-br from-primary to-secondary text-white rounded-2xl shadow-xl">
        <Shield className="w-20 h-20 mx-auto mb-6" />
        <h1 className="text-5xl font-bold mb-4">About TaxGrid</h1>
        <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
          {TEAM_INFO.mission}
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="p-8 bg-white rounded-xl shadow-md border-l-4 border-primary">
          <Target className="w-12 h-12 text-primary mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            {TEAM_INFO.mission}
          </p>
        </div>
        <div className="p-8 bg-white rounded-xl shadow-md border-l-4 border-secondary">
          <Eye className="w-12 h-12 text-secondary mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Vision</h2>
          <p className="text-gray-700 leading-relaxed">
            {TEAM_INFO.vision}
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="p-8 bg-red-50 rounded-xl border border-red-200">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-10 h-10 text-red-600" />
          <h2 className="text-3xl font-bold text-red-900">The GST Fraud Crisis</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-4xl font-bold text-red-600 mb-2">{FRAUD_STATISTICS.totalFraud}</p>
            <p className="text-sm text-gray-600">Total GST Fraud ({FRAUD_STATISTICS.period})</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-4xl font-bold text-red-600 mb-2">{FRAUD_STATISTICS.fakeFirmsDetected}</p>
            <p className="text-sm text-gray-600">Fake Firms Detected</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-4xl font-bold text-red-600 mb-2">{FRAUD_STATISTICS.fakeInvoices}</p>
            <p className="text-sm text-gray-600">Fake Invoices Generated</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-red-900 mb-4">GI Product Fraud</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {GI_FRAUD_STATS.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-red-200">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{item.product}</h4>
                  <span className="text-red-600 font-bold text-lg">{item.fakePenetration}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Genuine:</span> {item.genuineSource}
                </p>
                <p className="text-xs text-red-700">⚠️ {item.issue}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How TaxGrid Helps */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How TaxGrid Protects You</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TAXGRID_BENEFITS.map((benefit, index) => (
            <div key={index} className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-200">
              <div className="text-5xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-700 mb-4 text-sm leading-relaxed">{benefit.description}</p>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-primary font-semibold">{benefit.stats}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Real Impact Stories */}
      <section className="p-8 bg-green-50 rounded-xl border border-green-200">
        <h2 className="text-3xl font-bold text-green-900 mb-6 text-center">Real Impact Stories</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {IMPACT_STORIES.map((story, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full mb-3">
                {story.category}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{story.title}</h3>
              <p className="text-sm text-gray-600">{story.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GST Facts */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">GST in India: By the Numbers</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {GST_FACTS.map((item, index) => (
            <div key={index} className="p-6 bg-blue-50 rounded-lg border-l-4 border-primary">
              <TrendingUp className="w-6 h-6 text-primary mb-3" />
              <p className="text-lg font-semibold text-gray-900 mb-2">{item.fact}</p>
              <p className="text-xs text-gray-600">Source: {item.source}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values */}
      <section className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Core Values</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {TEAM_INFO.values.map((value, index) => (
            <div key={index} className="px-6 py-3 bg-white rounded-full shadow-md border border-gray-200">
              <p className="font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4 max-w-4xl mx-auto">
          {FAQS.map((faq, index) => (
            <details key={index} className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
              <summary className="font-semibold text-gray-900 cursor-pointer hover:text-primary">
                {faq.question}
              </summary>
              <p className="mt-3 text-gray-700 leading-relaxed text-sm">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Open Source */}
      <section className="p-8 bg-gray-900 text-white rounded-xl text-center">
        <Code className="w-16 h-16 mx-auto mb-4 text-green-400" />
        <h2 className="text-3xl font-bold mb-4">Free & Open Source</h2>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          TaxGrid is built by the community, for the community. All code is open source,
          auditable, and free to use. Contribute on GitHub!
        </p>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          <Code className="w-5 h-5" />
          View on GitHub
        </a>
      </section>

      {/* CTA */}
      <section className="p-12 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl text-center">
        <Users className="w-16 h-16 mx-auto mb-4" />
        <h2 className="text-4xl font-bold mb-4">Join the Movement</h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Help us build a fraud-free GST ecosystem. Every validation, every scan,
          every bill split brings us closer to transparency.
        </p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="px-8 py-4 bg-white text-primary rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
        >
          Start Validating GSTINs
        </button>
      </section>
    </div>
  );
}
