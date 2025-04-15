
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  BarChart2,
  PieChart,
  FileText,
  Calendar,
  Download,
  Filter,
} from 'lucide-react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from 'recharts';

// Données fictives pour les différents graphiques
const visitsByDayData = [
  { day: 'Lun', count: 18 },
  { day: 'Mar', count: 25 },
  { day: 'Mer', count: 20 },
  { day: 'Jeu', count: 27 },
  { day: 'Ven', count: 32 },
  { day: 'Sam', count: 15 },
  { day: 'Dim', count: 5 },
];

const salesByProductData = [
  { name: 'Bisko Original', value: 35 },
  { name: 'Bisko Fouree', value: 25 },
  { name: 'Krispo', value: 15 },
  { name: 'Bisko Choco', value: 20 },
  { name: 'Bisko Vanille', value: 5 },
];

const salesByZoneData = [
  { zone: 'Dakar', sales: 120000 },
  { zone: 'Thiès', sales: 85000 },
  { zone: 'Saint-Louis', sales: 68000 },
  { zone: 'Ziguinchor', sales: 42000 },
];

const revenueByMonthData = [
  { month: 'Jan', revenue: 180000 },
  { month: 'Fév', revenue: 210000 },
  { month: 'Mar', revenue: 190000 },
  { month: 'Avr', revenue: 250000 },
  { month: 'Mai', revenue: 280000 },
  { month: 'Juin', revenue: 260000 },
];

const COLORS = ['#4585fc', '#2d68f6', '#f97316', '#22c55e', '#9333ea', '#6366f1'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border shadow-sm rounded-md">
        <p className="font-medium">{`${label}`}</p>
        <p className="text-bisko-600">{`${payload[0].value.toLocaleString()} FCFA`}</p>
      </div>
    );
  }

  return null;
};

const AdminReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [reportPeriod, setReportPeriod] = useState('this-month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 rounded-full border-4 border-bisko-200 border-t-bisko-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <BarChart className="h-5 w-5" /> Rapports
            </CardTitle>
            <CardDescription>
              Consultez les analyses et statistiques détaillées
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <select
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={reportPeriod}
              onChange={(e) => setReportPeriod(e.target.value)}
            >
              <option value="today">Aujourd'hui</option>
              <option value="this-week">Cette semaine</option>
              <option value="this-month">Ce mois</option>
              <option value="last-month">Mois dernier</option>
              <option value="this-year">Cette année</option>
            </select>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="sales">Ventes</TabsTrigger>
              <TabsTrigger value="visits">Visites</TabsTrigger>
              <TabsTrigger value="stores">Boutiques</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <BarChart2 className="h-4 w-4 text-bisko-500" /> Revenu mensuel
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart
                          data={revenueByMonthData}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Bar dataKey="revenue" fill="#4585fc" name="Revenu (FCFA)" />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <PieChart className="h-4 w-4 text-bisko-500" /> Ventes par produit
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={salesByProductData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {salesByProductData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <BarChart2 className="h-4 w-4 text-bisko-500" /> Ventes par zone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={salesByZoneData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="zone" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="sales" fill="#22c55e" name="Ventes (FCFA)" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sales" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-bisko-500" /> Rapport de ventes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg bg-muted/30">
                        <div className="text-2xl font-bold text-bisko-600">
                          315,750 FCFA
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Chiffre d'affaires total
                        </div>
                        <div className="text-xs text-green-600 mt-2">
                          +12.3% par rapport au mois dernier
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg bg-muted/30">
                        <div className="text-2xl font-bold text-bisko-600">126</div>
                        <div className="text-sm text-muted-foreground">
                          Nombre de factures
                        </div>
                        <div className="text-xs text-green-600 mt-2">
                          +8.5% par rapport au mois dernier
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg bg-muted/30">
                        <div className="text-2xl font-bold text-bisko-600">
                          2,506 FCFA
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Valeur moyenne
                        </div>
                        <div className="text-xs text-green-600 mt-2">
                          +3.8% par rapport au mois dernier
                        </div>
                      </div>
                    </div>

                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart
                          data={revenueByMonthData}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Bar dataKey="revenue" fill="#4585fc" name="Chiffre d'affaires (FCFA)" />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="visits" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-bisko-500" /> Rapport de visites
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg bg-muted/30">
                        <div className="text-2xl font-bold text-bisko-600">142</div>
                        <div className="text-sm text-muted-foreground">
                          Visites totales
                        </div>
                        <div className="text-xs text-green-600 mt-2">
                          +5.3% par rapport au mois dernier
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg bg-muted/30">
                        <div className="text-2xl font-bold text-bisko-600">125</div>
                        <div className="text-sm text-muted-foreground">
                          Visites complétées
                        </div>
                        <div className="text-xs text-green-600 mt-2">
                          +7.2% par rapport au mois dernier
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg bg-muted/30">
                        <div className="text-2xl font-bold text-bisko-600">
                          88%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Taux de complétion
                        </div>
                        <div className="text-xs text-green-600 mt-2">
                          +1.8% par rapport au mois dernier
                        </div>
                      </div>
                    </div>

                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart
                          data={visitsByDayData}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" fill="#22c55e" name="Nombre de visites" />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stores" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <BarChart2 className="h-4 w-4 text-bisko-500" /> Performance par boutique
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Filter className="h-3 w-3" />
                        <span>Filtrer</span>
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Boutique
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Visites
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Ventes
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Taux de conversion
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-background divide-y divide-border">
                          {[
                            { name: "Supermarché Excel", visits: 32, sales: 28500, rate: 87 },
                            { name: "Mini Market Plus", visits: 24, sales: 19200, rate: 82 },
                            { name: "Market Express", visits: 18, sales: 14400, rate: 79 },
                            { name: "Super Shop", visits: 15, sales: 13000, rate: 75 },
                            { name: "Boutique Centrale", visits: 12, sales: 9600, rate: 72 },
                          ].map((store, idx) => (
                            <tr key={idx}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {store.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {store.visits}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {store.sales.toLocaleString()} FCFA
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs inline-flex items-center ${
                                  store.rate >= 80 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                }`}>
                                  {store.rate}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports;
