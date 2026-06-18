import { useState } from "react";
import { useLocation } from "wouter";
import { CalendarIcon, Users } from "lucide-react";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { cn } from "@/lib/utils";

export function BookingWidget({ className }: { className?: string }) {
  const [, setLocation] = useLocation();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState<string>("2");

  const handleCheckAvailability = () => {
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", format(checkIn, "yyyy-MM-dd"));
    if (checkOut) params.set("checkOut", format(checkOut, "yyyy-MM-dd"));
    params.set("guests", guests);
    setLocation(`/book?${params.toString()}`);
  };

  return (
    <div className={cn("bg-background/80 backdrop-blur-xl border border-primary/20 p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 shadow-2xl", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full md:w-[240px] justify-start text-left font-normal bg-transparent border-primary/30 rounded-none h-14",
              !checkIn && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
            {checkIn ? format(checkIn, "MMM dd, yyyy") : <span>Check-in Date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 border-primary/30 rounded-none bg-popover" align="start">
          <Calendar
            mode="single"
            selected={checkIn}
            onSelect={setCheckIn}
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full md:w-[240px] justify-start text-left font-normal bg-transparent border-primary/30 rounded-none h-14",
              !checkOut && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
            {checkOut ? format(checkOut, "MMM dd, yyyy") : <span>Check-out Date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 border-primary/30 rounded-none bg-popover" align="start">
          <Calendar
            mode="single"
            selected={checkOut}
            onSelect={setCheckOut}
            disabled={(date) => (checkIn ? date <= checkIn : date < new Date())}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Select value={guests} onValueChange={setGuests}>
        <SelectTrigger className="w-full md:w-[180px] bg-transparent border-primary/30 rounded-none h-14">
          <Users className="mr-3 h-5 w-5 text-primary" />
          <SelectValue placeholder="Guests" />
        </SelectTrigger>
        <SelectContent className="border-primary/30 rounded-none bg-popover">
          <SelectItem value="1">1 Guest</SelectItem>
          <SelectItem value="2">2 Guests</SelectItem>
          <SelectItem value="3">3 Guests</SelectItem>
          <SelectItem value="4">4 Guests</SelectItem>
          <SelectItem value="5">5+ Guests</SelectItem>
        </SelectContent>
      </Select>

      <Button
        onClick={handleCheckAvailability}
        className="w-full md:w-auto h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-serif tracking-widest uppercase rounded-none border border-primary/50 relative overflow-hidden group"
      >
        <span className="relative z-10">Check Availability</span>
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
      </Button>
    </div>
  );
}
