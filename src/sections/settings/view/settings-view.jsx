/* eslint-disable */

import React, { useState } from "react";
import axios from "axios";

function SettingsView() {
  const token = localStorage.getItem("token");

  const [platformFeePercentage, setPlatformFeePercentage] = useState(15);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASEURL}/admin/setting/update`,
        {
          platform_fee_percentage: platformFeePercentage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(response.data);

      // Success message here
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <h1 className="page-title mb-0">Settings</h1>
      </div>

      <div className="page-content setting-page cm-page-panel pt-3">
        <div class="row">
          <div class="col-sm-9 col-lg-6 col-xxl-4">
            <div className="panel">
              <div className="panel-heading">
                <h3 className="panel-title">Settings</h3>
              </div>

              <div className="panel-body parent-table">
                <div className="example-wrap mb-0">
                  <div className="example mb-0 mt-xxl-2 mt-0">
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <div className="input-group input-field">
                          <input
                          type="text"
                            inputMode="decimal"
                            className="form-control border"
                            name="platform_fee_percentage"
                            id="platform_fee_percentage"
                            value={platformFeePercentage}
                            autoComplete="off"
                            maxLength={9}
                            onChange={(e) =>
                              setPlatformFeePercentage(e.target.value)
                            }
                          />

                          <span className="input-group-text">%</span>
                        </div>
                      </div>

                      <div className="form-group text-end mb-0">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={loading}
                        >
                          {loading ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

}
export default SettingsView;
