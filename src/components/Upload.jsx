import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import "./Upload.css";

function Upload() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [infrastructureType, setInfrastructureType] = useState("Bridge");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [formError, setFormError] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const [geoState, setGeoState] = useState({ status: "idle", message: "" });

  // -----------------------------
  const requestCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoState({
        status: "unsupported",
        message: "Geolocation is not supported in this browser.",
      });
      return;
    }

    setGeoState({
      status: "requesting",
      message: "Detecting your current location...",
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLatitude(String(lat));
        setLongitude(String(lng));
        setLocation((prev) =>
          prev || `Auto-detected: ${lat.toFixed(5)}, ${lng.toFixed(5)}`
        );
        setLocationConfirmed(false);

        setGeoState({
          status: "success",
          message: `Current location detected: ${lat.toFixed(5)}, ${lng.toFixed(5)}.`,
        });
      },
      (error) => {
        if (error.code === 1) {
          setGeoState({
            status: "denied",
            message: "Location permission was denied. Please enter a location manually.",
          });
        } else if (error.code === 2) {
          setGeoState({
            status: "unavailable",
            message: "Location is unavailable right now. Please enter a manual location.",
          });
        } else {
          setGeoState({
            status: "timeout",
            message: "Location detection timed out. Please enter a manual location.",
          });
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };
  // FILE HANDLING
  // -----------------------------

  const handleFileChange = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Please select a JPG or PNG image.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFormError("Image size must be less than 10 MB.");
      return;
    }

    setFormError("");
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleInputChange = (e) => {
    handleFileChange(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreview(null);
    setFormError("");
  };

  // -----------------------------
  // SUBMIT
  // -----------------------------
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!user) {
    setFormError("Please log in before submitting an inspection.");
    return;
  }
  if (!selectedFile) {
    setFormError("Please upload an infrastructure image.");
    return;
  }

  if (!location || !date) {
    setFormError("Please enter the inspection location and date.");
    return;
  }

  setFormError("");
  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await fetch("http://127.0.0.1:8000/analyze", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Analysis failed");
    }

    const result = await response.json();

    console.log("AI Analysis Result:", result);
    const allowed = ["Critical", "High", "Medium", "Low"];
    const clean = (v) => {
      const s = String(v ?? "").toLowerCase();
      return allowed.find((a) => a.toLowerCase() === s) || "Medium";
    };

    const severity = clean(result.severity);
    const priority = clean(result.priority ?? result.severity);

    await addDoc(collection(db, "reports"), {
      uid: user.uid,
      location,
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
      type: infrastructureType,
      severity,
      priority,
      date: new Date(date).toISOString(),
      description,
    });
    // Store the AI result temporarily so the Analysis page can use it
    localStorage.setItem(
      "safeinfra_analysis",
      JSON.stringify({
        infrastructureType: infrastructureType,
        location: location,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        date: date,
        description: description,
        image: preview,
        ...result,
      })
    );

    navigate("/analysis");
  } catch (error) {
    console.error("Backend error:", error);
    setFormError("Unable to connect to SafeInfra AI backend. Please make sure the backend is running.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="upload-page min-h-screen bg-[#F1F5F9]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="relative overflow-hidden bg-[#111827] text-white">

        {/* Subtle grid background */}

        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(#22D3EE 1px, transparent 1px),
              linear-gradient(90deg, #22D3EE 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Decorative blue glow */}

        <div className="relative max-w-7xl mx-auto px-6 py-10">

          <div className="flex items-center gap-4">

            {/* Icon */}

            <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-300/20 flex items-center justify-center">

              <svg
                className="w-6 h-6 text-cyan-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M12 3v18m9-9H3"
                />
              </svg>

            </div>

            <div>

              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Upload Inspection
              </h1>

              <p className="text-slate-400 text-sm mt-1">
                Add inspection details and an image.
              </p>

            </div>

          </div>

        </div>

      </header>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="max-w-7xl mx-auto px-6 py-8">

        <form onSubmit={handleSubmit} aria-busy={loading}>

          {formError && <p className="upload-error-banner" role="alert">{formError}</p>}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


            {/* =================================================
                INSPECTION DETAILS
            ================================================= */}

            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

              {/* Card header */}

              <div className="px-6 py-5 border-b border-slate-100">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">

                    <svg
                      className="w-5 h-5 text-cyan-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a3 3 0 006 0M9 5h6"
                      />
                    </svg>

                  </div>

                  <div>

                    <h2 className="text-lg font-semibold text-[#0F172A]">
                      Inspection
                    </h2>

                    <p className="text-xs text-slate-400">
                      Basic inspection information
                    </p>

                  </div>

                </div>

              </div>


              {/* Form */}

              <div className="p-6">

                {/* Infrastructure Type */}

                <div className="mb-5">

                  <label htmlFor="infrastructure-type" className="block text-sm font-semibold text-slate-700 mb-2">
                    Infrastructure Type
                  </label>

                  <select
                    id="infrastructure-type"
                    value={infrastructureType}
                    onChange={(e) =>
                      setInfrastructureType(e.target.value)
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none transition focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  >

                    <option value="Bridge">
                      Bridge
                    </option>

                    <option value="Road">
                      Road
                    </option>

                    <option value="Building">
                      Building
                    </option>

                  </select>

                </div>


                {/* Location */}

                <div className="mb-5">

                  <label htmlFor="inspection-location" className="block text-sm font-semibold text-slate-700 mb-2">
                    Location
                  </label>

                  <div className="relative">

                    <svg
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M12 21s7-5.2 7-11a7 7 0 10-14 0c0 5.8 7 11 7 11z"
                      />

                      <circle
                        cx="12"
                        cy="10"
                        r="2.2"
                      />
                    </svg>

                    <input
                      id="inspection-location"
                      type="text"
                      value={location}
                      onChange={(e) =>
                        setLocation(e.target.value)
                      }
                      placeholder="Enter location"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                    />

                  </div>

                </div>


                {/* Location Controls */}

                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Coordinates
                    </label>

                    <button
                      type="button"
                      onClick={requestCurrentLocation}
                      disabled={geoState.status === "requesting"}
                      className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {geoState.status === "requesting"
                        ? "Detecting..."
                        : "Use current location"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="inspection-latitude"
                        className="block text-xs font-medium text-slate-500 mb-1"
                      >
                        Latitude
                      </label>
                      <input
                        id="inspection-latitude"
                        type="number"
                        step="any"
                        value={latitude}
                        onChange={(e) => {
                          setLatitude(e.target.value);
                          setLocationConfirmed(false);
                        }}
                        placeholder="e.g. 13.0827"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none transition focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="inspection-longitude"
                        className="block text-xs font-medium text-slate-500 mb-1"
                      >
                        Longitude
                      </label>
                      <input
                        id="inspection-longitude"
                        type="number"
                        step="any"
                        value={longitude}
                        onChange={(e) => {
                          setLongitude(e.target.value);
                          setLocationConfirmed(false);
                        }}
                        placeholder="e.g. 80.2707"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none transition focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                      />
                    </div>
                  </div>

                  {geoState.message && (
                    <p className="mt-2 text-xs text-slate-500">
                      {geoState.message}
                    </p>
                  )}

                  {latitude && longitude && location && (
                    <label className="flex items-start gap-2 mt-3 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={locationConfirmed}
                        onChange={(e) =>
                          setLocationConfirmed(e.target.checked)
                        }
                        className="mt-0.5 accent-cyan-600"
                      />
                      <span>
                        I confirm that this location and these coordinates are correct.
                      </span>
                    </label>
                  )}
                </div>
                {/* Date */}

                <div className="mb-5">

                  <label htmlFor="inspection-date" className="block text-sm font-semibold text-slate-700 mb-2">
                    Date
                  </label>

                  <input
                    id="inspection-date"
                    type="date"
                    value={date}
                    onChange={(e) =>
                      setDate(e.target.value)
                    }
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none transition focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  />

                </div>


                {/* Description */}

                <div>

                  <div className="flex justify-between items-center mb-2">

                    <label htmlFor="inspection-description" className="text-sm font-semibold text-slate-700">
                      Description
                    </label>

                    <span className="text-xs text-slate-400">
                      Optional
                    </span>

                  </div>

                  <textarea
                    id="inspection-description"
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    placeholder="Add observations..."
                    rows="5"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none resize-y transition focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  />

                </div>

              </div>

            </section>



            {/* =================================================
                IMAGE UPLOAD
            ================================================= */}

            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

              {/* Card header */}

              <div className="px-6 py-5 border-b border-slate-100">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">

                    <svg
                      className="w-5 h-5 text-cyan-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M4 16l4.5-4.5a2 2 0 012.8 0L16 16m-2-2l1.5-1.5a2 2 0 012.8 0L20 14M14 8h.01M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>

                  </div>

                  <div>

                    <h2 className="text-lg font-semibold text-[#0F172A]">
                      Upload Image
                    </h2>

                    <p className="text-xs text-slate-400">
                      Infrastructure image
                    </p>

                  </div>

                </div>

              </div>


              <div className="p-6">

                {!preview ? (

                  /* =========================
                     EMPTY UPLOAD
                  ========================== */

                  <label
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragActive(true);
                    }}

                    onDragLeave={() => {
                      setDragActive(false);
                    }}

                    onDrop={handleDrop}

                    className={`upload-dropzone h-[390px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                      dragActive
                        ? "border-cyan-500 bg-cyan-50"
                        : "border-cyan-200 bg-cyan-50 hover:border-cyan-500"
                    }`}
                  >

                    {/* Image icon */}

                    <div className="w-20 h-20 rounded-2xl bg-cyan-100 flex items-center justify-center mb-5">

                      <svg
                        className="w-9 h-9 text-cyan-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.6"
                          d="M4 16l4.5-4.5a2 2 0 012.8 0L16 16m-2-2l1.5-1.5a2 2 0 012.8 0L20 14M14 8h.01M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>

                    </div>


                    <h3 className="text-base font-semibold text-[#0F172A]">
                      Drop image here
                    </h3>


                    <p className="text-sm text-slate-400 mt-2">
                      or
                    </p>


                    <span className="upload-choose-button mt-3 px-6 py-3 bg-cyan-500 hover:bg-cyan-700 text-slate-950 text-sm font-semibold rounded-xl shadow-sm transition">
                      Choose Image
                    </span>


                    <p className="text-xs text-slate-400 mt-4">
                      JPG or PNG - Max 10 MB
                    </p>


                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleInputChange}
                      className="upload-file-input"
                    />

                  </label>


                ) : (

                  /* =========================
                     IMAGE PREVIEW
                  ========================== */

                  <div>

                    <div className="relative group">

                      <img
                        src={preview}
                        alt="Infrastructure preview"
                        className="w-full h-[390px] object-cover rounded-2xl"
                      />


                      {/* Remove */}

                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-4 right-4 px-4 py-2 bg-white/95 backdrop-blur text-slate-700 rounded-lg shadow-md text-sm font-medium hover:bg-white transition"
                      >
                        Remove
                      </button>

                    </div>


                    {/* SUCCESS STATUS */}

                    <div className="mt-4 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">

                      <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">

                        <svg
                          className="w-5 h-5 text-[#059669]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>

                      </div>


                      <div className="min-w-0">

                        <p className="text-sm font-semibold text-[#059669]">
                          Image ready
                        </p>

                        <p className="text-xs text-emerald-600 truncate">
                          {selectedFile?.name}
                        </p>

                      </div>

                    </div>

                  </div>

                )}

              </div>

            </section>

          </div>



          {/* =================================================
              ACTION BAR
          ================================================= */}

          <div className="mt-6 flex justify-end">

            <button
              type="submit"
              disabled={loading}
              className="upload-submit group px-8 py-3.5 bg-cyan-500 hover:bg-cyan-700 disabled:bg-slate-300 text-slate-950 font-semibold rounded-xl shadow-sm transition-all"
              aria-busy={loading}
            >

              <span className="flex items-center gap-2">

                {loading ? (
                  <>
                    <svg
                      className="animate-spin w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-30"
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="3"
                      />

                      <path
                        className="opacity-90"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
                      />
                    </svg>

                    Analyzing...

                  </>
                ) : (
                  <>
                    Analyze

                    <span className="group-hover:translate-x-1 transition-transform">
                      {"->"}
                    </span>
                  </>
                )}

              </span>

            </button>

          </div>

        </form>

      </main>

    </div>
  );
}

export default Upload;
