import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">TaskFlow</h1>
      <p className="text-gray-600 mb-8">A modern task management app</p>

      <div className="flex gap-4">
        <Link
          href="/login"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}