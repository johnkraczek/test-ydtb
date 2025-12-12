
import DashboardLayout from "~/components/dashboard/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ArrowUpRight, Users, DollarSign, Activity, MoreHorizontal } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
  { name: 'Jul', value: 1000 },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Revenue"
            value="$45,231.89"
            change="+20.1% from last month"
            icon={DollarSign}
            trend="up"
          />
          <StatsCard
            title="Subscriptions"
            value="+2350"
            change="+180.1% from last month"
            icon={Users}
            trend="up"
          />
          <StatsCard
            title="Active Now"
            value="+573"
            change="+201 since last hour"
            icon={Activity}
            trend="up"
          />
          <StatsCard
            title="Sales"
            value="+12,234"
            change="+19% from last month"
            icon={ArrowUpRight}
            trend="up"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Main Chart */}
          <Card className="col-span-4 border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-display font-semibold">Overview</CardTitle>
              <CardDescription>Monthly revenue performance</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="col-span-3 border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-display font-semibold">Recent Sales</CardTitle>
              <CardDescription>You made 265 sales this month.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <RecentSaleItem name="Olivia Martin" email="olivia.martin@email.com" amount="+$1,999.00" initials="OM" />
                <RecentSaleItem name="Jackson Lee" email="jackson.lee@email.com" amount="+$39.00" initials="JL" />
                <RecentSaleItem name="Isabella Nguyen" email="isabella.nguyen@email.com" amount="+$299.00" initials="IN" />
                <RecentSaleItem name="William Kim" email="will@email.com" amount="+$99.00" initials="WK" />
                <RecentSaleItem name="Sofia Davis" email="sofia.davis@email.com" amount="+$39.00" initials="SD" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Projects Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          <ProjectCard title="Marketing Campaign" status="In Progress" progress={65} />
          <ProjectCard title="Mobile App Redesign" status="Review" progress={90} />
          <ProjectCard title="Q3 Financials" status="Pending" progress={15} />
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatsCard({ title, value, change, icon: Icon, trend }: any) {
  return (
    <Card className="border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</CardTitle>
        <Icon className="h-4 w-4 text-slate-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100">{value}</div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          <span className={trend === 'up' ? 'text-emerald-600 dark:text-emerald-500 font-medium' : 'text-rose-600 dark:text-rose-500 font-medium'}>{change}</span>
        </p>
      </CardContent>
    </Card>
  )
}

function RecentSaleItem({ name, email, amount, initials }: any) {
  return (
    <div className="flex items-center">
      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold mr-4">
        {initials}
      </div>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none text-slate-900 dark:text-slate-100">{name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{email}</p>
      </div>
      <div className="ml-auto font-medium text-slate-900 dark:text-slate-100">{amount}</div>
    </div>
  )
}

function ProjectCard({ title, status, progress }: any) {
  return (
    <Card className="border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-display font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">{title}</CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>{status}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-2 text-xs text-slate-500 text-right">{progress}% Complete</div>
      </CardContent>
    </Card>
  )
}
