import { useState, useEffect } from 'react';
import { Page } from '@/components/Page';
import axios from 'axios';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import './DashboardPage.css';

// ngrok public HTTPS URL for API
const API_URL = 'https://recursive-gaynelle-unperceivably.ngrok-free.dev';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function DashboardPage() {
  const [kpi, setKpi] = useState({
    today_revenue: 0,
    week_revenue: 0,
    month_revenue: 0,
    total_turnover: 0,
  });
  const [revenueTrend, setRevenueTrend] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [kpiRes, trendRes, productsRes, districtsRes] = await Promise.all([
        axios.get(`${API_URL}/api/kpi`),
        axios.get(`${API_URL}/api/revenue-trend?days=30`),
        axios.get(`${API_URL}/api/sales-by-product`),
        axios.get(`${API_URL}/api/sales-by-district`),
      ]);

      setKpi(kpiRes.data);
      setRevenueTrend(trendRes.data);
      setProducts(productsRes.data);
      setDistricts(districtsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Page back={false}>
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading dashboard...</p>
        </div>
      </Page>
    );
  }

  return (
    <Page back={false}>
      <div className="dashboard">
        <h1 className="dashboard-title">📊 ShopTG Analytics</h1>

        {/* KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-label">Today</div>
            <div className="kpi-value">${kpi.today_revenue.toFixed(2)}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Week</div>
            <div className="kpi-value">${kpi.week_revenue.toFixed(2)}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Month</div>
            <div className="kpi-value">${kpi.month_revenue.toFixed(2)}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Turnover</div>
            <div className="kpi-value">${kpi.total_turnover.toFixed(2)}</div>
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="chart-card">
          <h2>Revenue Trend (30 Days)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#0088FE" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Products Pie Chart */}
        <div className="chart-card">
          <h2>Sales by Product</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={products}
                dataKey="revenue"
                nameKey="product"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label
              >
                {products.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Districts Bar Chart */}
        <div className="chart-card">
          <h2>Sales by District</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={districts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="district" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Product Summary Table */}
        <div className="table-card">
          <h2>Product Summary</h2>
          <table className="summary-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Orders</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <td>{product.product}</td>
                  <td>{product.orders}</td>
                  <td>${product.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Page>
  );
}
