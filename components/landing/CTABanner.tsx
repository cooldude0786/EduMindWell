import { Button } from '@/components/ui/button'
import { CheckCircle2, Lock, Star } from 'lucide-react'
import { CTA_BANNER } from '@/lib/landing-constants'

export function CTABanner() {
  return (
    <section id="cta" className="py-xl px-6 bg-surface-container-lowest">
      <div className="max-w-4xl mx-auto">
        <div className="bg-primary rounded-[48px] p-12 md:p-24 text-center overflow-hidden relative">
          {/* Radial Gradient Overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, #10b981 0%, transparent 100%)',
            }}
          ></div>

          <div className="relative z-10">
            <h1 className="font-h1 text-h1 text-white mb-2">
              {CTA_BANNER.headline}
            </h1>
            <p className="text-h2 text-secondary font-h1 mb-6">
              {CTA_BANNER.subheadline}
            </p>
            <p className="text-body-lg text-primary-fixed-dim max-w-2xl mx-auto mb-8">
              {CTA_BANNER.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                className="h-auto rounded-full bg-on-tertiary-container px-10 py-4 text-button font-button shadow-[0_16px_35px_rgba(31,41,55,0.18)] hover:bg-primary hover:shadow-[0_18px_40px_rgba(37,99,235,0.24)] transition-all duration-200"
                style={{ minWidth: 260, color: '#ffffff' }}
              >
                {CTA_BANNER.primaryBtn}
              </Button>
              <Button
                variant="outline"
                className="h-auto rounded-full border border-white/85 bg-transparent px-10 py-4 text-button font-button hover:bg-white/8 hover:border-white transition-all duration-200"
                style={{ minWidth: 260, color: '#ffffff' }}
              >
                {CTA_BANNER.secondaryBtn}
              </Button>
            </div>

            {/* Trust Signals */}
            <div className="border-t border-white/10 pt-8 opacity-60 flex flex-col sm:flex-row justify-center gap-6 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Certified Counsellors
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Secure & Confidential
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                No Commitment Required
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
