
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownRight, ArrowUpRight, TrendingUp, DollarSign, PieChart } from "lucide-react";

const MarketOverview = () => {
  const marketStats = {
    marketCap: {
      value: "$1.87T",
      change: -2.38,
    },
    volume: {
      value: "$57.8B",
      change: 12.5,
    },
    btcDominance: {
      value: "50.8%",
      change: 0.5,
    },
    fear: {
      value: "Neutral",
      score: 54,
    },
  };

  return (
    <Card className="crypto-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Market Overview
        </CardTitle>
        <CardDescription>Global crypto market statistics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" />
                  Market Cap
                </div>
                <div className="font-medium">{marketStats.marketCap.value}</div>
                <div className={`text-xs flex items-center ${marketStats.marketCap.change >= 0 ? 'trend-up' : 'trend-down'}`}>
                  {marketStats.marketCap.change >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(marketStats.marketCap.change)}%
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <PieChart className="h-3.5 w-3.5" />
                  BTC Dominance
                </div>
                <div className="font-medium">{marketStats.btcDominance.value}</div>
                <div className={`text-xs flex items-center ${marketStats.btcDominance.change >= 0 ? 'trend-up' : 'trend-down'}`}>
                  {marketStats.btcDominance.change >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(marketStats.btcDominance.change)}%
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="details" className="pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">24h Volume</div>
                <div className="font-medium">{marketStats.volume.value}</div>
                <div className={`text-xs flex items-center ${marketStats.volume.change >= 0 ? 'trend-up' : 'trend-down'}`}>
                  {marketStats.volume.change >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(marketStats.volume.change)}%
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Fear & Greed</div>
                <div className="font-medium">{marketStats.fear.value}</div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-crypto-danger via-crypto-yellow to-crypto-success" 
                    style={{ width: `${marketStats.fear.score}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MarketOverview;
