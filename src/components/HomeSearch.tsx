"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/villas?search=${encodeURIComponent(q)}` : "/villas");
  }

  return (
    <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto">
      <div className="flex items-center bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-shadow focus-within:shadow-xl focus-within:border-blue/30">
        <svg className="w-5 h-5 text-gray-400 ml-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหาวิลล่า, ทำเล, จำนวนห้อง..."
          className="flex-1 px-3 py-3.5 text-sm sm:text-base text-navy bg-transparent outline-none placeholder:text-gray-400"
        />
        <button
          type="submit"
          className="mr-2 px-5 py-2 rounded-xl bg-blue text-white text-sm font-semibold hover:bg-blue/90 transition shrink-0"
        >
          ค้นหา
        </button>
      </div>
    </form>
  );
}
