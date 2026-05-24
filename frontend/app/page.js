const installUrl = process.env.NEXT_PUBLIC_GITHUB_APP_INSTALL_URL || '#';
const feedbackUrl = process.env.NEXT_PUBLIC_FEEDBACK_FORM_URL || '#';

const features = [
  'Scans pull request diffs',
  'Detects leaked API keys and secrets',
  'Finds common JS/TS/Python security risks',
  'Posts a clear PR comment',
  'Does not require AI API keys',
  'Designed for free demo validation'
];

const steps = [
  'Install the GitHub App',
  'Select a test repository',
  'Open or update a pull request',
  'CodeShield AI scans changed code',
  'Review the bot comment on GitHub',
  'Send feedback so we can improve it'
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl shadow-black/30 sm:p-12">
          <div className="mb-5 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
            Free demo • GitHub PR Security Bot
          </div>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
            Catch secrets and security bugs before you merge.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            CodeShield AI is a demo GitHub App that scans pull requests for leaked credentials and common vulnerability patterns, then comments directly on the PR.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="https://github.com/apps/codeshield-ai-demo/installations/new">
              Install GitHub App
            </a>
            <a href={feedbackUrl} className="rounded-2xl border border-slate-700 px-6 py-3 text-center font-semibold text-slate-200 hover:bg-slate-800">
              Share feedback
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-16 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8">
          <h2 className="text-2xl font-bold">What it checks</h2>
          <div className="mt-6 grid gap-3">
            {features.map((feature) => (
              <div key={feature} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-slate-300">
                ✓ {feature}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8">
          <h2 className="text-2xl font-bold">How it works</h2>
          <ol className="mt-6 space-y-3">
            {steps.map((step, index) => (
              <li key={step} className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-slate-300">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-sm font-bold text-slate-950">{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl border border-amber-400/30 bg-amber-400/10 p-6 text-amber-100">
          <h2 className="text-xl font-bold">Demo disclaimer</h2>
          <p className="mt-3 leading-7">
            This is a free demo security scanner. It may produce false positives or miss vulnerabilities. Do not use it as your only security review.
          </p>
        </div>
      </section>
    </main>
  );
}
