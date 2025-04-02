
import { useWindowSize } from '@/hooks/use-window-size';
import Confetti from 'react-confetti';

export default function ConfettiLoader() {
  const { width, height } = useWindowSize();

  return (
    <div
      className={`fixed inset-0 z-50 pointer-events-none transition-opacity duration-1000`}
    >
      <Confetti
        width={width}
        gravity={0.1}
        height={height}
        recycle={false}
        numberOfPieces={700}
        tweenDuration={8000}
        initialVelocityY={15}
        colors={['#F0B6BC', '#E8D7C3', '#D4AF7A', '#F9F5F2', '#1A1A2E', '#FFD1DC', '#FFEFD5']}
      />
    </div>
  );
}
