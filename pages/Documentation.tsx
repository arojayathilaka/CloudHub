
import React from 'react';

const Documentation: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-full uppercase tracking-wider">Infrastructure Guide</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Deployment & Debugging</h1>
        <p className="text-slate-500 text-lg mt-2">Solving connectivity, DNS, and architectural issues.</p>
      </header>

      <div className="space-y-8 pb-24">
        {/* NEW: AZURE DEPLOYMENT BLUEPRINT */}
        <section className="bg-indigo-700 text-white p-8 rounded-3xl shadow-xl border border-indigo-500">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-8 h-8 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h2 className="text-2xl font-bold text-white">Azure Deployment Strategy</h2>
          </div>
          <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
            Follow this 3-step blueprint to move from Localhost to the Microsoft Azure cloud.
          </p>
          
          <div className="space-y-6">
            <div className="bg-black/20 p-6 rounded-2xl">
              <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-3">1. Provision Web Apps</h4>
              <p className="text-xs opacity-90 mb-4">Create three <strong>Azure App Services</strong> (Linux, .NET 8) in the same region as your Cosmos DB.</p>
              <div className="bg-slate-900/50 p-3 rounded-lg font-mono text-[10px] text-indigo-300">
                az webapp create --name cloudhub-auth-api --resource-group my-rg --plan my-plan --runtime "DOTNET|8.0"<br/>
                az webapp create --name cloudhub-product-api --resource-group my-rg --plan my-plan --runtime "DOTNET|8.0"<br/>
                az webapp create --name cloudhub-order-api --resource-group my-rg --plan my-plan --runtime "DOTNET|8.0"
              </div>
            </div>

            <div className="bg-black/20 p-6 rounded-2xl">
              <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-3">2. Configure Environment</h4>
              <p className="text-xs opacity-90 mb-4">Inject secrets directly into the App Service environment. This overrides <code>appsettings.json</code>.</p>
              <p className="text-[10px] font-semibold text-white mb-2">Key Mappings (Case Sensitive):</p>
              <ul className="text-[10px] space-y-1 opacity-80 list-disc ml-4">
                <li><code>Cosmos__ConnectionString</code></li>
                <li><code>ServiceBus__ConnectionString</code></li>
                <li><code>Jwt__Secret</code></li>
              </ul>
            </div>

            <div className="bg-black/20 p-6 rounded-2xl border-2 border-dashed border-indigo-400/30">
              <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-3">3. Fix CORS Policy</h4>
              <p className="text-xs opacity-90">
                In the Azure Portal, go to each API's <strong>CORS</strong> blade. Add your Frontend URL (e.g., <code>https://my-app.azurewebsites.net</code>) to the Allowed Origins. 
                <span className="block mt-2 font-bold text-white italic">Uncheck "Enable Access-Control-Allow-Credentials" unless using Cookies.</span>
              </p>
            </div>
          </div>
        </section>

        {/* CRITICAL: SUBSCRIPTIONS SECTION */}
        <section className="bg-amber-600 text-white p-8 rounded-3xl shadow-xl border border-amber-400">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-2xl font-bold text-white">Why are messages "missing"?</h2>
          </div>
          <p className="text-amber-50 text-sm mb-6 leading-relaxed">
            In Azure Service Bus <strong>Topics</strong>, if you send a message but there are <strong>Zero Subscriptions</strong>, Azure simply deletes the message.
          </p>
          <div className="bg-black/20 p-6 rounded-2xl space-y-4 text-xs">
            <h4 className="font-bold uppercase tracking-widest text-amber-100 italic underline">The Solution:</h4>
            <p className="opacity-90 leading-relaxed">
              1. In the Azure Portal, go to your <code>order-events</code> Topic.<br/>
              2. Click <strong>+ Subscription</strong> at the top.<br/>
              3. Name it <code>dev-test-sub</code> and click Create.<br/>
              4. Azure will now hold messages in this subscription for you.
            </p>
          </div>
        </section>

        {/* AZURE PORTAL SECTION */}
        <section className="bg-emerald-600 text-white p-8 rounded-3xl shadow-xl border border-emerald-400">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-white">Azure Portal: Checking Messages</h2>
          </div>
          <p className="text-emerald-50 text-sm mb-6 leading-relaxed">
            Verify messages in the Service Bus Explorer:
          </p>
          <div className="bg-black/20 p-6 rounded-2xl space-y-4 text-xs">
            <div className="flex gap-3">
              <span className="bg-emerald-400 text-emerald-900 font-bold px-2 py-0.5 rounded h-fit">1</span>
              <p className="opacity-90">Open <strong>order-events</strong> Topic &gt; <strong>Subscriptions</strong>.</p>
            </div>
            <div className="flex gap-3">
              <span className="bg-emerald-400 text-emerald-900 font-bold px-2 py-0.5 rounded h-fit">2</span>
              <p className="opacity-90">Click on your subscription (e.g. <code>dev-test-sub</code>).</p>
            </div>
            <div className="flex gap-3">
              <span className="bg-emerald-400 text-emerald-900 font-bold px-2 py-0.5 rounded h-fit">3</span>
              <p className="opacity-90">Select <strong>Service Bus Explorer</strong> and click <strong>Peek from beginning</strong>.</p>
            </div>
          </div>
        </section>

        {/* IMDS TRACE INFO */}
        <section className="bg-slate-100 border border-slate-200 p-8 rounded-3xl">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-slate-800">Warning: 169.254.169.254</h2>
          </div>
          <p className="text-slate-600 text-sm mb-2 leading-relaxed">
            The Cosmos SDK attempts to reach the <strong>Instance Metadata Service</strong> at this IP. 
          </p>
          <p className="text-slate-400 text-xs">This is normal behavior when running outside of an Azure VM/Function.</p>
        </section>
      </div>
    </div>
  );
};

export default Documentation;
