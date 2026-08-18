import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Upload() {
  const navigate = useNavigate();

  const [infrastructureType, setInfrastructureType] = useState("Bridge");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // -----------------------------
  // FILE HANDLING
  // -----------------------------

  const handleFileChange = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a JPG or PNG image.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image size must be less than 10 MB.");
      return;
    }

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
  };

  // -----------------------------
  // SUBMIT
  // -----------------------------

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please upload an infrastructure image.");
      return;
    }

    if (!location || !date) {
      alert("Please enter location and date.");
      return;
    }

    setLoading(true);

    // Temporary frontend simulation
    // Later this will connect to the AI API

    setTimeout(() => {
      navigate("/analysis", {
        state: {
          image: preview,
          fileName: selectedFile.name,
          location,
          date,
          infrastructureType,
          description,
        },
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="relative overflow-hidden bg-[#0F172A] text-white">

        {/* Subtle grid background */}

        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(#60A5FA 1px, transparent 1px),
              linear-gradient(90deg, #60A5FA 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Decorative blue glow */}

        <div className="absolute -right-20 -top-20 w-72 h-72 bg-blue-600 rounded-full blur-3xl opacity-20" />

        <div className="relative max-w-7xl mx-auto px-6 py-10">

          <div className="flex items-center gap-4">

            {/* Icon */}

            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-400/20 flex items-center justify-center">

              <svg
                className="w-6 h-6 text-blue-400"
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

        <form onSubmit={handleSubmit}>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


            {/* =================================================
                INSPECTION DETAILS
            ================================================= */}

            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

              {/* Card header */}

              <div className="px-6 py-5 border-b border-slate-100">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">

                    <svg
                      className="w-5 h-5 text-[#2563EB]"
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

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Infrastructure Type
                  </label>

                  <select
                    value={infrastructureType}
                    onChange={(e) =>
                      setInfrastructureType(e.target.value)
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none transition focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
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

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                      type="text"
                      value={location}
                      onChange={(e) =>
                        setLocation(e.target.value)
                      }
                      placeholder="Enter location"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                    />

                  </div>

                </div>


                {/* Date */}

                <div className="mb-5">

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Date
                  </label>

                  <input
                    type="date"
                    value={date}
                    onChange={(e) =>
                      setDate(e.target.value)
                    }
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none transition focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                  />

                </div>


                {/* Description */}

                <div>

                  <div className="flex justify-between items-center mb-2">

                    <label className="text-sm font-semibold text-slate-700">
                      Description
                    </label>

                    <span className="text-xs text-slate-400">
                      Optional
                    </span>

                  </div>

                  <textarea
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    placeholder="Add observations..."
                    rows="5"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none resize-none transition focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
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

                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">

                    <svg
                      className="w-5 h-5 text-[#2563EB]"
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

                    className={`h-[390px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                      dragActive
                        ? "border-[#2563EB] bg-blue-50 scale-[1.01]"
                        : "border-blue-200 bg-[#F8FBFF] hover:border-[#2563EB] hover:bg-blue-50"
                    }`}
                  >

                    {/* Image icon */}

                    <div className="w-20 h-20 rounded-2xl bg-blue-100 flex items-center justify-center mb-5">

                      <svg
                        className="w-9 h-9 text-[#2563EB]"
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


                    <span className="mt-3 px-6 py-3 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition">
                      Choose Image
                    </span>


                    <p className="text-xs text-slate-400 mt-4">
                      JPG or PNG · Max 10 MB
                    </p>


                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleInputChange}
                      className="hidden"
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
              className="group px-8 py-3.5 bg-[#2563EB] hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 transition-all"
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
                      →
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