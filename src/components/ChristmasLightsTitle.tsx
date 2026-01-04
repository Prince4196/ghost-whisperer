import { motion } from 'framer-motion';

interface ChristmasLightsTitleProps {
  text: string;
  className?: string;
}

export function ChristmasLightsTitle({ text, className = '' }: ChristmasLightsTitleProps) {
  const letters = text.split('');
  
  return (
    <h1 className={`christmas-lights font-stranger ${className}`}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05 }}
          className="inline-block"
          style={{
            textShadow: `0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor`,
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </h1>
  );
}