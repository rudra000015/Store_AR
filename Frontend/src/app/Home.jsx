import { Link } from 'react-router'

function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-900 text-stone-50 p-4 text-center">
      <h1 className="text-3xl sm:text-4xl font-bold">Welcome to THE A & R STORE</h1>
      <p className="mt-4 text-stone-300">Home Page</p>
      <Link to="/register" className="mt-6 inline-block rounded-lg bg-[#d8b15f] px-4 py-2 font-medium text-black">
        Go to Register
      </Link>
    </div>
  )
}

export default Home
