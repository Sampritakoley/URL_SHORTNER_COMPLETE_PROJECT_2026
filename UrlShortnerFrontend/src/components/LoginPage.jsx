import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function LoginPage() {
  const navigate = useNavigate()
  const [username,setUserName] = useState("")
  const [password,setPassword] = useState("")
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError("")

    try{

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/public/login`,
        {
          username: username,
          password: password
        }
      )

      console.log(response.data)

      localStorage.setItem("token",response.data.token)

      alert("Login successful")

    }catch(err){

      setError("Invalid credentials")

    }

    setLoading(false)
  }


  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      {/* CARD */}
      <div className="bg-white shadow-xl rounded-2xl w-[420px] p-8">

        {/* LOGO */}
        <div className="text-center mb-6">
          <h1 className="text-indigo-600 font-bold text-xl">
            LinkSnap
          </h1>
        </div>

        {/* TITLE */}
        <h2 className="text-center text-2xl font-semibold">
          Welcome back
        </h2>

        <p className="text-center text-gray-500 text-sm mt-1">
          Enter your credentials to access your dashboard
        </p>


        {/* SOCIAL LOGIN */}
        <div className="flex gap-3 mt-6">

          <button className="flex-1 border rounded-lg py-2 text-sm hover:bg-gray-50">
            Google
          </button>

          <button className="flex-1 border rounded-lg py-2 text-sm hover:bg-gray-50">
            GitHub
          </button>

        </div>


        {/* DIVIDER */}
        <div className="flex items-center my-6">

          <div className="flex-1 h-px bg-gray-200"></div>

          <span className="px-3 text-xs text-gray-400">
            OR CONTINUE WITH EMAIL
          </span>

          <div className="flex-1 h-px bg-gray-200"></div>

        </div>


        {/* FORM */}
        <form onSubmit={handleLogin}>

          {/* EMAIL */}
          <div className="mb-4">

            <label className="text-sm font-medium">
              Email Address
            </label>

            <input
              type="username"
              placeholder="name@company.com"
              className="w-full border rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={username}
              onChange={(e)=>setUserName(e.target.value)}
              required
            />

          </div>


          {/* PASSWORD */}
          <div className="mb-4">

            <div className="flex justify-between">

              <label className="text-sm font-medium">
                Password
              </label>

              <button
                type="button"
                className="text-xs text-indigo-600"
              >
                Forgot password?
              </button>

            </div>

            <input
              type="password"
              placeholder="****"
              className="w-full border rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
            />

          </div>


          {/* KEEP LOGIN */}
          <div className="flex items-center mb-4">

            <input type="checkbox" className="mr-2"/>

            <span className="text-sm text-gray-500">
              Keep me logged in for 30 days
            </span>

          </div>


          {/* ERROR */}
          {error && (
            <p className="text-red-500 text-sm mb-3">
              {error}
            </p>
          )}


          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-2 rounded-lg font-medium hover:opacity-90"
          >
            {loading ? "Signing in..." : "Sign in to LinkSnap"}
          </button>

        </form>


        {/* SIGNUP */}
        <p className="text-center text-sm text-gray-500 mt-6">

          New to LinkSnap?{" "}

          <span 
            onClick={() => navigate("/register")}
            className="text-indigo-600 cursor-pointer hover:underline"
          >
            Create an account
          </span>

        </p>


        {/* SECURITY */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Secure, encrypted authentication
        </p>

      </div>

    </div>

  )
}