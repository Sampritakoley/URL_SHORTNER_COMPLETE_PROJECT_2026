import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function RegisterPage() {
  const navigate = useNavigate()

  const [username,setUsername] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState("")

  const handleRegister = async (e) => {

    e.preventDefault()

    setLoading(true)
    setError("")

    try{
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/public/register`,
        {
          username: username,
          password: password,
          email:email
        }
      )
      alert("Account created successfully")
      console.log(response.data)
      navigate("/login")
    }catch(err){
      setError("Registration failed")
    }

    setLoading(false)

  }

  return (

    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-16 py-5 bg-white shadow-sm">

        <div className="text-xl font-bold text-indigo-600">
          LinkSnap
        </div>

        <div className="flex items-center gap-6">

          <button className="text-gray-600">
            Login
          </button>

          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
            Get Started
          </button>

        </div>

      </div>


      {/* MAIN SECTION */}
      <div className="grid grid-cols-2 min-h-[90vh]">

        {/* LEFT SIDE */}
        <div className="flex justify-center items-center">

          <div className="w-[420px]">

            <h2 className="text-3xl font-bold mb-2">
              Create your account
            </h2>

            <p className="text-gray-500 mb-6">
              Join thousands of creators managing links with LinkSnap.
            </p>


            {/* CARD */}
            <div className="bg-white shadow-xl rounded-xl p-6">

              {/* SOCIAL LOGIN */}
              <div className="flex gap-3">

                <button className="flex-1 border py-2 rounded-lg">
                  Github
                </button>

                <button className="flex-1 border py-2 rounded-lg">
                  Google
                </button>

              </div>


              {/* DIVIDER */}
              <div className="flex items-center my-5">

                <div className="flex-1 h-px bg-gray-200"></div>

                <span className="px-3 text-xs text-gray-400">
                  OR CONTINUE WITH EMAIL
                </span>

                <div className="flex-1 h-px bg-gray-200"></div>

              </div>


              {/* FORM */}
              <form onSubmit={handleRegister}>

                {/* NAME */}
                <div className="mb-3">

                  <label className="text-sm font-medium">
                    Full Name
                  </label>

                  <input
                    type="text"
                    placeholder="Jane Doe"
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                    required
                  />

                </div>


                {/* EMAIL */}
                <div className="mb-3">

                  <label className="text-sm font-medium">
                    Email Address
                  </label>

                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    required
                  />

                </div>


                {/* PASSWORD */}
                <div className="mb-3">

                  <label className="text-sm font-medium">
                    Password
                  </label>

                  <input
                    type="password"
                    placeholder="****"
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    required
                  />

                </div>


                {/* TERMS */}
                <div className="flex items-center mb-4 text-sm">

                  <input type="checkbox" className="mr-2"/>

                  <span>
                    I agree to the
                    <span className="text-indigo-600"> Terms of Service </span>
                    and
                    <span className="text-indigo-600"> Privacy Policy</span>
                  </span>

                </div>


                {error && (
                  <p className="text-red-500 text-sm mb-3">
                    {error}
                  </p>
                )}


                {/* SUBMIT */}
                <button
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-2 rounded-lg"
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>

              </form>


              <p className="text-sm text-center mt-4 text-gray-500">
                Already have an account?
                <span 
                  onClick={() => navigate("/login")}
                  className="text-indigo-600 cursor-pointer ml-1"
                >
                  Login here
                </span>
              </p>

            </div>


            <p className="text-xs text-gray-400 mt-4">
              🔒 Secure SSL
            </p>

          </div>

        </div>



        {/* RIGHT SIDE */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center">

          <div className="max-w-md">

            <h3 className="text-2xl font-bold mb-4">
              Everything you need to own your audience.
            </h3>

            <p className="text-gray-600 mb-6">
              Join over 12,000 professional marketers who use LinkSnap
              to grow their online presence.
            </p>


            {/* FEATURES */}

            <div className="space-y-4">

              <div className="bg-white p-4 rounded-lg shadow-sm">
                ⚡ Lightning Fast
                <p className="text-sm text-gray-500">
                  Global CDN ensures links resolve in milliseconds.
                </p>
              </div>


              <div className="bg-white p-4 rounded-lg shadow-sm">
                📊 Advanced Analytics
                <p className="text-sm text-gray-500">
                  Track clicks and location in real time.
                </p>
              </div>


              <div className="bg-white p-4 rounded-lg shadow-sm">
                🌐 Branded Domains
                <p className="text-sm text-gray-500">
                  Increase click-through rate with custom domains.
                </p>
              </div>

            </div>


            {/* TESTIMONIAL */}

            <div className="mt-8 bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-6 rounded-xl">

              <p className="text-sm mb-2">
                ⭐⭐⭐⭐⭐
              </p>

              <p className="text-sm">
                LinkSnap has completely changed how we handle our
                marketing campaigns. The analytics are simply amazing.
              </p>

              <p className="mt-3 text-xs opacity-80">
                Marcus Chen • Growth Marketer
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* FOOTER */}
      <div className="flex justify-between px-16 py-4 text-xs text-gray-400">

        <span>© 2026 LinkSnap. All rights reserved.</span>

        <div className="flex gap-4">
          <span>Privacy</span>
          <span>Terms</span>
        </div>

      </div>

    </div>
  )
}