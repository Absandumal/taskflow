import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createTask, toggleTask, deleteTask } from "@/app/actions/tasks";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">TaskFlow</h1>
            <p className="text-gray-600">
              Welcome, {session.user.name || session.user.email}
            </p>
          </div>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </form>
        </div>

        {/* Add Task Form */}
        <form action={createTask} className="mb-8 flex gap-2">
          <input
            type="text"
            name="title"
            placeholder="Add a new task..."
            required
            className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </form>

        {/* Task List */}
        <div className="bg-white rounded-lg shadow">
          {tasks.length === 0 ? (
            <p className="p-6 text-center text-gray-500">
              No tasks yet. Add your first task above!
            </p>
          ) : (
            <ul>
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between p-4 border-b last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <form action={toggleTask.bind(null, task.id)}>
                      <button
                        type="submit"
                        className={`w-5 h-5 rounded border flex items-center justify-center ${
                          task.completed
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-400"
                        }`}
                      >
                        {task.completed && "✓"}
                      </button>
                    </form>

                    <span
                      className={`${
                        task.completed
                          ? "line-through text-gray-400"
                          : "text-gray-800"
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  <form action={deleteTask.bind(null, task.id)}>
                    <button
                      type="submit"
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}