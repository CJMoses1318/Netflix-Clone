import React, { useEffect, useState } from "react";
import "./PlansScreen.css";
import db from "../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { loadStripe } from "@stripe/stripe-js";
import {
  formatRenewalDate,
  isCurrentProduct,
  useSubscription,
} from "../hooks/useSubscription";

function PlansScreen({ subscription: subscriptionProp }) {
  const [products, setProducts] = useState({});
  const [hoveredPlanId, setHoveredPlanId] = useState(null);
  const user = useSelector(selectUser);
  const hasSubscriptionProp = subscriptionProp !== undefined;
  const { subscription: subscriptionFromHook } = useSubscription(
    hasSubscriptionProp ? null : user.uid,
  );
  const subscription = hasSubscriptionProp
    ? subscriptionProp
    : subscriptionFromHook;

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await db
        .collection("products")
        .where("active", "==", true)
        .get();

      const productsMap = {};

      for (const productDoc of querySnapshot.docs) {
        productsMap[productDoc.id] = productDoc.data();

        const priceSnap = await productDoc.ref.collection("prices").get();

        priceSnap.docs.forEach((price) => {
          productsMap[productDoc.id].prices = {
            priceId: price.data().price,
            priceData: price.data(),
          };
        });
      }

      setProducts(productsMap);
    };

    fetchProducts();
  }, []);

  const loadCheckout = async (priceId) => {
    const docRef = await db
      .collection("customers")
      .doc(user.uid)
      .collection("checkout_sessions")
      .add({
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      });

    docRef.onSnapshot(async (snap) => {
      const { error, sessionId } = snap.data();

      if (error) {
        alert(`An error occured: ${error.message}`);
      }

      if (sessionId) {
        const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
        if (!publishableKey) {
          alert("Stripe publishable key is not configured.");
          return;
        }
        const stripe = await loadStripe(publishableKey);
        stripe.redirectToCheckout({ sessionId });
      }
    });
  };

  return (
    <div className="plansScreen">
      <br />
      {subscription ? (
        <p>
          Renewal Date: {formatRenewalDate(subscription.current_period_end)}
        </p>
      ) : (
        <p className="plansScreen__noPlan">No active plan</p>
      )}

      {Object.entries(products).map(([productId, productData]) => {
        const isCurrentPackage = isCurrentProduct(
          productData,
          subscription?.role,
        );

        return (
          <div
            key={productId}
            className={`plansScreen__plan${
              isCurrentPackage ? " plansScreen__plan--disabled" : ""
            }`}
          >
            <div className="plansScreen__info">
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>
            <div className="plansScreen__actions">
              <button
                type="button"
                className={`plansScreen__subscribe${
                  !isCurrentPackage && hoveredPlanId === productId
                    ? " plansScreen__subscribe--hover"
                    : ""
                }`}
                onMouseEnter={() =>
                  !isCurrentPackage && setHoveredPlanId(productId)
                }
                onMouseLeave={() => setHoveredPlanId(null)}
                onClick={() =>
                  !isCurrentPackage &&
                  loadCheckout(productData?.prices?.priceId)
                }
              >
                {isCurrentPackage ? "Current Package" : "Subscribe"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PlansScreen;
