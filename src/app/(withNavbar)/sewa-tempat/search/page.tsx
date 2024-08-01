"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import FacilityCard from "@/components/facilities/facilityCard";
import { FilterCategoryInput } from "@/components/navbar/filterCategoryInput";

interface Amenity {
  uuid: string;
  name: string;
  facility: string;
}

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
  amenities: Amenity[];
  images: FacilityImage[];
}

type FacilityResponse = Facility[];

const getSearchResults = async (url: string) => {
  const response = await fetch(url, {
    method: "GET",
    // mode: 'no-cors',
  });
  const data: FacilityResponse = await response.json();
  return data;
};

export default function Page() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const encodedSearchQuery = encodeURI(searchQuery);
  const { data, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/facilities/?name=${encodedSearchQuery}`,
    getSearchResults,
  );

  if (isLoading) return <div>Loading...</div>;
  if (!data || data.length === 0) return <div>No facilities found</div>;

  return (
    <div className="flex h-screen w-full flex-col">
      <div className="w-full px-10 py-4">
        <FilterCategoryInput />
      </div>
      <div className="flex-grow p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
          {data.map((facility) => (
            <FacilityCard
              key={facility.uuid}
              facility={facility}
              isOwner={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
