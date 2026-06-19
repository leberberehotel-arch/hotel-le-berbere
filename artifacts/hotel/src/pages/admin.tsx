import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useGetAdminStats, useListBookings, useListAdminRooms, useGetRevenueByMonth, useGetOccupancyByMonth } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { LayoutDashboard, CalendarDays, Bed, LogOut, Loader2, Star, Mail, Trash2, PlusCircle, Download, MessageSquare, CheckCircle, XCircle } from "lucide-react";

const apiBase = () => (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");

type AdminReview = {
  id: number;
  guestName: string;
  country: string;
  rating: number;
  title: string;
  body: string;
  stayDate: string;
  roomName?: string | null;
  featured: boolean;
  createdAt?: string | null;
};

type Subscriber = {
  id: number;
  email: string;
  firstName?: string | null;
  subscribedAt?: string | null;
};

const emptyReview = {
  guestName: "",
  country: "",
  rating: 5,
  title: "",
  body: "",
  stayDate: new Date().toISOString().substring(0, 7),
  roomName: "",
  featured: false,
};

export default function Admin({ params }: { params?: { tab?: string } }) {
  const [, setLocation] = useLocation();
  const currentTab = params?.tab || "overview";
  const qc = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useGetAdminStats();
  const { data: bookings, isLoading: bookingsLoading } = useListBookings({ limit: 50 });
  const { data: rooms, isLoading: roomsLoading } = useListAdminRooms();
  const { data: revenueData } = useGetRevenueByMonth();
  const { data: occupancyData } = useGetOccupancyByMonth();

  const { data: reviews, isLoading: reviewsLoading } = useQuery<AdminReview[]>({
    queryKey: ["admin-reviews"],
    queryFn: () => fetch(`${apiBase()}/api/admin/reviews`).then((r) => r.json()),
    enabled: currentTab === "reviews",
  });

  const { data: subscribers, isLoading: subscribersLoading } = useQuery<Subscriber[]>({
    queryKey: ["admin-newsletter"],
    queryFn: () => fetch(`${apiBase()}/api/admin/newsletter/subscribers`).then((r) => r.json()),
    enabled: currentTab === "newsletter",
  });

  const deleteReview = useMutation({
    mutationFn: (id: number) =>
      fetch(`${apiBase()}/api/admin/reviews/${id}`, { method: "DELETE" }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-reviews"] }),
  });

  const toggleFeatured = useMutation({
    mutationFn: ({ id, featured }: { id: number; featured: boolean }) =>
      fetch(`${apiBase()}/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured }),
      }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-reviews"] }),
  });

  const [showAddReview, setShowAddReview] = useState(false);
  const [reviewForm, setReviewForm] = useState(emptyReview);

  const addReview = useMutation({
    mutationFn: (data: typeof emptyReview) =>
      fetch(`${apiBase()}/api/admin/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, rating: Number(data.rating) }),
      }).then((r) => r.json()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-reviews"] });
      setShowAddReview(false);
      setReviewForm(emptyReview);
    },
  });

  const handleTabChange = (tab: string) => setLocation(`/admin/${tab}`);
  const formatCurrency = (val: number) => `$${val.toLocaleString()}`;

  const exportCSV = () => {
    if (!subscribers?.length) return;
    const header = "Email,First Name,Subscribed At";
    const rows = subscribers.map(
      (s) => `${s.email},${s.firstName ?? ""},${s.subscribedAt ? new Date(s.subscribedAt).toLocaleDateString() : ""}`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hotel-leberbere-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const navItem = (tab: string, icon: React.ReactNode, label: string) => (
    <Button
      variant="ghost"
      className={`w-full justify-start rounded-none h-12 font-medium ${
        currentTab === tab
          ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-primary"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50 border-l-2 border-transparent"
      }`}
      onClick={() => handleTabChange(tab)}
    >
      {icon}
      {label}
    </Button>
  );

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-sidebar-border">
          <span className="font-serif text-xl tracking-widest text-sidebar-foreground">LE BERBÈRE ADMIN</span>
        </div>
        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navItem("overview", <LayoutDashboard className="mr-3 h-5 w-5" />, "Overview")}
          {navItem("bookings", <CalendarDays className="mr-3 h-5 w-5" />, "Bookings")}
          {navItem("rooms", <Bed className="mr-3 h-5 w-5" />, "Rooms & Suites")}
          {navItem("reviews", <MessageSquare className="mr-3 h-5 w-5" />, "Guest Reviews")}
          {navItem("newsletter", <Mail className="mr-3 h-5 w-5" />, "Newsletter")}
        </div>
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-none h-12">
              <LogOut className="mr-3 h-5 w-5" /> Exit to Website
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:bg-destructive/10 rounded-none h-10 text-xs uppercase tracking-widest"
            onClick={() => { sessionStorage.removeItem("admin_token"); window.location.href = "/admin/login"; }}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <div className="h-20 flex items-center justify-between px-10 border-b border-border bg-card shrink-0">
          <h1 className="text-2xl font-serif text-foreground capitalize">{currentTab}</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Hotel Le Berbère Dashboard</span>
        </div>

        <Tabs value={currentTab} className="flex-1">
          {/* OVERVIEW */}
          <TabsContent value="overview" className="mt-0 p-10 space-y-8">
            {statsLoading ? (
              <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: "Total Revenue", value: formatCurrency(stats?.totalRevenue || 0), sub: `+${formatCurrency(stats?.revenueThisMonth || 0)} this month` },
                    { label: "Occupancy Rate", value: `${stats?.occupancyRate || 0}%`, sub: "Current month average" },
                    { label: "Active Bookings", value: stats?.activeBookings || 0, sub: "Confirmed future stays" },
                    { label: "Avg Nightly Rate", value: formatCurrency(stats?.avgNightlyRate || 0), sub: "Across all room types" },
                  ].map((s) => (
                    <div key={s.label} className="bg-card border border-border p-6 shadow-sm">
                      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{s.label}</div>
                      <div className="text-3xl font-serif text-foreground">{s.value}</div>
                      <div className="text-xs text-primary mt-2">{s.sub}</div>
                    </div>
                  ))}
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
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "0" }} />
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
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "0" }} cursor={{ fill: "hsl(var(--muted))" }} />
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

          {/* BOOKINGS */}
          <TabsContent value="bookings" className="mt-0 p-10">
            <div className="bg-card border border-border shadow-sm rounded-none overflow-hidden">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-serif">Recent Bookings</h3>
              </div>
              {bookingsLoading ? (
                <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        {["Guest", "Suite", "Dates", "Status", "Amount"].map((h) => (
                          <TableHead key={h} className={`font-serif font-normal text-muted-foreground ${h === "Amount" ? "text-right" : ""}`}>{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings?.map((b) => (
                        <TableRow key={b.id} className="border-border">
                          <TableCell>
                            <div className="font-medium text-foreground">{b.guestName}</div>
                            <div className="text-xs text-muted-foreground">{b.confirmationCode}</div>
                          </TableCell>
                          <TableCell>{b.roomName}</TableCell>
                          <TableCell>
                            <div className="text-sm">{b.checkIn.substring(5)} → {b.checkOut.substring(5)}</div>
                            <div className="text-xs text-muted-foreground">{b.nights} nights</div>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 text-xs uppercase tracking-widest ${b.status === "confirmed" ? "bg-primary/20 text-primary" : b.status === "cancelled" ? "bg-destructive/20 text-destructive" : "bg-muted text-muted-foreground"}`}>
                              {b.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-medium">${b.totalPrice}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ROOMS */}
          <TabsContent value="rooms" className="mt-0 p-10">
            <div className="bg-card border border-border shadow-sm rounded-none overflow-hidden">
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h3 className="text-lg font-serif">Room Inventory</h3>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none text-xs uppercase tracking-widest">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Room
                </Button>
              </div>
              {roomsLoading ? (
                <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        {["Name", "Category", "Price / Night", "Status", "Actions"].map((h) => (
                          <TableHead key={h} className={`font-serif font-normal text-muted-foreground ${h === "Actions" ? "text-right" : ""}`}>{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rooms?.map((r) => (
                        <TableRow key={r.id} className="border-border">
                          <TableCell className="font-medium text-foreground">{r.name}</TableCell>
                          <TableCell className="capitalize">{r.category.replace("-", " ")}</TableCell>
                          <TableCell>${r.pricePerNight}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 text-xs uppercase tracking-widest ${r.available ? "bg-green-500/20 text-green-500" : "bg-destructive/20 text-destructive"}`}>
                              {r.available ? "Available" : "Occupied"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 rounded-none text-xs">Edit</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* REVIEWS */}
          <TabsContent value="reviews" className="mt-0 p-10 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-serif">Guest Reviews</h3>
                <p className="text-xs text-muted-foreground mt-1">{reviews?.length ?? 0} total · {reviews?.filter((r) => r.featured).length ?? 0} featured on homepage</p>
              </div>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none text-xs uppercase tracking-widest"
                onClick={() => setShowAddReview(!showAddReview)}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Review
              </Button>
            </div>

            {/* Add Review Form */}
            {showAddReview && (
              <div className="bg-card border border-primary/30 p-6 space-y-4">
                <h4 className="font-serif text-base">New Review</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-1">Guest Name *</label>
                    <Input className="rounded-none h-10 bg-background" value={reviewForm.guestName} onChange={(e) => setReviewForm((f) => ({ ...f, guestName: e.target.value }))} placeholder="e.g. Sarah M." />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-1">Country *</label>
                    <Input className="rounded-none h-10 bg-background" value={reviewForm.country} onChange={(e) => setReviewForm((f) => ({ ...f, country: e.target.value }))} placeholder="e.g. France" />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-1">Rating (1–5) *</label>
                    <Input type="number" min={1} max={5} className="rounded-none h-10 bg-background" value={reviewForm.rating} onChange={(e) => setReviewForm((f) => ({ ...f, rating: Number(e.target.value) }))} />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-1">Stay Date (YYYY-MM)</label>
                    <Input className="rounded-none h-10 bg-background" value={reviewForm.stayDate} onChange={(e) => setReviewForm((f) => ({ ...f, stayDate: e.target.value }))} placeholder="2025-03" />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-1">Review Title *</label>
                    <Input className="rounded-none h-10 bg-background" value={reviewForm.title} onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Absolutely stunning" />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-1">Room Stayed In</label>
                    <Input className="rounded-none h-10 bg-background" value={reviewForm.roomName} onChange={(e) => setReviewForm((f) => ({ ...f, roomName: e.target.value }))} placeholder="e.g. Suite Riad" />
                  </div>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-1">Review Text *</label>
                  <Textarea className="rounded-none bg-background min-h-[100px] resize-none" value={reviewForm.body} onChange={(e) => setReviewForm((f) => ({ ...f, body: e.target.value }))} />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="featured" checked={reviewForm.featured} onChange={(e) => setReviewForm((f) => ({ ...f, featured: e.target.checked }))} className="w-4 h-4" />
                  <label htmlFor="featured" className="text-sm text-muted-foreground">Show on homepage</label>
                </div>
                <div className="flex gap-3">
                  <Button
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none text-xs uppercase tracking-widest"
                    disabled={addReview.isPending || !reviewForm.guestName || !reviewForm.country || !reviewForm.title || !reviewForm.body}
                    onClick={() => addReview.mutate(reviewForm)}
                  >
                    {addReview.isPending ? "Saving..." : "Save Review"}
                  </Button>
                  <Button variant="outline" className="rounded-none text-xs uppercase tracking-widests border-border" onClick={() => { setShowAddReview(false); setReviewForm(emptyReview); }}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Reviews Table */}
            <div className="bg-card border border-border shadow-sm rounded-none overflow-hidden">
              {reviewsLoading ? (
                <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : !reviews?.length ? (
                <div className="p-12 text-center text-muted-foreground text-sm">No reviews yet. Add the first one above.</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        {["Guest", "Rating", "Review", "Room", "Featured", "Actions"].map((h) => (
                          <TableHead key={h} className={`font-serif font-normal text-muted-foreground text-xs ${h === "Actions" ? "text-right" : ""}`}>{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviews.map((r) => (
                        <TableRow key={r.id} className="border-border">
                          <TableCell>
                            <div className="font-medium text-foreground text-sm">{r.guestName}</div>
                            <div className="text-xs text-muted-foreground">{r.country} · {r.stayDate}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex text-primary">
                              {[...Array(r.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="font-medium text-sm text-foreground truncate">"{r.title}"</div>
                            <div className="text-xs text-muted-foreground line-clamp-1">{r.body}</div>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{r.roomName ?? "—"}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`rounded-none h-8 w-8 p-0 ${r.featured ? "text-primary hover:text-primary/80" : "text-muted-foreground hover:text-primary"}`}
                              onClick={() => toggleFeatured.mutate({ id: r.id, featured: !r.featured })}
                              title={r.featured ? "Remove from homepage" : "Show on homepage"}
                            >
                              {r.featured ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                            </Button>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10 rounded-none h-8 w-8 p-0"
                              onClick={() => { if (confirm(`Delete review by ${r.guestName}?`)) deleteReview.mutate(r.id); }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* NEWSLETTER */}
          <TabsContent value="newsletter" className="mt-0 p-10 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-serif">Newsletter Subscribers</h3>
                <p className="text-xs text-muted-foreground mt-1">{subscribers?.length ?? 0} total subscribers</p>
              </div>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-none text-xs uppercase tracking-widest"
                onClick={exportCSV}
                disabled={!subscribers?.length}
              >
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </div>

            <div className="bg-card border border-border shadow-sm rounded-none overflow-hidden">
              {subscribersLoading ? (
                <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : !subscribers?.length ? (
                <div className="p-12 text-center text-muted-foreground text-sm">No subscribers yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        {["Email", "First Name", "Subscribed"].map((h) => (
                          <TableHead key={h} className="font-serif font-normal text-muted-foreground text-xs">{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscribers.map((s) => (
                        <TableRow key={s.id} className="border-border">
                          <TableCell className="font-medium text-foreground text-sm">{s.email}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">{s.firstName ?? "—"}</TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {s.subscribedAt ? new Date(s.subscribedAt).toLocaleDateString("en-GB") : "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            <div className="bg-card border border-primary/20 p-6 text-sm">
              <h4 className="font-serif mb-2">Email Configuration</h4>
              <p className="text-muted-foreground text-xs leading-relaxed mb-3">
                To send automated welcome emails, configure the following environment variables in the API server:
              </p>
              <div className="font-mono text-xs bg-background border border-border p-4 space-y-1 text-primary">
                <div>EMAIL_USER=your-email@gmail.com</div>
                <div>EMAIL_PASS=your-app-password</div>
                <div>NEWSLETTER_FROM="Hotel Le Berbère &lt;no-reply@yourdomain.com&gt;"</div>
              </div>
              <p className="text-muted-foreground text-xs mt-3">For Gmail, use an App Password (not your regular password). Other SMTP providers also supported via Nodemailer.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
