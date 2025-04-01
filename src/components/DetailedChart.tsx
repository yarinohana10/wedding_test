
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PriceChart from "./PriceChart";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface DetailedChartProps {
  title?: string;
}

const DetailedChart = ({ title = "Bitcoin Price" }: DetailedChartProps) => {
  const [timeframe, setTimeframe] = useState<"1d" | "1w" | "1m" | "1y">("1d");
  
  // Generate mock chart data
  const generateMockData = (days: number, volatility: number) => {
    const now = Date.now();
    const points = days * 24; // 24 data points per day
    const interval = (days * 24 * 60 * 60 * 1000) / points;
    const data = [];
    
    // Start price around $57,000
    let price = 57000;
    
    for (let i = 0; i < points; i++) {
      const timestamp = now - (points - i) * interval;
      
      // Add random volatility
      const change = (Math.random() * volatility * 2) - volatility;
      price = Math.max(1, price * (1 + change / 100));
      
      data.push({
        timestamp,
        price
      });
    }
    
    return data;
  };
  
  const timeframeData = {
    "1d": generateMockData(1, 0.5),  // 1 day with 0.5% volatility
    "1w": generateMockData(7, 1),    // 1 week with 1% volatility
    "1m": generateMockData(30, 2),   // 1 month with 2% volatility 
    "1y": generateMockData(365, 3),  // 1 year with 3% volatility
  };
  
  const data = timeframeData[timeframe];
  const currentPrice = data[data.length - 1].price;
  const startPrice = data[0].price;
  const priceChange = ((currentPrice - startPrice) / startPrice) * 100;
  const isPositiveChange = priceChange >= 0;
  
  return (
    <Card className="crypto-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex space-x-1">
            {(["1d", "1w", "1m", "1y"] as const).map((period) => (
              <Button
                key={period}
                size="sm"
                variant={timeframe === period ? "secondary" : "ghost"}
                className="text-xs h-7 px-2.5"
                onClick={() => setTimeframe(period)}
              >
                {period}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-2xl font-bold">${currentPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            <div className={`text-sm flex items-center ${isPositiveChange ? 'trend-up' : 'trend-down'}`}>
              {isPositiveChange ? (
                <ArrowUpRight className="h-4 w-4 mr-0.5" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-0.5" />
              )}
              {Math.abs(priceChange).toFixed(2)}%
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              {new Date(data[0].timestamp).toLocaleDateString()} - {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
        
        <div className="h-64">
          <PriceChart 
            data={data}
            color={isPositiveChange ? "#02c076" : "#f6465d"}
            height={250}
            showAxis={true}
            showTooltip={true}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailedChart;
