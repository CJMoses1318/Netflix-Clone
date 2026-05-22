import React, { useEffect, useState } from "react";
import "./ProfileScreen.css";
import Nav from "../Nav";
import { selectUser } from "../features/userSlice";
import { useSelector } from "react-redux";
import { auth } from "../firebase";
import PlansScreen from "./PlansScreen";
import {
  formatPlanLabel,
  formatRenewalDate,
  useSubscription,
} from "../hooks/useSubscription";

function ProfileScreen() {
  const user = useSelector(selectUser);
  const { subscription, loading } = useSubscription(user.uid);
  const [showPlans, setShowPlans] = useState(!subscription);

  useEffect(() => {
    if (!loading) {
      setShowPlans(!subscription);
    }
  }, [loading, subscription]);

  const planSummaryLabel = subscription
    ? `Current plan: ${formatPlanLabel(subscription.role)}`
    : "Choose a plan";

  const planSummaryDetail = subscription
    ? `Renews ${formatRenewalDate(subscription.current_period_end)}`
    : null;

  return (
    <div className="profileScreen">
      <Nav />
      <div className="profileScreen__body">
        <h1>Edit Profile</h1>
        <div className="profileScreen__info">
          <img
            src="https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-88wkdmjrorckekha.jpg"
            alt=""
          />
          <div className="profileScreen__details">
            <h2>{user.email}</h2>
            <div className="profileScreen__plans">
              <h3>Plans</h3>

              <button
                type="button"
                className="profileScreen__planSummary"
                onClick={() => setShowPlans((v) => !v)}
                aria-expanded={showPlans}
              >
                <span className="profileScreen__planSummaryText">
                  <span className="profileScreen__planSummaryLabel">
                    {planSummaryLabel}
                  </span>
                  {planSummaryDetail && (
                    <span className="profileScreen__planSummaryDetail">
                      {planSummaryDetail}
                    </span>
                  )}
                </span>
                <span className="profileScreen__planSummaryChevron">
                  {showPlans ? "▲" : "▼"}
                </span>
              </button>

              {showPlans && <PlansScreen subscription={subscription} />}

              <button
                onClick={() => auth.signOut()}
                className="profileScreen__signOut"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileScreen;
