import { useEffect, useState } from "react";
import db from "../firebase";

const ACTIVE_STATUSES = new Set(["active", "trialing"]);

const PLAN_LABELS = {
  basic: "Basic 480p",
  standard: "Standard 1080p",
  premium: "Premium 4K+HDR",
};

export function formatPlanLabel(role) {
  if (!role) return "Unknown plan";
  const key = String(role).toLowerCase();
  return PLAN_LABELS[key] ?? role;
}

export function formatRenewalDate(currentPeriodEnd) {
  if (!currentPeriodEnd) return "—";
  return new Date(currentPeriodEnd * 1000).toLocaleDateString();
}

function toSeconds(value) {
  if (value == null) return null;
  if (typeof value === "object" && "seconds" in value) return value.seconds;
  if (typeof value === "number") return value;
  return null;
}

function normalizeSubscriptionDoc(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    role: data.role,
    status: data.status,
    productId: data.product ?? data.productId ?? null,
    current_period_end: toSeconds(data.current_period_end),
    current_period_start: toSeconds(data.current_period_start),
  };
}

function pickActiveSubscription(subs) {
  if (!subs.length) return null;

  const active = subs.filter(
    (s) => s.status && ACTIVE_STATUSES.has(String(s.status).toLowerCase()),
  );
  const pool = active.length ? active : subs;

  return pool.reduce((best, current) => {
    if (!best) return current;
    const bestEnd = best.current_period_end ?? 0;
    const currentEnd = current.current_period_end ?? 0;
    return currentEnd > bestEnd ? current : best;
  }, null);
}

export function getProductRole(product) {
  if (!product) return null;
  if (product.role) return String(product.role).toLowerCase();
  if (product.metadata?.role) return String(product.metadata.role).toLowerCase();
  return null;
}

export function isCurrentProduct(product, role) {
  if (!product || !role) return false;
  const roleSlug = String(role).toLowerCase();
  const productRole = getProductRole(product);
  if (productRole) return productRole === roleSlug;
  return product.name?.toLowerCase().includes(roleSlug) ?? false;
}

export function useSubscription(uid) {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uid) {
      setSubscription(null);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = db
      .collection("customers")
      .doc(uid)
      .collection("subscriptions")
      .onSnapshot(
        (querySnapshot) => {
          const subs = querySnapshot.docs.map(normalizeSubscriptionDoc);
          setSubscription(pickActiveSubscription(subs));
          setLoading(false);
        },
        (err) => {
          setError(err);
          setSubscription(null);
          setLoading(false);
        },
      );

    return unsubscribe;
  }, [uid]);

  return { subscription, loading, error };
}
