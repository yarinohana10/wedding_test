
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import PriceChart from "./PriceChart";

export interface CryptoCoin {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: string;
  volume: string;
  image: string;
  sparkline: Array<{ timestamp: number; price: number }>;
  color: string;
}

interface CryptoCoinCardProps {
  coin: CryptoCoin;
}

const CryptoCoinCard = ({ coin }: CryptoCoinCardProps) => {
  const isPositiveChange = coin.change24h >= 0;

  return (
    <Card className="crypto-card overflow-hidden">
      <div className="flex items-start justify-between p-4">
        <div className="flex items-center gap-3">
          <img src={coin.image} alt={coin.name} className="w-8 h-8" />
          <div>
            <h3 className="font-medium">{coin.name}</h3>
            <span className="text-xs text-muted-foreground">{coin.symbol}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="font-medium">${coin.price.toLocaleString()}</div>
          <div className={`text-sm flex items-center justify-end ${isPositiveChange ? 'trend-up' : 'trend-down'}`}>
            {isPositiveChange ? (
              <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />
            )}
            {Math.abs(coin.change24h).toFixed(2)}%
          </div>
        </div>
      </div>
      <div className="px-4 pb-3">
        <div className="grid grid-cols-2 text-xs text-muted-foreground gap-2">
          <div>
            Market Cap:
            <span className="ml-1 text-foreground">{coin.marketCap}</span>
          </div>
          <div className="text-right">
            Volume:
            <span className="ml-1 text-foreground">{coin.volume}</span>
          </div>
        </div>
      </div>
      <div className="price-chart-container">
        <PriceChart
          data={coin.sparkline}
          color={coin.color}
          height={100}
          className="absolute inset-0"
        />
      </div>
    </Card>
  );
};

export default CryptoCoinCard;
