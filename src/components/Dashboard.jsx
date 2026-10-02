import React from "react";
import { useNavigate } from "react-router-dom";
import { useReports } from "./useReports";
import { useAuth } from "../context/AuthContext";

import "leaflet/dist/leaflet.css";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";


// ==========================================
// MARKER ICON
// ==========================================

const createMarkerIcon = (priority) => {
  const colors = {
    Critical: "#DC2626",
    High: "#D97706",
    Medium: "#E3A928",
    Low: "#059669",
  };

  return L.divIcon({
    className: "safeinfra-marker",
    html: `
      <div style="
        width: 18px;
        height: 18px;
        background: ${colors[priority] || "#2563EB"};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.35);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};


// ==========================================
// KNOWN LOCATION COORDINATES
// ==========================================

const locationCoordinates = {
  ramapuram: [13.0324, 80.1809],

  rajasthan: [27.0238, 74.2179],
};
export default function Dashboard() {

  const navigate = useNavigate();

  const { reports, stats, loading } = useReports();

  const { user } = useAuth();

  const name = user?.displayName || "Srinithi";


  // ==========================================
  // PRIORITY ORDER
  // ==========================================

  const rank = {
    Critical: 0,
    High: 1,
    Medium: 2,
    Low: 3,
  };


  const priorityLocations = [...reports]
    .sort(
      (a, b) =>
        (rank[a.priority] ?? 4) -
          (rank[b.priority] ?? 4) ||
        new Date(b.date) - new Date(a.date)
    )
    .slice(0, 5)
    .map((r) => {

      const location =
        String(r.location || "").trim();

      const key =
        location.toLowerCase();


      let coordinates =
        locationCoordinates[key];


      // ------------------------------------------
      // Handle "Ramapuram, Chennai"
      // ------------------------------------------

      if (!coordinates && key.includes("ramapuram")) {
        coordinates =
          locationCoordinates.ramapuram;
      }


      // ------------------------------------------
      // Handle "Rajasthan"
      // ------------------------------------------

      if (!coordinates && key.includes("rajasthan")) {
        coordinates =
          locationCoordinates.rajasthan;
      }


      return {
        id: r.id,
        type: r.type,
        location: location,
        priority: r.priority,
        date: r.date,
        coordinates: coordinates,
      };

    });


  // ==========================================
  // PRIORITY COLORS
  // ==========================================

  const priorityStyles = {

    Critical: {
      background: "#FEE2E2",
      color: "#B91C1C",
    },

    High: {
      background: "#FEF3C7",
      color: "#B45309",
    },

    Medium: {
      background: "#FEF9C3",
      color: "#A16207",
    },

    Low: {
      background: "#D1FAE5",
      color: "#047857",
    },

  };


  if (loading) {

    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
        }}
      >
        Loading dashboard...
      </div>
    );

  }
    return (

    <div
      style={{
        padding: "24px",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >

        <div>

          <h1
            style={{
              margin: "0 0 6px",
              fontSize: "28px",
              color: "#111827",
            }}
          >
            Welcome, {name}
          </h1>

          <p
            style={{
              margin: 0,
              color: "#6B7280",
            }}
          >
            Infrastructure monitoring and
            disaster response dashboard
          </p>

        </div>


        <button
          onClick={() => navigate("/reports")}
          style={{
            background: "#2563EB",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          View Reports
        </button>

      </div>


      {/* ================================= */}
      {/* SUMMARY CARDS */}
      {/* ================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4, minmax(0, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >

          <div style={{ color: "#6B7280" }}>
            Total Reports
          </div>

          <div
            style={{
              fontSize: "28px",
              fontWeight: "700",
              marginTop: "8px",
            }}
          >
            {stats?.total ?? reports.length}
          </div>

        </div>


        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >

          <div style={{ color: "#6B7280" }}>
            Critical
          </div>

          <div
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#DC2626",
              marginTop: "8px",
            }}
          >
            {stats?.critical ??
              reports.filter(
                (r) => r.priority === "Critical"
              ).length}
          </div>

        </div>


        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >

          <div style={{ color: "#6B7280" }}>
            High Priority
          </div>

          <div
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#D97706",
              marginTop: "8px",
            }}
          >
            {stats?.high ??
              reports.filter(
                (r) => r.priority === "High"
              ).length}
          </div>

        </div>


        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >

          <div style={{ color: "#6B7280" }}>
            Locations
          </div>

          <div
            style={{
              fontSize: "28px",
              fontWeight: "700",
              marginTop: "8px",
            }}
          >
            {priorityLocations.length}
          </div>

        </div>

      </div>


      {/* ================================= */}
      {/* MAP SECTION */}
      {/* ================================= */}

      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "24px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >

        <h2
          style={{
            margin: "0 0 6px",
            fontSize: "20px",
          }}
        >
          Infrastructure Priority Map
        </h2>

        <p
          style={{
            margin: "0 0 16px",
            color: "#6B7280",
            fontSize: "13px",
          }}
        >
          Real-world locations of reported
          infrastructure issues
        </p>


        {/* ================================= */}
        {/* LEAFLET MAP */}
        {/* ================================= */}

        <div
          style={{
            width: "100%",
            height: "450px",
            borderRadius: "10px",
            overflow: "hidden",
            position: "relative",
          }}
        >

          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            scrollWheelZoom={true}
            style={{
              width: "100%",
              height: "100%",
            }}
          >

            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />


            {priorityLocations.map((item) => {

              if (!item.coordinates) {
                return null;
              }


              return (

                <Marker
                  key={item.id}
                  position={item.coordinates}
                  icon={createMarkerIcon(
                    item.priority
                  )}
                >

                  <Popup>

                    <div
                      style={{
                        minWidth: "190px",
                      }}
                    >

                      <strong
                        style={{
                          fontSize: "15px",
                        }}
                      >
                        {item.type}
                      </strong>

                      <div
                        style={{
                          marginTop: "8px",
                        }}
                      >
                        <b>Location:</b>{" "}
                        {item.location}
                      </div>

                      <div
                        style={{
                          marginTop: "6px",
                        }}
                      >
                        <b>Priority:</b>{" "}

                        <span
                          style={{
                            color:
                              priorityStyles[
                                item.priority
                              ]?.color,
                            fontWeight: "700",
                          }}
                        >
                          {item.priority}
                        </span>

                      </div>

                      <div
                        style={{
                          marginTop: "6px",
                          fontSize: "11px",
                          color: "#6B7280",
                        }}
                      >
                        Coordinates:
                        <br />

                        {item.coordinates[0].toFixed(4)}
                        {", "}
                        {item.coordinates[1].toFixed(4)}

                      </div>

                    </div>

                  </Popup>

                </Marker>

              );

            })}

          </MapContainer>

        </div>

      </div>
            {/* ================================= */}
      {/* TOP PRIORITY LOCATIONS */}
      {/* ================================= */}

      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "20px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >

        <h2
          style={{
            margin: "0 0 6px",
            fontSize: "20px",
          }}
        >
          Top Priority Locations
        </h2>

        <p
          style={{
            margin: "0 0 16px",
            color: "#6B7280",
            fontSize: "13px",
          }}
        >
          Recently reported infrastructure
          requiring attention
        </p>


        {priorityLocations.length === 0 ? (

          <div
            style={{
              padding: "25px",
              textAlign: "center",
              color: "#6B7280",
            }}
          >
            No reports available.
          </div>

        ) : (

          priorityLocations.map((item) => {

            const style =
              priorityStyles[item.priority] ||
              priorityStyles.Low;


            return (

              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px",
                  border:
                    "1px solid #E5E7EB",
                  borderRadius: "10px",
                  marginBottom: "10px",
                }}
              >

                <div>

                  <div
                    style={{
                      fontWeight: "600",
                    }}
                  >
                    {item.type} - {item.location}
                  </div>

                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6B7280",
                      marginTop: "4px",
                    }}
                  >
                    {item.location}
                  </div>

                </div>


                <div
                  style={{
                    background:
                      style.background,
                    color: style.color,
                    padding: "6px 10px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: "700",
                  }}
                >
                  {item.priority}
                </div>

              </div>

            );

          })

        )}

      </div>

    </div>

  );

}