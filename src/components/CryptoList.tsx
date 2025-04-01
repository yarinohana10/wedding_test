
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CryptoCoinCard, { CryptoCoin } from "./CryptoCoinCard";

const generateMockSparklineData = (
  startPrice: number,
  volatility: number,
  isUp: boolean
) => {
  const now = Date.now();
  const points = 24;
  const data = [];

  let currentPrice = startPrice;
  for (let i = 0; i < points; i++) {
    const timestamp = now - (points - i) * 60 * 60 * 1000;
    
    // Add random volatility
    const changePercent = (Math.random() * volatility) * (Math.random() > 0.5 ? 1 : -1);
    
    // Make sure the overall trend follows the isUp parameter
    const trend = isUp ? 
      1 + (i / points) * volatility : 
      1 - (i / points) * volatility;
    
    currentPrice = currentPrice * (1 + changePercent / 100) * trend;
    
    data.push({
      timestamp,
      price: Math.max(0, currentPrice)
    });
  }

  return data;
};

const mockCoins: CryptoCoin[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    price: 57324.51,
    change24h: 2.41,
    marketCap: "$1.13T",
    volume: "$32.6B",
    image: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/btc.svg",
    sparkline: generateMockSparklineData(57000, 2, true),
    color: "#F7931A",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    price: 3204.78,
    change24h: -0.82,
    marketCap: "$385.2B",
    volume: "$15.8B",
    image: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/eth.svg",
    sparkline: generateMockSparklineData(3200, 3, false),
    color: "#627EEA",
  },
  {
    id: "binancecoin",
    name: "BNB",
    symbol: "BNB",
    price: 594.32,
    change24h: 1.45,
    marketCap: "$91.7B",
    volume: "$1.2B",
    image: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/bnb.svg",
    sparkline: generateMockSparklineData(590, 2.5, true),
    color: "#F0B90B",
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    price: 143.67,
    change24h: 5.23,
    marketCap: "$62.1B",
    volume: "$2.8B",
    image: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/sol.svg",
    sparkline: generateMockSparklineData(140, 4, true),
    color: "#00FFA3",
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    price: 0.59,
    change24h: -1.2,
    marketCap: "$20.8B",
    volume: "$418.5M",
    image: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/ada.svg",
    sparkline: generateMockSparklineData(0.6, 2, false),
    color: "#0033AD",
  },
  {
    id: "xrp",
    name: "XRP",
    symbol: "XRP",
    price: 0.62,
    change24h: -0.34,
    marketCap: "$34.2B",
    volume: "$1.1B",
    image: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/xrp.svg",
    sparkline: generateMockSparklineData(0.62, 1.5, false),
    color: "#23292F",
  }
];

const CryptoList = () => {
  const [viewMore, setViewMore] = useState(false);

  const displayCoins = viewMore ? mockCoins : mockCoins.slice(0, 4);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Assets</TabsTrigger>
            <TabsTrigger value="gainers">Gainers</TabsTrigger>
            <TabsTrigger value="losers">Losers</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayCoins.map((coin) => (
              <CryptoCoinCard key={coin.id} coin={coin} />
            ))}
          </div>
          
          <div className="mt-4 flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => setViewMore(!viewMore)}
              className="bg-muted hover:bg-secondary border-border"
            >
              {viewMore ? "Show Less" : "View More"}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="gainers" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockCoins
              .filter((coin) => coin.change24h > 0)
              .map((coin) => (
                <CryptoCoinCard key={coin.id} coin={coin} />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="losers" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockCoins
              .filter((coin) => coin.change24h < 0)
              .map((coin) => (
                <CryptoCoinCard key={coin.id} coin={coin} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CryptoList;
