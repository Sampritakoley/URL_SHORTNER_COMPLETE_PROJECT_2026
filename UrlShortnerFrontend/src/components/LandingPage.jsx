import heroImg from "../assets/hero.png"
import LightImg from "../assets/LightningFastRedirection.png"
import { useNavigate } from "react-router-dom";

export const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white text-gray-900">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-20 py-6">
        <div className="text-2xl font-bold text-indigo-600">
          LinkSnap
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/login")}
            className="text-gray-600 hover:text-indigo-600">Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 shadow"
          >
            Get Started
          </button>
        </div>

      </nav>



      {/* HERO SECTION */}
      <section className="grid grid-cols-2 gap-20 px-20 py-20 items-center">

        {/* LEFT */}
        <div>

          <h1 className="text-5xl font-bold leading-tight">
            Shorten, Manage <br />
            and <span className="text-indigo-600">Track</span><br />
            <span className="text-indigo-600">Your Links</span><br />
            Effortlessly.
          </h1>

          <p className="text-gray-500 mt-6 max-w-lg">
            Take control of your online presence. Create branded short links,
            track real-time analytics, and optimize marketing campaigns in seconds.
          </p>


          {/* URL BOX */}
          <div className="flex mt-8 bg-white shadow-lg rounded-xl overflow-hidden w-[520px]">

            <input
              type="text"
              placeholder="Paste your long URL here..."
              className="flex-1 px-5 py-3 outline-none"
            />

            <button className="bg-indigo-600 text-white px-6 hover:bg-indigo-700">
              Shorten Now
            </button>

          </div>

        </div>


        {/* RIGHT IMAGE */}
        <div className="flex justify-center">

          <img
            src={heroImg}
            className="w-[420px] rounded-xl shadow-xl"
          />

        </div>

      </section>



      {/* TRUSTED COMPANIES */}
      <section className="text-center py-14">

        <p className="text-sm text-gray-500 mb-6">
          TRUSTED BY LEADING TEAMS
        </p>

        <div className="flex justify-center gap-16 text-gray-500 font-medium opacity-70">

          <span>Google</span>
          <span>Slack</span>
          <span>Stripe</span>
          <span>Notion</span>
          <span>Meta</span>

        </div>

      </section>



      {/* FEATURES */}
      <section className="bg-gray-50 py-24">

        <div className="text-center mb-14">

          <h2 className="text-3xl font-bold">
            Everything you need to{" "}
            <span className="text-indigo-600">grow your brand</span>
          </h2>

          <p className="text-gray-500 mt-3">
            LinkSnap provides a complete suite of tools to shorten,
            customize and analyze every link you share.
          </p>

        </div>



        {/* FEATURE CARDS */}
        <div className="grid grid-cols-3 gap-8 px-20">


          {/* CARD 1 */}
          <div className="bg-white p-6 rounded-xl shadow">


            <img
              src={LightImg}
              className="rounded-lg mb-4"
            />
            <h3 className="text-lg font-semibold">
              Lightning Fast Redirection
            </h3>

            <p className="text-gray-500 text-sm mt-2">
              Our global edge network ensures links redirect instantly.
            </p>

          </div>



          {/* CARD 2 */}
          <div className="bg-white p-6 rounded-xl shadow">

            <img
              src="https://images.unsplash.com/photo-1518770660439-4636190af475"
              className="rounded-lg mb-4"
            />

            <h3 className="text-lg font-semibold">
              Enterprise-Grade Security
            </h3>

            <p className="text-gray-500 text-sm mt-2">
              Advanced security and malware protection built in.
            </p>

          </div>



          {/* CARD 3 */}
          <div className="bg-white p-6 rounded-xl shadow">

            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
              className="rounded-lg mb-4"
            />

            <h3 className="text-lg font-semibold">
              Deep Analytics
            </h3>

            <p className="text-gray-500 text-sm mt-2">
              Track clicks, location data and referral insights in real time.
            </p>

          </div>

        </div>

      </section>



      {/* WORKFLOW */}
      <section className="px-20 py-24">

        <h2 className="text-3xl font-bold mb-10">
          Optimized for every workflow
        </h2>

        <div className="grid grid-cols-2 gap-16">


          {/* LEFT */}
          <div>

            <p className="text-gray-500 mb-6">
              From social media managers to enterprise developers,
              LinkSnap integrates seamlessly into your workflow.
            </p>


            <ul className="space-y-5">

              <li className="flex gap-3">
                <span className="text-indigo-600 font-bold">01</span>
                Copy & paste your long URL
              </li>

              <li className="flex gap-3">
                <span className="text-indigo-600 font-bold">02</span>
                Customize your short link
              </li>

              <li className="flex gap-3">
                <span className="text-indigo-600 font-bold">03</span>
                Share and track analytics
              </li>

            </ul>

          </div>



          {/* RIGHT */}
          <div className="grid grid-cols-2 gap-6">

            <div className="bg-white p-6 shadow rounded-xl text-center">
              Social Ready
            </div>

            <div className="bg-white p-6 shadow rounded-xl text-center">
              Global Edge
            </div>

            <div className="bg-white p-6 shadow rounded-xl text-center">
              One-Click Copy
            </div>

            <div className="bg-white p-6 shadow rounded-xl text-center">
              Smart Insights
            </div>

          </div>

        </div>

      </section>



      {/* CTA SECTION */}
      <section className="px-20 pb-20 flex justify-center">

        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-2xl text-center px-16 py-14 w-full max-w-5xl shadow-xl">

          <h2 className="text-3xl font-bold">
            Ready to take control of your links?
          </h2>

          <p className="mt-4 opacity-90">
            Join thousands of marketers and creators using LinkSnap
            to manage and analyze their links effortlessly.
          </p>

          <div className="flex justify-center gap-4 mt-8">

            <button
              onClick={() => navigate("/register")}
              className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold"
            >
              Start For Free
            </button>

            <button className="border border-white px-6 py-3 rounded-xl">
              Learn More
            </button>

          </div>

        </div>

      </section>



      {/* FOOTER */}
      <footer className="border-t px-20 py-14 text-gray-600 text-sm">

        <div className="grid grid-cols-4 gap-12">

          {/* LOGO */}
          <div>

            <h3 className="text-lg font-bold text-indigo-600">
              LinkSnap
            </h3>

            <p className="mt-4">
              Powerful link management for modern teams.
            </p>

          </div>



          {/* PRODUCT */}
          <div>

            <h4 className="font-semibold text-gray-900 mb-3">
              Product
            </h4>

            <ul className="space-y-2">
              <li>Features</li>
              <li>Analytics</li>
              <li>Pricing</li>
              <li>Integrations</li>
            </ul>

          </div>



          {/* COMPANY */}
          <div>

            <h4 className="font-semibold text-gray-900 mb-3">
              Company
            </h4>

            <ul className="space-y-2">
              <li>About</li>
              <li>Blog</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>

          </div>



          {/* LEGAL */}
          <div>

            <h4 className="font-semibold text-gray-900 mb-3">
              Legal
            </h4>

            <ul className="space-y-2">
              <li>Privacy Policy</li>
              <li>Terms</li>
              <li>Security</li>
            </ul>

          </div>

        </div>


        <div className="text-center mt-12 text-xs text-gray-400">
          © 2026 LinkSnap. All rights reserved.
        </div>

      </footer>



    </div>
  )
}