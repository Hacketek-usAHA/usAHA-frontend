"use client";

import { useUser } from "@/components/isomorphic/userContext";
import BookingCard from "@/components/facilities/bookingCard";
import Link from "next/link";
import { useEffect, useState } from "react";
import FacilityCard from "@/components/facilities/facilityCard";

interface FacilityImage {
  uuid: string;
  facility: string;
  image: string;
  is_primary: boolean;
}

interface Facility {
  uuid: string;
  owner: string;
  owner_name: string;
  owner_pfp: string;
  owner_start: string;
  name: string;
  category: string;
  description: string;
  city: string;
  location_link: string;
  price_per_day: number;
  rating: number;
  created_at: string;
  updated_at: string;
  amenities: string[];
  images: FacilityImage[];
}

export default function Page() {
  const { isLoggedIn, fetchWithCredentials } = useUser();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFacilities = async () => {
      if (isLoggedIn()) {
        try {
          const response = await fetchWithCredentials(
            "http://localhost:8000/facilities/owner/",
          );
          if (response.ok) {
            const data: Facility[] = await response.json();
            setFacilities(data);
          } else {
            throw new Error("Gagal mengambil listing anda");
          }
        } catch (err) {
          setError("Gagal mengambil listing anda. Coba lagi di lain waktu.");
          console.error(err);
        }
      } else {
        setError("Anda harus login terlebih dahulu.");
      }
      setLoading(false);
    };

    fetchFacilities();
  }, [isLoggedIn, fetchWithCredentials]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex h-screen w-full flex-col items-center">
      <div className="flex flex-col items-center justify-center py-4">
        <h1 className="text-center text-[40px] font-semibold">Listing Anda</h1>
      </div>
      <div className="mx-auto grid grid-cols-1 gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {facilities.map((facility) => (
          <FacilityCard
            key={facility.uuid}
            facility={facility}
            isOwner={true}
          />
        ))}
      </div>
    </div>
  );
}