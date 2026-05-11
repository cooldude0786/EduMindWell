import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type EmailLogWithRelations = Prisma.EmailLogGetPayload<{
  include: {
    EmailRecipient: true;
    BulkEmail: true;
  };
}>;

export default async function LogsPage() {
  const logs: EmailLogWithRelations[] = await prisma.emailLog.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      EmailRecipient: true,
      BulkEmail: true,
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Email Logs</h1>
        <p className="text-sm text-gray-500">
          Track all email deliveries
        </p>
      </div>

      {/* List */}
      <div className="space-y-3">
        {logs.length === 0 ? (
          <p className="text-gray-500">
            No logs yet
          </p>
        ) : (
          logs.map((log: EmailLogWithRelations) => (
            <div
              key={log.id}
              className="border p-4 rounded flex justify-between"
            >
              {/* Left */}
              <div>
                <p className="font-medium">
                  {log.EmailRecipient?.email}
                </p>

                <p className="text-sm text-gray-500">
                  Campaign: {log.BulkEmail?.subject}
                </p>

                {log.error && (
                  <p className="text-red-500 text-xs">
                    {log.error}
                  </p>
                )}
              </div>

              {/* Right */}
              <div className="text-right">
                <span
                  className={
                    log.status === "SENT"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {log.status}
                </span>

                <p className="text-xs text-gray-400">
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
