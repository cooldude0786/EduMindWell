import { prisma } from "@/lib/prisma";
import AddSubscriber from "./ui/AddSubscriber";
import SubscribersList from "./ui/SubscribersList";

export default async function SubscribersPage() {
  const subscribers = await prisma.emailRecipient.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Subscribers</h1>
        <p className="text-sm text-gray-500">
          Manage your email subscriber base ({subscribers.length} total)
        </p>
      </div>

      {/* Add subscriber form */}
      <AddSubscriber />

      {/* List */}
      <SubscribersList initialSubscribers={subscribers} />
    </div>
  );
}