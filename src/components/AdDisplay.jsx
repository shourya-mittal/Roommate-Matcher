import React, { useEffect } from "react";

const AD_CLIENT = process.env.REACT_APP_ADSENSE_CLIENT;
const AD_SLOT   = process.env.REACT_APP_ADSENSE_SLOT;

const AdDisplay = () => {
  useEffect(() => {
    try {
      if (window.adsbygoogle && process.env.NODE_ENV === "production" && AD_CLIENT && AD_SLOT) {
        window.adsbygoogle.push({});
      }
    } catch (e) {}
  }, []);

  // Don't render the ad unit if credentials are not configured
  if (!AD_CLIENT || !AD_SLOT) return null;

  return (
    <div style={{ margin: "20px 0", textAlign: "center" }}>
      <ins className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={AD_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    </div>
  );
};

export default AdDisplay;
 