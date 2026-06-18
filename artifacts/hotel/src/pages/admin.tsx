import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useGetAdminStats, useListBookings, useListAdminRooms, useGetRevenueByMonth, useGetOccupancyByMonth } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { LayoutDashboard, CalendarDays, Bed, Users, LogOut, Loader2 } from "lucide-react";

export default function Admin({ params }: { params?: { tab?: string } }) {
  const [location, setLocation] = useLocation();
  const currentTab = params?.tab || "overview";

  const { data: stats, isLoading: statsLoading } = useGetAdminStats();
  const { data: bookings, isLoading: bookingsLoading } = useListBookings({ limit: 50 });
  const { data: rooms, isLoading: roomsLoading } = useListAdminRooms();
  const { data: revenueData } = useGetRevenueByMonth();
  const { data: occupancyData } = useGetOccupancyByMonth();

  const handleTabChange = (tab: string) => {
    setLocation(`/admin/${tab}`);
  };

  const formatCurrency = (val: number) => `$${val.toLocaleString()}`;

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-sidebar-border">
          <span className="font-serif text-xl tracking-widest text-sidebar-foreground">LE BERBÈRE ADMIN</span>
        </div>
        <div className="flex-1 py-6 px-4 space-y-2">
          <Button 
            variant="ghost" 
            className={`w-full justify-start rounded-none h-12 font-medium ${currentTab === "overview" ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-primary" : "text-sidebar-foreground hover:bg-sidebar-accent/50 border-l-2 border-transparent"}`}
            onClick={() => handleTabChange("overview")}
          >
            <LayoutDashboard className="mr-3 h-5 w-5" /> Overview
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start rounded-none h-12 font-medium ${currentTab === "bookings" ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-primary" : "text-sidebar-foreground hover:bg-sidebar-accent/50 border-l-2 border-transparent"}`}
            onClick={() => handleTabChange("bookings")}
          >
            <CalendarDays className="mr-3 h-5 w-5" /> Bookings
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start rounded-none h-12 font-medium ${currentTab === "rooms" ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-primary" : "text-sidebar-foreground hover:bg-sidebar-accent/50 border-l-2 border-transparent"}`}
            onClick={() => handleTabChange("rooms")}
          >
            <Bed className="mr-3 h-5 w-5" /> Rooms & Suites
          </Button>
        </div>
        <div className="p-4 border-t border-sidebar-border">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-none h-12">
              <LogOut className="mr-3 h-5 w-5" /> Exit Admin
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <div className="h-20 flex items-center px-10 border-b border-border bg-card">
          <h1 className="text-2xl font-serif text-foreground capitalize">{currentTab}</h1>
        </div>
        
        <div className="p-10">
          <Tabs value={currentTab} className="w-full">
            {/* OVERVIEW TAB */}
            <TabsContent value="overview" className="mt-0 space-y-8">
              {statsLoading ? (
                <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-card border border-border p-6 shadow-sm">
                      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Total Revenue</div>
                      <div className="text-3xl font-serif text-foreground">{formatCurrency(stats?.totalRevenue || 0)}</div>
                      <div className="text-xs text-primary mt-2">+{formatCurrency(stats?.revenueThisMonth || 0)} this month</div>
                    </div>
                    <div className="bg-card border border-border p-6 shadow-sm">
                      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Occupancy Rate</div>
                      <div className="text-3xl font-serif text-foreground">{stats?.occupancyRate || 0}%</div>
                      <div className="text-xs text-muted-foreground mt-2">Current month average</div>
                    </div>
                    <div className="bg-card border border-border p-6 shadow-sm">
                      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Active Bookings</div>
                      <div className="text-3xl font-serif text-foreground">{stats?.activeBookings || 0}</div>
                      <div className="text-xs text-muted-foreground mt-2">Confirmed future stays</div>
                    </div>
                    <div className="bg-card border border-border p-6 shadow-sm">
                      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Avg Nightly Rate</div>
                      <div className="text-3xl font-serif text-foreground">{formatCurrency(stats?.avgNightlyRate || 0)}</div>
                      <div className="text-xs text-muted-foreground mt-2">Across all room types</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-card border border-border p-6 shadow-sm">
                      <h3 className="text-lg font-serif mb-6">Revenue Trend</h3>
                      <div className="h-[300px] w-full">
                        {revenueData && (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                              <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0' }}
                                itemStyle={{ color: 'hsl(var(--primary))' }}
                              />
                              <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>
                    <div className="bg-card border border-border p-6 shadow-sm">
                      <h3 className="text-lg font-serif mb-6">Occupancy Rate</h3>
                      <div className="h-[300px] w-full">
                        {occupancyData && (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={occupancyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0' }}
                                cursor={{ fill: 'hsl(var(--muted))' }}
                              />
                              <Bar dataKey="occupancyRate" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            {/* BOOKINGS TAB */}
            <TabsContent value="bookings" className="mt-0">
              <div className="bg-card border border-border shadow-sm rounded-none overflow-hidden">
                <div className="p-6 border-b border-border flex justify-between items-center">
                  <h3 className="text-lg font-serif">Recent Bookings</h3>
                </div>
                {bookingsLoading ? (
                  <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                          <TableHead className="font-serif font-normal text-muted-foreground">Guest</TableHead>
                          <TableHead className="font-serif font-normal text-muted-foreground">Suite</TableHead>
                          <TableHead className="font-serif font-normal text-muted-foreground">Dates</TableHead>
                          <TableHead className="font-serif font-normal text-muted-foreground">Status</TableHead>
                          <TableHead className="font-serif font-normal text-muted-foreground text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings?.map((booking) => (
                          <TableRow key={booking.id} className="border-border">
                            <TableCell>
                              <div className="font-medium text-foreground">{booking.guestName}</div>
                              <div className="text-xs text-muted-foreground">{booking.confirmationCode}</div>
                            </TableCell>
                            <TableCell>{booking.roomName}</TableCell>
                            <TableCell>
                              <div className="text-sm">{booking.checkIn.substring(5)} to {booking.checkOut.substring(5)}</div>
                              <div className="text-xs text-muted-foreground">{booking.nights} nights</div>
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 text-xs uppercase tracking-widest ${
                                booking.status === 'confirmed' ? 'bg-primary/20 text-primary' :
                                booking.status === 'cancelled' ? 'bg-destructive/20 text-destructive' :
                                'bg-muted text-muted-foreground'
                              }`}>
                                {booking.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              ${booking.totalPrice}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* ROOMS TAB */}
            <TabsContent value="rooms" className="mt-0">
              <div className="bg-card border border-border shadow-sm rounded-none overflow-hidden">
                <div className="p-6 border-b border-border flex justify-between items-center">
                  <h3 className="text-lg font-serif">Room Inventory</h3>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none text-xs uppercase tracking-widest">
                    Add Room
                  </Button>
                </div>
                {roomsLoading ? (
                  <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                          <TableHead className="font-serif font-normal text-muted-foreground">Name</TableHead>
                          <TableHead className="font-serif font-normal text-muted-foreground">Category</TableHead>
                          <TableHead className="font-serif font-normal text-muted-foreground">Price</TableHead>
                          <TableHead className="font-serif font-normal text-muted-foreground">Status</TableHead>
                          <TableHead className="font-serif font-normal text-muted-foreground text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rooms?.map((room) => (
                          <TableRow key={room.id} className="border-border">
                            <TableCell className="font-medium text-foreground">{room.name}</TableCell>
                            <TableCell className="capitalize">{room.category.replace('-', ' ')}</TableCell>
                            <TableCell>${room.pricePerNight}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 text-xs uppercase tracking-widest ${room.available ? 'bg-green-500/20 text-green-500' : 'bg-destructive/20 text-destructive'}`}>
                                {room.available ? 'Available' : 'Occupied'}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10 rounded-none text-xs">Edit</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
