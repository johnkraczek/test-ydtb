
import DashboardLayout from "@/components/dashboard/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Activity, ArrowUpRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 6000 },
  { name: 'Apr', value: 8000 },
  { name: 'May', value: 5000 },
  { name: 'Jun', value: 9000 },
  { name: 'Jul', value: 10000 },
];

export default function AgencyDashboardPage() {
  return (
    <DashboardLayout mode="agency" activeTool="agency-home">
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard 
            title="Total Agency Revenue" 
            value="$145,231.89" 
            change="+12.1% from last month" 
            icon={DollarSign} 
            trend="up"
          />
          <StatsCard 
            title="Active Clients" 
            value="142" 
            change="+4 new this month" 
            icon={Users} 
            trend="up"
          />
          <StatsCard 
            title="Active Sub-accounts" 
            value="315" 
            change="+12 since last week" 
            icon={Activity} 
            trend="up"
          />
          <StatsCard 
            title="MRR" 
            value="$42,234" 
            change="+8% from last month" 
            icon={ArrowUpRight} 
            trend="up"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Main Chart */}
          <Card className="col-span-4 border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-display font-semibold">Agency Overview</CardTitle>
              <CardDescription>Monthly revenue performance across all clients</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValueAgency" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorValueAgency)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="col-span-3 border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-display font-semibold">Recent Client Activity</CardTitle>
              <CardDescription>Latest updates from your sub-accounts.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <RecentActivityItem title="New Lead" client="Acme Corp" time="2 min ago" />
                <RecentActivityItem title="Payment Failed" client="Globex Inc" time="15 min ago" type="warning" />
                <RecentActivityItem title="Campaign Started" client="Soylent Corp" time="1 hour ago" />
                <RecentActivityItem title="New User Added" client="Umbrella Corp" time="3 hours ago" />
                <RecentActivityItem title="Subscription Upgraded" client="Stark Ind" time="5 hours ago" type="success" />
              </div>
            </CardContent>
          </Card>
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

function RecentActivityItem({ title, client, time, type = "default" }: any) {
    return (
        <div className="flex items-center">
            <div className={`h-2 w-2 rounded-full mr-4 ${
                type === 'warning' ? 'bg-amber-500' : 
                type === 'success' ? 'bg-emerald-500' : 
                'bg-blue-500'
            }`} />
            <div className="space-y-1">
                <p className="text-sm font-medium leading-none text-slate-900 dark:text-slate-100">{title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{client}</p>
            </div>
            <div className="ml-auto text-xs text-slate-400">{time}</div>
        </div>
    )
}
