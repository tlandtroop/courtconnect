"use client";

import { useState, useEffect } from "react";
import Filters from "@/app/(main)/courts/_components/filters";
import GoogleMaps from "@/app/(main)/courts/_components/google-maps";
import { Court } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CourtsPage() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("sports+courts");
  const [checkedPickle, setCheckedPickle] = useState(false);
  const [checkedBasket, setCheckedBasket] = useState(false);
  const [checkedTennis, setCheckedTennis] = useState(false);
  const [checkedVolley, setCheckedVolley] = useState(false);
  const [slider, setSlider] = useState([5]);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const response = await fetch("/api/v1/courts");
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to fetch courts");
        }
        const data = await response.json();
        if (data.success) {
          setCourts(data.courts);
        } else {
          throw new Error(data.error || "Failed to fetch courts");
        }
      } catch (err) {
        console.error("Error fetching courts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, []);

  const handleValueChange = (newValue: string) => {
    const words: string[] = newValue.split(/\s+/);
    const val: string = words.join("+");
    setSearchValue(val);
  };

  const handlePickleChange = (newPickle: boolean) => {
    setCheckedPickle(newPickle);
    if (!checkedPickle) {
      const val = searchValue + "+pickleball+";
      setSearchValue(val);
    } else {
      const words: string[] = searchValue.split(/\+pickleball/);
      const val: string = words.join("+");
      setSearchValue(val);
    }
  };

  const handleBasketChange = (newBasket: boolean) => {
    setCheckedBasket(newBasket);
    if (!checkedBasket) {
      const val = searchValue + "+basketball+";
      setSearchValue(val);
    } else {
      const words: string[] = searchValue.split(/\+basketball/);
      const val: string = words.join("+");
      setSearchValue(val);
    }
  };

  const handleTennisChange = (newTennis: boolean) => {
    setCheckedTennis(newTennis);
    if (!checkedTennis) {
      const val = searchValue + "+tennis+";
      setSearchValue(val);
    } else {
      const words: string[] = searchValue.split(/\+tennis/);
      const val: string = words.join("+");
      setSearchValue(val);
    }
  };

  const handleVolleyChange = (newVolley: boolean) => {
    setCheckedVolley(newVolley);
    if (!checkedVolley) {
      const val = searchValue + "+volleyball+";
      setSearchValue(val);
    } else {
      const words: string[] = searchValue.split(/\+volleyball/);
      const val: string = words.join("+");
      setSearchValue(val);
    }
  };

  const handleSliderChange = (newSlider: number) => {
    setSlider([newSlider]);
    const words: string[] = searchValue.split(/\+within\+[0-9]*\+miles/);
    const res: string = words.join("+");
    const str = "within+" + slider + "+miles+";
    const val = res + str;
    setSearchValue(val);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3">
              <Card className="p-6">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-10 w-full mb-4" />
                <Skeleton className="h-6 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-6 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full" />
              </Card>
            </div>
            <div className="col-span-9">
              <Skeleton className="h-[600px] w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Filters */}
          <div className="col-span-3">
            <Filters
              onValueChange={handleValueChange}
              onPickleChange={handlePickleChange}
              onBasketChange={handleBasketChange}
              onTennisChange={handleTennisChange}
              onVolleyChange={handleVolleyChange}
              slider={slider}
              onSliderChange={handleSliderChange}
            />
          </div>
          {/* Map */}
          <div className="col-span-9">
            <Card className="h-[600px] overflow-hidden">
              <GoogleMaps searchValue={searchValue} courts={courts} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
