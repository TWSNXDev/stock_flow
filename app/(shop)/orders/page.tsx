import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  ChevronRight,
  MapPin,
  CalendarDays,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { getMyOrders, type OrderData } from "@/app/actions/order-action";

type StatusFilter = "ALL" | "PENDING" | "PAID" | "SHIPPED" | "CANCELLED";

const STATUS_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; bg: string; text: string; border: string }
> = {
  PENDING: {
    label: "Pending",
    icon: <Clock size={13} />,
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200",
  },
  PAID: {
    label: "Paid",
    icon: <CheckCircle2 size={13} />,
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
  },
  SHIPPED: {
    label: "Shipped",
    icon: <Truck size={13} />,
    bg: "bg-success/10",
    text: "text-success",
    border: "border-success/20",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: <XCircle size={13} />,
    bg: "bg-red-50",
    text: "text-error",
    border: "border-red-200",
  },
};

const TAB_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: "All Orders", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Paid", value: "PAID" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/?auth=login");
  }

  const { status: statusParam } = await searchParams;
  const activeFilter: StatusFilter =
    TAB_FILTERS.some((t) => t.value === statusParam?.toUpperCase())
      ? (statusParam!.toUpperCase() as StatusFilter)
      : "ALL";

  const { orders = [], error } = await getMyOrders();

  const filtered =
    activeFilter === "ALL"
      ? orders
      : orders.filter((o) => o.status === activeFilter);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShoppingBag size={20} />
            </div>
            <h1 className="text-2xl font-bold text-neutral-800 sm:text-3xl">My Orders</h1>
          </div>
          <p className="ml-13 text-sm text-neutral-500">
            {orders.length === 0
              ? "No orders yet"
              : `${orders.length} order${orders.length !== 1 ? "s" : ""} total`}
          </p>
        </div>

        {/* ── Status Tabs ── */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {TAB_FILTERS.map((tab) => {
            const count =
              tab.value === "ALL"
                ? orders.length
                : orders.filter((o) => o.status === tab.value).length;
            const isActive = activeFilter === tab.value;
            return (
              <Link
                key={tab.value}
                href={tab.value === "ALL" ? "/orders" : `/orders?status=${tab.value.toLowerCase()}`}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-neutral-200 bg-surface text-neutral-500 hover:border-primary/30 hover:text-primary"
                }`}
              >
                {tab.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                    isActive ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {count}
                </span>
              </Link>
            );
          })}
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-error">
            {error}
          </div>
        )}

        {/* ── Order List ── */}
        {filtered.length === 0 ? (
          <EmptyState filter={activeFilter} />
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Order Card ── */
function OrderCard({ order }: { order: OrderData }) {
  const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING;
  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
  const shortId = order.id.slice(-8).toUpperCase();
  const date = new Date(order.createdAt).toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = new Date(order.createdAt).toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const previewItems = order.items.slice(0, 3);
  const overflow = order.items.length - 3;

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-surface shadow-sm transition-shadow hover:shadow-md">
      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 bg-neutral-50/60 px-5 py-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="text-sm font-bold text-neutral-800 font-mono">
            #{shortId}
          </span>
          <span className="flex items-center gap-1 text-xs text-neutral-400">
            <CalendarDays size={12} />
            {date} · {time}
          </span>
          <span className="text-xs text-neutral-400">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${status.bg} ${status.text} ${status.border}`}
        >
          {status.icon}
          {status.label}
        </span>
      </div>

      {/* Items */}
      <div className="px-5 py-4">
        <div className="flex gap-3">
          {/* Thumbnails */}
          <div className="flex shrink-0 -space-x-2">
            {previewItems.map((item, i) => (
              <div
                key={item.id}
                style={{ zIndex: previewItems.length - i }}
                className="relative h-14 w-14 overflow-hidden rounded-xl border-2 border-white bg-neutral-100 shadow-sm"
              >
                {item.product.imageUrl ? (
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Package size={20} className="text-neutral-300" />
                  </div>
                )}
              </div>
            ))}
            {overflow > 0 && (
              <div
                style={{ zIndex: 0 }}
                className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-white bg-neutral-100 text-xs font-bold text-neutral-500 shadow-sm"
              >
                +{overflow}
              </div>
            )}
          </div>

          {/* Item names */}
          <div className="min-w-0 flex-1">
            {order.items.slice(0, 3).map((item) => (
              <p key={item.id} className="truncate text-sm text-neutral-700">
                <span className="font-medium">{item.product.name}</span>
                <span className="text-neutral-400"> × {item.quantity}</span>
              </p>
            ))}
            {overflow > 0 && (
              <p className="text-xs text-neutral-400">+{overflow} more item{overflow > 1 ? "s" : ""}</p>
            )}
          </div>
        </div>

        {/* Address */}
        {order.address && (
          <div className="mt-3 flex items-start gap-1.5 text-xs text-neutral-500">
            <MapPin size={12} className="mt-0.5 shrink-0 text-neutral-300" />
            <span className="line-clamp-1">{order.address}</span>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50/60 px-5 py-3">
        <div>
          <p className="text-xs text-neutral-400">Order Total</p>
          <p className="text-base font-bold text-primary">
            ฿{order.totalAmount.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <Link
          href={`/orders/${order.id}`}
          className="flex items-center gap-1.5 rounded-xl border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-600 transition-colors hover:border-primary/30 hover:bg-primary-light hover:text-primary"
        >
          View Details
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* Progress Bar for non-cancelled orders */}
      {order.status !== "CANCELLED" && (
        <OrderProgress status={order.status} />
      )}
    </div>
  );
}

/* ── Order Progress ── */
const STEPS = ["PENDING", "PAID", "SHIPPED"] as const;

function OrderProgress({ status }: { status: string }) {
  const currentIndex = STEPS.indexOf(status as (typeof STEPS)[number]);

  return (
    <div className="border-t border-neutral-100 px-5 py-3">
      <div className="flex items-center gap-0">
        {STEPS.map((step, i) => {
          const stepConfig = STATUS_CONFIG[step];
          const isCompleted = currentIndex >= i;
          const isActive = currentIndex === i;
          return (
            <div key={step} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs transition-all ${
                    isCompleted
                      ? "bg-primary text-white shadow-sm"
                      : "border-2 border-neutral-200 bg-surface text-neutral-300"
                  } ${isActive ? "ring-2 ring-primary/20 ring-offset-1" : ""}`}
                >
                  {stepConfig.icon}
                </div>
                <span
                  className={`whitespace-nowrap text-[10px] font-medium ${
                    isCompleted ? "text-primary" : "text-neutral-400"
                  }`}
                >
                  {stepConfig.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`mb-4 h-0.5 flex-1 transition-all ${
                    currentIndex > i ? "bg-primary" : "bg-neutral-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Empty State ── */
function EmptyState({ filter }: { filter: StatusFilter }) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border-2 border-dashed border-neutral-200 bg-surface py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
        <ShoppingBag size={36} className="text-neutral-300" strokeWidth={1.5} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-neutral-800">
          {filter === "ALL" ? "No orders yet" : `No ${filter.toLowerCase()} orders`}
        </h3>
        <p className="mt-1 text-sm text-neutral-500">
          {filter === "ALL"
            ? "When you place an order, it will appear here."
            : `You don't have any ${filter.toLowerCase()} orders.`}
        </p>
      </div>
      {filter === "ALL" && (
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          <Package size={16} />
          Start Shopping
        </Link>
      )}
    </div>
  );
}
