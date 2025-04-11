import React from "react";
import { Search, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface FiltersProps {
  onValueChange: (value: string) => void;
  onPickleChange: (checked: boolean) => void;
  onBasketChange: (checked: boolean) => void;
  onTennisChange: (checked: boolean) => void;
  onVolleyChange: (checked: boolean) => void;
  slider: number[];
  onSliderChange: (value: number) => void;
}

const Filters = ({
  onValueChange,
  onPickleChange,
  onBasketChange,
  onTennisChange,
  onVolleyChange,
  slider,
  onSliderChange,
}: FiltersProps) => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(event.target.value);
  };

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Search Courts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10"
              type="text"
              placeholder="Search by location..."
              onChange={handleSearch}
            />
          </div>

          <Separator />

          {/* Court Types */}
          <div className="space-y-4">
            <Label className="text-base">Court Types</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pickleball"
                  onCheckedChange={(checked) =>
                    onPickleChange(checked as boolean)
                  }
                />
                <Label htmlFor="pickleball">Pickleball Courts</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="basketball"
                  onCheckedChange={(checked) =>
                    onBasketChange(checked as boolean)
                  }
                />
                <Label htmlFor="basketball">Basketball Courts</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tennis"
                  onCheckedChange={(checked) =>
                    onTennisChange(checked as boolean)
                  }
                />
                <Label htmlFor="tennis">Tennis Courts</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="volleyball"
                  onCheckedChange={(checked) =>
                    onVolleyChange(checked as boolean)
                  }
                />
                <Label htmlFor="volleyball">Volleyball Courts</Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Distance */}
          <div className="space-y-4">
            <Label className="text-base">Distance</Label>
            <div className="space-y-2">
              <Slider
                defaultValue={slider}
                max={10}
                step={1}
                onValueChange={(value) => onSliderChange(value[0])}
              />
              <div className="text-sm text-muted-foreground text-center">
                Within {slider[0]} miles
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Filters;
