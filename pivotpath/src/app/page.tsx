export default function Home() {
  return (
    <>
      {/* Top Navigation Bar */}
      <header className="sticky top-0 w-full z-50 flex justify-between items-center px-gutter py-4 bg-surface/95 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-3">
          <img
            alt="PivotPath Logo"
            className="w-10 h-10 rounded-md"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKnTvxF0kUasd7T66SnBK2w2AjLQsqW5BiQN1TwvLlEI0aH4LL6wHC-QwztQpPgP2SLyfBSQEf4yBc2EXmYGTozG2lNi1xzaxxUHKh5mQkNVZ4BPVipM-9Y9DCNxDEQEcf-3FFk8MzPH58lMeaPsqG0JZuthGS-iC2gII9aw7YV9Wd3Ubz6lq4EzIO5d-A5KfsYZoq9Xw_ik-wXvaT5P9MtAlc2nbhuYPZO4-SZeUa1mfJ0WifAkKGuA"
          />
          <span className="text-headline-md font-bold text-primary">PivotPath</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a className="text-secondary font-bold border-b-2 border-secondary pb-1 transition-colors" href="#">
            Dashboard
          </a>
          <a className="text-on-surface-variant hover:text-secondary transition-colors text-label-md" href="#">
            Roadmap
          </a>
          <a className="text-on-surface-variant hover:text-secondary transition-colors text-label-md" href="#">
            Mentors
          </a>
          <a className="text-on-surface-variant hover:text-secondary transition-colors text-label-md" href="#">
            Resources
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <button className="px-6 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:opacity-90 transition-opacity">
            Get Started
          </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-32 px-gutter">
          <div className="max-w-container-max mx-auto grid lg:grid-cols-2 items-center gap-space-md relative z-10">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-high text-secondary rounded-full text-label-sm">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Empowering your next professional chapter</span>
              </div>
              <h1 className="text-headline-xl text-primary leading-tight">
                Your Next Chapter <br />
                <span className="text-secondary">Starts Here.</span>
              </h1>
              <p className="text-body-lg text-on-surface-variant max-w-xl">
                We help you navigate your career transition with a personalized plan, financial
                guidance, and advice from mentors who have been in your shoes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="px-space-xl py-4 bg-primary text-on-primary rounded-xl text-label-md flex items-center justify-center gap-2 hover:shadow-lg transition-all transform hover:-translate-y-1">
                  Get Started
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <button className="px-space-xl py-4 border-2 border-secondary text-secondary rounded-xl text-label-md flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors">
                  Watch Success Stories
                </button>
              </div>
              <div className="flex items-center gap-6 pt-8 grayscale opacity-60">
                <span className="text-label-sm uppercase tracking-widest text-on-surface-variant">
                  Trusted by professionals at
                </span>
                <div className="flex gap-4">
                  <span className="material-symbols-outlined text-3xl">corporate_fare</span>
                  <span className="material-symbols-outlined text-3xl">domain</span>
                  <span className="material-symbols-outlined text-3xl">apartment</span>
                </div>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute -top-12 -right-12 w-96 h-96 bg-surface-variant/30 rounded-full blur-3xl animate-pulse" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/30">
                <img
                  className="w-full aspect-[4/3] object-cover"
                  alt="A professional woman sitting comfortably and smiling at her laptop in a bright, modern office, representing a successful career transition."
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAf9GO5TUO9YOIxYf8b7vgATNWKjOidFtmfF3escGFXH6FWcEGIdC9KSgF_l8htWHPUapY1UXzo964SZ4uhAtMmJsnuOTPcR26vWGbrWTeTO5jMuq0jACl0fEqbBl2Cf_jbqhC97JGjv9UGTElctM0jEGc2riDrHX-cEY4eWkWWKavk-wLwZ47Oxmt1ewAdRskPQUbTuKXL0te8vUqpLuq226MSHqy0wm_D9PIFtDin1h5TLDM0yuQjxg"
                />
                <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur-md rounded-xl border border-white/50 shadow-xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                      <span className="material-symbols-outlined">trending_up</span>
                    </div>
                    <div>
                      <p className="text-label-md text-primary">Sarah&apos;s Transition</p>
                      <p className="text-label-sm text-on-surface-variant">
                        Marketing → Tech Product Lead
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-2">
                    <div className="bg-tertiary-fixed-dim h-2 rounded-full w-full shadow-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Pillars Section (Bento Grid Style) */}
        <section className="py-space-xl px-gutter bg-surface-container-low">
          <div className="max-w-container-max mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-headline-lg text-primary">Three Pillars of Success</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto text-body-md">
                Our systematic approach removes the guesswork from your career pivot, ensuring you
                move forward with confidence and clarity.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md">
              {/* Custom Roadmaps */}
              <div className="md:col-span-8 bg-white p-8 rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between group hover:shadow-md transition-shadow">
                <div className="space-y-6">
                  <div className="w-14 h-14 bg-surface-container rounded-xl flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-3xl">route</span>
                  </div>
                  <div>
                    <h3 className="text-headline-md text-primary mb-2">Custom Roadmaps</h3>
                    <p className="text-on-surface-variant leading-relaxed">
                      No two journeys are the same. We analyze your current skills and future goals
                      to build a day-by-day roadmap tailored exclusively to your professional
                      evolution.
                    </p>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-label-md">
                      <span className="material-symbols-outlined text-secondary text-xl">
                        check_circle
                      </span>
                      <span>Skills Gap Analysis</span>
                    </li>
                    <li className="flex items-center gap-3 text-label-md">
                      <span className="material-symbols-outlined text-secondary text-xl">
                        check_circle
                      </span>
                      <span>Weekly Milestone Tracking</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-8 relative overflow-hidden rounded-lg h-48 bg-slate-50">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt="A clean UI dashboard mockup showing a vertical progress roadmap with steps like Initial Assessment, Skill Acquisition, and Market Positioning."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvlc1sti8oQBQuJpx8_pYw4Ws6MZy9ga8cl15JAuTPFzmZ4I42K4UX1R-_6qJCFm1LGk_ZjOv-qV_i-suStpOgkoOJ0dhFQIDYjGtq46pokza0pJlLB_gervamzwLuopcaq-i1mqLFHen7KIF6Fnlj7utukqrDjAEZ1BqGZlFTjAJXE4JnSJ5AiLtruIywZKt3kujhJ-ceUzAUfLSsM1oxXYNpBRCQXwJ09tYW3UZ55UP2udrYpfJYWg"
                  />
                </div>
              </div>
              {/* Financial Guidance */}
              <div className="md:col-span-4 bg-primary text-on-primary p-8 rounded-2xl flex flex-col justify-between shadow-xl">
                <div className="space-y-6">
                  <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-tertiary-fixed">
                    <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
                  </div>
                  <div>
                    <h3 className="text-headline-md text-white mb-2">Financial Guidance</h3>
                    <p className="text-on-primary-container leading-relaxed">
                      Transitioning doesn&apos;t have to mean financial instability. We provide
                      tools to calculate your runway and optimize your budget.
                    </p>
                  </div>
                </div>
                <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-label-sm text-on-primary-container uppercase">
                        Target Runway
                      </p>
                      <p className="text-headline-md font-bold text-white">6 Months</p>
                    </div>
                    <span className="material-symbols-outlined text-tertiary-fixed">insights</span>
                  </div>
                </div>
              </div>
              {/* Expert Mentorship */}
              <div className="md:col-span-4 bg-white p-8 rounded-2xl shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow">
                <div className="space-y-6">
                  <div className="w-14 h-14 bg-surface-container-highest rounded-xl flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-3xl">groups</span>
                  </div>
                  <div>
                    <h3 className="text-headline-md text-primary mb-2">Expert Mentorship</h3>
                    <p className="text-on-surface-variant">
                      Connect with people who have successfully navigated the exact transition
                      you&apos;re pursuing.
                    </p>
                  </div>
                  <div className="flex -space-x-4">
                    <div className="w-12 h-12 rounded-full border-4 border-white bg-slate-200">
                      <img
                        className="w-full h-full rounded-full object-cover"
                        alt="Headshot of a mentor who transitioned careers."
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnASP6Lc61dDyeAEbEp5_vcuYCrqWCjZeQgaHm-FEdAbkr2MXzmETKr65NTme9FP0-RTV9QvWMGpcrieb5es-T4gOV2sHV3NiTOUFYWDpeGnic2YP_xdYP57UExacVRz5hQ31_H6kOFG4lGnJgv8sXhFfx4mvDXVFGOdBLSufbLbD9U4Xu9YkNeuxXRnUuHllpevikUq0Gvt0Ot_m80FbazI9B5VPOaSGYredpHqmyKesqtnfFwLkT8A"
                      />
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-white bg-slate-200">
                      <img
                        className="w-full h-full rounded-full object-cover"
                        alt="Headshot of a mentor who transitioned careers."
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPyPPVirbqDYMPQ3uScWlHM-1JAxtKANFLVzdB_bZ047EfTB39U2XQIOKfoF8y2ICWnNj6kYiCmgOkwicfJCMXN1z2D5K6qfneg7yi501IJi06SRNQZVTBWwQhNi14r5UvUOEucrtP4GDMS2Dk6PjUDAr6lsnLByKkEglRT-hcDxcTNdhkecjUxAqmmHcOTDOSDjoSbh0dnrEekNVLGVcTBDuhZNDPbONXigl_1bEXTFE-su4RC4QVTQ"
                      />
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-white bg-slate-200">
                      <img
                        className="w-full h-full rounded-full object-cover"
                        alt="Headshot of a mentor who transitioned careers."
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9Ldw0Rm32pH0un0a_KlM46a8ZoAGTHiPrLw_3F6cpDjXV_FnvH8ZLOjuzVHixwGd6WfFAbRI1WFgflUAR4JWPHoS0-zDWzuwwtfX27NcQjRsF5TI63o-CTg4ctIeGp2Ag_5bMabSNSD2Nc3-n_mFerQ6eVTn6fSdmXTfG3WIt1FpBrSvGKPiT2Y2moVcy6421vNcWiE9WxjMlWWwD0wbiOFlXGJkZqSI5uArQPcnexqf8iiLWCb0gBw"
                      />
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-white bg-secondary flex items-center justify-center text-white font-bold text-xs">
                      +50
                    </div>
                  </div>
                </div>
              </div>
              {/* Success CTA */}
              <div className="md:col-span-8 bg-gradient-to-br from-secondary to-secondary-container p-12 rounded-2xl relative overflow-hidden flex items-center shadow-lg">
                <div className="relative z-10 max-w-lg">
                  <h3 className="text-headline-lg text-white mb-4">Start your journey today.</h3>
                  <p className="text-white/80 mb-8 text-body-md">
                    Join 5,000+ professionals who pivoted their careers with PivotPath. Your
                    personalized strategy is just a click away.
                  </p>
                  <button className="bg-white text-secondary px-8 py-3 rounded-lg font-bold text-label-md hover:bg-surface-bright transition-colors">
                    Create My Free Account
                  </button>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 pointer-events-none">
                  <span className="material-symbols-outlined text-[300px] absolute -right-20 -top-20">
                    celebration
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Logos */}
        <section className="py-16 border-y border-surface-container">
          <div className="max-w-container-max mx-auto px-gutter">
            <p className="text-center text-label-sm uppercase tracking-widest text-on-surface-variant mb-12">
              PivotPath Alumni work at the world&apos;s leading companies
            </p>
            <div className="flex flex-wrap justify-center items-center gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-4xl">cloud</span>
                <span className="font-bold text-2xl tracking-tighter">CLOUDWARE</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-4xl">rocket_launch</span>
                <span className="font-bold text-2xl tracking-tighter">NEXTGEN</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-4xl">shield</span>
                <span className="font-bold text-2xl tracking-tighter">SECURE.IO</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-4xl">psychology</span>
                <span className="font-bold text-2xl tracking-tighter">MINDSHARE</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-4xl">forest</span>
                <span className="font-bold text-2xl tracking-tighter">ECOGROWTH</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-space-lg px-gutter flex flex-col md:flex-row justify-between items-center gap-space-md bg-surface-container">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-3">
            <img
              alt="PivotPath Logo"
              className="w-8 h-8 rounded-md grayscale"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKnTvxF0kUasd7T66SnBK2w2AjLQsqW5BiQN1TwvLlEI0aH4LL6wHC-QwztQpPgP2SLyfBSQEf4yBc2EXmYGTozG2lNi1xzaxxUHKh5mQkNVZ4BPVipM-9Y9DCNxDEQEcf-3FFk8MzPH58lMeaPsqG0JZuthGS-iC2gII9aw7YV9Wd3Ubz6lq4EzIO5d-A5KfsYZoq9Xw_ik-wXvaT5P9MtAlc2nbhuYPZO4-SZeUa1mfJ0WifAkKGuA"
            />
            <span className="text-headline-md font-bold text-primary">PivotPath</span>
          </div>
          <p className="text-body-md text-on-surface-variant max-w-sm text-center md:text-left">
            © 2026 PivotPath. Empowering your next chapter. Supporting high-stakes career
            transitions with data-driven strategy.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-12 text-center md:text-left">
          <div className="space-y-4">
            <h4 className="text-label-md text-primary uppercase tracking-wider">Resources</h4>
            <nav className="flex flex-col gap-2">
              <a className="text-on-surface-variant hover:text-primary transition-colors text-label-sm" href="#">
                Success Stories
              </a>
              <a className="text-on-surface-variant hover:text-primary transition-colors text-label-sm" href="#">
                Financial Guide
              </a>
              <a className="text-on-surface-variant hover:text-primary transition-colors text-label-sm" href="#">
                Blog
              </a>
            </nav>
          </div>
          <div className="space-y-4">
            <h4 className="text-label-md text-primary uppercase tracking-wider">Company</h4>
            <nav className="flex flex-col gap-2">
              <a className="text-on-surface-variant hover:text-primary transition-colors text-label-sm" href="#">
                Privacy Policy
              </a>
              <a className="text-on-surface-variant hover:text-primary transition-colors text-label-sm" href="#">
                Contact Support
              </a>
              <a className="text-on-surface-variant hover:text-primary transition-colors text-label-sm" href="#">
                Careers
              </a>
            </nav>
          </div>
        </div>
        <div className="flex gap-4">
          <a
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm hover:text-secondary transition-colors"
            href="#"
          >
            <span className="material-symbols-outlined">alternate_email</span>
          </a>
          <a
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm hover:text-secondary transition-colors"
            href="#"
          >
            <span className="material-symbols-outlined">public</span>
          </a>
        </div>
      </footer>
    </>
  );
}
